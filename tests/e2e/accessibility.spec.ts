import { expect, type Page, test } from "@playwright/test";

const waitForHeaderHydration = (page: Page) =>
  expect(page.locator("header")).toHaveAttribute("data-hydrated", "true", {
    // The header is interactive only after React hydrates it. A cold WebKit
    // worker can take longer than Playwright's default assertion window.
    timeout: 20_000,
  });

test("skip link is the first focusable element", async ({ page }) => {
  test.setTimeout(45_000);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();

  // Wait for the cookie notice before querying, so this test explicitly covers
  // the hardest case rather than passing by accident on timing. The notice
  // carries three buttons and is mounted as the LAST child of <body>
  // (app/layout.tsx) precisely so it lands after the skip link in document
  // order — moving it anywhere earlier in the tree breaks this assertion.
  // It reveals only after the welcome splash finishes (~3.8s), hence the
  // extended test timeout above.
  await expect(page.getByTestId("consent-notice")).toBeVisible({ timeout: 12_000 });

  const firstFocusableText = await page.evaluate(() => {
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.tabIndex >= 0);

    return focusable[0]?.textContent?.trim();
  });

  expect(firstFocusableText).toBe("Skip to content");
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content"
  );
});

test("desktop services menu is keyboard reachable and closes with Escape", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "Desktop navigation is hidden in mobile projects.");
  test.setTimeout(45_000);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHeaderHydration(page);

  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Services" }).focus();
  await page.keyboard.press("Enter");

  const servicesMenu = page.getByTestId("services-menu-content");
  await expect(servicesMenu.getByRole("link", { name: "Roofing" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(servicesMenu).not.toBeVisible();
});

test("mobile sheet is keyboard reachable and closes with Escape", async ({ page }) => {
  test.setTimeout(45_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHeaderHydration(page);

  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: "Roofing" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
