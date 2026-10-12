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

export function AtticHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden bg-[#0e120e] pb-0 pt-32 text-brand-cream sm:min-h-[85svh] lg:min-h-[max(85svh,720px)] sm:pt-40 2xl:pt-32"
      data-testid="service-hero-attic-insulation"
    >
      {/* Background image with upward-fading gradient — darkest at top */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e120e]/90 via-[#0e120e]/60 to-[#0e120e]/75" />
      </div>

      {/* Green-tinted radial glow at bottom-center — evokes thermal envelope */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(64,108,64,0.16)_0%,transparent_65%)]"
      />

      {/* Content wrapper — bottom anchored, left aligned */}
      <div className="relative z-10 container mx-auto px-4 pb-16 sm:pb-20 md:px-8">
        <div className="max-w-3xl">
          <MaskReveal>
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-brand-cream/45">
              Energy Envelope
            </p>
          </MaskReveal>

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
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-cream/80 md:text-lg">
              {blurb}
            </p>
          </MaskReveal>

          <MaskReveal
            delay={0.2}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
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
            { label: "Up to 30% energy reduction" },
            { label: "R-49 NJ target" },
            { label: "~1 day install" },
            { label: "NJ Lic 13VH13821400" },
          ]}
        />
      </div>

      {/* Gold accent bar */}
      <div className="relative z-10 h-[2px] w-full bg-brand-gold" />
    </section>
  );
}
