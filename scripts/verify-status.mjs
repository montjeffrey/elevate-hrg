#!/usr/bin/env node
/**
 * Publishes the result of a local `npm run verify` run to GitHub as a commit
 * status, so branch protection can require it.
 *
 * Why this exists: a git hook is a courtesy, not a guard — `--no-verify` walks
 * straight past it, and a hook on this machine says nothing about a commit
 * pushed from anywhere else. A required status check on `main` IS a guard, and
 * a status posted from here costs zero Actions minutes.
 *
 * Run it AFTER pushing — a status can only attach to a commit the remote
 * already has:
 *
 *   git push && npm run verify:report
 *
 * It refuses to post unless `.git/local-verify` — written only by a PASSING
 * verify run — names the commit currently checked out.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CONTEXT = "local-verify";

// Single-string commands, not (cmd, args[]): see the note in verify.mjs.
const run = (command) => spawnSync(command, { encoding: "utf8", shell: true });
const fail = (message) => {
  console.error(`verify:report — ${message}`);
  process.exit(1);
};

const head = run("git rev-parse HEAD");
if (head.status !== 0) fail("not a git repository");
const sha = head.stdout.trim();

const receiptPath = join(".git", "local-verify");
if (!existsSync(receiptPath)) fail("no verify receipt found — run `npm run verify` first");

const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
if (receipt.sha !== sha) {
  fail(
    `the last passing verify was for ${receipt.sha.slice(0, 8)}, but HEAD is ${sha.slice(0, 8)}.\n` +
      "Re-run `npm run verify` on this commit before reporting it."
  );
}

// `gh` is a .exe on Windows and is not on PATH in every shell.
//
// Forward slashes, not backslashes: every Windows API and every shell that runs
// here accepts them, and they cannot be eaten by an escape pass. The literal was
// previously written with backslashes and lost them — `'"C:\Program Files\..."'`
// collapses to `"C:Program FilesGitHub CLIgh.exe"` once JS resolves `\P`, `\G`
// and `\g`, so the fallback silently pointed at a path that cannot exist. It
// went unnoticed because candidate 1 (`gh` on PATH) resolves on the machine this
// was written on, and the fallback is only reached where it does not.
const GH_CANDIDATES = ["gh", '"C:/Program Files/GitHub CLI/gh.exe"'];
const gh = GH_CANDIDATES.find((candidate) => run(`${candidate} --version`).status === 0);
if (!gh) {
  fail("GitHub CLI not found — install it, or post the status by hand (see docs/local-ci.md)");
}

const repo = run(`${gh} repo view --json nameWithOwner -q .nameWithOwner`);
if (repo.status !== 0) fail(`gh could not resolve the repository:\n${repo.stderr}`);

const post = run(
  `${gh} api repos/${repo.stdout.trim()}/statuses/${sha} -X POST ` +
    `-f state=success -f context=${CONTEXT} ` +
    `-f "description=local verify passed (${receipt.level} matrix)"`
);

if (post.status !== 0) {
  fail(
    `posting the status failed:\n${post.stderr}\n` +
      "If that says 'No commit found', push the commit first — a status can only " +
      "attach to a commit the remote already has."
  );
}

console.log(`verify:report — posted "${CONTEXT}" = success on ${sha.slice(0, 8)}.`);
