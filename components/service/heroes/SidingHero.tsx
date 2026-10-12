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

const swatchColors: ReadonlyArray<{ name: string; hex: string }> = [
  { name: "Iron", hex: "#1f2a30" },
  { name: "Pewter", hex: "#4a4742" },
  { name: "Sandalwood", hex: "#7a6a55" },
  { name: "Linen", hex: "#b8a888" },
  { name: "Wheat", hex: "#d8c9a8" },
  { name: "Cream", hex: "#efe6d2" },
];

export function SidingHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[75svh] flex-col justify-end overflow-hidden bg-brand-charcoal pb-0 pt-32 sm:min-h-[82svh] lg:min-h-[max(82svh,730px)] sm:pt-40 2xl:pt-32"
      data-testid="service-hero-siding"
    >
      {/* Background image with dark left-leaning overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ viewTransitionName: `service-${slug}` }}
          label={eyebrow}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/85 via-brand-charcoal/60 to-brand-charcoal/25" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_95%_50%,rgba(185,130,63,0.07)_0%,transparent_60%)]"
        />
      </div>

      {/* Content — bottom anchored, left aligned */}
      <div className="relative z-10 container mx-auto px-4 pb-16 sm:pb-20 md:px-8">
        <div className="max-w-3xl">
          <MaskReveal>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">{eyebrow}</p>
          </MaskReveal>

          <h1
            className={cn(
              "font-display font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl",
              "mt-5 text-brand-cream"
            )}
          >
            {heading}
          </h1>

          <MaskReveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-cream/85 md:text-lg">
              {blurb}
            </p>
          </MaskReveal>

          {/* Mini swatch chips row */}
          <MaskReveal delay={0.16} className="mt-6 mb-4">
            <div className="flex gap-2">
              {swatchColors.map((s) => (
                <div
                  key={s.name}
                  title={s.name}
                  className="h-6 w-[18px] rounded shadow-md ring-1 ring-brand-cream/20"
                  style={{ backgroundColor: s.hex }}
                  aria-label={s.name}
                  role="img"
                />
              ))}
              <span className="ml-3 self-center text-xs text-brand-cream/50">+40 profiles</span>
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
            { label: "R-3.5 added insulation" },
            { label: "30+ yr color warranty" },
            { label: `NJ Lic ${siteConfig.licenseNumber}` },
          ]}
        />
      </div>

      {/* Gold accent bar */}
      <div className="relative z-10 h-[2px] w-full bg-brand-sandstone" />
    </section>
  );
}
