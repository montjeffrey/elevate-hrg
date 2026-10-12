"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import type { ServiceSlug } from "@/content/services";
import { HeroFrostedStrip } from "@/components/service/HeroFrostedStrip";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type BespokeHeroProps = {
  slug: ServiceSlug;
  eyebrow: string;
  heading: string;
  blurb: string;
  heroImage: string;
  heroImageAlt: string;
};

export function WindowsHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex flex-col overflow-hidden bg-brand-charcoal pt-24"
      data-testid="service-hero-windows"
    >
      <div className="grid min-h-[70svh] grid-cols-1 lg:grid-cols-[40%_60%]">
        {/* Left panel — cream */}
        <div className="relative flex flex-col justify-between bg-brand-cream px-8 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
          <div>
            <MaskReveal>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
                {eyebrow}
              </p>
            </MaskReveal>

            <h1
              className={cn(
                "font-display font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl",
                "mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-charcoal sm:text-5xl"
              )}
            >
              {heading}
            </h1>

            <MaskReveal delay={0.12}>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-brand-warm-gray md:text-lg">
                {blurb}
              </p>
            </MaskReveal>

            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-brand-charcoal/15 px-4 py-3 lg:hidden">
              <span className="font-display text-2xl font-bold text-brand-gold-deep">30%</span>
              <span className="max-w-[150px] text-[11px] leading-snug text-brand-warm-gray">
                avg. energy lost through old single-pane windows
              </span>
            </div>

            <MaskReveal
              delay={0.2}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <MagneticCTA>
                <Link
                  href={siteConfig.quotePath}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold-deep px-8 font-medium text-white shadow-sm transition-colors hover:bg-brand-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
                >
                  {siteConfig.ctaLabel}
                </Link>
              </MagneticCTA>
              <a
                href={siteConfig.phoneTel}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-charcoal/20 px-7 font-medium text-brand-charcoal transition-colors hover:bg-brand-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
              >
                <Phone className="h-5 w-5 text-brand-gold-deep" />
                <span>Or call {siteConfig.phone}</span>
              </a>
            </MaskReveal>
          </div>

          <div className="mt-auto pt-16">
            <HeroFrostedStrip
              theme="light"
              items={[
                { label: "Up to 30% energy savings" },
                { label: "Energy Star Certified" },
                { label: "NJ Lic 13VH13821400" },
              ]}
            />
            <div className="h-[2px] w-full bg-brand-gold-deep/60" />
          </div>
        </div>

        {/* Right panel — image */}
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-center"
            style={{ viewTransitionName: `service-${slug}` }}
            label={eyebrow}
          />

          {/* Subtle left-to-right gradient overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/20 via-transparent to-transparent"
          />

          {/* Floating stat badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl border border-brand-gold/30 bg-brand-charcoal/80 px-8 py-6 text-center backdrop-blur-sm">
              <p className="font-display text-5xl font-bold text-brand-gold">30%</p>
              <p className="mt-2 max-w-[120px] text-xs leading-relaxed text-brand-cream/70">
                avg. energy lost through old single-pane windows
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
