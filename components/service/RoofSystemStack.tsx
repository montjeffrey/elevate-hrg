import { MaskReveal } from "@/components/motion/MaskReveal";

type RoofLayer = {
  number: string;
  label: string;
  sub: string;
};

const layers: RoofLayer[] = [
  {
    number: "01",
    label: "Ridge Cap",
    sub: "Hip and ridge shingles seated over balanced ventilation",
  },
  {
    number: "02",
    label: "Arch. Shingles",
    sub: "GAF Timberline HDZ shingle field",
  },
  {
    number: "03",
    label: "Underlayment",
    sub: "Synthetic tear-resistant slip layer across the full deck",
  },
  {
    number: "04",
    label: "Ice & Water Shield",
    sub: "Eaves, valleys, and all penetrations to NJ code",
  },
  {
    number: "05",
    label: "Drip Edge",
    sub: "Metal edge over fascia, under the underlayment",
  },
  {
    number: "06",
    label: "Decking",
    sub: "OSB or plywood inspected and replaced where soft",
  },
];

// Opacity fade from full (top) to /30 (bottom) for the accent bar.
const accentOpacity = ["1", "0.86", "0.72", "0.58", "0.44", "0.3"];

export function RoofSystemStack() {
  return (
    <section
      className="bg-brand-charcoal py-24 text-brand-cream sm:py-32"
      data-testid="roof-system-stack"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Left column — heading and descriptor */}
          <div className="md:col-span-5">
            <MaskReveal>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                The roof as a system
              </p>
            </MaskReveal>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-brand-cream md:text-4xl">
              A roof is six layers. We install all of them.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-cream/60">
              Every Elevate HRG installation is a complete system — not a shingle swap. Each layer
              is inspected, spec&apos;d to NJ code, and registered under the manufacturer&apos;s
              full system warranty.
            </p>
          </div>

          {/* Right column — six-layer stack */}
          <div className="md:col-span-7">
            <div className="border-t border-brand-cream/[0.07]">
              {layers.map((layer, index) => (
                <MaskReveal key={layer.number} delay={index * 0.06}>
                  <div className="flex items-stretch border-b border-brand-cream/[0.07]">
                    <div
                      aria-hidden="true"
                      className="w-[3px] shrink-0 bg-brand-gold"
                      style={{ opacity: accentOpacity[index] }}
                    />
                    <div className="flex flex-1 items-center gap-4 py-4 pl-4">
                      <span className="text-xs font-bold text-brand-gold">{layer.number}</span>
                      <span className="font-semibold text-brand-cream text-sm">{layer.label}</span>
                      <span className="ml-auto text-right text-xs text-brand-cream/50">
                        {layer.sub}
                      </span>
                    </div>
                  </div>
                </MaskReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Closing credential line */}
        <p className="mt-10 text-center text-xs uppercase tracking-wider text-brand-cream/55">
          GAF Certified installer · NJ Lic 13VH13821400
        </p>
      </div>
    </section>
  );
}
