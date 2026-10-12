import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Every value here must trace to the stakeholder-approved warranty statement
// rendered by CoverageMatrix and pinned in stakeholder-corrections.spec.ts.
// Earlier copy carried unapproved terms ("Up to 50yr", "10yr workmanship")
// that contradicted that statement on the same page. Do not add a term
// without a source.
const metrics = [
  { value: "Lifetime", label: "true, never prorated" },
  { value: "50yr", label: "labor and materials" },
  { value: "Transferable", label: "materials coverage" },
];

export function WarrantyHero() {
  return (
    <section className="bg-brand-charcoal text-brand-cream py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Col 1: Shield */}
          <div className="hidden lg:flex justify-center">
            <svg
              viewBox="0 0 100 120"
              className="w-40 h-40 text-brand-gold-deep"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path d="M50 5 L95 25 L95 60 C95 85 72 105 50 115 C28 105 5 85 5 60 L5 25 Z" />
              <path
                d="M50 15 L85 30 L85 60 C85 80 67 97 50 107 C33 97 15 80 15 60 L15 30 Z"
                strokeOpacity="0.3"
              />
            </svg>
          </div>

          {/* Col 2: Main content */}
          <div className="lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-4">
              OUR PROMISE
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-brand-cream mb-6">
              Two warranties on every project. Read both.
            </h1>
            <p className="text-base text-brand-cream/75 leading-relaxed mb-8 max-w-md">
              Every Elevate HRG project carries a manufacturer warranty on materials and our own
              workmanship guarantee on the installation — the same coverage on every service we
              install, with nothing prorated.
            </p>
            <Link
              href={siteConfig.quotePath}
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-8 font-medium text-brand-charcoal transition-colors hover:bg-brand-gold-deep hover:text-white"
            >
              {siteConfig.ctaLabel}
            </Link>
          </div>

          {/* Col 3: Metric stack */}
          <div className="flex flex-col gap-6 lg:items-end lg:text-right">
            {metrics.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-medium text-brand-cream/80">{value}</p>
                <p className="text-xs text-brand-warm-gray uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
