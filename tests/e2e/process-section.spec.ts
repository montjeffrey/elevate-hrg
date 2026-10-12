import { expect, type Page, test } from "@playwright/test";

const MOTION_READY_TIMEOUT = 15_000;

const waitForHomeMotionTier = async (page: Page) => {
  await expect(
    page.locator(
      '[data-motion-tier="full"], [data-motion-tier="mobile"], [data-motion-tier="minimal"]'
    )
  ).toBeVisible();
};

const readHomeMotionTier = (page: Page) => {
  return page.locator("[data-motion-tier]").first().getAttribute("data-motion-tier");
};

const waitForHomeMotionTierValue = async (page: Page, expected: "full" | "mobile" | "minimal") => {
  await waitForHomeMotionTier(page);

  try {
    await expect.poll(async () => readHomeMotionTier(page), { timeout: 3000 }).toBe(expected);
  } catch {
    return readHomeMotionTier(page);
  }

  return expected;
};

const EXPECTED_STEPS = [
  { num: "01", title: "Initial Consultation" },
  { num: "02", title: "Detailed Proposal" },
  { num: "03", title: "Material Selection" },
  { num: "04", title: "Quality Assurance" },
] as const;

type VerticalProcessSnapshot = {
  cards: Array<{
    bottom: number;
    descriptionDisplay: string | null;
    descriptionText: string;
    left: number;
    markerCenterX: number | null;
    right: number;
    testId: string | null;
    text: string;
    top: number;
    width: number;
  }>;
  documentScrollWidth: number;
  pathLineX: number | null;
  viewportWidth: number;
};

const readVerticalProcessSnapshot = async (page: Page): Promise<VerticalProcessSnapshot> => {
  const section = page.getByTestId("process-section");
  return section.evaluate((element) => {
    const viewportWidth = document.documentElement.clientWidth;
    const pathLineRect = element
      .querySelector('[data-testid="process-vertical-path-line"]')
      ?.getBoundingClientRect();
    const cards = Array.from(element.querySelectorAll("[data-process-card]")).map((card) => {
      const rect = card.getBoundingClientRect();
      const marker = card.querySelector("[data-process-card-marker]");
      const markerRect = marker?.getBoundingClientRect();
      const description = card.querySelector("[data-process-description]") as HTMLElement | null;

      return {
        bottom: rect.bottom,
        descriptionDisplay: description ? getComputedStyle(description).display : null,
        descriptionText: description?.textContent?.trim() ?? "",
        left: rect.left,
        markerCenterX: markerRect ? markerRect.left + markerRect.width / 2 : null,
        right: rect.right,
        testId: card.getAttribute("data-testid"),
        text: card.textContent?.trim() ?? "",
        top: rect.top,
        width: rect.width,
      };
    });

    return {
      cards,
      documentScrollWidth: document.documentElement.scrollWidth,
      pathLineX: pathLineRect ? pathLineRect.left + pathLineRect.width / 2 : null,
      viewportWidth,
    };
  });
};

const assertVerticalTimelineLayout = (
  layout: VerticalProcessSnapshot,
  { minCardWidth }: { minCardWidth: number }
) => {
  expect(layout.cards).toHaveLength(EXPECTED_STEPS.length);
  expect(layout.cards.map((card) => card.testId)).toEqual(
    EXPECTED_STEPS.map((step) => `process-step-card-${step.num}`)
  );
  expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);

  for (const card of layout.cards) {
    expect(card.left).toBeGreaterThanOrEqual(0);
    expect(card.right).toBeLessThanOrEqual(layout.viewportWidth);
    expect(card.markerCenterX).not.toBeNull();
    expect(layout.pathLineX).not.toBeNull();
    expect(Math.abs((card.markerCenterX ?? 0) - (layout.pathLineX ?? 0))).toBeLessThanOrEqual(4);
    expect(card.descriptionDisplay).not.toBe("none");
    expect(card.descriptionText.length).toBeGreaterThan(0);
    expect(card.text.length).toBeGreaterThan(0);
    expect(card.width).toBeGreaterThan(minCardWidth);
  }

  for (let index = 1; index < layout.cards.length; index += 1) {
    expect(layout.cards[index].top).toBeGreaterThan(layout.cards[index - 1].bottom);
  }
};

test("desktop process section renders the vertical timeline without horizontal overflow", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "Desktop layout assertions require a desktop project.");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "full");
  test.skip(tier !== "full", `Desktop process scene requires full motion tier; got ${tier}.`);

  const section = page.getByTestId("process-section");
  const scene = page.getByTestId("process-scene");

  await expect(section).toBeVisible();
  await expect(scene).toBeVisible();
  // The heavy GSAP-pinned desktop scene was retired in favour of the
  // unified vertical timeline. Lock that contract in so it can't regress.
  await expect(page.getByTestId("process-desktop-scene")).toHaveCount(0);
  await expect(page.locator("[data-process-watermark]")).toHaveCount(0);
  await expect(page.locator("[data-process-matte]")).toHaveCount(0);
  await expect(page.locator("[data-process-marker]")).toHaveCount(0);

  const layout = await readVerticalProcessSnapshot(page);
  assertVerticalTimelineLayout(layout, { minCardWidth: 360 });

  await expect(
    page.getByTestId("process-step-card-01").getByRole("link", { name: "Schedule Now" })
  ).toBeVisible();
  await expect(section.getByRole("link", { name: "Schedule Now" })).toHaveCount(1);
});

test("desktop process timeline advances active state as the user scrolls", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "Desktop scroll behaviour is validated on a desktop project.");
  test.setTimeout(45_000);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "full");
  test.skip(tier !== "full", `Desktop process scene requires full motion tier; got ${tier}.`);

  const step01 = page.getByTestId("process-step-card-01");
  const step02 = page.getByTestId("process-step-card-02");
  const step03 = page.getByTestId("process-step-card-03");

  // Scroll step 02 into the active band (~58% of viewport height).
  await step02.evaluate((card) => {
    const rect = card.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top - window.innerHeight * 0.42);
  });
  await expect
    .poll(() => step02.getAttribute("data-process-state"), { timeout: MOTION_READY_TIMEOUT })
    .toBe("active");
  await expect
    .poll(() => step01.getAttribute("data-process-state"), { timeout: MOTION_READY_TIMEOUT })
    .toBe("compact");

  // Continue past step 02 and confirm step 03 takes over.
  await step03.evaluate((card) => {
    const rect = card.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top - window.innerHeight * 0.42);
  });
  await expect
    .poll(() => step03.getAttribute("data-process-state"), { timeout: MOTION_READY_TIMEOUT })
    .toBe("active");
  await expect
    .poll(() => step02.getAttribute("data-process-state"), { timeout: MOTION_READY_TIMEOUT })
    .toBe("compact");
});

test("desktop process timeline path fill grows as the section scrolls", async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, "Desktop scroll behaviour is validated on a desktop project.");
  test.setTimeout(60_000);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "full");
  test.skip(tier !== "full", `Desktop process scene requires full motion tier; got ${tier}.`);

  const scene = page.getByTestId("process-scene");
  const fill = page.getByTestId("process-vertical-path-fill");

  await expect(fill).toBeAttached();

  // Park the scene below the viewport so the fill starts at its smallest.
  await scene.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top - window.innerHeight + 80);
  });
  await page.waitForTimeout(80);

  const startHeight = await fill.evaluate((element) => element.getBoundingClientRect().height);

  // Pull the scene into the middle of the viewport; scaleY should grow.
  await scene.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    window.scrollTo(
      0,
      window.scrollY + rect.top - window.innerHeight * 0.5 + element.clientHeight / 2
    );
  });

  await expect
    .poll(async () => fill.evaluate((element) => element.getBoundingClientRect().height), {
      timeout: MOTION_READY_TIMEOUT,
    })
    .toBeGreaterThan(startHeight + 8);
});

test("tablet process scene matches the vertical timeline contract", async ({ page }) => {
  test.setTimeout(60_000);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "mobile");
  test.skip(tier !== "mobile", `Tablet process scene requires mobile motion tier; got ${tier}.`);

  await expect(page.getByTestId("process-section")).toBeVisible();
  await expect(page.getByTestId("process-scene")).toBeVisible();
  await expect(page.getByTestId("process-desktop-scene")).toHaveCount(0);

  const layout = await readVerticalProcessSnapshot(page);
  assertVerticalTimelineLayout(layout, { minCardWidth: 260 });
});

test("mobile process scene renders vertically and avoids horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "mobile");
  test.skip(tier !== "mobile", `Mobile process scene requires mobile motion tier; got ${tier}.`);

  await expect(page.getByTestId("process-section")).toBeVisible();
  await expect(page.getByTestId("process-scene")).toBeVisible();
  await expect(page.getByTestId("process-desktop-scene")).toHaveCount(0);

  const layout = await readVerticalProcessSnapshot(page);
  assertVerticalTimelineLayout(layout, { minCardWidth: 0 });
});

test("mobile process active markers visibly fill as the timeline advances", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const tier = await waitForHomeMotionTierValue(page, "mobile");
  test.skip(tier !== "mobile", `Mobile process scene requires mobile motion tier; got ${tier}.`);

  const step02 = page.getByTestId("process-step-card-02");
  await step02.evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const pageTop = window.scrollY + rect.top;
    window.scrollTo(0, pageTop - window.innerHeight * 0.42);
  });
  await expect.poll(() => step02.getAttribute("data-process-state")).toBe("active");

  const marker = step02.locator("[data-process-card-marker]");

  await expect
    .poll(async () => {
      return marker.evaluate((element) => {
        const style = getComputedStyle(element);

        return (
          style.backgroundColor !== "rgb(255, 255, 255)" &&
          style.borderColor === style.backgroundColor &&
          style.color === "rgb(255, 255, 255)"
        );
      });
    })
    .toBe(true);
});

test("process step copy is identical across viewports", async ({ isMobile, page }) => {
  test.setTimeout(60_000);

  const collectSteps = async () => {
    const section = page.getByTestId("process-section");
    await expect(section).toBeVisible();
    return section.evaluate((element) => {
      return Array.from(element.querySelectorAll("[data-process-card]")).map((card) => {
        const title = card.querySelector("h3")?.textContent?.trim() ?? "";
        const description =
          card.querySelector("[data-process-description]")?.textContent?.trim() ?? "";
        const num = (card.getAttribute("data-testid") ?? "").split("process-step-card-")[1] ?? "";
        return { description, num, title };
      });
    });
  };

  // Same page, two viewports — flip via setViewportSize so the motion tier
  // reacts through matchMedia. A second goto would trigger another dev
  // compile and exceed budget on slower projects.
  const firstWidth = isMobile ? 390 : 1280;
  await page.setViewportSize({ width: firstWidth, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHomeMotionTier(page);
  const firstSteps = await collectSteps();

  const secondWidth = isMobile ? 1280 : 390;
  await page.setViewportSize({ width: secondWidth, height: 844 });
  await waitForHomeMotionTier(page);
  const secondSteps = await collectSteps();

  expect(firstSteps).toEqual(secondSteps);
  expect(firstSteps.map((step) => step.num)).toEqual(EXPECTED_STEPS.map((step) => step.num));
  for (const expected of EXPECTED_STEPS) {
    const actual = firstSteps.find((step) => step.num === expected.num);
    expect(actual?.title).toBe(expected.title);
  }
});

test("reduced motion renders a static readable process timeline", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHomeMotionTier(page);
  await expect(page.locator('[data-motion-tier="minimal"]')).toBeVisible();

  const section = page.getByTestId("process-section");
  const scene = page.getByTestId("process-scene");

  await expect(section).toBeVisible();
  await expect(scene).toHaveAttribute("data-motion-disabled", "true");
  await expect(page.getByTestId("process-desktop-scene")).toHaveCount(0);
  await expect(page.getByTestId("process-vertical-path-fill")).toHaveCount(0);
  await expect(section.locator("[data-process-card]")).toHaveCount(4);
  await expect(
    page.getByTestId("process-step-card-01").getByRole("link", { name: "Schedule Now" })
  ).toBeVisible();
  await expect(
    page.getByTestId("process-step-card-01").getByRole("link", { name: "Schedule Now" })
  ).toHaveAttribute("href", "/quote");
  await expect(section.getByRole("link", { name: "Schedule Now" })).toHaveCount(1);
  await expect(
    page.getByTestId("process-step-card-02").getByRole("link", { name: "Schedule Now" })
  ).toHaveCount(0);

  // Let the SSR-full -> client-minimal opacity transition settle before
  // sampling computed opacity. Each card has its own `transition-all
  // duration-500`, so wait until the slowest one is past 0.99.
  await expect
    .poll(async () =>
      section.evaluate((element) => {
        const cards = Array.from(element.querySelectorAll("[data-process-card]"));
        return Math.min(...cards.map((card) => Number(getComputedStyle(card).opacity)), 1);
      })
    )
    .toBeGreaterThan(0.99);

  const timeline = await section.evaluate((element) => {
    const cards = Array.from(element.querySelectorAll("[data-process-card]")).map((card) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);

      return {
        height: rect.height,
        opacity: Number(style.opacity),
        text: card.textContent?.trim() ?? "",
        width: rect.width,
      };
    });

    return { cards };
  });

  for (const card of timeline.cards) {
    expect(card.height).toBeGreaterThan(40);
    expect(card.opacity).toBeGreaterThan(0.98);
    expect(card.text.length).toBeGreaterThan(0);
    expect(card.width).toBeGreaterThan(200);
  }

  await context.close();
});
