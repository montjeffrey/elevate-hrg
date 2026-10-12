import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * The financing page sends homeowners to a third-party credit application. Its
 * security properties are entirely about the integrity of three outbound links
 * and the fact that nothing here collects applicant data — so those are what
 * these tests lock down, not the layout.
 *
 * See docs/FINANCING_PAGE_MIGRATION.md for why this shape was chosen.
 */

const APPLY_URL_PATTERN =
  /^https:\/\/cp\.decisionlender\.solutions\/cp2\/pure659\/\(retail\/new\/page1\)\?internalDealerId=5104146954322&plan=\d{4}$/;

test.describe("financing page", () => {
  test("the three apply links are intact, safe, and point only at the lender", async ({ page }) => {
    await page.goto("/financing");

    const links = page.locator('a[data-cta="financing_apply"]');
    await expect(links).toHaveCount(3);

    for (const link of await links.all()) {
      const rel = await link.getAttribute("rel");
      // `noopener` is required for target=_blank; `noreferrer` keeps our exact
      // page path out of the lender's referrer log.
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
      expect(await link.getAttribute("target")).toBe("_blank");
      // A swapped destination is the one thing that would turn this page into a
      // phishing funnel under the Elevate brand. Pin the whole URL shape,
      // including the dealer ID — a stale ID is also a revenue incident.
      expect(await link.getAttribute("href")).toMatch(APPLY_URL_PATTERN);
    }

    const planIds = await links.evaluateAll((els) => els.map((el) => el.getAttribute("data-plan")));
    expect(planIds).toEqual(["1008", "1009", "1509"]);
  });

  test("the estimator is inert — it never contacts the lender or any third party", async ({
    page,
  }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.includes("localhost") && !url.startsWith("data:")) external.push(url);
    });

    await page.goto("/financing");

    const estimate = page.locator('p[aria-live="polite"]');
    const before = await estimate.textContent();

    const amount = page.getByLabel("Project amount");
    await amount.fill("50000");
    await amount.blur();

    await expect(estimate).not.toHaveText(before ?? "");

    expect(
      external.filter((url) => url.includes("decisionlender") || url.includes("purefinance"))
    ).toEqual([]);
  });

  test("no payment estimate is shown for an amount below the financing minimum", async ({
    page,
  }) => {
    await page.goto("/financing");

    const estimate = page.locator('p[aria-live="polite"]');
    const amount = page.getByLabel("Project amount");

    await amount.fill("1000");
    await amount.blur();

    // Quoting "$21/mo" beside "Financing starts at $2,500" would be advertising
    // terms for a loan this program will not write.
    await expect(estimate).toHaveText("—");
    await expect(page.getByText(/Enter \$2,500 or more to see an estimate/)).toBeVisible();

    await amount.fill("25000");
    await amount.blur();
    await expect(estimate).not.toHaveText("—");
  });

  test("required lender identification and disclosures are present", async ({ page }) => {
    await page.goto("/financing");

    // Elevate must be identified as not a lender, and the lender must be named
    // with its NMLS ID. Both are disclosure obligations, not copy choices.
    // Scoped to the disclosure block: the lender is also named in the FAQ, and
    // it is specifically the disclosures that have to carry this.
    const block = page.getByTestId("financing-disclosures");

    await expect(
      block.getByText("Elevate Home Renovation Group is neither a lender nor a broker")
    ).toBeVisible();
    // `exact` pins the lender-identification line specifically — the name also
    // appears inside the "programs subject to change" paragraph in this block.
    await expect(block.getByText("Pure Financial Group LLC", { exact: true })).toBeVisible();
    await expect(block.getByText(/NMLS\s*#\s*1802643/)).toBeVisible();
  });

  test("has no serious or critical accessibility violations", async ({ page }) => {
    // Scan with reduced motion. This is not a convenience — it is the only way
    // to get a deterministic result, and it also happens to be a real user
    // configuration worth testing.
    //
    // With motion on, axe races the entrance animations and reports garbage in
    // both directions: content still inside an unrevealed MaskReveal is clipped
    // and silently skipped, and content mid-fade is sampled at blended colors
    // that fail contrast when the settled values pass comfortably (this page's
    // body copy sampled at #92877d instead of its real #6b6058, the apply
    // buttons at #fefdfb on #a16e32 instead of white on #996324).
    //
    // Waiting it out does not fix it: the settle time moves with machine load,
    // and awaiting document.getAnimations() hangs forever on the site's looping
    // animations. globals.css already has a complete prefers-reduced-motion
    // path that forces every [data-reveal] fully visible with no animation, so
    // emulating it renders the settled page directly.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/financing");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical"
    );

    // Report the offending selectors, not just a count — a bare "1 violation"
    // costs whoever hits this a debugging session.
    expect(
      blocking.flatMap((violation) =>
        violation.nodes.map((node) => ({
          id: violation.id,
          target: node.target.join(" "),
          html: node.html.slice(0, 160),
          why: node.failureSummary?.replace(/\n/g, " | "),
        }))
      )
    ).toEqual([]);
  });
});
