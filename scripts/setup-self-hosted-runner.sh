#!/usr/bin/env bash
#
# One-time setup for the self-hosted GitHub Actions runner that runs this repo's
# CI. Run it INSIDE WSL2 Ubuntu, from a terminal where you can type your sudo
# password:
#
#   wsl -d Ubuntu -- bash /mnt/c/Users/colom/OneDrive/Escritorio/Coding/elevatehrg/scripts/setup-self-hosted-runner.sh
#
# Why self-hosted: this repo is private, so every GitHub-hosted minute is billed,
# and the six-project Playwright matrix is expensive enough to exhaust the
# monthly allowance. Self-hosted runner time is never billed regardless of
# duration. The usual "self-hosted runners are unsafe" warning applies to PUBLIC
# repos, where a fork PR can run arbitrary code on your hardware; a private
# single-contributor repo is not exposed to that.
#
# Re-running this script is safe: every step is idempotent.

set -euo pipefail

REPO_SLUG="montjeffrey/elevateHRG"
REPO_URL="https://github.com/${REPO_SLUG}"
RUNNER_DIR="${HOME}/actions-runner"
# Must match the @playwright/test version pinned in package.json, so the system
# libraries match the browser builds CI will actually download.
PLAYWRIGHT_VERSION="1.59.1"
GH_EXE="/mnt/c/Program Files/GitHub CLI/gh.exe"

log() { printf '\n\033[1m=== %s ===\033[0m\n' "$1"; }
die() { printf '\n\033[31mERROR: %s\033[0m\n' "$1" >&2; exit 1; }

log "Checking prerequisites"
[ -x "$GH_EXE" ] || die "GitHub CLI not found at $GH_EXE — needed to mint a runner registration token."
[ -d /run/systemd/system ] || die "systemd is not running in this distro; the runner cannot install as a service."
echo "gh:      $("$GH_EXE" --version | head -1)"
echo "systemd: running"
echo "cores:   $(nproc)   memory: $(free -h | awk '/^Mem:/{print $2}')"

log "Installing Node 22"
# The runner ships its own Node for executing JS actions, and actions/setup-node
# provides Node 22 for the `run` steps — so this is not for CI itself. It is
# here because the Playwright dependency installer below needs a real Linux
# node/npx, and without one WSL's PATH interop silently falls through to the
# Windows npm at /mnt/c/Program Files/nodejs/npm, which cannot install apt packages.
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1)" != "v22" ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "node: $(node -v)  (at $(command -v node))"

log "Installing Docker"
# CI runs inside mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble, not
# on this host. That is not a preference: Ubuntu 26.04 is newer than any distro
# Playwright ${PLAYWRIGHT_VERSION} publishes browser builds for, so
# `npx playwright install` on the host fails outright, and the 24.04 fallback
# needs five apt packages 26.04 does not carry. The image ships browsers and
# their system libraries together, matched to the package.json pin.
#
# `command -v docker` is NOT a usable test for this inside WSL, and trusting it
# is what left the runner broken. WSL's PATH interop puts Docker Desktop's
# Windows shim on PATH even when the distro contains no Docker whatsoever:
#
#     command -v docker  ->  /mnt/c/Program Files/Docker/Docker/resources/bin/docker
#
# so the guard reports success, the install below is skipped, and
# `systemctl enable --now docker` then dies on a unit that was never created.
# The visible symptom is one step further away still: that shim only functions
# when Docker Desktop has WSL integration enabled for this distro, so with the
# integration off the CI job fails at `##[error]docker: command not found` — a
# message that reads like nothing is installed, when the truth is that something
# IS on PATH and it is the wrong thing.
#
# Deliberately installing Docker Engine natively rather than leaning on Docker
# Desktop's integration: this runner is a background service, and Docker Desktop
# only exposes its socket while the GUI app is running. A CI gate that silently
# stops working whenever a desktop app is closed is not a gate.
#
# So ask for a LINUX docker specifically. Anything under /mnt/ is a Windows
# binary reached through interop and does not count.
docker_bin="$(command -v docker 2>/dev/null || true)"
case "$docker_bin" in
  "" | /mnt/*) curl -fsSL https://get.docker.com | sudo sh ;;
esac
sudo systemctl enable --now docker
# The runner shells out to docker as itself, not as root.
sudo usermod -aG docker "$(whoami)"
# Pre-pull, so the first CI run does not spend its 30-minute budget on a ~2 GB
# download inside the job.
sudo docker pull "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
echo "docker: $(docker --version)"

log "Downloading the Actions runner"
mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"
if [ ! -f ./config.sh ]; then
  # Two steps on purpose. Piping curl straight into `grep -m1` makes grep exit
  # at the first match and close the pipe, so curl aborts mid-body with
  # CURLE_WRITE_ERROR (23) — "Failure writing output to destination". VERSION
  # is still extracted correctly, but `set -o pipefail` adopts curl's 23 as the
  # pipeline status and `set -e` then kills this script immediately after a step
  # that actually succeeded. Buffering the response first leaves no pipe to break.
  RELEASE_JSON=$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest)
  VERSION=$(printf '%s' "$RELEASE_JSON" | grep -m1 '"tag_name"' | sed -E 's/.*"v?([^"]+)".*/\1/')
  [ -n "$VERSION" ] || die "Could not determine the latest runner version from the GitHub API."
  echo "Latest runner: v${VERSION}"
  curl -fsSL -o runner.tar.gz \
    "https://github.com/actions/runner/releases/download/v${VERSION}/actions-runner-linux-x64-${VERSION}.tar.gz"
  tar xzf runner.tar.gz
  rm runner.tar.gz
else
  echo "Runner already extracted in $RUNNER_DIR"
fi

log "Installing the runner's .NET dependencies"
# config.sh is a .NET 8 binary and will not start until ICU, OpenSSL and
# lttng-ust are present. Ubuntu 26.04 ships NO libicu at all by default, so a
# fresh distro fails here with:
#
#   Libicu's dependencies is missing for Dotnet Core 6.0
#
# That message names the wrong .NET version — it is a stale hardcoded string in
# config.sh; bin/Runner.Listener.runtimeconfig.json pins net8.0 — so taking it
# literally sends you hunting for a .NET 6 package that does not exist. The
# runner's own dependency installer tries libicu80 → 79 → 78 → ... and stops at
# the first that resolves, which on 26.04 is libicu78.
sudo ./bin/installdependencies.sh

log "Registering the runner with ${REPO_SLUG}"
# `--replace` is NOT what makes this idempotent, despite reading like it. It
# replaces a runner of the same name on GITHUB's side; it does not overwrite a
# local .runner. So a re-run against an already-configured directory exits
# non-zero with
#
#   Cannot configure the runner because it is already configured.
#   To reconfigure the runner, run 'config.cmd remove' or './config.sh remove' first.
#
# and `set -e` then kills the script HERE — before the systemd block below. That
# is the worst possible place to stop on a re-run, because the service step is
# the one that matters most the second time around: it is what restarts the
# runner so systemd re-reads its supplementary groups and picks up `docker`.
# Registration is the step least likely to need repeating and the only one that
# was aborting the run.
#
# So treat an existing .runner as "already registered" and move on.
if [ -f .runner ]; then
  echo "Runner already registered (.runner present) — skipping registration."
  echo "To re-register from scratch, remove it first:"
  echo "  cd $RUNNER_DIR && sudo ./svc.sh stop && ./config.sh remove --token <token>"
else
  # Minted on the fly and used immediately: registration tokens expire in one
  # hour and are never written to disk.
  TOKEN=$("$GH_EXE" api -X POST "repos/${REPO_SLUG}/actions/runners/registration-token" --jq .token | tr -d '\r\n')
  [ -n "$TOKEN" ] || die "Could not obtain a registration token. Is 'gh auth status' healthy?"

  ./config.sh --unattended --replace \
    --url "$REPO_URL" \
    --token "$TOKEN" \
    --name "wsl-ubuntu-$(hostname)" \
    --labels self-hosted,linux,x64 \
    --work _work
fi

log "Installing the runner as a systemd service"
# A re-run reaches here with the service already installed, so stop it first and
# let the install be a clean replace. The restart also matters for Docker:
# systemd reads a service account's supplementary groups at start, so the runner
# only picks up the `docker` group granted above once it is restarted.
if [ -f .service ]; then sudo ./svc.sh stop || true; fi
sudo ./svc.sh install "$(whoami)" || true
sudo ./svc.sh start
sudo ./svc.sh status || true

log "Done"
cat <<'DONE'
The runner is registered and running as a systemd service, so it survives WSL
restarts. Verify it appears as "Idle" at:

    https://github.com/montjeffrey/elevateHRG/settings/actions/runners

ONE REMAINING GAP: WSL2 does not start on Windows boot, so the runner is offline
until something wakes the distro. Fix it with a logon task (run in PowerShell as
Administrator, once):

    $A = New-ScheduledTaskAction -Execute "wsl.exe" -Argument "-d Ubuntu --exec /bin/true"
    $T = New-ScheduledTaskTrigger -AtLogOn
    $S = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName "Start WSL Ubuntu (CI runner)" -Action $A -Trigger $T -Settings $S

Jobs queued while the machine is off simply wait; they run when it comes back.
DONE
