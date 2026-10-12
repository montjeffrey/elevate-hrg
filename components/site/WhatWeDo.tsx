"use client";

import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { siteConfig } from "@/lib/site-config";

export function WhatWeDo() {
  return (
    <section className="bg-brand-cream py-24 sm:py-32" data-testid="what-we-do-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              ABOUT US
            </p>
          </MaskReveal>
          <SplitHeading
            as="h2"
            stagger="lines"
            text="Elevating homes, leaving a lasting legacy."
            className="text-brand-charcoal"
          />
          <MaskReveal delay={0.1}>
            <p className="mt-6 text-lg leading-8 text-brand-charcoal/80 md:text-xl">
              Proudly Serving Homeowners Throughout New Jersey. Elevate Home Remodeling is a
              veteran-owned, NaVOBA-certified exterior renovation company based in Wallington, NJ,
              with more than 25 years of experience. Roofing, siding, windows, gutters, soffit,
              fascia, entry doors, and attic insulation — delivered with an iron-clad commitment to
              craftsmanship and backed by a workmanship guarantee and registered manufacturer
              warranties.
            </p>
          </MaskReveal>
          <MaskReveal delay={0.15}>
            <p className="mt-4 text-sm text-brand-warm-gray">
              NJ Home Improvement Contractor Lic. #{siteConfig.licenseNumber}.
            </p>
          </MaskReveal>
          <MaskReveal delay={0.2}>
            <div className="mx-auto mt-10 h-px w-16 bg-brand-gold" />
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
