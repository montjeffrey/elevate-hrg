import { expect, test, type Page } from "@playwright/test";
import { siteConfig } from "@/lib/site-config";

const CONSENT_KEY = "elevate-consent-v1";

/**
 * Seed a resolved consent record so the cookie notice never mounts during these
 * tests. Without it the fixed bottom bar can overlay a form control mid-run and
 * make click targets non-deterministic. Called with `analytics: false` by the
 * consent-gate test below.
 */
async function seedConsent(page: Page, analytics: boolean) {
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage denied — the notice may show; assertions still hold.
      }
    },
    {
      key: CONSENT_KEY,
      value: JSON.stringify({
        v: 1,
        ts: Date.now(),
        source: "explicit",
        categories: { necessary: true, functional: true, analytics, marketing: false },
      }),
    }
  );
}

test.beforeEach(async ({ page }) => {
  await seedConsent(page, true);
});

test("sticky mobile CTA does not overlap quote form fields", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quote");

  const quoteForm = page.locator("[data-quote-form]");
  await quoteForm.scrollIntoViewIfNeeded();

  await expect(quoteForm).toBeInViewport();
  await expect(page.getByTestId("sticky-mobile-cta")).toHaveCount(0);
});

test("invalid quote form input returns visible field errors", async ({ page }) => {
  await page.goto("/contact");
  const quoteForm = page.locator("[data-quote-form]");

  // Attempt to advance step 1 with no service selected.
  await quoteForm.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Select a service.")).toBeVisible();

  // Step 1 keeps the project essentials together: service and ZIP.
  await quoteForm.locator("#quote-service").selectOption("Roofing");
  await quoteForm.getByRole("button", { name: "Continue" }).click();

  // Missing ZIP blocks progress before contact details are requested.
  await expect(page.getByText("ZIP must be exactly 5 digits.")).toBeVisible();

  // Fill the remaining project detail and submit empty contact fields.
  await quoteForm.locator("#quote-zip").fill("07057");
  await quoteForm.getByRole("button", { name: "Continue" }).click();
  await quoteForm.getByRole("button", { name: "Submit Quote Request" }).click();
  await expect(page.getByText("Name is required.")).toBeVisible();
  await expect(page.getByText("Phone is required.")).toBeVisible();
});

for (const path of ["/quote", "/contact"]) {
  test(`${path} quote form keeps only homeowner fields and no qualification questions`, async ({
    page,
  }) => {
    await page.goto(path);
    const quoteForm = page.locator("[data-quote-form]");

    await expect(quoteForm.locator("#quote-service")).toBeVisible();
    await expect(quoteForm.locator("#quote-zip")).toBeVisible();
    await expect(quoteForm.locator("#quote-timeline")).toHaveCount(0);
    await expect(quoteForm.locator("#quote-home-age")).toHaveCount(0);
    await expect(quoteForm.locator("#quote-best-time")).toHaveCount(0);

    await quoteForm.locator("#quote-service").selectOption("Roofing");
    await quoteForm.locator("#quote-zip").fill("07057");
    await quoteForm.getByRole("button", { name: "Continue" }).click();

    await expect(quoteForm.locator("#quote-name")).toBeVisible();
    await expect(quoteForm.locator("#quote-phone")).toBeVisible();
    await expect(quoteForm.locator("#quote-email")).toBeVisible();
    await expect(quoteForm.locator("#quote-message")).toBeVisible();
    await expect(quoteForm.locator("#quote-company")).toHaveCount(1);
    await expect(quoteForm.locator("#quote-timeline")).toHaveCount(0);
    await expect(quoteForm.locator("#quote-home-age")).toHaveCount(0);
    await expect(quoteForm.locator("#quote-best-time")).toHaveCount(0);
  });
}

test("short lead form retains the standard contact and project fields", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const leadForm = page.locator("[data-lead-form]");
  await leadForm.scrollIntoViewIfNeeded();

  await expect(leadForm.locator("#lead-name")).toBeVisible();
  await expect(leadForm.locator("#lead-phone")).toBeVisible();
  await expect(leadForm.locator("#lead-email")).toBeVisible();
  await expect(leadForm.locator("#lead-service")).toBeVisible();
  await expect(leadForm.locator("#lead-zip")).toBeVisible();
  await expect(leadForm.locator("#lead-message")).toBeVisible();
  await expect(leadForm.locator("#company")).toHaveCount(1);
});

test("lead API passes valid input to delivery and rejects honeypot submissions", async ({
  request,
}) => {
  const validLead = {
    honeypot: "",
    name: "Test Homeowner",
    phone: "908-641-9827",
    email: "test@example.com",
    service: "Roofing",
    message: "Please call after 5 PM.",
    sourcePath: "/contact",
    utmCampaign: "fall-estimates",
    utmContent: "hero-cta",
    utmMedium: "cpc",
    utmSource: "google",
    utmTerm: "roof-replacement",
    zip: "07057",
  };

  // A valid lead clears schema validation and reaches the delivery layer. With a
  // delivery provider configured the route returns 200 + data.status "accepted";
  // with none configured (the default for CI / local E2E) it intentionally
  // returns 502 rather than a false success — see app/api/leads/route.ts, which
  // must "never show a false success". Either branch proves validation passed —
  // the real contract under test is that a valid lead is NOT a 400.
  const accepted = await request.post("/api/leads", { data: validLead });
  expect([200, 502]).toContain(accepted.status());
  const acceptedJson = (await accepted.json()) as {
    data?: { status?: string };
    error?: { code?: string };
  };
  if (accepted.status() === 200) {
    expect(acceptedJson.data?.status).toBe("accepted");
  } else {
    expect(acceptedJson.error?.code).toBe("lead_delivery_failed");
  }

  // Honeypot submissions are rejected at validation with 400.
  const rejected = await request.post("/api/leads", {
    data: {
      ...validLead,
      honeypot: "bot-filled",
    },
  });
  expect(rejected.status()).toBe(400);
});

test("quote form sends retained homeowner and attribution fields only", async ({ page }) => {
  let resolveSubmitted!: (payload: Record<string, unknown>) => void;
  const submitted = new Promise<Record<string, unknown>>((resolve) => {
    resolveSubmitted = resolve;
  });

  await page.addInitScript(() => {
    window.addEventListener("generate_lead", (event) => {
      window.sessionStorage.setItem(
        "elevate-hrg-last-generate-lead",
        JSON.stringify((event as CustomEvent).detail)
      );
    });
  });

  await page.route("**/api/leads", async (route) => {
    resolveSubmitted(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      body: JSON.stringify({ data: { leadId: "test-lead", status: "accepted" } }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto(
    "/quote?utm_source=google&utm_medium=cpc&utm_campaign=fall-estimates&utm_term=roofing&utm_content=hero"
  );
  const quoteForm = page.locator("[data-quote-form]");

  await quoteForm.locator("#quote-service").selectOption("Roofing");
  await quoteForm.locator("#quote-zip").fill("07057");
  await quoteForm.getByRole("button", { name: "Continue" }).click();
  await quoteForm.locator("#quote-name").fill("Test Homeowner");
  await quoteForm.locator("#quote-phone").fill("908-641-9827");
  await quoteForm.locator("#quote-email").fill("test@example.com");
  await quoteForm.locator("#quote-message").fill("Please call after 5 PM.");
  await quoteForm.getByRole("button", { name: "Submit Quote Request" }).click();

  await expect(
    quoteForm.getByRole("heading", { name: "Thanks, Test — your request is in." })
  ).toBeVisible();
  await expect(quoteForm.getByText("What happens next")).toBeVisible();
  await expect(quoteForm.getByRole("link", { name: `Call ${siteConfig.phone}` })).toBeVisible();
  await expect(quoteForm.getByText("Reference:")).toBeVisible();
  // The form is replaced by the confirmation, so its fields are gone.
  await expect(quoteForm.locator("#quote-name")).toBeHidden();
  const payload = await submitted;
  expect(payload).toMatchObject({
    email: "test@example.com",
    honeypot: "",
    message: "Please call after 5 PM.",
    name: "Test Homeowner",
    phone: "908-641-9827",
    service: "Roofing",
    sourcePath: "/quote",
    utmCampaign: "fall-estimates",
    utmContent: "hero",
    utmMedium: "cpc",
    utmSource: "google",
    utmTerm: "roofing",
    zip: "07057",
  });
  expect(payload).not.toHaveProperty("timeline");
  expect(payload).not.toHaveProperty("homeAge");
  expect(payload).not.toHaveProperty("bestTimeToCall");

  const analyticsPayload = await page.evaluate(() => {
    const saved = window.sessionStorage.getItem("elevate-hrg-last-generate-lead");
    return saved ? JSON.parse(saved) : null;
  });
  expect(analyticsPayload).toEqual({ form: "quote", service: "Roofing" });
});

test("generate_lead still fires internally when analytics consent is denied", async ({ page }) => {
  // Locks in the lib/analytics.ts ordering decision: the internal CustomEvent
  // is dispatched BEFORE the consent gate's early return, because it carries no
  // storage, no network, and no identifier — it is purely how our own
  // components talk to each other. A future "simplification" that moves the
  // gate above the dispatch would break the submission flow silently; this test
  // is the guard.
  await seedConsent(page, false);

  await page.addInitScript(() => {
    window.addEventListener("generate_lead", (event) => {
      window.sessionStorage.setItem(
        "elevate-hrg-last-generate-lead",
        JSON.stringify((event as CustomEvent).detail)
      );
    });
  });

  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ data: { leadId: "test-lead", status: "accepted" } }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto("/quote");
  const quoteForm = page.locator("[data-quote-form]");
  const dataLayerBefore = await page.evaluate(() => (window.dataLayer ?? []).length);

  await quoteForm.locator("#quote-service").selectOption("Roofing");
  await quoteForm.locator("#quote-zip").fill("07057");
  await quoteForm.getByRole("button", { name: "Continue" }).click();
  await quoteForm.locator("#quote-name").fill("Test Homeowner");
  await quoteForm.locator("#quote-phone").fill("908-641-9827");
  await quoteForm.locator("#quote-email").fill("test@example.com");
  await quoteForm.locator("#quote-message").fill("Please call after 5 PM.");
  await quoteForm.getByRole("button", { name: "Submit Quote Request" }).click();

  await expect(
    quoteForm.getByRole("heading", { name: "Thanks, Test — your request is in." })
  ).toBeVisible();

  const analyticsPayload = await page.evaluate(() => {
    const saved = window.sessionStorage.getItem("elevate-hrg-last-generate-lead");
    return saved ? JSON.parse(saved) : null;
  });
  expect(analyticsPayload).toEqual({ form: "quote", service: "Roofing" });

  // Nothing reached Google, though.
  const dataLayerAfter = await page.evaluate(() => (window.dataLayer ?? []).length);
  expect(dataLayerAfter).toBe(dataLayerBefore);
});

test("quote form persists only the selected service", async ({ page }) => {
  await page.goto("/quote");
  const quoteForm = page.locator("[data-quote-form]");
  await quoteForm.locator("#quote-service").selectOption("Roofing");
  await quoteForm.locator("#quote-zip").fill("07057");
  await quoteForm.getByRole("button", { name: "Continue" }).click();
  await quoteForm.locator("#quote-name").fill("Test Homeowner");
  await quoteForm.locator("#quote-phone").fill("908-641-9827");
  await quoteForm.locator("#quote-email").fill("test@example.com");
  await quoteForm.locator("#quote-message").fill("Please call after 5 PM.");

  const saved = await page.evaluate(() => window.sessionStorage.getItem("elevate-hrg-quote-form"));

  expect(saved).not.toBeNull();
  expect(JSON.parse(saved ?? "{}")).toEqual({ service: "Roofing" });
});
