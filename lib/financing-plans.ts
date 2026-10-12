/**
 * Pure Finance Group financing — the single source of truth for everything the
 * /financing page states or links to.
 *
 * Extracted from https://offers.purefinancegroup.com/elevate on 2026-09-08.
 * Full provenance, including the raw disclosure text and the security review of
 * the lender handoff, is in docs/FINANCING_PAGE_MIGRATION.md.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠️  TWO ITEMS ARE STILL UNCONFIRMED WITH PURE FINANCE. See
 *     docs/PURE_FINANCE_PARTNER_REPORT.md Part A.
 *
 *     This page was PUBLISHED on 2026-09-17 with the rates visible, as an
 *     explicit owner decision, before either was answered. Chase the answers.
 *
 *   A1. Are the advertised rates APRs? The source page states "9.99%" and
 *       "10.99%" with no APR label. Reg Z (12 CFR 1026.24) requires a rate in a
 *       consumer-credit ad to be stated as an annual percentage rate, and
 *       stating a rate/payment/term triggers additional required disclosures.
 *       `ratesConfirmedAsApr` below is FALSE until Pure Finance confirms in
 *       writing. Flip it the moment they do, and nowhere else.
 *
 *       Be clear about what FALSE actually buys, because an earlier draft of
 *       this comment overstated it: the cards still display a bare "9.99%",
 *       they just omit the "APR" suffix and add a "contact us for the APR"
 *       line. That is NOT the conservative reading. Reg Z attaches to stating
 *       a rate at all, so an unlabelled rate is arguably the exact defect —
 *       omitting the label removes the claim, not the exposure. The genuinely
 *       safe options are to confirm and label, or to show no rate at all.
 *       Shipping the unlabelled rate was a deliberate business call, not a
 *       compliance-safe default. Do not cite this flag as cover.
 *
 *   A2. What distinguishes plan 1008 (9.99% / 120mo) from plan 1009
 *       (10.99% / 120mo)? On the source both render as "10 YEAR PAYMENT PLAN".
 *       We lead each card with its rate so they are at least distinguishable,
 *       but `distinction` is a placeholder until they answer.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Elevate is NOT a lender or a broker. Nothing on our side collects, stores, or
 * transmits applicant financial data — the Apply buttons are plain outbound
 * links and the application lives entirely on the lender's platform. Keep it
 * that way: a native application form here would put Elevate in GLBA/FCRA
 * scope for no gain.
 */

/**
 * Elevate's dealer/merchant identifier on the DecisionLender platform. This is
 * the attribution key — applications submitted through a URL carrying it are
 * credited to Elevate. It is public by design (it ships in a client-side href),
 * so do not try to hide it; proxying these links through our own redirect
 * endpoint would add an open-redirect surface and gain nothing.
 *
 * If Pure Finance rotates it, change it HERE and nowhere else. A stale dealer ID
 * is a revenue incident, not a cosmetic bug.
 */
const DEALER_ID = "5104146954322";

/** Pure Finance Group's tenant on the DecisionLender consumer portal. */
const LENDER_TENANT = "pure659";

/**
 * Built from constants only. Never interpolate user input, query parameters, or
 * CMS content into this — these hrefs are the single meaningful attack surface
 * on this page, because a swapped destination sends homeowners into a phishing
 * clone that harvests SSN and income under Elevate's brand.
 */
function applyUrl(planId: string): string {
  return (
    `https://cp.decisionlender.solutions/cp2/${LENDER_TENANT}/(retail/new/page1)` +
    `?internalDealerId=${DEALER_ID}&plan=${planId}`
  );
}

/**
 * FALSE until Pure Finance confirms the advertised rates are APRs in writing.
 * See the A1 note above before changing this.
 */
export const ratesConfirmedAsApr = false;

export type FinancingPlan = {
  /** DecisionLender program identifier. */
  readonly planId: string;
  /** Card heading, e.g. "10-Year Plan". */
  readonly name: string;
  /** The advertised rate, as published by the lender. */
  readonly rate: string;
  readonly termMonths: number;
  /** Human term for the card, e.g. "120 months". */
  readonly termLabel: string;
  /**
   * What separates this plan from the others. Placeholder until A2 is answered
   * — the two 120-month plans are otherwise identical on the source page.
   */
  readonly distinction: string;
  readonly applyUrl: string;
};

export const financingPlans: readonly FinancingPlan[] = [
  {
    planId: "1008",
    name: "10-Year Plan",
    rate: "9.99%",
    termMonths: 120,
    termLabel: "120 months",
    distinction: "Lowest advertised rate of the three programs.",
    applyUrl: applyUrl("1008"),
  },
  {
    planId: "1009",
    name: "10-Year Plan",
    rate: "10.99%",
    termMonths: 120,
    termLabel: "120 months",
    // NOT "eligibility differs by program" — an earlier draft said that, and it
    // was invented. The source gives no distinction between 1008 and 1009
    // beyond the rate and the plan ID (A2 is still open), and guessing at a
    // reason could steer a homeowner into the higher-rate application on the
    // strength of a sentence nobody verified. Say only what we can see.
    distinction: "Same 120-month term as the 9.99% plan, at a higher rate.",
    applyUrl: applyUrl("1009"),
  },
  {
    planId: "1509",
    name: "15-Year Plan",
    rate: "10.99%",
    termMonths: 180,
    termLabel: "180 months",
    distinction: "Longest term available — lowest monthly payment.",
    applyUrl: applyUrl("1509"),
  },
] as const;

/**
 * Payment estimator bounds and rate/term steps, carried over verbatim from the
 * lender's own calculator so our estimate never disagrees with theirs.
 */
export const calculatorConfig = {
  minAmount: 2500,
  maxAmount: 100_000,
  defaultAmount: 25_000,
  /** Rate slider runs base + 0…steps in whole points: 6.99% … 18.99%. */
  rateBase: 6.99,
  rateSteps: 12,
  defaultRateStep: 3,
  termOptions: [60, 84, 96, 120, 144, 180, 240] as const,
  defaultTermIndex: 3,
} as const;

/** Rate for a given slider step. */
export function rateFromStep(step: number): number {
  return Number((calculatorConfig.rateBase + step).toFixed(2));
}

/**
 * Standard amortising payment. Mirrors the lender's implementation exactly,
 * including the zero-rate branch.
 */
export function monthlyPayment(principal: number, rate: number, months: number): number {
  if (!principal || principal <= 0 || months <= 0) return 0;
  const monthlyRate = rate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -months));
}

/** Lender of record. Required on the page — Elevate is neither lender nor broker. */
export const lender = {
  legalName: "Pure Financial Group LLC",
  nmlsId: "1802643",
  licensing: "Licensed by the Maryland Office of Regulation",
  address: "14880 Sweitzer Ln, Suite D, Laurel, MD 20707",
  phone: "410-401-4957",
  email: "info@purefinancegroup.com",
  privacyPolicyUrl: "https://www.purefinancegroup.com/privacy-policy/",
  termsUrl: "https://www.purefinancegroup.com/privacy-policy/terms-of-use/",
  makePaymentUrl: "https://www.purefinancegroup.com/make-payment/",
  nmlsConsumerAccessUrl: "https://www.nmlsconsumeraccess.org/",
} as const;

/**
 * Disclosure text. Reproduced from the lender's page — do NOT paraphrase, and do
 * not edit for tone. "Contractor" has been replaced with Elevate's name per
 * A5 in the partner report; revert if Pure Finance requires their exact wording.
 */
export const disclosures = {
  calculator:
    "This loan calculator is for informational and illustrative purposes only. The estimated payments are based on user inputs and do not constitute an offer, quote, or commitment to lend by any financial institution. Actual loan terms, including interest rates, annual percentage rates (APR), payments, and fees, may vary based on your credit profile, financial situation, and lender requirements. The calculator assumes a fixed interest rate and does not account for additional costs such as taxes, insurance, fees, or other charges that may be associated with a loan. For precise loan terms, please contact a licensed lender or financial advisor.",

  applyNotice:
    "Financing for consumer loan programs may be offered by Pure Financial Group or one or more participating third-party lenders. Clicking an apply link will take you to the loan application on the lender's website.",

  notALender:
    "Elevate Home Renovation Group is neither a lender nor a broker. All financing is provided by third-party lending institutions under the terms and conditions of each lender. All applications are subject to approval through credit, income, and residency verification. All advertised finance terms, rates and payments are subject to change without notice. Advertised terms are solely to be used as estimating tools; actual terms will be disclosed at time of approval. Not all applications will be approved for all programs.",

  noCounseling:
    "Elevate Home Renovation Group does not assist with, counsel, or negotiate financing other than submitting credit applications on behalf of our customers to the lender. Approved applications become customers of the lender and will make payments directly to the lender. The lender has final say to approve or decline an application based on fair lending guidelines.",

  programsSubjectToChange:
    "Loan offers are subject to credit approval. Loan programs are subject to change without notice and may be offered by Pure Financial Group LLC or one or more participating third-party lenders.",
} as const;
