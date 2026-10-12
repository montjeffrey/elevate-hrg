"use client";

import { Star, MapPin } from "lucide-react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

type Review = {
  quote: string;
  name: string;
  city: string;
  service: string;
};

const reviews: Review[] = [
  {
    quote: "On time, on budget, and the cleanest jobsite I've ever seen.",
    name: "Sarah M.",
    city: "Morristown",
    service: "Roof Replacement",
  },
  {
    quote: "Replaced 14 windows in our historic home. The draftiness is completely gone.",
    name: "Michael T.",
    city: "Chatham",
    service: "Windows",
  },
  {
    quote: "From quote to walkthrough, every step was communicated clearly.",
    name: "Jessica L.",
    city: "Madison",
    service: "Siding",
  },
  {
    quote: "New roof looks great and we finally have peace of mind before winter.",
    name: "David R.",
    city: "Summit",
    service: "Roof Replacement",
  },
  {
    quote: "Crew was professional, finished ahead of schedule, and cleaned up daily.",
    name: "Linda K.",
    city: "Westfield",
    service: "Gutters",
  },
  {
    quote: "Siding looks brand new and our heating bill noticeably dropped.",
    name: "Tom B.",
    city: "Florham Park",
    service: "Siding",
  },
  {
    quote: "Attic insulation paid for itself the first winter — the house actually feels warm.",
    name: "Maria C.",
    city: "Livingston",
    service: "Attic Insulation",
  },
  {
    quote: "New entry door changed the whole front of the house. Couldn't be happier.",
    name: "Robert P.",
    city: "Cranford",
    service: "Entry Doors",
  },
];

function ReviewItem({ quote, name, city, service }: Review) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-8">
      <div
        className="flex shrink-0 gap-0.5 text-brand-gold"
        role="img"
        aria-label="5 out of 5 stars"
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <Star key={s} className="h-3 w-3 fill-current" aria-hidden />
        ))}
      </div>
      <p className="shrink-0 text-[13px] leading-snug text-brand-cream/90 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <span className="shrink-0 text-[11px] font-semibold tracking-wide text-brand-gold">
        — {name}
      </span>
      <span className="hidden shrink-0 items-center gap-1 text-[11px] text-brand-cream/55 sm:inline-flex">
        <MapPin className="h-3 w-3" aria-hidden />
        {city}, NJ
      </span>
      <span className="shrink-0 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
        {service}
      </span>
    </div>
  );
}

function BeltDivider() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      <span className="h-6 w-px bg-gradient-to-b from-transparent via-brand-gold/35 to-transparent" />
      <span className="mx-1.5 h-1 w-1 rotate-45 bg-brand-gold/60" />
      <span className="h-6 w-px bg-gradient-to-b from-transparent via-brand-gold/35 to-transparent" />
    </div>
  );
}

function BeltSegment({ items }: { items: Review[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((r, i) => (
        <div key={`${r.name}-${i}`} className="flex items-center">
          <ReviewItem {...r} />
          <BeltDivider />
        </div>
      ))}
    </div>
  );
}

export function ReviewMarquee() {
  const tier = useMotionTier();
  const animate = tier !== "minimal";
  const duration = tier === "mobile" ? "140s" : "110s";

  return (
    <section
      className="relative isolate overflow-hidden bg-brand-charcoal py-4"
      aria-label="Customer reviews"
    >
      {/* Subtle warm depth — gradient + faint gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-charcoal via-brand-charcoal-light/80 to-brand-charcoal"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-24 w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/8 blur-3xl"
      />
      {/* Gold hairlines top + bottom */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent"
      />

      {/* The belt — continuous strip with edge fade + pause on hover */}
      <div
        className="group relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div
          data-testid="review-belt"
          className={cn(
            "flex w-max items-center will-change-transform",
            animate && "review-belt-track motion-reduce:!animate-none"
          )}
          style={animate ? { animationDuration: duration } : undefined}
        >
          <BeltSegment items={reviews} />
          <BeltSegment items={reviews} />
        </div>
      </div>
    </section>
  );
}
