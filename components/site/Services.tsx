"use client";

import { m } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "roofing",
    eyebrow: "Roofing",
    title: "Roofs that take the weather off your mind.",
    description:
      "Asphalt and metal roof replacements by a GAF Certified crew — full deck, flashing, and ventilation review before the first new shingle.",
    href: "/roofing",
    image: "/brand/roofing-hero.avif",
  },
  {
    id: "siding",
    eyebrow: "Siding",
    title: "Siding that stops looking new in decades, not seasons.",
    description:
      "ProVia CedarMax leading installer — insulated vinyl, fiber cement, and engineered wood with proper house-wrap, J-channel, and flashing on every job.",
    href: "/siding",
    // LOCK: DO NOT ALTER THIS IMAGE OR ITS PARENT MARGINS.
    // Client-approved replacement (Aug 2026). The previous /brand/siding-job.jpg
    // was a *before* photo — visibly algae-streaked siding and stained gutters —
    // sitting directly beside the headline "Siding that stops looking new in
    // decades, not seasons." The image contradicted the copy.
    // Source is the yellow-house SIDING job (crew photo, company Discord). The
    // crew in frame are up on the roof, which makes this shot easy to mistake
    // for a roofing job — it is not. The subject is the new yellow clapboard.
    // Pre-cropped to 4:3 (1800x1350) so `object-cover` behaves at both the
    // aspect-[4/3] mobile and md:aspect-[5/4] desktop card sizes; do not swap in
    // a portrait source here, it will crop the roofline off.
    image: "/brand/siding-yellow-clapboard.jpg",
  },
  {
    id: "windows",
    eyebrow: "Windows",
    title: "Replacement windows that quiet the house and the energy bill.",
    description:
      "ProVia windows installed full-frame with ENERGY STAR–rated glass packages for the Northern climate zone. A quieter house, a lower utility bill.",
    href: "/windows",
    image: "/brand/windows.jpg",
  },
  {
    id: "soffit-fascia",
    eyebrow: "Soffit & Fascia",
    title: "Soffit and fascia that finish the roofline right.",
    description:
      "Aluminum and engineered profiles installed with venting that actually feeds the attic. Protects the rafter tails and completes the gutter line.",
    href: "/soffit-fascia",
    image: "/brand/soffits&fascia.png",
  },
  {
    id: "gutters",
    eyebrow: "Gutters",
    title: "Seamless gutters that move water, not your foundation.",
    description:
      'Seamless 5" and 6" K-style aluminum gutters cut on-site from a single roll, with optional micro-mesh leaf guards.',
    href: "/gutters",
    image: "/brand/gutters.jpg",
  },
  {
    id: "entry-doors",
    eyebrow: "Entry Doors & Storm Doors",
    title: "Front doors that frame the rest of the house.",
    description:
      "ProVia steel, fiberglass, and storm door systems — secure, energy-efficient, and weather-sealed for decades.",
    href: "/entry-doors",
    image: "/brand/door.jpg",
  },
  {
    id: "attic-insulation",
    eyebrow: "Attic Insulation",
    title: "Insulation that pays for itself, then keeps paying.",
    description:
      "Blown-in and batt upgrades to NJ-zone R-values that drop heating and cooling bills and end ice dams. Ask about current utility rebates.",
    href: "/attic-insulation",
    image: "/brand/attic-insulation-hero.jpg",
  },
];

type Service = (typeof services)[number];

function ServiceRow({
  service,
  index,
  minimal,
}: {
  service: Service;
  index: number;
  minimal: boolean;
}) {
  const imageFirst = index % 2 === 0;
  const number = String(index + 1).padStart(2, "0");

  return (
    <m.div
      initial={minimal ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={minimal ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: minimal ? 0.5 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={service.href}
        transitionTypes={["morph", "service-card"]}
        className="group grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center md:gap-12 lg:gap-16"
      >
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-charcoal/5 md:col-span-7 md:aspect-[5/4]",
            imageFirst ? "md:order-1" : "md:order-2"
          )}
        >
          <ImageWithFallback
            src={service.image}
            alt={`${service.eyebrow} project by Elevate HRG`}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center transition-transform duration-[900ms] ease-elevate group-hover:scale-[1.04]"
            style={{ viewTransitionName: `service-${service.id}` }}
            label={service.eyebrow}
          />
          <div className="pointer-events-none absolute right-0 top-0 size-16 -translate-y-16 translate-x-16 rotate-45 bg-brand-gold-deep/90 transition-transform duration-500 ease-elevate group-hover:-translate-y-8 group-hover:translate-x-8" />
        </div>

        <div
          className={cn(
            "flex flex-col gap-4 md:col-span-5",
            imageFirst ? "md:order-2" : "md:order-1"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="font-display text-xs font-medium tracking-[0.2em] text-brand-gold-deep/80">
              {number}
            </span>
            <span className="h-px w-8 bg-brand-gold-deep/40" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-bronze">
              {service.eyebrow}
            </p>
          </div>

          <h3 className="font-display text-2xl font-semibold leading-tight text-brand-charcoal md:text-3xl lg:text-4xl">
            {service.title}
          </h3>
          <p className="text-base leading-relaxed text-brand-warm-gray md:text-lg">
            {service.description}
          </p>

          <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
            <span className="relative inline-block">
              Explore {service.eyebrow}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-brand-gold-deep transition-transform duration-500 ease-elevate group-hover:scale-x-0" />
            </span>
            <ArrowRight className="h-4 w-4 text-brand-gold-deep transition-transform duration-300 ease-elevate group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </m.div>
  );
}

export function Services() {
  const tier = useMotionTier();
  const minimal = tier === "minimal";

  return (
    <section
      className="relative bg-brand-cream pt-4 pb-24 sm:pt-6 sm:pb-32"
      data-testid="services-section"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              SERVICES
            </p>
          </MaskReveal>
          <SplitHeading
            as="h2"
            text="Full-Service Exterior Home Remodeling in New Jersey."
            className="text-brand-charcoal"
          />
          <MaskReveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
              Every exterior service your home needs — installed by manufacturer-certified crews
              under one warranty, one project manager, and one workmanship guarantee.
            </p>
          </MaskReveal>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-28 lg:gap-32">
          {services.map((service, index) => (
            <ServiceRow key={service.id} index={index} minimal={minimal} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
