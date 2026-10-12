import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { siteConfig } from "@/lib/site-config";

const defaultCounties = ["Bergen", "Essex", "Hudson", "Morris", "Passaic", "Union"];

type ServiceAreaMentionProps = {
  counties: string[];
};

export function ServiceAreaMention({ counties }: ServiceAreaMentionProps) {
  const list = counties.length > 0 ? counties : defaultCounties;
  const featured = list.map((name) => ({
    name: `${name} County`,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="service-area-mention">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              WHERE WE WORK
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text="Proudly Serving Homeowners Throughout New Jersey." />
          <MaskReveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
              Based in {siteConfig.city}, {siteConfig.stateAbbr}. Explore the county links below to
              find your community.
            </p>
          </MaskReveal>
        </div>

        <MaskReveal delay={0.2}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {featured.map((county) => (
              <Link
                key={county.slug}
                href={`/service-areas/${county.slug}`}
                className="flex items-center gap-2 rounded-full border border-brand-charcoal/15 bg-white px-4 py-2 text-sm font-medium text-brand-charcoal transition-colors hover:border-brand-gold-deep hover:text-brand-gold-deep"
              >
                <MapPin className="h-4 w-4 text-brand-gold-deep" aria-hidden="true" />
                <span>{county.name}</span>
              </Link>
            ))}
          </div>
        </MaskReveal>

        <div className="mt-10 flex justify-center">
          <MaskReveal delay={0.28}>
            <Link
              href="/service-areas"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-charcoal/25 px-7 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-brand-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
            >
              See all service areas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
