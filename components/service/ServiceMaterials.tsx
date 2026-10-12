import Image from "next/image";
import Link from "next/link";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Manufacturer = {
  name: string;
  logo?: string;
  blurb?: string;
  url?: string;
};

type ServiceMaterialsProps = {
  heading: string;
  manufacturers: Manufacturer[];
};

function getMonogram(name: string): string {
  const words = name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function ServiceMaterials({ heading, manufacturers }: ServiceMaterialsProps) {
  if (manufacturers.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="service-materials-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              MATERIALS & MANUFACTURERS
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text={heading} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {manufacturers.map((manufacturer, index) => (
            <MaskReveal key={manufacturer.name} delay={0.08 + index * 0.1}>
              <article className="flex h-full flex-col rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm">
                {manufacturer.logo ? (
                  <div className="relative mb-5 h-14 w-32">
                    <Image
                      src={manufacturer.logo}
                      alt={`${manufacturer.name} logo`}
                      fill
                      sizes="128px"
                      className="object-contain object-left"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="mb-5 flex h-14 w-32 items-center justify-center rounded-lg border border-brand-charcoal/10 bg-brand-sandstone font-display text-xl font-bold tracking-wide text-brand-charcoal"
                  >
                    {getMonogram(manufacturer.name)}
                  </div>
                )}
                <h3 className="font-display text-2xl font-semibold leading-tight text-brand-charcoal">
                  <Link
                    href="/warranty"
                    rel="noopener noreferrer"
                    aria-label={`${manufacturer.name} warranty details`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-brand-gold-deep"
                  >
                    {manufacturer.name}
                  </Link>
                </h3>
                {manufacturer.blurb ? (
                  <p className="mt-3 text-sm leading-relaxed text-brand-warm-gray">
                    {manufacturer.blurb}
                  </p>
                ) : null}
              </article>
            </MaskReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
