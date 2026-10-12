import { expect, test } from "@playwright/test";

test("reduced motion disables motion primitives and WebGL canvas", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  await page.goto("/playground/motion");
  await expect(page.getByTestId("motion-tier-label")).toContainText("minimal");
  await expect(
    page.getByTestId("parallax-demo").locator("[data-motion-disabled='true']")
  ).toBeVisible();
  await expect(
    page.getByTestId("velocity-marquee-demo").locator("[data-motion-disabled='true']")
  ).toBeVisible();
  await expect(
    page.getByTestId("number-scrub-demo").locator("[data-motion-disabled='true']")
  ).toBeVisible();
  await expect(page.getByTestId("hover-distortion-demo").locator("canvas")).toHaveCount(0);

  await context.close();
});

test("below 1024px OGL canvas is not instantiated", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/playground/motion", { waitUntil: "domcontentloaded" });

  await expect(page.getByTestId("motion-tier-label")).toContainText("mobile");
  await expect(page.getByTestId("hover-distortion-demo").locator("canvas")).toHaveCount(0);
});
