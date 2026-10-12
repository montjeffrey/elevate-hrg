import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, Clock } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

const bullets = [
  {
    title: "No application to get a price",
    body: "Financing options are reviewed during the estimate. Nothing is submitted and no credit is pulled to get a project price.",
    icon: Clock,
  },
  {
    title: "Plans that fit the project",
    body: "Multiple lenders compete for your project so terms match the scope, not the other way around.",
    icon: Calculator,
  },
  {
    title: "Transparent terms",
    body: "Rate, term, and monthly payment laid out in writing before any work begins.",
    icon: BadgeCheck,
  },
];

export function ServiceFinancingTeaser() {
  return (
    <section
      className="bg-brand-sandstone/30 py-20 sm:py-28"
      data-testid="service-financing-teaser"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <MaskReveal>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
                FINANCING
              </p>
            </MaskReveal>
            <SplitHeading as="h2" text="Spread the project across the years it'll last." />
            <MaskReveal delay={0.12}>
              <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
                A new roof or full exterior shouldn&rsquo;t come out of one paycheck. Financing
                options are reviewed during the estimate so the monthly number is clear before any
                work begins.
              </p>
            </MaskReveal>

            <MaskReveal delay={0.2}>
              <Link
                href="/financing"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-brand-gold-deep px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-espresso hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-charcoal focus-visible:ring-offset-2"
              >
                Talk to us about financing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </MaskReveal>
          </div>

          <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm">
            <ul className="flex flex-col gap-6">
              {bullets.map((bullet, index) => {
                const Icon = bullet.icon;
                return (
                  <li key={bullet.title}>
                    <MaskReveal delay={0.1 + index * 0.08}>
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold-deep/10 text-brand-gold-deep">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-semibold text-brand-charcoal">
                            {bullet.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-brand-warm-gray">
                            {bullet.body}
                          </p>
                        </div>
                      </div>
                    </MaskReveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
