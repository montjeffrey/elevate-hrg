"use client";

import { MaskReveal } from "@/components/motion/MaskReveal";

type AnatomyItem = {
  num: string;
  label: string;
  sub: string;
};

const ANATOMY: AnatomyItem[] = [
  {
    num: "01",
    label: "Slab",
    sub: "Fiberglass or steel skin — ProVia or Therma-Tru",
  },
  {
    num: "02",
    label: "Frame",
    sub: "Full replacement, not reused. Set plumb and level.",
  },
  {
    num: "03",
    label: "Threshold",
    sub: "Adjustable aluminum, sealed flush to the subfloor",
  },
  {
    num: "04",
    label: "Weatherstripping",
    sub: "Magnetic on steel, kerf-in compression on fiberglass",
  },
  {
    num: "05",
    label: "Lockset",
    sub: "Strike plate mortised into solid blocking, not just jamb",
  },
  {
    num: "06",
    label: "Casing",
    sub: "Interior and exterior trim re-set to match the wall finish",
  },
];

export function DoorAnatomyPanel() {
  return (
    <section
      className="bg-brand-charcoal py-24 text-brand-cream sm:py-32"
      data-testid="door-anatomy-panel"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:items-start">
          {/* Left column — editorial heading */}
          <div className="md:col-span-5">
            <MaskReveal>
              <p className="mb-6 text-xs font-bold uppercase tracking-wider text-brand-gold">
                What we replace
              </p>
            </MaskReveal>
            <MaskReveal delay={0.08}>
              <h2 className="font-display text-3xl font-semibold leading-tight text-brand-cream md:text-4xl">
                A door is six components. We replace all of them.
              </h2>
            </MaskReveal>
            <MaskReveal delay={0.14}>
              <p className="mt-6 text-sm leading-relaxed text-brand-cream/55">
                Most contractors swap the slab and call it done. We pull the full frame, reset the
                threshold to the subfloor, and re-hang interior and exterior casing to match your
                wall. The result seals like the day it was manufactured.
              </p>
            </MaskReveal>
          </div>

          {/* Right column — numbered anatomy list */}
          <div className="md:col-span-7">
            <ol className="divide-y divide-brand-cream/[0.08] border-y border-brand-cream/[0.08]">
              {ANATOMY.map((item, i) => (
                // The reveal wrapper lives INSIDE the <li> so the list keeps a
                // valid <ol> → <li> relationship (axe list/listitem rules).
                <li key={item.num}>
                  <MaskReveal delay={0.08 + i * 0.06}>
                    <div className="flex items-baseline gap-5 py-5">
                      <span className="shrink-0 font-display text-sm font-bold text-brand-gold">
                        {item.num}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-brand-cream">{item.label}</span>
                        <span className="ml-2 text-sm italic text-brand-cream/50">
                          — {item.sub}
                        </span>
                      </div>
                    </div>
                  </MaskReveal>
                </li>
              ))}
            </ol>

            <MaskReveal delay={0.5}>
              <div className="mt-10 rounded-2xl border border-brand-cream/[0.08] bg-brand-cream/[0.04] p-6">
                <p className="text-sm leading-relaxed text-brand-cream/55">
                  Every installation is registered for the manufacturer&apos;s lifetime frame
                  warranty the day we close out. Workmanship warranty included.
                </p>
              </div>
            </MaskReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
