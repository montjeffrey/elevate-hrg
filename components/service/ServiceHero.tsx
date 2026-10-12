"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { siteConfig } from "@/lib/site-config";
import type { ServiceSlug } from "@/content/services";

type ServiceHeroVariant = "full-bleed" | "split" | "overlay-light" | "centered";

type ServiceHeroProps = {
  slug: ServiceSlug;
  eyebrow: string;
  heading: string;
  blurb: string;
  heroImage: string;
  heroImageAlt: string;
  variant?: ServiceHeroVariant;
  heightClass?: string;
  gradientClass?: string;
  accentClass?: string;
  subEyebrow?: string;
};

const DEFAULT_HEIGHT = "min-h-[70svh] sm:min-h-[78svh]";
const DEFAULT_GRADIENT =
  "bg-gradient-to-b from-brand-charcoal/65 via-brand-charcoal/55 to-brand-charcoal/85";
const DEFAULT_ACCENT = "bg-brand-gold";

export function ServiceHero({
  slug,
  eyebrow,
  heading,
  blurb,
  heroImage,
  heroImageAlt,
  variant = "full-bleed",
  heightClass,
  gradientClass,
  accentClass,
  subEyebrow,
}: ServiceHeroProps) {
  const height = heightClass ?? DEFAULT_HEIGHT;
  const gradient = gradientClass ?? DEFAULT_GRADIENT;
  const accent = accentClass ?? DEFAULT_ACCENT;

  if (variant === "split") {
    return (
      <section
        className="relative isolate flex flex-col overflow-hidden bg-brand-charcoal pt-24"
        data-testid={`service-hero-${slug}`}
      >
        <div className="grid min-h-[70svh] grid-cols-1 lg:grid-cols-[40%_60%]">
          <div className="relative z-10 flex flex-col justify-end bg-brand-cream px-8 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
            {subEyebrow ? (
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/55">
                {subEyebrow}
              </p>
            ) : null}
            <MaskReveal>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
                {eyebrow}
              </p>
            </MaskReveal>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-charcoal sm:text-5xl md:text-6xl">
              {heading}
            </h1>

            <MaskReveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-warm-gray md:text-lg">
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
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-charcoal/20 px-7 font-medium text-brand-charcoal transition-colors hover:bg-brand-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
              >
                <Phone className="h-5 w-5 text-brand-gold-deep" />
                <span>Or call {siteConfig.phone}</span>
              </a>
            </MaskReveal>
          </div>

          <div className="relative overflow-hidden">
            <ImageWithFallback
              src={heroImage}
              alt={heroImageAlt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 60vw"
              className="object-cover object-center"
              style={{ viewTransitionName: `service-${slug}` }}
              label={eyebrow}
            />
            <div className={`absolute inset-0 ${gradient}`} />
          </div>
        </div>

        <div className={`relative z-10 h-[2px] w-full ${accent}`} />
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section
        className={`relative isolate flex ${height} flex-col justify-end overflow-hidden bg-brand-charcoal pt-32 pb-16 text-brand-cream sm:pt-40 sm:pb-24 md:pt-48`}
        data-testid={`service-hero-${slug}`}
      >
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
          <div className={`absolute inset-0 ${gradient}`} />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {subEyebrow ? (
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-brand-cream/60">
                {subEyebrow}
              </p>
            ) : null}
            <MaskReveal>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                {eyebrow}
              </p>
            </MaskReveal>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-cream sm:text-5xl md:text-6xl">
              {heading}
            </h1>

            <MaskReveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-cream/85 md:text-lg">
                {blurb}
              </p>
            </MaskReveal>

            <MaskReveal
              delay={0.2}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
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

        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <span className="h-px w-24 bg-brand-gold/70" />
          <span className="h-2 w-2 rotate-45 bg-brand-gold" />
          <span className="h-px w-24 bg-brand-gold/70" />
        </div>
      </section>
    );
  }

  // full-bleed (default) and overlay-light share the same structure;
  // they differ only by the gradient overlay prop.
  return (
    <section
      className={`relative isolate flex ${height} flex-col justify-end overflow-hidden bg-brand-charcoal pt-32 pb-16 text-brand-cream sm:pt-40 sm:pb-24 md:pt-48`}
      data-testid={`service-hero-${slug}`}
    >
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
        <div className={`absolute inset-0 ${gradient}`} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-3xl">
          {subEyebrow ? (
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-brand-cream/60">
              {subEyebrow}
            </p>
          ) : null}
          <MaskReveal>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">{eyebrow}</p>
          </MaskReveal>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-cream sm:text-5xl md:text-6xl">
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

      <div className={`absolute bottom-0 left-0 z-10 h-[2px] w-full ${accent}`} />
    </section>
  );
}
