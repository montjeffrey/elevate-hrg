import { expect, test, type Locator, type Page } from "@playwright/test";

const TRUST_LABEL = "TRUSTED BY HOMEOWNERS. CERTIFIED BY THE BRANDS WE INSTALL.";
const GSAP_READY_TIMEOUT = 30_000;

// Scrolls the page exactly once so the trust strip's top lands ~70% down the
// viewport — safely past the GSAP `start: "top 82%"` entrance trigger. The
// scroll target is computed from the strip's own document position so it stays
// correct no matter how tall the hero renders (it is min-h:max(100dvh,700px)
// plus padding and is taller than the viewport, which is why a fixed small
// scroll fraction never reached the trigger).
async function scrollStripIntoTriggerZone(page: Page, trustStrip: Locator) {
  const stripDocTop = await trustStrip.evaluate(
    (section) => section.getBoundingClientRect().top + window.scrollY
  );
  await page.evaluate(
    ({ top }) => window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.7)),
    { top: stripDocTop }
  );
}

test.beforeEach(async ({ page }) => {
  // Suppress the welcome splash (it now plays on every full page load). It
  // overlays the hero at z-200, so it intercepts elementFromPoint() and delays
  // the trust-strip entrance under test timing. The layout inline script hides
  // it pre-paint when this suppression key is set.
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem("elevate-splash-suppress", "1");
    } catch {
      // sessionStorage unavailable — the splash will simply show.
    }
  });
});

test("desktop hero pulls the trust strip and badges into view together", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "The pinned hero pull-up transition only runs on desktop motion.");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-motion-tier="full"]')).toBeVisible();

  const trustStrip = page.getByText(TRUST_LABEL).locator("xpath=ancestor::section[1]");
  await expect(trustStrip).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));

  const readGeometry = () =>
    trustStrip.evaluate((section) => {
      const badge = section.querySelector('img[alt="GAF Certified installer"]');
      const sectionRect = section.getBoundingClientRect();
      const badgeRect = badge?.getBoundingClientRect();

      return {
        badgeBottom: badgeRect?.bottom ?? null,
        badgeTop: badgeRect?.top ?? null,
        sectionBottom: sectionRect.bottom,
        sectionTop: sectionRect.top,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });

  await expect.poll(async () => (await readGeometry()).badgeTop).not.toBeNull();
  const geometry = await readGeometry();

  if (geometry.badgeTop === null || geometry.badgeBottom === null) {
    throw new Error("Expected the GAF badge to be rendered in the trust strip.");
  }

  const sampleX = Math.round(geometry.viewportWidth / 2);
  const sampleY = Math.round(geometry.sectionTop + 20);
  const topmostSectionText = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest("section")?.textContent ?? "",
    { x: sampleX, y: sampleY }
  );

  expect(geometry.sectionTop).toBeLessThan(geometry.viewportHeight * 0.75);
  expect(geometry.sectionBottom).toBeGreaterThan(geometry.viewportHeight * 0.2);
  expect(geometry.badgeTop).toBeGreaterThanOrEqual(geometry.sectionTop);
  expect(geometry.badgeBottom).toBeLessThanOrEqual(geometry.sectionBottom);
  expect(topmostSectionText).toContain(TRUST_LABEL);
});

test("desktop certifications animate after entering without further scrolling", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "The desktop entrance reveal only runs on desktop motion.");
  // The GSAP ScrollTrigger entrance is wired by a dynamically imported chunk;
  // on a loaded CI runner (observed on WebKit) the chunk fetch/parse alone can
  // eat several seconds before the entrance even starts, so the poll below
  // needs real headroom beyond the animation's own ~0.8s duration.
  test.setTimeout(60_000);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-motion-tier="full"]')).toBeVisible();

  const trustStrip = page.getByText(TRUST_LABEL).locator("xpath=ancestor::section[1]");
  const readBadgeState = () =>
    trustStrip.evaluate((section) => {
      const badge = section.querySelector('img[alt="GAF Certified installer"]');
      const style = badge ? getComputedStyle(badge) : null;
      const transform = new DOMMatrixReadOnly(
        style?.transform === "none" ? undefined : style?.transform
      );

      return {
        opacity: style ? Number(style.opacity) : null,
        scrollY: window.scrollY,
        translateY: transform.m42,
      };
    });

  const initialState = await readBadgeState();
  // Scroll ONCE so the trust strip crosses the GSAP `start: "top 82%"` trigger.
  // The hero is `min-h-[max(100dvh,700px)]` plus padding, so it renders taller
  // than the 800px viewport (~894px here). A fixed innerHeight*0.2 (160px)
  // scroll leaves the strip top at ~734px > the 656px (82%) threshold, so the
  // entrance never fires. Compute the scroll from the strip's document position
  // so it lands ~70% down the viewport — safely inside the trigger zone —
  // regardless of the hero's exact height.
  await scrollStripIntoTriggerZone(page, trustStrip);
  const enteredScrollY = await page.evaluate(() => window.scrollY);
  // The GSAP entrance is wired by a dynamically imported chunk, so poll for the
  // badge to settle rather than racing a fixed timeout against the chunk load.
  await expect
    .poll(async () => Math.abs((await readBadgeState()).translateY), {
      timeout: GSAP_READY_TIMEOUT,
    })
    .toBeLessThan(2);
  const settledState = await readBadgeState();

  if (initialState.opacity === null || settledState.opacity === null) {
    throw new Error("Expected the GAF badge to be measurable during the trust strip reveal.");
  }

  // The entrance must settle without any FURTHER scrolling beyond the single
  // entering scroll above.
  expect(settledState.scrollY).toBe(enteredScrollY);
  expect(initialState.translateY).toBeGreaterThan(10);
  expect(Math.abs(settledState.translateY)).toBeLessThan(2);
  // GSAP clearProps restores the badge's resting `opacity-80` class once the
  // reveal finishes, so the settled value is 0.8 — well above the dim 0.46
  // FROM state but below 1. Assert it cleared the FROM state, not full opacity.
  expect(settledState.opacity).toBeGreaterThan(0.7);
  expect(settledState.opacity).toBeGreaterThan(initialState.opacity);
});

test("desktop certifications do not replay after the first entrance", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "The desktop entrance reveal only runs on desktop motion.");
  // See the timeout note in the previous test — same dynamically imported
  // GSAP chunk, same CI-runner headroom requirement.
  test.setTimeout(60_000);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-motion-tier="full"]')).toBeVisible();

  const trustStrip = page.getByText(TRUST_LABEL).locator("xpath=ancestor::section[1]");
  const readTranslateY = () =>
    trustStrip.evaluate((section) => {
      const badge = section.querySelector('img[alt="GAF Certified installer"]');
      const style = badge ? getComputedStyle(badge) : null;
      const transform = new DOMMatrixReadOnly(
        style?.transform === "none" ? undefined : style?.transform
      );

      return transform.m42;
    });

  // Scroll the strip across the `top 82%` trigger (the hero renders taller than
  // the viewport, so a fixed innerHeight*0.2 scroll never reaches it).
  await scrollStripIntoTriggerZone(page, trustStrip);
  await expect
    .poll(async () => Math.abs(await readTranslateY()), { timeout: GSAP_READY_TIMEOUT })
    .toBeLessThan(2);

  // Scroll the strip fully back out of view, then return it to the trigger
  // zone. Because the entrance is `once: true`, it must NOT replay or reset.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await scrollStripIntoTriggerZone(page, trustStrip);
  await page.waitForTimeout(100);

  expect(Math.abs(await readTranslateY())).toBeLessThan(2);
});
