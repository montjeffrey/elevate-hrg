"use client";

import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Swatch = {
  name: string;
  hex: string;
  profile: string;
  textColor: "text-white" | "text-brand-charcoal";
};

const swatches: ReadonlyArray<Swatch> = [
  { name: "Iron", hex: "#1f2a30", profile: "Dutch Lap", textColor: "text-white" },
  { name: "Pewter", hex: "#4a4742", profile: "Beaded", textColor: "text-white" },
  { name: "Sandalwood", hex: "#7a6a55", profile: "Shake Panel", textColor: "text-white" },
  { name: "Linen", hex: "#b8a888", profile: "Clapboard", textColor: "text-white" },
  { name: "Wheat", hex: "#d8c9a8", profile: 'Double 4"', textColor: "text-brand-charcoal" },
  { name: "Cream", hex: "#efe6d2", profile: "Smooth", textColor: "text-brand-charcoal" },
];

export function SidingSwatchRail() {
  return (
    <section className="bg-brand-cream py-24 sm:py-32" data-testid="siding-swatch-rail">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <MaskReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-bronze">
              Color & Profile Range
            </p>
          </MaskReveal>

          <SplitHeading
            as="h2"
            text="Forty profiles. Final color picked on-site."
            stagger="lines"
            className="text-brand-charcoal"
          />

          <MaskReveal delay={0.1}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-warm-gray">
              We bring samples and match against your roof, brick, and stone before any order is
              placed. ProVia vinyl and James Hardie fiber cement panels available in matte and
              semi-gloss finishes.
            </p>
          </MaskReveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((swatch, idx) => (
            <MaskReveal key={swatch.name} delay={0.05 * idx}>
              <div
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl p-4 shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-xl"
                style={{ backgroundColor: swatch.hex }}
              >
                {/* subtle inner highlight at top */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
                />
                {/* label at bottom */}
                <div className="relative">
                  <p className={`text-sm font-bold ${swatch.textColor}`}>{swatch.name}</p>
                  <p className={`mt-0.5 text-xs opacity-70 ${swatch.textColor}`}>
                    {swatch.profile}
                  </p>
                </div>
              </div>
            </MaskReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-brand-warm-gray">
          Final color selection is confirmed on-site. All profiles available in 30+ year
          manufacturer color warranty.
        </p>
      </div>
    </section>
  );
}
