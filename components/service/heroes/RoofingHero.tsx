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

export function RoofingHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
}: BespokeHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[75svh] flex-col justify-end overflow-hidden bg-[#0d1210] pt-32 text-brand-cream sm:min-h-[82svh] lg:min-h-[max(82svh,730px)] sm:pt-40 md:pt-48 2xl:pt-32"
      data-testid="service-hero-roofing"
    >
      {/* Background image with dark overlay gradient */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1210]/72 via-[#0d1210]/58 to-[#0d1210]/92" />
      </div>

      {/* Bronze radial glow on the right — engineered atmosphere, not flat photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_85%_28%,rgba(185,130,63,0.14)_0%,transparent_70%)]"
      />

      {/* Content wrapper — bottom anchored, left aligned */}
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
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-cream/85 md:text-lg">
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
            { label: "GAF Certified installer" },
            { label: "NJ Lic 13VH13821400" },
          ]}
        />
      </div>

      {/* Gold accent bar */}
      <div className="relative z-10 h-[2px] w-full bg-brand-gold" />
    </section>
  );
}
