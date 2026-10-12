import { expect, type Page, test } from "@playwright/test";

// Regression guard for the mobile-responsiveness fixes. These are the checks a
// metric-only performance audit does not cover: small-viewport layout overflow,
// mobile-nav reachability, and iOS-zoom-safe form controls. Every test forces a
// real phone viewport so it is meaningful regardless of which Playwright project
// runs it.

const PHONE = { width: 390, height: 844 };

// Representative routes across every page template.
const ROUTES = [
  "/",
  "/roofing",
  "/windows",
  "/siding",
  "/gutters",
  "/entry-doors",
  "/soffit-fascia",
  "/attic-insulation",
  "/our-process",
  "/services",
  "/gallery",
  "/about",
  "/financing",
  "/reviews",
  "/contact",
  "/quote",
  "/service-areas",
];

const gotoAt = async (page: Page, path: string, size: { width: number; height: number }) => {
  await page.setViewportSize(size);
  // The assertions only need the document's layout. Do not wait for "load":
  // deferred gallery media can keep WebKit waiting even though the DOM and
  // rendered layout are ready to inspect.
  await page.goto(path, { waitUntil: "domcontentloaded" });
};

const gotoPhone = (page: Page, path: string) => gotoAt(page, path, PHONE);

const expectNoHorizontalOverflow = async (page: Page, path: string) => {
  // Let deferred content (splash, reveals, lazy widgets) settle.
  await page.waitForTimeout(1000);

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  // 1px tolerance for sub-pixel rounding.
  expect(scrollWidth, `${path} overflows: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(
    clientWidth + 1
  );
};

// Same reasoning as the EXTRA_VIEWPORTS cap below, applied to the sweep that
// predates it: Desktop Chrome at 390px re-tests the Chromium engine Mobile
// Chrome already covers, and Desktop Safari re-tests Mobile Safari WebKit.
// Both are dropped. Desktop Firefox is deliberately KEPT — Gecko is the one
// engine no mobile project provides, and it is exactly the gap the note below
// names as the cost of that cap. Net: 18 routes x 3 projects instead of x 5,
// with Gecko coverage gained here rather than lost.
test.describe("no horizontal overflow at 390px", () => {
  for (const path of ROUTES) {
    test(`"${path}" does not scroll horizontally`, async ({ browserName, isMobile, page }) => {
      test.skip(
        !isMobile && browserName !== "firefox",
        "Desktop Chromium/WebKit at a phone viewport duplicate the mobile projects; Gecko still runs."
      );
      await gotoPhone(page, path);
      await expectNoHorizontalOverflow(page, path);
    });
  }
});

// 390px alone left two real gaps: 320px (iPhone SE 1st gen, small Androids) is
// the narrowest viewport still worth supporting, and landscape was never
// exercised at all — which is exactly where the hero's rendition breakpoint
// used to break.
//
// Deliberate cap, stated so it is not mistaken for full coverage: these two
// sweeps run ONLY on the real mobile projects (Mobile Chrome / Mobile Safari).
// The three desktop projects forced into a phone viewport would just re-test
// the same Chromium and WebKit engines, so running all three viewports across
// all five projects would add ~170 tests for no extra signal. The trade-off is
// that 320px and landscape are NOT covered on Gecko.
const EXTRA_VIEWPORTS = [
  { label: "320px portrait", size: { width: 320, height: 568 } },
  { label: "landscape phone", size: { width: 844, height: 390 } },
];

for (const { label, size } of EXTRA_VIEWPORTS) {
  test.describe(`no horizontal overflow at ${label}`, () => {
    for (const path of ROUTES) {
      test(`"${path}" does not scroll horizontally`, async ({ page, isMobile }) => {
        test.skip(!isMobile, "Runs on the real mobile projects only — see note above.");
        await gotoAt(page, path, size);
        await expectNoHorizontalOverflow(page, path);
      });
    }
  });
}

test("a landscape phone still gets the right-sized hero rendition", async ({ page, isMobile }) => {
  test.skip(
    !isMobile,
    "Rendition choice keys off a coarse pointer, which only mobile projects emulate."
  );

  // Regression guard for the cellular-cost bug: selection used to key off
  // `max-width: 767px`, so simply rotating a phone (iPhone 12 landscape is
  // 844px, Pixel 5 is 851px) fell through to the desktop ladder and pulled a
  // 3.3–4.6 MB file instead of the 0.9–2.4 MB phone rendition.
  await gotoAt(page, "/", { width: 844, height: 390 });

  const src = await page
    .getByTestId("hero-video")
    .evaluate((v) => (v as HTMLVideoElement).currentSrc || (v as HTMLVideoElement).src);

  expect(src, `landscape phone loaded a desktop rendition: ${src}`).toContain("hero-loop.mobile.");
});

test("mobile nav exposes every link and both CTAs", async ({ page }) => {
  await gotoPhone(page, "/");
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Open navigation menu" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // The Call + Schedule CTAs previously fell below the fold in a non-scrolling
  // sheet and were unreachable — assert they are actually in the viewport.
  const callCta = dialog.getByRole("link", { name: /Call/ });
  const scheduleCta = dialog.getByRole("link", { name: /Schedule a Free Estimate/ });
  await expect(callCta).toBeInViewport();
  await expect(scheduleCta).toBeInViewport();

  // Every nav link must be reachable by scrolling the nav's own scroll
  // region across its full range. Checked via plain DOM scrollTop math
  // rather than Playwright's scrollIntoViewIfNeeded/toBeInViewport
  // actionability polling: WebKit's "wait for element to be stable" check
  // never settles inside this nested overflow-y-auto flex region, which
  // times out the check regardless of whether the link is actually
  // reachable (confirmed reachable via manual DOM inspection).
  const reachability = await dialog.evaluate((dialogEl) => {
    const nav = dialogEl.querySelector("nav");
    if (!nav) return { navFound: false, linkCount: 0, unreachable: [] as number[] };

    const links = Array.from(nav.querySelectorAll("a"));
    const maxScrollTop = Math.max(0, nav.scrollHeight - nav.clientHeight);

    const unreachable = links
      .map((link, index) => {
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        const linkTopWithinNav = linkRect.top - navRect.top + nav.scrollTop;
        const targetScrollTop = Math.max(
          0,
          Math.min(maxScrollTop, linkTopWithinNav - (nav.clientHeight - linkRect.height) / 2)
        );

        nav.scrollTop = targetScrollTop;

        const navRectAfter = nav.getBoundingClientRect();
        const linkRectAfter = link.getBoundingClientRect();
        const inView =
          linkRectAfter.top >= navRectAfter.top - 1 &&
          linkRectAfter.bottom <= navRectAfter.bottom + 1;

        return inView ? -1 : index;
      })
      .filter((index) => index !== -1);

    return { navFound: true, linkCount: links.length, unreachable };
  });

  expect(reachability.navFound).toBe(true);
  expect(reachability.linkCount).toBeGreaterThanOrEqual(8);
  expect(reachability.unreachable, `unreachable link indices: ${reachability.unreachable}`).toEqual(
    []
  );
});

test("form selects use a >=16px font so iOS Safari does not zoom on focus", async ({ page }) => {
  for (const path of ["/quote", "/contact"]) {
    await gotoPhone(page, path);
    await page.waitForTimeout(1000);

    const selects = page.locator("select");
    const count = await selects.count();
    expect(count, `${path} should render at least one native select`).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const fontSize = await selects
        .nth(i)
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontSize, `${path} select #${i} font-size`).toBeGreaterThanOrEqual(16);
    }
  }
});
