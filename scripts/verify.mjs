#!/usr/bin/env node
/**
 * The local CI gate.
 *
 * GitHub-hosted Actions minutes are exhausted, so this script — not a remote
 * runner — is what stands between a broken commit and the Netlify production
 * build. It runs the same stages `.github/workflows/ci.yml` does, in the same
 * order, on the machine you code on.
 *
 * Usage:
 *   node scripts/verify.mjs                 # full: all six Playwright projects
 *   node scripts/verify.mjs --level=quick   # one engine per form factor
 *   node scripts/verify.mjs --skip-e2e      # typecheck + lint + build only
 *
 * Levels exist because a gate has to be fast enough that nobody reaches for
 * `--no-verify`. `quick` keeps every assertion and drops only the duplicate
 * engines; `full` still runs before anything reaches main.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { connect } from "node:net";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.some((a) => a === `--${name}`);
const value = (name, fallback) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const level = value("level", process.env.VERIFY_LEVEL || "full");
if (!["quick", "full"].includes(level)) {
  console.error(`verify: unknown level "${level}" (expected "quick" or "full")`);
  process.exit(2);
}

// Chromium desktop + Chromium mobile + the server-rendered Content project.
// Dropping Firefox and WebKit is the entire difference between the two levels.
const QUICK_PROJECTS = ["Content", "Desktop Chrome", "Mobile Chrome"];

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const green = (s) => `\u001b[32m${s}\u001b[0m`;
const red = (s) => `\u001b[31m${s}\u001b[0m`;

// Commands are single strings rather than (command, args[]) pairs: these run
// through a shell either way — `npx` is a .cmd on Windows — and passing an args
// array alongside `shell: true` is deprecated (DEP0190) precisely because the
// args get concatenated unescaped. Quoting here is explicit and visible.
const stages = [
  { name: "typecheck", command: "npm run typecheck" },
  { name: "lint", command: "npm run lint" },
  { name: "production build", command: "npm run build" },
];

if (!flag("skip-e2e")) {
  const projects =
    level === "quick" ? QUICK_PROJECTS.map((p) => ` --project "${p}"`).join("") : "";
  stages.push({
    name: level === "quick" ? "e2e + responsiveness (quick)" : "e2e + responsiveness (full matrix)",
    command: `npx playwright test${projects}`,
    // The build stage above already produced .next; tell the Playwright
    // webServer to serve it instead of running `next build` a second time.
    env: { PW_REUSE_BUILD: "1" },
  });
}

// The e2e stage serves the build stage 3 produces, on port 3000. If something
// is already listening there — almost always a forgotten `npm run dev` — say so
// in plain words now, rather than letting Playwright fail later with a bare
// "port is already used" and no hint about which process to close.
if (stages.some((stage) => stage.env?.PW_REUSE_BUILD)) {
  const busy = await new Promise((resolve) => {
    const socket = connect({ host: "127.0.0.1", port: 3000 });
    const settle = (answer) => {
      socket.destroy();
      resolve(answer);
    };
    socket.setTimeout(1000);
    socket.once("connect", () => settle(true));
    socket.once("timeout", () => settle(false));
    socket.once("error", () => settle(false));
  });

  if (busy) {
    console.error("");
    console.error(red("verify: something is already listening on port 3000."));
    console.error("The gate needs that port for the production build it is about to test.");
    console.error("Stop your dev server (Ctrl+C in that terminal) and re-run.");
    process.exit(1);
  }
}

const started = Date.now();
const elapsed = (ms) => `${(ms / 1000).toFixed(0)}s`;

for (const [index, stage] of stages.entries()) {
  console.log(`\n${bold(`verify ${index + 1}/${stages.length} — ${stage.name}`)}`);
  const stageStart = Date.now();
  const result = spawnSync(stage.command, {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...stage.env },
  });

  if (result.status !== 0) {
    console.error(
      `\n${red(`verify FAILED at "${stage.name}" after ${elapsed(Date.now() - started)}.`)}`
    );
    console.error("Fix the failure above, then re-run. Nothing was pushed.");
    process.exit(result.status ?? 1);
  }
  console.log(green(`  ✓ ${stage.name} (${elapsed(Date.now() - stageStart)})`));
}

// Record what passed, so `npm run verify:report` can only vouch for a commit
// that was actually verified — never for whatever happens to be checked out now.
const head = spawnSync("git rev-parse HEAD", { encoding: "utf8", shell: true });
if (head.status === 0) {
  writeFileSync(
    join(".git", "local-verify"),
    JSON.stringify(
      { sha: head.stdout.trim(), level, stages: stages.map((s) => s.name) },
      null,
      2
    ) + "\n"
  );
}

console.log(
  `\n${green(`verify PASSED — ${stages.length} stages in ${elapsed(Date.now() - started)} (level: ${level}).`)}`
);
