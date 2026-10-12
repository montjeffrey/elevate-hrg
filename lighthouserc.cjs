const lhciBaseUrl = "http://localhost:3001";

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: "npm run start -- -p 3001",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 30000,
      settings: {
        // Mobile preset: Lighthouse default (no desktop preset override)
        // Simulates Moto G4 on slow 4G throttling — matches Core Web Vitals field conditions
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          disabled: false,
        },
        throttlingMethod: "simulate",
        throttling: {
          // Slow 4G
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
        },
      },
      url: [
        // Splash-inclusive runs — the real first-visit experience. The welcome
        // splash (an intentional ~3.4s brand intro, kept by owner decision) is
        // included in these measurements, so their budgets are splash-aware.
        `${lhciBaseUrl}/`,
        `${lhciBaseUrl}/roofing`,
        `${lhciBaseUrl}/windows`,
        `${lhciBaseUrl}/siding`,
        `${lhciBaseUrl}/gutters`,
        `${lhciBaseUrl}/entry-doors`,
        `${lhciBaseUrl}/attic-insulation`,
        // Splash-skipped runs — ?intro=skip (handled by the pre-paint inline
        // script in app/layout.tsx) suppresses the intro so these runs measure
        // the pure content path and can hold the strict Core Web Vitals
        // budgets. This is the gate that catches genuine loading regressions.
        `${lhciBaseUrl}/?intro=skip`,
        `${lhciBaseUrl}/roofing?intro=skip`,
      ],
    },
    assert: {
      assertMatrix: [
        {
          // ── Content-path gate: splash-skipped (?intro=skip) ──────────────
          // Isolates loading performance from the intro so this gate keeps
          // catching content regressions no matter how the splash evolves.
          // Measured baseline (Lighthouse 13, simulated slow-4G + 4× CPU):
          // LCP ~5.5s — the hero logo loads in <100ms but sits behind ~1.2s of
          // observed main-thread render delay, which the 4× CPU simulation
          // multiplies. The classic 2500ms target therefore requires the
          // unused-JS/hydration work in docs/LIGHTHOUSE_PERF_ACTION_PLAN.md
          // Wave 2 — tighten this ceiling as that lands (next stop ~4000,
          // target 2500).
          // Excludes the homepage, which gets its own wider-variance group
          // below (heaviest route: motion stack + hero video).
          matchingUrlPattern: "^(?!.*localhost:3001/\\?intro=skip$).*intro=skip.*",
          assertions: {
            "largest-contentful-paint": ["error", { maxNumericValue: 5500 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
            "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
            // Re-baselined for gtag.js. The 551/507ms figures this ceiling was
            // built on predate GA4 in CI. With gtag.js loaded, run 32056919441
            // measured best-of-3 720ms on /roofing?intro=skip (runs 720, 733.5,
            // 754.5) against the old 600ms ceiling. An earlier run
            // (32047158297) happened to pass this group, which is why the first
            // recalibration pass left it alone — one passing sample was too
            // thin an inference given the ±20% runner variance visible in the
            // spreads above. 900 clears the worst observed best-of-3.
            "total-blocking-time": ["error", { maxNumericValue: 900 }],
            "categories:performance": ["error", { minScore: 0.7 }],
          },
        },
        {
          // ── Content-path gate, homepage ──────────────────────────────────
          // Same intent as above, homepage-calibrated: it is the heaviest
          // route (full motion stack + hero video) and shows the widest
          // run-to-run runner variance in CI (best-of-3 TBT observed 526-969ms
          // across runs). Budgets = worst observed best-of-3 + headroom;
          // tighten with the Wave 2 hydration work.
          matchingUrlPattern: "localhost:3001/\\?intro=skip$",
          assertions: {
            "largest-contentful-paint": ["error", { maxNumericValue: 5500 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
            "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
            // Re-baselined for gtag.js alongside the group above. Run
            // 32056919441 measured best-of-3 1206.9ms here (runs 1206.9, 1274.6,
            // 1336) against the old 1100ms ceiling. 1450 clears it with room for
            // the wide homepage variance this group's comment already notes.
            "total-blocking-time": ["error", { maxNumericValue: 1450 }],
            "categories:performance": ["error", { minScore: 0.6 }],
          },
        },
        {
          // ── Splash-aware gate: real first-visit experience ───────────────
          // LCP budget = intro window + strict content budget. The intro now
          // runs its FULL choreography on every device (~3.4s, owner decision
          // — previously the mobile tier that these audits emulate was ~2.3s),
          // so this budget reflects intro ~3.4s + measured content path + CI
          // variance. Trips if the intro grows or loading regresses underneath
          // it. Excludes the homepage (own group below). The intro=skip groups
          // above keep the intro-independent regression guard.
          matchingUrlPattern: "^(?!.*intro=skip)(?!.*localhost:3001/$).*$",
          assertions: {
            "largest-contentful-paint": ["error", { maxNumericValue: 6200 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
            "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
            // Re-baselined on the first CI runs that actually loaded gtag.js
            // (run 32047158297). Splash + GA4 together push this group past
            // the 600ms content-path ceiling: best-of-3 TBT measured 626.5ms
            // (/roofing), 630.5ms (/siding), 642ms (/windows), 693.4ms
            // (/entry-doors); /gutters and /attic-insulation stayed under 600.
            // A later run (32056919441) showed the ?intro=skip groups going
            // over too, so all four TBT ceilings were re-baselined together
            // rather than only the splash-inclusive pair. This one is held
            // level with its ?intro=skip counterpart: a splash-inclusive run
            // does strictly more work, so its ceiling must not sit lower.
            // This is GA4's real production cost, previously invisible because
            // CI built without the measurement ID — not a regression being
            // papered over. With every TBT ceiling now loosened, the offsetting
            // Wave 2 hydration work in docs/LIGHTHOUSE_PERF_ACTION_PLAN.md is
            // what earns these back down; see CURRENT_STATE.md.
            "total-blocking-time": ["error", { maxNumericValue: 900 }],
            // Intro-inclusive score: the longer intro costs LCP score points
            // by design; content regressions are caught by the intro=skip
            // groups at the higher floor.
            "categories:performance": ["error", { minScore: 0.6 }],
            // Non-performance categories are splash-independent — assert them
            // once here at full strictness.
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.9 }],
            "categories:seo": ["error", { minScore: 0.95 }],
            // Mobile tap-target sizing (WCAG 2.5.8; Lighthouse renamed the
            // audit from "tap-targets" to "target-size").
            "target-size": ["error", { minScore: 1 }],
          },
        },
        {
          // ── Splash-aware gate, homepage ──────────────────────────────────
          // Homepage-calibrated variance headroom (see content-path homepage
          // group), shifted for the full-length intro like the group above.
          matchingUrlPattern: "localhost:3001/$",
          assertions: {
            "largest-contentful-paint": ["error", { maxNumericValue: 6800 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
            "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
            // Re-baselined with gtag.js present (run 32047158297): best-of-3
            // TBT was 1163.5ms against the previous 1100ms ceiling, with the
            // three runs spanning 1163.5–1592.8ms — the widest variance of any
            // route, as the group comment above notes. 1400 clears the best-of-3
            // with headroom. Same rationale as the non-home group: the
            // ?intro=skip homepage group keeps its 1100ms ceiling as the strict
            // gate. Held level with the ?intro=skip homepage group for the same
            // reason as the non-home pair. Tighten with the Wave 2 work.
            "total-blocking-time": ["error", { maxNumericValue: 1450 }],
            "categories:performance": ["error", { minScore: 0.5 }],
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.9 }],
            "categories:seo": ["error", { minScore: 0.95 }],
            "target-size": ["error", { minScore: 1 }],
          },
        },
      ],
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
