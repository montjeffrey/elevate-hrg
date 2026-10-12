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

const DOOR_STYLES = [
  "Craftsman",
  "Traditional 6-Panel",
  "Full-Glass",
  "Double / Sidelight",
] as const;

export function EntryDoorsHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden bg-[#0e0c08] pb-0 pt-32 sm:min-h-[85svh] lg:min-h-[max(85svh,740px)] sm:pt-40 2xl:pt-24"
      data-testid="service-hero-entry-doors"
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
          className="object-cover object-center"
          style={{ viewTransitionName: `service-${slug}` }}
          label={eyebrow}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0c08]/55 via-[#0e0c08]/38 to-[#0e0c08]/85" />
        {/* Espresso vignette — warm-dark edges framing the door composition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_30%,rgba(14,12,8,0.6)_100%)]"
        />
      </div>

      {/* Content — bottom anchored, centered */}
      <div className="relative z-10 container mx-auto px-4 pb-16 text-center sm:pb-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          <MaskReveal>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">{eyebrow}</p>
          </MaskReveal>

          <h1
            className={cn(
              "font-display font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl",
              "mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-cream sm:text-5xl md:text-6xl"
            )}
          >
            {heading}
          </h1>

          <MaskReveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-brand-cream/80 md:text-lg">
              {blurb}
            </p>
          </MaskReveal>

          {/* Diamond accent divider */}
          <MaskReveal delay={0.15}>
            <div className="my-8 flex items-center justify-center gap-4">
              <div aria-hidden="true" className="h-px w-20 bg-brand-gold/50" />
              <div aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-brand-gold" />
              <div aria-hidden="true" className="h-px w-20 bg-brand-gold/50" />
            </div>
          </MaskReveal>

          {/* Style chips */}
          <MaskReveal delay={0.18}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DOOR_STYLES.map((style) => (
                <span
                  key={style}
                  className="rounded-sm border border-brand-cream/20 bg-brand-cream/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-cream/75 backdrop-blur-sm"
                >
                  {style}
                </span>
              ))}
            </div>
          </MaskReveal>

          <MaskReveal
            delay={0.22}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
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
          className="justify-center"
          items={[
            { label: "4 door styles" },
            { label: "Lifetime frame warranty" },
            { label: `NJ Lic ${siteConfig.licenseNumber}` },
          ]}
        />
      </div>

      {/* Gold accent bar */}
      <div aria-hidden="true" className="relative z-10 h-[2px] w-full bg-brand-gold" />
    </section>
  );
}
