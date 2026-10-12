import { disclosures, lender, ratesConfirmedAsApr } from "@/lib/financing-plans";

/**
 * Required credit-advertising disclosures and lender identification.
 *
 * This is not decorative small print — advertising specific rates, payments, or
 * terms for consumer credit carries disclosure obligations, and Elevate is the
 * advertiser on its own domain. Do not trim, reorder for layout, or collapse
 * this behind a toggle.
 */
export function FinancingDisclosures() {
  return (
    <section
      className="border-t border-brand-charcoal/10 bg-brand-cream py-16"
      data-testid="financing-disclosures"
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
          Financing Disclosures
        </h2>

        <div className="space-y-4 text-xs leading-relaxed text-brand-warm-gray">
          <p>{disclosures.applyNotice}</p>
          <p>{disclosures.notALender}</p>
          <p>{disclosures.noCounseling}</p>
          <p>{disclosures.programsSubjectToChange}</p>

          {!ratesConfirmedAsApr ? (
            <p>
              Rates shown are as published by the lender. Contact us or the lender for the annual
              percentage rate (APR) and full terms applicable to your project.
            </p>
          ) : null}

          <p>
            Financing provided by{" "}
            <span className="font-semibold text-brand-charcoal">{lender.legalName}</span> | NMLS #
            {lender.nmlsId} | {lender.licensing}. {lender.address}. For more information about
            licenses maintained on NMLS, see the{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-brand-charcoal"
              href={lender.nmlsConsumerAccessUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              NMLS Consumer Access website
            </a>
            . Review the lender&rsquo;s{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-brand-charcoal"
              href={lender.privacyPolicyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-2 transition-colors hover:text-brand-charcoal"
              href={lender.termsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Use
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
