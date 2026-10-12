import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { NJCountyMap } from "@/components/site/NJCountyMap";
import { counties as countyData } from "@/lib/locations-data";

export function ServiceAreas() {
  return (
    <section className="bg-brand-sandstone py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <MaskReveal>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-espresso mb-4">
                WHERE WE WORK
              </p>
            </MaskReveal>
            <SplitHeading
              as="h2"
              text="Proudly Serving Homeowners Throughout New Jersey."
            />
            <MaskReveal delay={0.1}>
              <p className="mt-6 text-lg leading-8 text-brand-charcoal/80 mb-8">
                Based in Wallington, NJ. Crews are routinely on jobs in Wallington, Clifton, Linden,
                and communities throughout the state.
              </p>
            </MaskReveal>

            <MaskReveal delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
                {Object.values(countyData).map((county) => (
                  <Link
                    key={county.slug}
                    href={`/service-areas/${county.slug}`}
                    className="flex min-h-11 items-center text-brand-charcoal/80 hover:text-brand-espresso transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-brand-charcoal/60" />
                    <span className="font-medium">{county.name}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/service-areas"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-charcoal/25 px-8 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-brand-charcoal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
              >
                Find Your Town
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </MaskReveal>
          </div>

          <MaskReveal
            delay={0.3}
            className="relative w-full max-w-xs mx-auto lg:max-w-sm xl:max-w-md rounded-3xl bg-brand-cream p-6 border border-brand-charcoal/10"
          >
            <NJCountyMap />
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
