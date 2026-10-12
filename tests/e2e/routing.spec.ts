import { expect, test } from "@playwright/test";

test("dynamic content routes reject unknown slugs", async ({ page }) => {
  const unknownBlog = await page.goto("/blog/not-a-real-post");
  expect(unknownBlog?.status()).toBe(404);

  const unknownCounty = await page.goto("/service-areas/not-a-county");
  expect(unknownCounty?.status()).toBe(404);

  const unknownCity = await page.goto("/service-areas/bergen/not-a-city");
  expect(unknownCity?.status()).toBe(404);
});
