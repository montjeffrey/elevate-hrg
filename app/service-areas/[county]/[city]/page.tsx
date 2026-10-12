import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, ChevronRight, Clock, Shield, Wrench } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { counties } from "@/lib/locations-data";
import { countyVariety } from "@/lib/location-variety-config";
import { cityVariety } from "@/lib/city-variety-config";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { canonicalUrl } from "@/lib/seo";

interface CityPageProps {
  params: Promise<{
    county: string;
    city: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { county: string; city: string }[] = [];

  Object.values(counties).forEach((county) => {
    county.cities.forEach((city) => {
      params.push({
        county: county.slug,
        city: city.slug,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { county, city } = await params;
  const countyData = counties[county];
  const cityData = countyData?.cities.find((c) => c.slug === city);

  if (!countyData || !cityData) {
    return {
      title: "City Not Found",
    };
  }

  const url = canonicalUrl(`/service-areas/${countyData.slug}/${cityData.slug}`);
  const heroImage = countyVariety(countyData.slug).heroImage ?? "/brand/roofing-hero.avif";
  const ogImage = `${siteConfig.url}${heroImage}`;
  const title = `Roofing & Siding in ${cityData.name}, NJ | ${siteConfig.name}`;
  const description = `Roofing, siding, windows & gutters in ${cityData.name}, ${countyData.name} by Elevate HRG — veteran-owned, NJ HIC #${siteConfig.licenseNumber}. Free estimate.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Elevate HRG exterior renovation in ${cityData.name}, New Jersey`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const services = [
  {
    name: "Roofing",
    slug: "roofing",
    description: "GAF-certified replacements, repairs, and inspections.",
  },
  {
    name: "Siding",
    slug: "siding",
    description: "Insulated vinyl and fiber cement systems built to last.",
  },
  {
    name: "Windows",
    slug: "windows",
    description: "Energy-efficient ProVia replacement windows.",
  },
  {
    name: "Soffit & Fascia",
    slug: "soffit-fascia",
    description: "Vented aluminum and engineered profiles that finish the roofline.",
  },
  {
    name: "Gutters",
    slug: "gutters",
    description: "Seamless gutters with leaf-guard protection.",
  },
  {
    name: "Entry Doors & Storm Doors",
    slug: "entry-doors",
    description: "ProVia steel, fiberglass, and storm door systems.",
  },
  {
    name: "Attic Insulation",
    slug: "attic-insulation",
    description: "Blown-in insulation that lowers monthly energy bills.",
  },
];

export default async function CityPage({ params }: CityPageProps) {
  const { county, city } = await params;
  const countyData = counties[county];
  const cityData = countyData?.cities.find((c) => c.slug === city);

  if (!countyData || !cityData) {
    notFound();
  }

  // City pages inherit their parent county's hero image differentiation.
  const variety = countyVariety(countyData.slug);
  const heroImage = variety.heroImage ?? "/brand/roofing-hero.avif";

  // Per-city content (truthful local note, spotlight service, local FAQ) that
  // differentiates each city page from its county siblings.
  const cityExtra = cityVariety(countyData.slug, cityData.slug);
  const featuredService = cityExtra?.featuredService;
  const orderedServices = featuredService
    ? [
        ...services.filter((service) => service.slug === featuredService),
        ...services.filter((service) => service.slug !== featuredService),
      ]
    : services;

  const trustItems = [
    {
      icon: Shield,
      title: "NJ-Licensed & Insured",
      copy: `Operating under NJ HIC #${siteConfig.licenseNumber} with full liability coverage.`,
    },
    {
      icon: BadgeCheck,
      title: "GAF Certified",
      copy: "Manufacturer-certified roofing installs that unlock extended warranties.",
    },
    {
      icon: Clock,
      title: "Veteran-Owned & Operated",
      copy: `${siteConfig.yearsExperience} years installing exteriors across New Jersey.`,
    },
    {
      icon: Wrench,
      title: "14 NJ Counties Served",
      copy: `One accountable team from estimate through final walkthrough in ${cityData.name}.`,
    },
  ];

  const faqs = [
    ...(cityExtra?.localFaq
      ? [{ question: cityExtra.localFaq.question, answer: cityExtra.localFaq.answer }]
      : []),
    {
      question: `Does Elevate HRG handle roofing and siding permits in ${cityData.name}?`,
      answer: `Yes. ${countyData.permitNote} We pull every permit ${cityData.name} requires before the crew starts.`,
    },
    {
      question: `How soon can Elevate HRG schedule an estimate in ${cityData.name}, ${countyData.name}?`,
      answer: `${cityData.name} is in ${countyData.name}, ${countyData.driveTime}, so we are out there regularly. We return every estimate request the same business day and can usually book an on-site walkthrough within the week.`,
    },
  ];

  return (
    <main id="main-content" className="flex-1 bg-brand-cream">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
          { name: countyData.name, path: `/service-areas/${countyData.slug}` },
          { name: cityData.name, path: `/service-areas/${countyData.slug}/${cityData.slug}` },
        ]}
      />
      <FAQJsonLd entries={faqs} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`Elevate HRG exterior renovation in ${cityData.name}, ${siteConfig.primaryStateAbbr}`}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/80 to-brand-charcoal/30" />
          {variety.accentGlow ? (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `radial-gradient(60% 55% at 75% 25%, ${variety.accentGlow}, transparent 70%)`,
              }}
            />
          ) : null}
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-brand-sandstone mb-6 text-sm font-medium"
            >
              <Link href="/" className="hover:text-brand-gold transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <Link href="/service-areas" className="hover:text-brand-gold transition-colors">
                Service Areas
              </Link>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <Link
                href={`/service-areas/${countyData.slug}`}
                className="hover:text-brand-gold transition-colors"
              >
                {countyData.name}
              </Link>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <span className="text-brand-cream">{cityData.name}</span>
            </nav>
            <h1 className="font-display text-4xl font-bold tracking-tight text-brand-cream sm:text-6xl mb-6">
              Roofing & exterior remodeling in {cityData.name}, {siteConfig.primaryStateAbbr}.
            </h1>
            <p className="text-lg text-brand-cream/90 mb-8">
              {siteConfig.name} serves homeowners in {cityData.name} and throughout{" "}
              {countyData.name} — roofing, siding, windows, gutters, soffit, fascia, entry doors,
              and attic insulation. {cityData.name} is {countyData.driveTime} from our Wallington
              shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-brand-gold-deep text-white hover:bg-brand-gold hover:text-brand-charcoal"
              >
                <Link href={siteConfig.quotePath}>{siteConfig.ctaLabel}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 text-brand-cream hover:bg-white/10 hover:text-white"
              >
                <a href={siteConfig.phoneTel}>Call {siteConfig.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Elevate */}
      <section className="py-20 lg:py-28 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
                Why Choose Elevate
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-6">
                Why {cityData.name} homeowners choose {siteConfig.name}
              </h2>
              {cityExtra?.localNote ? (
                <p className="text-lg text-brand-warm-gray mb-6">{cityExtra.localNote}</p>
              ) : null}
              <p className="text-lg text-brand-warm-gray mb-6">{countyData.intro}</p>
              <p className="text-lg text-brand-warm-gray mb-10">
                {countyData.climateNote} On every {cityData.name} job, that means one accountable
                team and a workmanship guarantee — not a subcontracted hand-off.
              </p>

              <ul className="grid sm:grid-cols-2 gap-6">
                {trustItems.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-brand-charcoal/10 bg-white p-6"
                  >
                    <div className="size-12 rounded-xl bg-brand-sandstone/30 flex items-center justify-center text-brand-gold-deep mb-4">
                      <item.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-charcoal mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-warm-gray leading-relaxed">{item.copy}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-brand-charcoal text-brand-cream rounded-2xl p-8 shadow-xl">
                  <h3 className="font-display text-2xl font-bold mb-3 text-white">
                    Request an estimate
                  </h3>
                  <p className="text-brand-cream/80 mb-6 text-sm leading-relaxed">
                    Free, no-obligation quotes for {cityData.name} exterior projects.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full bg-brand-gold text-brand-charcoal hover:bg-brand-gold-deep hover:text-white mb-3"
                  >
                    <Link href={siteConfig.quotePath}>{siteConfig.ctaLabel}</Link>
                  </Button>
                  <a
                    href={siteConfig.phoneTel}
                    className="block text-center text-sm font-semibold text-brand-cream/80 hover:text-brand-gold transition-colors"
                  >
                    or call {siteConfig.phone}
                  </a>
                </div>

                <div className="bg-white border border-brand-charcoal/10 rounded-2xl p-6">
                  <h3 className="font-display text-lg font-bold mb-4 text-brand-charcoal">
                    {cityData.name} info
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-bronze mb-1">
                        County
                      </p>
                      <Link
                        href={`/service-areas/${countyData.slug}`}
                        className="text-brand-charcoal font-medium hover:text-brand-gold-deep transition-colors"
                      >
                        {countyData.name}
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-bronze mb-1">
                        Zip Codes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cityData.zipCodes.map((zip) => (
                          <span
                            key={zip}
                            className="inline-flex items-center rounded-full bg-brand-sandstone/30 px-3 py-1 text-xs font-medium text-brand-charcoal"
                          >
                            {zip}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-bronze mb-1">
                        License
                      </p>
                      <p className="text-brand-charcoal text-sm font-medium">
                        NJ HIC #{siteConfig.licenseNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Local FAQ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
            {cityData.name} FAQ
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-10">
            Common questions from {cityData.name} homeowners
          </h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-brand-charcoal/10 bg-brand-cream p-6"
              >
                <dt className="font-display text-lg font-bold text-brand-charcoal mb-2">
                  {faq.question}
                </dt>
                <dd className="text-brand-warm-gray leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28 bg-brand-sandstone/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Services
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-4">
              Our services in {cityData.name}
            </h2>
            <p className="text-lg text-brand-warm-gray">
              Seven exterior services. One accountable team. Manufacturer-backed warranties.
            </p>
          </div>
          <ul className="space-y-3">
            {orderedServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="group flex items-center justify-between gap-6 p-6 rounded-2xl border border-brand-charcoal/10 bg-white hover:border-brand-gold-deep hover:shadow-md transition-all"
                >
                  <div>
                    {service.slug === featuredService ? (
                      <span className="mb-1 inline-block text-xs font-bold uppercase tracking-[0.15em] text-brand-gold-deep">
                        Spotlight in {cityData.name}
                      </span>
                    ) : null}
                    <h3 className="font-display text-lg font-bold text-brand-charcoal mb-1 group-hover:text-brand-gold-deep transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-brand-warm-gray leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-5 h-5 text-brand-warm-gray group-hover:text-brand-gold-deep group-hover:translate-x-1 transition-all shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
