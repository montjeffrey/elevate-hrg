import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function GalleryHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "60vh" }}
      data-testid="gallery-hero"
    >
      {/* Background image */}
      <Image
        src="/brand/siding-yellow-clapboard-wide.jpg"
        alt="Exterior remodeling project by Elevate HRG"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Gradient overlay — left to right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/85 via-brand-charcoal/55 to-transparent"
      />

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 md:px-8 pb-16 sm:pb-24 pt-32">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
          REAL PROJECTS
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-brand-cream leading-tight mb-4">
          Real homes. Real before-and-afters.
        </h1>
        <p className="text-base text-brand-cream/80 mb-6 max-w-xl">
          2,500+ projects across 14 NJ counties. No stock photography — every project is real
          Elevate HRG work.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={siteConfig.quotePath}
            className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold px-8 font-medium text-brand-charcoal shadow-sm transition-colors hover:bg-brand-gold-deep hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
          >
            Schedule a Free Estimate
          </Link>
          <a
            href="#gallery-grid"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold hover:text-brand-gold-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal rounded"
          >
            Browse projects below
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-wide text-brand-cream/70">
          GAF Certified · ProVia Authorized · NJ Lic {siteConfig.licenseNumber}
        </p>
      </div>
    </section>
  );
}
