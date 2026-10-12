import { CheckCircle2 } from "lucide-react";

// Sourced to the stakeholder-approved warranty statement. The previous list
// asserted service commitments (free year-one inspection, a direct PM line for
// the warranty period) that no approved document backs. Do not reinstate them
// without a source.
const bullets = [
  "50 years on labor and materials",
  "Never prorated, and never a limited warranty",
  "Materials coverage transfers with the home",
];

export function WorkmanshipPromise() {
  return (
    <section className="bg-brand-sandstone/30 py-20 sm:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
          WORKMANSHIP GUARANTEE
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-charcoal mb-12 max-w-3xl">
          We stand behind the installation, not just the materials.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: pull quote */}
          <div>
            <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug text-brand-charcoal italic">
              &ldquo;If we installed it and it fails, we come back. No invoice, no debate.&rdquo;
            </p>
          </div>
          {/* Right: bullet list */}
          <ul className="space-y-6">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-brand-gold-deep mt-1 shrink-0" aria-hidden />
                <span className="text-base text-brand-charcoal">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
