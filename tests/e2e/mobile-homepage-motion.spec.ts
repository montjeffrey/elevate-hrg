import { expect, type Locator, type Page, test } from "@playwright/test";

const disableIntersectionObserver = async (page: Page) => {
  await page.addInitScript(() => {
    class NoopIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [];

      disconnect() {}
      observe() {}
      takeRecords() {
        return [];
      }
      unobserve() {}
    }

    window.IntersectionObserver =
      NoopIntersectionObserver as unknown as typeof window.IntersectionObserver;
  });
};

// Every test here forces a 390x844 viewport and then asserts MOBILE-TIER motion
// behaviour: the mobile reveal path, native scroll instead of Lenis, autoplay
// resumption, the plain vertical service stack. That tier is selected from the
// real device profile, not the viewport box alone — a desktop project shrunk to
// 390px has no touch input and no mobile UA, so it is a hybrid that exists on no
// real device.
//
// Running them on the three desktop projects was therefore both redundant and
// actively harmful: Desktop Chrome at 390px re-tests Mobile Chrome Chromium and
// Desktop Safari re-tests Mobile Safari WebKit, while Desktop Firefox produced
// every flaky result in the suite (5 of 5) because it never settles into the
// mobile tier it is being asserted against. Same cap, and same reasoning, as the
// EXTRA_VIEWPORTS note in mobile-layout.spec.ts.
test.skip(
  ({ isMobile }) => !isMobile,
  "Mobile-tier motion is asserted on the real mobile projects; a desktop engine at 390px is not a phone."
);

const waitForMobileTier = async (page: Page) => {
  // `data-motion-tier` is written by client JS once the motion stack has
  // hydrated and picked a tier from the real device profile. Playwright runs
  // this suite on ten parallel workers, and under that contention hydration
  // routinely takes longer than the 5s default assertion timeout — the element
  // is not slow to become visible, it does not exist yet.
  //
  // That is the actual cause of the intermittent failures here, and it is
  // separate from the scroll-stability problem the helpers below solve: it
  // struck tests that never scroll at all. A generous explicit timeout is the
  // fix, because what is being waited on is hydration, not an assertion about
  // steady-state behaviour.
  await expect(page.locator('[data-motion-tier="mobile"]')).toBeVisible({ timeout: 20_000 });
};

// Scroll an element into view WITHOUT Playwright's actionability polling.
//
// `locator.scrollIntoViewIfNeeded()` waits for "element is stable" — two
// consecutive animation frames at the same position. The homepage motion stack
// keeps elements in continuous sub-pixel movement, so on WebKit that check
// never settles and burns the whole test timeout; on Chromium it settles only
// sometimes, which is what made these tests flake. `locator.evaluate` resolves
// the element and runs script against it without that check, so the scroll is
// deterministic. Same reasoning, and same fix, as the nav-reachability test in
// mobile-layout.spec.ts.
const scrollToElement = async (locator: Locator) => {
  await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const centred = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, Math.min(max, Math.max(0, Math.round(centred))));
  });
};

// Sweep the whole document once so any scroll-driven reveal has fired before
// geometry is measured. Plain scrollTo in a rAF loop — again, no actionability.
const sweepDocument = async (page: Page, steps = 10) => {
  await page.evaluate(async (stepCount) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    for (let step = 0; step <= stepCount; step += 1) {
      window.scrollTo(0, Math.round((max * step) / stepCount));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
  }, steps);
};

test("mobile homepage reveals key sections without IntersectionObserver", async ({ page }) => {
  test.setTimeout(60_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await disableIntersectionObserver(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMobileTier(page);

  const services = page.getByTestId("services-section");
  const featuredWork = page.getByTestId("featured-work-section");
  const finalCta = page.getByTestId("final-cta-section");

  for (const section of [services, featuredWork, finalCta]) {
    await scrollToElement(section);
    const reveals = section.locator("[data-mobile-reveal]");
    const revealCount = await reveals.count();

    expect(revealCount).toBeGreaterThan(0);
    for (let index = 0; index < revealCount; index += 1) {
      const reveal = reveals.nth(index);
      await scrollToElement(reveal);
      await page.waitForTimeout(250);

      const state = await reveal.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return {
          clipPath: style.clipPath,
          height: rect.height,
          opacity: Number(style.opacity),
          width: rect.width,
        };
      });

      expect(state.width).toBeGreaterThan(0);
      expect(state.height).toBeGreaterThan(0);
      expect(state.opacity).toBeGreaterThan(0.92);
      expect(state.clipPath).not.toContain("100%");
    }
  }
});

test("mobile uses native scroll instead of the Lenis smooth-scroll wrapper", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMobileTier(page);

  await expect
    .poll(() => page.evaluate(() => document.documentElement.className))
    .not.toContain("lenis");
});

test("mobile trust emblems keep moving without IntersectionObserver", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await disableIntersectionObserver(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMobileTier(page);

  const marquee = page.getByTestId("trust-mobile-emblems");
  await expect(marquee).toBeVisible();

  const initialTransform = await marquee.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(async () => marquee.evaluate((element) => getComputedStyle(element).transform), {
      // Wait for the hydrated Motion animation instead of assuming it has
      // started within a fixed delay on a cold WebKit worker.
      timeout: 10_000,
    })
    .not.toBe(initialTransform);
});

test("mobile hero video is explicitly started and resumes after browser pauses", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalPlay = HTMLMediaElement.prototype.play;
    const win = window as typeof window & { __heroVideoPlayCalls?: number };

    win.__heroVideoPlayCalls = 0;
    HTMLMediaElement.prototype.play = function play() {
      // Identify the hero by its own marker attribute. It no longer has
      // <source> children — the pre-hydration bootstrap assigns `src` directly
      // so it can pick a rendition by pointer type and run its own fallback
      // chain — so the old `source[src=...]` probe would never match.
      if (this instanceof HTMLVideoElement && this.hasAttribute("data-hero-video")) {
        win.__heroVideoPlayCalls = (win.__heroVideoPlayCalls ?? 0) + 1;
      }

      return originalPlay.call(this);
    };
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMobileTier(page);

  const heroVideo = page.getByTestId("hero-video");
  // Playback is started from JS (not the declarative `autoplay` attribute) so
  // reduced-motion can skip the download entirely. `muted` + `playsinline` are
  // still required for inline mobile autoplay.
  await expect(heroVideo).toHaveAttribute("muted", "");
  await expect(heroVideo).toHaveAttribute("playsinline", "");

  await expect
    .poll(() =>
      page.evaluate(() => {
        const win = window as typeof window & { __heroVideoPlayCalls?: number };
        return win.__heroVideoPlayCalls ?? 0;
      })
    )
    .toBeGreaterThan(0);

  const playCallsAfterPause = await heroVideo.evaluate(async (video) => {
    const win = window as typeof window & { __heroVideoPlayCalls?: number };
    const initialPlayCalls = win.__heroVideoPlayCalls ?? 0;

    video.dispatchEvent(new Event("pause"));
    await new Promise((resolve) => window.requestAnimationFrame(resolve));

    return (win.__heroVideoPlayCalls ?? 0) - initialPlayCalls;
  });

  expect(playCallsAfterPause).toBeGreaterThan(0);
});

test("mobile services use a plain vertical stack instead of the desktop-only sticky stack", async ({
  page,
}) => {
  // Previously quarantined on WebKit and flaky on Chromium. Both came from the
  // per-row scrollIntoViewIfNeeded() loop this test used to run: WebKit's
  // "wait for element to be stable" check never settles against the homepage
  // motion stack, and Chromium settled only sometimes. The assertions here need
  // geometry, not actionability, so the scrolling is gone and every row is now
  // measured in ONE evaluate. The quarantine went with it.

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForMobileTier(page);

  const services = page.getByTestId("services-section");
  await expect(services).toBeVisible();

  // Sweep once so any scroll-driven reveal has fired, then take EVERY row
  // measurement in a single evaluate. One atomic snapshot at one scroll offset
  // is not just faster than scrolling per row — it is more correct, because
  // these assertions compare rows against each other and measurements taken at
  // different scroll positions are not comparable.
  //
  // Each service is rendered as a row whose CTA link reads "Explore {eyebrow}".
  // Those links are the stable per-row selector (rows have no testid).
  await sweepDocument(page);

  const rowMetrics = await services.evaluate((section) =>
    Array.from(section.querySelectorAll("a"))
      .filter((anchor) => /Explore/.test(anchor.textContent ?? ""))
      .map((anchor) => {
        const rect = anchor.getBoundingClientRect();
        return {
          // Document-absolute, so it does not depend on the current scroll.
          top: window.scrollY + rect.top,
          position: getComputedStyle(anchor).position,
        };
      })
  );

  expect(rowMetrics.length).toBeGreaterThanOrEqual(3);

  // Rows are stacked in a single vertical column: each row's top sits below
  // the previous row's top.
  for (let index = 1; index < rowMetrics.length; index += 1) {
    expect(rowMetrics[index].top).toBeGreaterThan(rowMetrics[index - 1].top);
  }

  // Plain vertical stack — NOT the desktop sticky-card treatment. No row in the
  // services section uses sticky positioning.
  for (const metric of rowMetrics) {
    expect(metric.position).not.toBe("sticky");
  }

  // Defensive: no descendant element inside the services section is sticky either.
  const hasStickyDescendant = await services.evaluate((section) =>
    Array.from(section.querySelectorAll("*")).some(
      (element) => getComputedStyle(element).position === "sticky"
    )
  );
  expect(hasStickyDescendant).toBe(false);
});
