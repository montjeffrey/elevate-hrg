"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { useMotionTier } from "@/components/motion/useMotionTier";

const features = [
  {
    number: "01",
    title: "Workmanship that doesn't cut corners.",
    body: "GAF Certified installer, ProVia CedarMax authorized — and the crews to back the certifications. Real flashing, ice-and-water shield, ridge ventilation. The parts that decide whether a roof lasts 12 years or 30.",
  },
  {
    number: "02",
    title: "Full-service exterior capability.",
    body: "Roofing, siding, windows, gutters, soffit and fascia, entry doors, storm doors, and attic insulation — under one project manager, one schedule, one warranty registration. No subbed-out finger-pointing.",
  },
  {
    number: "03",
    title: "Communication that respects your time.",
    body: "A dedicated project manager from kickoff to walkthrough. Transparent updates, no constant revisions, and a same-business-day call-back on every estimate request.",
  },
  {
    number: "04",
    title: "Veteran-owned & NaVOBA-certified.",
    body: "Discipline, accountability, and respect for your home and your time on every job — the standard we held in service to our country.",
  },
];

type Feature = (typeof features)[number];

function FeatureCardInner({ feature }: { feature: Feature }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute top-6 right-6 text-2xl font-bold tracking-widest text-brand-gold-deep/80 select-none"
      >
        {feature.number}
      </span>
      <div className="absolute top-0 left-0 w-1 h-12 bg-brand-gold-deep rounded-br-sm" />
      <h3 className="text-lg font-semibold text-brand-charcoal pr-10 leading-snug">
        {feature.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-warm-gray">{feature.body}</p>
    </>
  );
}

function MobileFeatureCard({ feature, minimal }: { feature: Feature; minimal: boolean }) {
  // Reveal on mount (no IntersectionObserver), consistent with the site-wide
  // no-IO mobile reveal contract.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <m.article
      data-mobile-reveal="true"
      initial={minimal ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={revealed ? (minimal ? { opacity: 1 } : { opacity: 1, y: 0 }) : undefined}
      transition={{ duration: minimal ? 0.5 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl bg-brand-cream border border-brand-gold/20 p-8 shadow-sm overflow-hidden"
    >
      <FeatureCardInner feature={feature} />
    </m.article>
  );
}

export function WhyElevate() {
  const tier = useMotionTier();
  return (
    <section className="bg-background pt-12 pb-12 sm:pt-16 sm:pb-16 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-24 items-start">
          {/* Image Side - Left on Desktop */}
          <div className="order-2 lg:order-1 relative aspect-video sm:aspect-[4/3] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-brand-cream flex items-center justify-center p-8 sm:p-12">
            <Image
              src="/brand/elevate-logo-america.png"
              alt="Elevate Home Remodeling — Veteran-Owned"
              width={900}
              height={836}
              priority
              className="w-full h-full object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text and Cards Side - Right on Desktop */}
          <div className="order-1 lg:order-2 flex flex-col pt-0 sm:pt-4 lg:pt-24">
            <MaskReveal>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-bronze mb-4">
                THE ELEVATE DIFFERENCE
              </p>
            </MaskReveal>
            <SplitHeading as="h2" text="One accountable team from estimate to final walkthrough." />

            <div className="mt-12 lg:mt-16">
              {tier === "full" ? (
                <div className="flex flex-col gap-5">
                  {features.map((feature) => (
                    <MobileFeatureCard key={feature.number} feature={feature} minimal={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {features.map((feature) => (
                    <MobileFeatureCard
                      key={feature.number}
                      feature={feature}
                      minimal={tier === "minimal"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8 lg:mt-20">
        <div className="flex flex-col items-center justify-center gap-10 rounded-2xl border border-brand-gold/20 bg-brand-cream/70 px-8 py-10 sm:flex-row sm:gap-16 sm:px-12 sm:py-12 md:gap-20 md:px-16 md:py-14">
          <Image
            src="/brand/NaVOBA_VeteranOwned_Logo_Color_LightBG_Web_300x300.png"
            alt="NaVOBA Veteran-Owned Business"
            title="NaVOBA Veteran-Owned Business"
            width={260}
            height={260}
            className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-contain rounded-md bg-white p-4"
          />
        </div>
      </div>
    </section>
  );
}
