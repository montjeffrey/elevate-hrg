import { expect, type Page, test } from "@playwright/test";

const STATEWIDE_MESSAGE = "Proudly Serving Homeowners Throughout New Jersey.";
const APPROVED_WARRANTY_COPY =
  "True lifetime warranty, 50-year labor and materials, materials are transferable.";

async function renderedPageAndMetadataText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const metadata = Array.from(
      document.head.querySelectorAll('title, meta, script[type="application/ld+json"]')
    )
      .map((element) => element.getAttribute("content") ?? element.textContent ?? "")
      .join(" ");

    return `${document.body.innerText} ${metadata}`;
  });
}

test("home retains the NaVOBA badge without the army-t-shirt veteran image", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator('img[alt*="NaVOBA"]')).toBeVisible();
  await expect(
    page.locator(
      'img[src*="army-t-shirt" i], img[srcset*="army-t-shirt" i], img[alt="Veteran emblem"]'
    )
  ).toHaveCount(0);
});

test("about removes the since-2000 claim from page content and metadata", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  expect(await renderedPageAndMetadataText(page)).not.toMatch(/since\s+2000/i);
});

// Stakeholder removed CertainTeed sitewide, not just from /roofing. These
// routes cover every surface that carried the brand: the home hero copy and
// trust badges, the FinalCTA credential line (rendered on most pages), the
// about credentials list and LocalBusiness JSON-LD, the services and process
// copy, the warranty FAQ, and a representative city page.
const CERTAINTEED_FREE_ROUTES = [
  "/",
  "/roofing",
  "/siding",
  "/about",
  "/warranty",
  "/our-process",
  "/service-areas/bergen/bergenfield",
];

for (const path of CERTAINTEED_FREE_ROUTES) {
  test(`${path} carries no CertainTeed reference in content, metadata, or imagery`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    expect(await renderedPageAndMetadataText(page)).not.toMatch(/certainteed/i);

    const imageReferences = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .map((image) =>
            [
              image.getAttribute("alt"),
              image.getAttribute("src"),
              image.getAttribute("srcset"),
              image.getAttribute("title"),
            ].join(" ")
          )
          .join(" ")
      );
    expect(imageReferences).not.toMatch(/certainteed/i);
  });
}

test("warranty page renders the approved warranty statement exactly", async ({ page }) => {
  await page.goto("/warranty", { waitUntil: "domcontentloaded" });

  await expect(page.getByText(APPROVED_WARRANTY_COPY, { exact: true })).toBeVisible();
});

test("core public routes use the statewide service-area message", async ({ page }) => {
  for (const path of ["/", "/about", "/contact", "/service-areas", "/roofing"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });

    expect(response?.status(), `${path} should return successfully`).toBe(200);
    const pageBody = page.locator("body");
    await expect(pageBody).toBeVisible();
    await expect(pageBody).toContainText(STATEWIDE_MESSAGE);
  }
});

test("a local county page remains available with its canonical URL", async ({ page }) => {
  const response = await page.goto("/service-areas/bergen", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://elevatehrg.com/service-areas/bergen"
  );
});
