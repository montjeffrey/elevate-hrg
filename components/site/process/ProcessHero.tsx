"use client";

import Link from "next/link";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { siteConfig } from "@/lib/site-config";

export function ProcessHero() {
  return (
    <section
      className="relative overflow-hidden bg-brand-cream pt-32 pb-16 sm:pt-40 sm:pb-24"
      data-testid="process-hero"
    >
      {/* Marquee behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.06]"
      >
        <VelocityMarquee baseVelocity={0.4} direction="left">
          <span className="whitespace-nowrap px-16 font-display text-[8rem] font-bold uppercase tracking-tighter text-brand-charcoal">
            CONSULT &middot; ESTIMATE &middot; INSTALL &middot; WALKTHROUGH &middot;
          </span>
        </VelocityMarquee>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
          OUR PROCESS
        </p>
        <h1 className="mb-6 font-display text-5xl font-semibold tracking-tight text-brand-charcoal sm:text-6xl md:text-7xl">
          Four steps. No surprises.
        </h1>
        <p className="mx-auto mb-4 max-w-2xl text-lg text-brand-warm-gray">
          From the first site visit to the final walkthrough, most exterior projects complete in
          2&ndash;4 weeks. Here&apos;s exactly what that looks like.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-sandstone/50 px-4 py-2 text-sm font-medium text-brand-charcoal">
          <span aria-hidden className="h-2 w-2 rounded-full bg-brand-gold-deep" />
          Average on-site duration: 14 days
        </div>
        <div className="mt-10">
          <Link
            href={siteConfig.quotePath}
            className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold-deep px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
          >
            Schedule Step 1: Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
