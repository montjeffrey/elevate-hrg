"use client";

import { ArrowUp } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function EnergyZoneCallout() {
  return (
    <section className="bg-brand-cream py-24 sm:py-32" data-testid="energy-zone-callout">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
          {/* Left column — stat comparison */}
          <div>
            <MaskReveal>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
                WHERE YOUR ENERGY GOES
              </p>
            </MaskReveal>

            <SplitHeading
              as="h2"
              text="Where your heating bill goes."
              stagger="lines"
              className="mt-5 text-brand-charcoal"
            />

            <MaskReveal delay={0.12}>
              <p className="mt-6 text-base leading-relaxed text-brand-warm-gray md:text-lg">
                Old single-pane windows lose up to 30% of your home&apos;s conditioned air through
                gaps, frames, and glass. Full-frame replacement — sill to lintel — eliminates the
                transfer point entirely.
              </p>
            </MaskReveal>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-brand-charcoal/10 bg-brand-sandstone/20 p-6">
                <p className="font-display text-2xl font-semibold text-brand-charcoal">
                  Single-Pane
                </p>
                <p className="mt-1 text-sm text-brand-warm-gray">U-factor 0.81 — loses heat fast</p>
              </div>
              <div className="rounded-2xl bg-brand-charcoal p-6">
                <p className="font-display text-2xl font-semibold text-brand-gold">Triple-Pane</p>
                <p className="mt-1 text-sm text-brand-cream/70">
                  U-factor 0.22 — four times better thermal resistance
                </p>
              </div>
            </div>
          </div>

          {/* Right column — visual zone diagram */}
          <MaskReveal delay={0.15}>
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-brand-charcoal/20 bg-brand-sandstone/10">
                {/* Window zone band */}
                <div className="absolute left-0 right-0 top-[20%] h-[25%] border-y border-brand-gold-deep/30 bg-brand-gold/5">
                  <div className="flex h-full items-center justify-center px-2">
                    <span className="text-center text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/70">
                      Window zone — primary heat transfer point
                    </span>
                  </div>
                </div>

                {/* Three upward arrows positioned at left/center/right of the window band */}
                <div
                  aria-hidden="true"
                  className="absolute left-[15%] top-[8%] text-brand-gold-deep"
                >
                  <ArrowUp className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-[8%] -translate-x-1/2 text-brand-gold-deep"
                >
                  <ArrowUp className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute right-[15%] top-[8%] text-brand-gold-deep"
                >
                  <ArrowUp className="h-6 w-6" strokeWidth={2.5} />
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-brand-warm-gray">
                Full-frame replacement closes all three transfer paths
              </p>
            </div>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
