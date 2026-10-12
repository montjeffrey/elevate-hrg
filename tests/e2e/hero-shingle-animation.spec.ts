import { expect, test } from "@playwright/test";

test("desktop hero renders an animated shingle texture", async ({ isMobile, page }) => {
  test.skip(isMobile, "The immersive shingle texture is validated on desktop motion.");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-motion-tier="full"]')).toBeVisible();

  const shingleLayer = page.getByTestId("hero-shingle-animation");
  await expect(shingleLayer).toBeVisible();

  const readLayerState = () =>
    shingleLayer.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      const anims = element.getAnimations();
      const running =
        anims.find((a) => {
          const anim = a as Animation & { animationName?: string };
          return (anim.animationName ?? a.id ?? "").includes("hero-shingle");
        }) ?? anims[0];

      return {
        animationDuration: style.animationDuration,
        animationName: style.animationName,
        backgroundImage: style.backgroundImage,
        backgroundPosition: style.backgroundPosition,
        currentTime: running ? Number(running.currentTime) : null,
        opacity: Number(style.opacity),
        playState: running ? running.playState : "idle",
        rectHeight: Math.round(rect.height),
        rectWidth: Math.round(rect.width),
        zIndex: style.zIndex,
      };
    });

  const initialState = await readLayerState();
  await page.waitForTimeout(800);
  const animatedState = await readLayerState();

  expect(initialState.backgroundImage).toContain("data:image/svg+xml");
  expect(initialState.animationName).not.toBe("none");
  expect(initialState.animationDuration).not.toBe("0s");
  expect(initialState.opacity).toBeGreaterThan(0.2);
  expect(initialState.rectWidth).toBeGreaterThanOrEqual(1280);
  expect(initialState.rectHeight).toBeGreaterThanOrEqual(800);
  expect(initialState.zIndex).toBe("15");
  expect(initialState.currentTime).not.toBeNull();
  expect(animatedState.currentTime).toBeGreaterThan(initialState.currentTime as number);
});
