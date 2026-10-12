import { expect, test, type Page } from "@playwright/test";

const CONSENT_KEY = "elevate-consent-v1";
const SPLASH_SUPPRESS_KEY = "elevate-splash-suppress";
const DAY_MS = 24 * 60 * 60 * 1000;

type StoredCategories = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

type StoredRecord = {
  v: number;
  ts: number;
  source: string;
  categories: StoredCategories;
};

type ConsentPush = { mode: unknown; signals: Record<string, unknown> };

// ── Local helpers ──────────────────────────────────────────────────────────
// Inline rather than a shared util module, matching the repo's convention
// (there is no tests/e2e/utils/). Every helper goes through addInitScript so
// state is established before any page script runs and the tests stay
// order-independent under `fullyParallel: true`.

async function clearConsent(page: Page) {
  await page.addInitScript((key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage denied — behaves as a first-time visitor anyway.
    }
  }, CONSENT_KEY);
}

async function seedConsent(page: Page, record: StoredRecord) {
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage denied — the notice will simply show.
      }
    },
    { key: CONSENT_KEY, value: JSON.stringify(record) }
  );
}

/** Reuses the same suppression key hero-trust-strip.spec.ts uses. */
async function suppressSplash(page: Page) {
  await page.addInitScript((key: string) => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — the splash will simply show.
    }
  }, SPLASH_SUPPRESS_KEY);
}

/**
 * Firefox ships a REAL `navigator.globalPrivacyControl` (true under ETP
 * Strict), so both the present and absent cases must be forced explicitly —
 * otherwise a runner profile change silently flips the behavior under test.
 */
async function forceGpc(page: Page, value: boolean | undefined) {
  await page.addInitScript((gpc: boolean | undefined) => {
    try {
      Object.defineProperty(navigator, "globalPrivacyControl", {
        configurable: true,
        get: () => gpc,
      });
    } catch {
      // Non-configurable in some engines; the assertion will surface it.
    }
  }, value);
}

async function readRecord(page: Page): Promise<StoredRecord | null> {
  return page.evaluate((key: string) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredRecord) : null;
    } catch {
      return null;
    }
  }, CONSENT_KEY);
}

/** Every `gtag('consent', …)` call, flattened out of its arguments object. */
async function consentPushes(page: Page): Promise<ConsentPush[]> {
  return page.evaluate(() => {
    const layer = (window.dataLayer ?? []) as unknown as ArrayLike<unknown>[];
    return Array.from(layer)
      .filter((entry) => entry && typeof entry.length === "number" && entry[0] === "consent")
      .map((entry) => ({
        mode: entry[1],
        signals: { ...(entry[2] as Record<string, unknown>) },
      }));
  });
}

const notice = (page: Page) => page.getByTestId("consent-notice");
const preferences = (page: Page) => page.getByTestId("consent-preferences");

test.describe("cookie consent", () => {
  test.beforeEach(async ({ page }) => {
    await clearConsent(page);
  });

  // 1 ────────────────────────────────────────────────────────────────────────
  test("notice waits for the welcome splash to finish", async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    // The splash choreography finishes at ~3.44s; the notice must not appear
    // through it (it is z-ordered underneath and would look like it develops
    // through the fade).
    await page.waitForTimeout(1500);
    await expect(notice(page)).toHaveCount(0);

    await expect(notice(page)).toBeVisible({ timeout: 20_000 });
  });

  // 2 ────────────────────────────────────────────────────────────────────────
  test("notice appears promptly when the splash is skipped", async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto("/?intro=skip", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });
  });

  // 3 ────────────────────────────────────────────────────────────────────────
  test("skip link stays the first focusable element while the notice is visible", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    // Same document-order query as tests/e2e/accessibility.spec.ts. The notice
    // carries three buttons, so this only holds because ConsentManagerLazy is
    // mounted as the last child of <body> — see the comment at that mount site.
    const firstFocusableText = await page.evaluate(() => {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.tabIndex >= 0);

      return focusable[0]?.textContent?.trim();
    });

    expect(firstFocusableText).toBe("Skip to content");
  });

  // 4 ────────────────────────────────────────────────────────────────────────
  test("accept all grants both categories and dismisses the notice", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await notice(page).getByRole("button", { name: "Accept all" }).click();
    await expect(notice(page)).toHaveCount(0);

    const record = await readRecord(page);
    expect(record?.v).toBe(1);
    expect(record?.source).toBe("explicit");
    expect(record?.categories.analytics).toBe(true);
    expect(record?.categories.marketing).toBe(true);

    const pushes = await consentPushes(page);
    const updates = pushes.filter((entry) => entry.mode === "update");
    expect(updates.length).toBeGreaterThan(0);
    expect(updates[updates.length - 1].signals).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  // 5 ────────────────────────────────────────────────────────────────────────
  test("reject non-essential denies everything and gates the dataLayer", async ({ page }) => {
    test.setTimeout(90_000);

    // Keep `tel:` clicks from navigating to the dialer. Registered in capture
    // phase before any page script, so the app's own capture-phase listener
    // still observes the click (preventDefault does not stop propagation).
    await page.addInitScript(() => {
      document.addEventListener(
        "click",
        (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest('a[href^="tel:"]')) {
            event.preventDefault();
          }
        },
        true
      );
      window.addEventListener("phone_click", () => {
        (window as unknown as { __phoneClicks: number }).__phoneClicks =
          ((window as unknown as { __phoneClicks?: number }).__phoneClicks ?? 0) + 1;
      });
    });

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await notice(page).getByRole("button", { name: "Reject non-essential" }).click();
    await expect(notice(page)).toHaveCount(0);

    const record = await readRecord(page);
    expect(record?.categories.analytics).toBe(false);
    expect(record?.categories.marketing).toBe(false);

    const before = await page.evaluate(() => (window.dataLayer ?? []).length);

    const phoneLink = page.locator('a[href^="tel:"]:visible').first();
    await phoneLink.click();

    // The internal CustomEvent still fires (lib/analytics.ts dispatches it
    // before the consent gate) ...
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { __phoneClicks?: number }).__phoneClicks ?? 0)
      )
      .toBeGreaterThan(0);

    // ... but nothing reached Google.
    const after = await page.evaluate(() => (window.dataLayer ?? []).length);
    expect(after).toBe(before);
  });

  // 6 ────────────────────────────────────────────────────────────────────────
  test("returning visitor with a stored record never sees the notice", async ({ page }) => {
    test.setTimeout(90_000);

    await seedConsent(page, {
      v: 1,
      ts: Date.now(),
      source: "explicit",
      categories: { necessary: true, functional: true, analytics: true, marketing: false },
    });
    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-consent", "resolved");
    await page.waitForTimeout(5000);
    await expect(notice(page)).toHaveCount(0);
  });

  // 7 ────────────────────────────────────────────────────────────────────────
  test("an expired record re-prompts", async ({ page }) => {
    test.setTimeout(90_000);

    await seedConsent(page, {
      v: 1,
      ts: Date.now() - 400 * DAY_MS,
      source: "explicit",
      categories: { necessary: true, functional: true, analytics: true, marketing: true },
    });
    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-consent", "pending");
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });
  });

  // 8 ────────────────────────────────────────────────────────────────────────
  test("reveal and modal open/close contribute no layout shift", async ({ browserName, page }) => {
    test.skip(browserName !== "chromium", "The layout-shift PerformanceObserver is Chromium-only.");
    test.setTimeout(90_000);

    await page.addInitScript(() => {
      const state = window as unknown as { __cls: number; __clsReset: () => void };
      state.__cls = 0;
      state.__clsReset = () => {
        state.__cls = 0;
      };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) state.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Reset after load so this measures the consent UI only, not the page's
    // own (separately budgeted) loading shifts.
    await page.waitForTimeout(1000);
    await page.evaluate(() => (window as unknown as { __clsReset: () => void }).__clsReset());

    await expect(notice(page)).toBeVisible({ timeout: 20_000 });
    await page.waitForTimeout(500);

    await notice(page).getByRole("button", { name: "Manage preferences" }).click();
    await expect(preferences(page)).toBeVisible();
    await page.waitForTimeout(500);

    await page.keyboard.press("Escape");
    await expect(preferences(page)).toBeHidden();
    await page.waitForTimeout(500);

    // This is the test that catches a Radix scroll-lock scrollbar-compensation
    // shift, which is the one realistic CLS regression vector in the feature.
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.01);
  });

  // 9 ────────────────────────────────────────────────────────────────────────
  test("notice does not overlap the sticky mobile CTA", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    // StickyMobileCTA mounts past 200px of scroll and hides again when a lead
    // form is in view, so land somewhere between.
    await page.evaluate(() => window.scrollTo(0, 400));
    const sticky = page.getByTestId("sticky-mobile-cta");
    await expect(sticky).toBeVisible({ timeout: 10_000 });

    const noticeBox = await notice(page).boundingBox();
    const stickyBox = await sticky.boundingBox();
    expect(noticeBox).not.toBeNull();
    expect(stickyBox).not.toBeNull();
    if (!noticeBox || !stickyBox) return;

    // The sticky bar is transform-shifted clear of the notice.
    expect(stickyBox.y + stickyBox.height).toBeLessThanOrEqual(noticeBox.y + 1);
  });

  // 10 ───────────────────────────────────────────────────────────────────────
  test("the Join-the-Club FAB is suppressed while the notice is up", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    // The FAB only mounts once the hero has scrolled out of view.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await expect(page.locator("[data-club-trigger]")).toBeHidden();

    await notice(page).getByRole("button", { name: "Accept all" }).click();
    await expect(notice(page)).toHaveCount(0);
    await expect(page.locator("[data-club-trigger]")).toBeVisible({ timeout: 10_000 });
  });

  // 11 ───────────────────────────────────────────────────────────────────────
  test("every consent control clears the 44px target-size floor", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    const assertTargets = async (scope: ReturnType<typeof notice>, floor: number, sel: string) => {
      const controls = scope.locator(sel);
      const count = await controls.count();
      expect(count).toBeGreaterThan(0);
      for (let index = 0; index < count; index += 1) {
        const box = await controls.nth(index).boundingBox();
        expect(box).not.toBeNull();
        if (!box) continue;
        expect.soft(box.width, `${sel} #${index} width`).toBeGreaterThanOrEqual(floor);
        expect.soft(box.height, `${sel} #${index} height`).toBeGreaterThanOrEqual(floor);
      }
    };

    await assertTargets(notice(page), 44, "button, a[href]");

    await notice(page).getByRole("button", { name: "Manage preferences" }).click();
    await expect(preferences(page)).toBeVisible();
    // The dialog enters with `zoom-in-95`, and boundingBox() reports the
    // mid-animation transformed size — a 44px control measures 41.8px at 95%.
    // Wait for the transform to settle before measuring anything.
    await page.waitForTimeout(700);

    await assertTargets(preferences(page), 44, "button, a[href]");
    // Checkboxes are held to WCAG 2.5.8's 24px floor rather than 44px: the
    // native box is sized for legibility and sits inside a 44px row, which is
    // what the surrounding label and spacing provide.
    await assertTargets(preferences(page), 24, 'input[type="checkbox"]');
  });

  // 12 ───────────────────────────────────────────────────────────────────────
  test("preferences modal honors the keyboard contract", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    const trigger = notice(page).getByRole("button", { name: "Manage preferences" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = preferences(page);
    await expect(dialog).toBeVisible();

    // Focus must land inside the dialog (Radix moves it there on open).
    await expect
      .poll(async () =>
        dialog.evaluate(
          (node) => node.contains(document.activeElement) || node === document.activeElement
        )
      )
      .toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // ... and return to the control that opened it.
    await expect
      .poll(async () => trigger.evaluate((node) => node === document.activeElement))
      .toBe(true);
  });

  // 13 ───────────────────────────────────────────────────────────────────────
  test("granular save persists exactly the chosen categories", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await notice(page).getByRole("button", { name: "Manage preferences" }).click();
    const dialog = preferences(page);
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("Analytics").uncheck();
    await dialog.getByLabel("Advertising").check();
    await dialog.getByRole("button", { name: "Save preferences" }).click();

    await expect(dialog).toBeHidden();

    const record = await readRecord(page);
    expect(record?.categories.analytics).toBe(false);
    expect(record?.categories.marketing).toBe(true);
    expect(record?.source).toBe("explicit");

    const updates = (await consentPushes(page)).filter((entry) => entry.mode === "update");
    expect(updates[updates.length - 1].signals).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      security_storage: "granted",
    });
  });

  // 14 ───────────────────────────────────────────────────────────────────────
  test("the footer link reopens the panel pre-populated", async ({ page }) => {
    test.setTimeout(90_000);

    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await notice(page).getByRole("button", { name: "Accept all" }).click();
    await expect(notice(page)).toHaveCount(0);

    await page.getByTestId("consent-preferences-link").click();
    const dialog = preferences(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Analytics")).toBeChecked();
    await expect(dialog.getByLabel("Advertising")).toBeChecked();
  });

  // 15 ───────────────────────────────────────────────────────────────────────
  test("a Global Privacy Control signal is honored and cannot be overridden", async ({ page }) => {
    test.setTimeout(90_000);

    await forceGpc(page, true);
    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await notice(page).getByRole("button", { name: "Manage preferences" }).click();
    const dialog = preferences(page);
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("consent-gpc-note")).toBeVisible();
    await expect(dialog.getByLabel("Advertising")).toBeDisabled();

    // Even "Accept all" cannot grant advertising while GPC is asserted.
    await dialog.getByRole("button", { name: "Accept all" }).click();
    await expect(dialog).toBeHidden();

    const record = await readRecord(page);
    expect(record?.categories.marketing).toBe(false);

    const updates = (await consentPushes(page)).filter((entry) => entry.mode === "update");
    expect(updates[updates.length - 1].signals).toMatchObject({ ad_storage: "denied" });
  });

  // 16 ───────────────────────────────────────────────────────────────────────
  test("without a GPC signal the default posture applies", async ({ page }) => {
    test.setTimeout(90_000);

    await forceGpc(page, undefined);
    await suppressSplash(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(notice(page)).toBeVisible({ timeout: 20_000 });

    await expect(page.getByTestId("consent-gpc-note")).toHaveCount(0);

    // Opt-out posture: analytics granted by default, advertising denied.
    const defaults = (await consentPushes(page)).filter((entry) => entry.mode === "default");
    expect(defaults.length).toBeGreaterThan(0);
    expect(defaults[0].signals).toMatchObject({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      security_storage: "granted",
    });

    await notice(page).getByRole("button", { name: "Manage preferences" }).click();
    const dialog = preferences(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Analytics")).toBeChecked();
    await expect(dialog.getByLabel("Advertising")).not.toBeChecked();
    await expect(dialog.getByLabel("Advertising")).toBeEnabled();
  });
});
