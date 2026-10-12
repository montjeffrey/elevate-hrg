import { ArrowUpRight } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { financingPlans, ratesConfirmedAsApr } from "@/lib/financing-plans";

/**
 * The three lender programs, as real markup rather than the images the source
 * page uses — screen readers, search engines, and the next person to change a
 * rate all need these to be text.
 *
 * The apply links leave the site. `rel="noopener noreferrer"` on every one:
 * `noopener` is required for `target="_blank"`, and `noreferrer` keeps the exact
 * page path out of the lender's referrer log for no cost to us.
 */
export function FinancingPlanCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {financingPlans.map((plan, index) => (
        <MaskReveal delay={0.08 * index} key={plan.planId}>
          <div className="flex h-full flex-col rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              {plan.name}
            </p>

            <p className="mt-4 font-display text-4xl font-semibold tabular-nums text-brand-charcoal">
              {plan.rate}
              {ratesConfirmedAsApr ? (
                <span className="ml-1.5 align-baseline text-lg font-semibold">APR</span>
              ) : null}
            </p>

            <p className="mt-1 text-lg text-brand-warm-gray tabular-nums">{plan.termLabel}</p>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-warm-gray">
              {plan.distinction}
            </p>

            <a
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold-deep px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-charcoal focus-visible:ring-offset-2"
              data-cta="financing_apply"
              data-plan={plan.planId}
              href={plan.applyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Apply for this plan
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(opens the lender&rsquo;s application in a new tab)</span>
            </a>
          </div>
        </MaskReveal>
      ))}
    </div>
  );
}
