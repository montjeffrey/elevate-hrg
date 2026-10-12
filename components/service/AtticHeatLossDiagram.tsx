import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

const heatLossArrows = [
  { pct: "25%", label: "Through uninsulated roof deck" },
  { pct: "35%", label: "Air leaks at top plates & penetrations" },
  { pct: "15%", label: "Uninsulated attic hatch" },
];

const stats = [
  { value: "Up to 30%", label: "Reduction in heating + cooling load" },
  // R-49 is the DOE/ENERGY STAR target for both IECC Zone 4 (most of NJ,
  // including the entire primary service area) and Zone 5 (northwest
  // counties), so this label stays zone-agnostic. Full answer in content/faqs.ts.
  { value: "R-49", label: "NJ attic insulation target" },
  { value: "~1 day", label: "Typical install, most NJ homes" },
];

export function AtticHeatLossDiagram() {
  return (
    <section className="bg-brand-cream py-24 sm:py-32" data-testid="attic-heat-loss-diagram">
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <MaskReveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-bronze">
            Energy Audit
          </p>
        </MaskReveal>

        <SplitHeading
          as="h2"
          text="Where your energy budget goes before we fix it."
          stagger="lines"
          className="font-display text-3xl font-semibold leading-tight tracking-tight text-brand-charcoal md:text-5xl"
        />

        <MaskReveal>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-warm-gray">
            An uninsulated or under-insulated attic is the single largest source of conditioned-air
            loss in a New Jersey home. Air-sealing must come first — insulating over air leaks traps
            moisture and reduces R-value over time.
          </p>
        </MaskReveal>

        {/* Diagram */}
        <div className="mt-12 mb-0">
          <MaskReveal>
            <div className="relative mx-auto max-w-2xl">
              {/* Three arrows pointing upward, spaced across the top of the diagram */}
              <div className="mb-4 flex justify-around px-8">
                {heatLossArrows.map(({ pct, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    {/* Arrow head + shaft */}
                    <div className="flex flex-col items-center gap-0">
                      <div
                        aria-hidden="true"
                        className="h-0 w-0 border-b-[8px] border-l-[5px] border-r-[5px] border-b-brand-gold-deep border-l-transparent border-r-transparent"
                      />
                      <div aria-hidden="true" className="h-8 w-0.5 bg-brand-gold-deep/60" />
                    </div>
                    <p className="font-display text-xl font-bold text-brand-gold-deep">{pct}</p>
                    <p className="max-w-[120px] text-center text-[11px] leading-relaxed text-brand-warm-gray sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* House outline */}
              <div
                aria-hidden="true"
                className="relative overflow-hidden rounded-xl border border-brand-charcoal/10 bg-brand-sandstone/10"
                style={{ minHeight: "140px" }}
              >
                {/* Attic floor / insulation band */}
                <div
                  className="absolute left-0 right-0 top-0 border-b-2 border-dashed border-brand-gold-deep/30 bg-brand-gold/5"
                  style={{ height: "40%" }}
                >
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-brand-bronze sm:text-[11px]">
                    Attic space — insulation target zone
                  </span>
                </div>
                {/* Living space below */}
                <div className="absolute bottom-0 left-0 right-0" style={{ top: "40%" }}>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/70 sm:text-[11px]">
                    Conditioned living space
                  </span>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-brand-warm-gray">
                Air-seal first. Insulate second. Done in reverse order, you trap moisture and lose
                R-value year over year.
              </p>
            </div>
          </MaskReveal>
        </div>

        {/* Dark stat row */}
        <div className="mt-16 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl bg-brand-charcoal sm:grid-cols-3 sm:divide-x sm:divide-brand-cream/10">
          {stats.map(({ value, label }, i) => (
            <MaskReveal key={value} delay={i * 0.08}>
              <div className="px-8 py-8 text-center">
                <p className="font-display text-3xl font-bold text-brand-gold">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-brand-cream/55">{label}</p>
              </div>
            </MaskReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
