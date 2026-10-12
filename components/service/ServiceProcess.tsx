import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { ServiceProcessStep } from "@/content/service-content";

type ServiceProcessProps = {
  heading: string;
  steps: ServiceProcessStep[];
};

export function ServiceProcess({ heading, steps }: ServiceProcessProps) {
  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="service-process-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              HOW WE WORK
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text={heading} />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical track */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[31px] top-0 w-px bg-brand-charcoal/10 sm:left-[39px]"
          />
          <ol className="flex flex-col gap-8 sm:gap-10">
            {steps.map((step, index) => (
              <li key={step.num}>
                <MaskReveal delay={0.08 + index * 0.1}>
                  <div className="flex items-start gap-5 sm:gap-7">
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold-deep bg-white font-display text-lg font-semibold text-brand-gold-deep shadow-sm sm:h-20 sm:w-20 sm:text-xl">
                      {step.num}
                    </div>
                    <div className="pt-2">
                      <h3 className="font-display text-xl font-semibold leading-snug text-brand-charcoal sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brand-warm-gray sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </MaskReveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <MaskReveal delay={0.2}>
            <Link
              href="/our-process"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-brand-charcoal underline underline-offset-4 decoration-brand-gold-deep transition-colors hover:text-brand-espresso"
            >
              See our full process
              <ArrowRight className="h-4 w-4" />
            </Link>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
