import { defineConfig, devices } from "@playwright/test";

// Specs whose assertions are engine-independent, so running them once is the
// same signal as running them five times.
//
// - stakeholder-corrections: asserts server-rendered body text, <title>/<meta>,
//   and JSON-LD. Next renders that HTML on the server; it is byte-identical
//   whichever browser requests it, so the extra four projects re-assert the
//   same bytes (measured: 157s of CPU across 5 projects, 60 runs, 0 skips).
// - routing: asserts HTTP status codes for unknown slugs. That is a server
//   response, not a rendering behaviour.
//
// Anything that touches layout, motion, storage, or input belongs in the
// cross-browser projects below instead — engine differences are the whole
// point there. Add to this list only when a spec's failure mode cannot differ
// between engines.
const ENGINE_INDEPENDENT_SPECS = ["**/stakeholder-corrections.spec.ts", "**/routing.spec.ts"];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Worker count is env-driven so the same config serves both runners: the
  // self-hosted WSL2 box sets PW_WORKERS=6 (20 cores, but ~7.7 GB of RAM makes
  // five concurrent engines memory-bound), while a 2-core GitHub-hosted runner
  // falls through to 2. Local runs stay on Playwright's own default.
  workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : process.env.CI ? 2 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Headless Chromium reports `prefers-reduced-motion: reduce` by default,
    // which forces our motion tier to "minimal" and breaks viewport-based
    // tier assertions. Pin every project to "no-preference" so individual
    // tests can opt-in to `reduce` via `browser.newContext({ reducedMotion })`.
    contextOptions: { reducedMotion: "no-preference" },
  },
  projects: [
    // Runs the engine-independent specs exactly once. Chromium purely because
    // it is the cheapest to boot — nothing here is Chromium-specific.
    {
      name: "Content",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ENGINE_INDEPENDENT_SPECS,
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ENGINE_INDEPENDENT_SPECS,
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: ENGINE_INDEPENDENT_SPECS,
    },
    {
      name: "Desktop Safari",
      use: { ...devices["Desktop Safari"] },
      testIgnore: ENGINE_INDEPENDENT_SPECS,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testIgnore: ENGINE_INDEPENDENT_SPECS,
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      testIgnore: ENGINE_INDEPENDENT_SPECS,
    },
  ],
  webServer: {
    // `npm run verify` builds once up front, then sets PW_REUSE_BUILD=1 so the
    // suite serves the build it already made. Without it a full local gate paid
    // for two production builds of the same commit.
    command: process.env.PW_REUSE_BUILD ? "npm run start" : "npm run build && npm run start",
    // CI always builds clean. A bare local run reuses a server that is already
    // up, so a focused re-run costs a page load instead of a full build.
    //
    // A verify run (PW_REUSE_BUILD) must NOT reuse one: the whole point is to
    // exercise the production build stage 3 just made, and silently testing a
    // leftover `npm run dev` server instead would make the gate a placebo.
    // Playwright fails loudly on a busy port, which is the correct outcome.
    reuseExistingServer: !process.env.CI && !process.env.PW_REUSE_BUILD,
    timeout: 180_000,
    url: "http://localhost:3000",
  },
});
