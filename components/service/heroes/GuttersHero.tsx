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

export function GuttersHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[58svh] flex-col justify-end overflow-hidden bg-brand-charcoal pb-0 pt-28 sm:min-h-[65svh] lg:min-h-[max(65svh,700px)] sm:pt-36 2xl:pt-28"
      data-testid="service-hero-gutters"
      aria-label={eyebrow}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          style={{ viewTransitionName: `service-${slug}` }}
          label={eyebrow}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1419]/88 via-[#0c1419]/70 to-brand-charcoal/90" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(100,140,150,0.06)_0%,transparent_50%)]"
        />
      </div>

      {/* Content — bottom anchored, left aligned */}
      <div className="relative z-10 container mx-auto px-4 pb-16 sm:pb-20 md:px-8">
        <div className="max-w-3xl">
          {/* Tag pill */}
          <MaskReveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded border border-brand-gold/30 bg-brand-gold/10 px-3 py-1.5">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-gold" />
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                Seamless · On-Site Formed
              </span>
            </div>
          </MaskReveal>

          <h1
            className={cn(
              "font-display font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl",
              "font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-cream sm:text-5xl"
            )}
          >
            {heading}
          </h1>

          <MaskReveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-cream/80 md:text-lg">
              {blurb}
            </p>
          </MaskReveal>

          {/* Sizing comparison pill */}
          <MaskReveal delay={0.15} className="mt-6 mb-4">
            <div className="inline-flex items-center gap-3 rounded-xl border border-brand-cream/15 bg-brand-cream/[0.07] px-5 py-3 backdrop-blur-sm">
              <span className="font-display text-2xl font-bold text-brand-gold">5&quot;</span>
              <span className="text-sm text-brand-cream/40">vs</span>
              <span className="font-display text-2xl font-bold text-brand-gold">6&quot;</span>
              <div aria-hidden="true" className="ml-2 h-8 w-px bg-brand-cream/15" />
              <span className="max-w-[160px] text-[10px] leading-relaxed text-brand-cream/60">
                Gutter size matched to your roof pitch and drainage area
              </span>
            </div>
          </MaskReveal>

          <MaskReveal
            delay={0.2}
            className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <MagneticCTA>
              <Link
                href={siteConfig.quotePath}
                className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold px-8 font-medium text-brand-charcoal shadow-sm transition-colors hover:bg-brand-gold-deep hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
              >
                {siteConfig.ctaLabel}
              </Link>
            </MagneticCTA>
            <a
              href={siteConfig.phoneTel}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-cream/25 px-7 font-medium text-brand-cream transition-colors hover:bg-brand-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Phone className="h-5 w-5 text-brand-gold" />
              <span>Or call {siteConfig.phone}</span>
            </a>
          </MaskReveal>
        </div>
      </div>

      {/* Frosted credentials strip */}
      <div className="relative z-10">
        <HeroFrostedStrip
          theme="dark"
          items={[
            { label: "Seamless aluminum" },
            { label: "On-site formed" },
            { label: `NJ Lic ${siteConfig.licenseNumber}` },
          ]}
        />
      </div>

      {/* Gold accent bar */}
      <div className="relative z-10 h-[2px] w-full bg-brand-gold" />
    </section>
  );
}
