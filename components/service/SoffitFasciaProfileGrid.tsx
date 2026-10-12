import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type ProfileCard = {
  number: string;
  label: string;
  spec: string;
  body: string;
  /** SVG cross-section illustration for this profile. */
  diagram: React.ReactNode;
};

// Vented aluminum soffit — perforated underside that draws intake air.
function VentedSoffitDiagram() {
  return (
    <svg
      viewBox="0 0 120 70"
      role="img"
      aria-label="Cross-section of a vented aluminum soffit panel with perforations drawing intake air"
      className="h-full w-full"
    >
      {/* Soffit panel body */}
      <rect
        x="8"
        y="30"
        width="104"
        height="14"
        rx="2"
        fill="#cfa37b"
        fillOpacity="0.28"
        stroke="#b9823f"
        strokeWidth="1.4"
      />
      {/* Perforation row */}
      {Array.from({ length: 11 }).map((_, i) => (
        <circle key={i} cx={16 + i * 9} cy={37} r={1.4} fill="#b9823f" />
      ))}
      {/* Intake airflow arrows rising up through perforations */}
      {[33, 60, 87].map((x) => (
        <g key={x} stroke="#b9823f" strokeWidth="1.4" strokeLinecap="round">
          <line x1={x} y1={30} x2={x} y2={12} />
          <path d={`M ${x - 3} 17 L ${x} 12 L ${x + 3} 17`} fill="none" />
        </g>
      ))}
      <text x="60" y="58" textAnchor="middle" fontSize="7" fill="#6f6256" fontWeight="600">
        Intake air to attic
      </text>
    </svg>
  );
}

// Solid (non-vented) aluminum soffit — sealed underside, no airflow.
function SolidSoffitDiagram() {
  return (
    <svg
      viewBox="0 0 120 70"
      role="img"
      aria-label="Cross-section of a solid non-vented aluminum soffit panel with a sealed underside"
      className="h-full w-full"
    >
      {/* Solid panel body */}
      <rect
        x="8"
        y="30"
        width="104"
        height="14"
        rx="2"
        fill="#3a3a38"
        fillOpacity="0.14"
        stroke="#3a3a38"
        strokeWidth="1.4"
      />
      {/* Sealed seam line */}
      <line
        x1="8"
        y1="37"
        x2="112"
        y2="37"
        stroke="#3a3a38"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Blocked airflow indicator */}
      <g stroke="#3a3a38" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
        <line x1="60" y1="28" x2="60" y2="16" strokeDasharray="2 3" />
        <line x1="54" y1="20" x2="66" y2="14" />
        <line x1="54" y1="14" x2="66" y2="20" />
      </g>
      <text x="60" y="58" textAnchor="middle" fontSize="7" fill="#6f6256" fontWeight="600">
        Sealed — no intake
      </text>
    </svg>
  );
}

// Engineered fascia board — capped board that caps rafter tails and carries the gutter.
function EngineeredFasciaDiagram() {
  return (
    <svg
      viewBox="0 0 120 70"
      role="img"
      aria-label="Cross-section of an engineered fascia board capping the rafter tail and carrying the gutter"
      className="h-full w-full"
    >
      {/* Rafter tail behind */}
      <rect
        x="20"
        y="14"
        width="40"
        height="10"
        rx="1.5"
        fill="#cfa37b"
        fillOpacity="0.22"
        stroke="#b9823f"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      <text x="40" y="11" textAnchor="middle" fontSize="6" fill="#6f6256">
        Rafter tail
      </text>
      {/* Fascia board — vertical, capping the tail end */}
      <rect
        x="58"
        y="10"
        width="10"
        height="44"
        rx="1.5"
        fill="#b9823f"
        fillOpacity="0.3"
        stroke="#b9823f"
        strokeWidth="1.4"
      />
      {/* Aluminum wrap cap */}
      <path d="M 56 9 L 70 9 L 70 55 L 56 55" fill="none" stroke="#8a6a2f" strokeWidth="1.2" />
      {/* Gutter hung off fascia */}
      <path
        d="M 70 40 L 70 52 Q 70 56 74 56 L 88 56 L 88 40"
        fill="none"
        stroke="#3a3a38"
        strokeOpacity="0.6"
        strokeWidth="1.6"
      />
      <text x="80" y="34" textAnchor="middle" fontSize="6" fill="#6f6256">
        Gutter
      </text>
    </svg>
  );
}

const cards: ReadonlyArray<ProfileCard> = [
  {
    number: "01",
    label: "Vented aluminum soffit",
    spec: "Perforated panel · ~9 sq in net free vent area per linear foot",
    body: "The perforated underside is the intake half of a balanced attic system. It pulls cool outside air in at the eave so ridge vents can exhaust hot, moist air above the insulation.",
    diagram: <VentedSoffitDiagram />,
  },
  {
    number: "02",
    label: "Solid soffit",
    spec: "Sealed panel · used over porches & where intake is not required",
    body: "A solid panel finishes the overhang cleanly where there is no attic to ventilate — porch ceilings, bump-outs, and runs already served by intake elsewhere. We never seal an eave that the attic depends on.",
    diagram: <SolidSoffitDiagram />,
  },
  {
    number: "03",
    label: "Engineered fascia",
    spec: "Capped board · carries the gutter & caps the rafter tails",
    body: "Fascia caps the cut ends of the rafter tails and gives the gutter a straight, rot-resistant board to hang from. We wrap it in color-matched aluminum so water never reaches the wood behind it.",
    diagram: <EngineeredFasciaDiagram />,
  },
];

export function SoffitFasciaProfileGrid() {
  return (
    <section
      className="bg-brand-cream py-24 sm:py-32"
      data-testid="soffit-fascia-profile-grid"
      aria-labelledby="soffit-fascia-profile-grid-heading"
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <MaskReveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-bronze">
            The eave as a system
          </p>
        </MaskReveal>

        <SplitHeading
          as="h2"
          text="Soffit and fascia are a system. We vent and seal both."
          stagger="lines"
          className="font-display text-3xl font-semibold leading-tight tracking-tight text-brand-charcoal md:text-5xl"
        />

        <MaskReveal>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-warm-gray">
            The soffit underneath and the fascia at the edge work together. Vented soffit feeds cool
            air into the attic; fascia caps the rafter tails and carries the gutter. Get one wrong
            and you trap heat, starve the ridge vents, or leave rafter tails exposed to rot.
          </p>
        </MaskReveal>

        {/* Profile cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <MaskReveal key={card.number} delay={index * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm">
                {/* Cross-section illustration */}
                <div
                  aria-hidden="false"
                  className="mb-5 flex h-28 items-center justify-center rounded-xl border border-brand-charcoal/10 bg-brand-sandstone/10 px-4"
                >
                  {card.diagram}
                </div>

                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-display text-sm font-bold text-brand-bronze">
                    {card.number}
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-brand-charcoal">
                    {card.label}
                  </h3>
                </div>

                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-brand-bronze/80">
                  {card.spec}
                </p>

                <p className="text-sm leading-relaxed text-brand-warm-gray">{card.body}</p>
              </div>
            </MaskReveal>
          ))}
        </div>

        {/* Closing why-venting line */}
        <MaskReveal delay={0.1}>
          <div className="mt-12 rounded-2xl bg-brand-charcoal px-8 py-8 text-center">
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-brand-cream/80">
              Venting feeds the attic and protects the rafter tails. Intake at the soffit plus
              exhaust at the ridge keeps the deck dry, the shingles cooler, and the wood behind your
              fascia from ever seeing standing water.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-brand-gold">
              Vented aluminum &amp; engineered · Rafter-tail protection · NJ Lic 13VH13821400
            </p>
          </div>
        </MaskReveal>

        {/* Hidden accessible heading anchor target */}
        <span id="soffit-fascia-profile-grid-heading" className="sr-only">
          Soffit and fascia are a system. We vent and seal both.
        </span>
      </div>
    </section>
  );
}
