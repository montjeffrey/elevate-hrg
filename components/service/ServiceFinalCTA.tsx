"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { siteConfig } from "@/lib/site-config";

type ServiceFinalCTAProps = {
  heading: string;
  subheading?: string;
};

export function ServiceFinalCTA({ heading, subheading }: ServiceFinalCTAProps) {
  return (
    <section
      className="relative overflow-hidden bg-brand-charcoal py-24 text-brand-cream sm:py-32"
      data-testid="service-final-cta"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold-deep/20 via-brand-charcoal to-brand-charcoal opacity-70"
      />

      <div className="relative container mx-auto max-w-4xl px-4 text-center md:px-8">
        <SplitHeading as="h2" text={heading} />

        {subheading ? (
          <MaskReveal delay={0.1}>
            <p className="mt-6 mb-10 text-lg leading-relaxed text-brand-cream/80 md:text-xl">
              {subheading}
            </p>
          </MaskReveal>
        ) : null}

        <MaskReveal
          delay={0.18}
          className="flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <MagneticCTA>
            <Link
              href={siteConfig.quotePath}
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold px-8 text-base font-medium text-brand-charcoal shadow-sm transition-colors hover:bg-brand-gold-deep hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
            >
              {siteConfig.ctaLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </MagneticCTA>

          <Link
            href={siteConfig.phoneTel}
            className="inline-flex h-14 items-center justify-center rounded-full border-2 border-brand-cream/25 px-7 text-base font-medium text-brand-cream transition-colors hover:bg-brand-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <Phone className="mr-2 h-5 w-5 text-brand-gold" />
            Or call {siteConfig.phone}
          </Link>
        </MaskReveal>
      </div>
    </section>
  );
}
