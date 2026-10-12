"use client";

import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type FormingStep = {
  number: string;
  label: string;
  body: string;
};

const steps: ReadonlyArray<FormingStep> = [
  {
    number: "01",
    label: "Aluminum Coil",
    body: "Continuous aluminum stock loads onto the forming brake mounted on the truck. No pre-cut sections, no factory seams.",
  },
  {
    number: "02",
    label: "Brake Forms the Run",
    body: "The brake extrudes a continuous length matched exactly to your roofline — no joints along the run, only at corners and outlets.",
  },
  {
    number: "03",
    label: "Hung the Same Day",
    body: "Brackets set, hangers spaced to pitch, end caps sealed, downspout connections made. Full install in a single visit.",
  },
];

type Stat = {
  value: string;
  label: string;
};

const stats: ReadonlyArray<Stat> = [
  { value: "Zero", label: "Field seams along runs" },
  { value: "1 Visit", label: "Full install, start to finish" },
  { value: '5" or 6"', label: "Sized to your roof area" },
];

export function GutterFormingCallout() {
  return (
    <section
      className="bg-brand-charcoal py-24 sm:py-32"
      data-testid="gutter-forming-callout"
      aria-labelledby="gutter-forming-callout-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <MaskReveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold">
            On-site forming
          </p>
        </MaskReveal>

        <SplitHeading
          as="h2"
          text="Formed on the truck. Hung the same day."
          stagger="lines"
          className="font-display text-3xl font-semibold text-brand-cream md:text-4xl"
        />

        <div aria-hidden="true" className="mt-8 h-px w-full bg-brand-gold/20" />
        <div aria-hidden="true" className="mt-0 h-[2px] w-16 bg-brand-gold" />

        {/* Three-step grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((step, idx) => (
            <Fragment key={step.number}>
              <MaskReveal delay={0.1 * (idx + 1)}>
                <div>
                  <div className="mb-4 font-display text-6xl font-bold leading-none text-brand-gold/20">
                    {step.number}
                  </div>
                  <div className="mb-2 font-display text-xl font-semibold text-brand-cream">
                    {step.label}
                  </div>
                  <p className="text-sm leading-relaxed text-brand-cream/55">{step.body}</p>
                </div>
              </MaskReveal>
              {idx < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden items-center justify-center text-brand-gold/30 md:flex"
                >
                  <ChevronRight className="h-8 w-8" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Footer stat bar */}
        <div className="mt-16 grid grid-cols-3 divide-x divide-brand-cream/10 rounded-2xl border border-brand-cream/10 bg-brand-cream/[0.04] py-6">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 text-center">
              <div className="font-display text-2xl font-bold text-brand-gold">{stat.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-brand-cream/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Hidden accessible heading anchor target */}
        <span id="gutter-forming-callout-heading" className="sr-only">
          Formed on the truck. Hung the same day.
        </span>
      </div>
    </section>
  );
}
