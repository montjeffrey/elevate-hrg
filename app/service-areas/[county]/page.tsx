import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Clock, MapPin, ShieldCheck, ThermometerSun } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { counties } from "@/lib/locations-data";
import { countyVariety } from "@/lib/location-variety-config";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { canonicalUrl } from "@/lib/seo";

interface CountyPageProps {
  params: Promise<{
    county: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(counties).map((county) => ({
    county,
  }));
}

export async function generateMetadata({ params }: CountyPageProps): Promise<Metadata> {
  const { county } = await params;
  const countyData = counties[county];

  if (!countyData) {
    return {
      title: "County Not Found",
    };
  }

  const url = canonicalUrl(`/service-areas/${countyData.slug}`);
  const heroImage = countyVariety(countyData.slug).heroImage ?? "/brand/roofing-hero.avif";
  const ogImage = `${siteConfig.url}${heroImage}`;
  const title = `${countyData.name} Roofing, Siding & Windows | ${siteConfig.name}`;
  const description = `Veteran-owned exterior remodeling in ${countyData.name}, NJ — roofing, siding, windows, gutters & more. GAF Certified, ProVia authorized. Free estimate.`;

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
          alt: `Elevate HRG exterior renovation in ${countyData.name}, New Jersey`,
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
    description: "Replacements, repairs, and inspections — GAF Certified installs.",
  },
  {
    name: "Siding",
    slug: "siding",
    description: "Insulated vinyl, fiber cement, and engineered wood siding systems.",
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
    description: "Blown-in insulation that lowers energy bills.",
  },
];

export default async function CountyPage({ params }: CountyPageProps) {
  const { county } = await params;
  const countyData = counties[county];

  if (!countyData) {
    notFound();
  }

  const namedCities = countyData.cities
    .slice(0, 4)
    .map((c) => c.name)
    .join(", ");
  const remainingCount = Math.max(countyData.cities.length - 4, 0);

  const variety = countyVariety(countyData.slug);
  const heroImage = variety.heroImage ?? "/brand/roofing-hero.avif";

  // Surface the county's most-requested service (light-touch variety lever).
  const primaryService = variety.primaryService
    ? services.find((s) => s.slug === variety.primaryService)
    : undefined;
  // Lead the services list with the county's primary service when present.
  const orderedServices = primaryService
    ? [primaryService, ...services.filter((s) => s.slug !== primaryService.slug)]
    : services;

  const faqs = [
    {
      question: `Do I need a permit for a roof replacement or new siding in ${countyData.name}?`,
      answer: `In most cases, yes. ${countyData.permitNote} Elevate HRG handles the permit filing as part of every job that requires one.`,
    },
    {
      question: `How quickly can Elevate HRG get to a job in ${countyData.name}?`,
      answer: `${countyData.name} is ${countyData.driveTime}, so our crews are out there regularly. We return every estimate request the same business day and can usually schedule an on-site walkthrough within the week.`,
    },
  ];

  return (
    <main id="main-content" className="flex-1 bg-brand-cream">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
          { name: countyData.name, path: `/service-areas/${countyData.slug}` },
        ]}
      />
      <FAQJsonLd entries={faqs} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`Elevate HRG exterior renovation in ${countyData.name}, ${siteConfig.primaryStateAbbr}`}
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
              <span className="text-brand-cream">{countyData.name}</span>
            </nav>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-brand-gold">
              {countyData.name}, NJ
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-brand-cream sm:text-6xl mb-6">
              Exterior home remodeling in {countyData.name}, New Jersey.
            </h1>
            {primaryService ? (
              <p className="mb-6 text-sm font-semibold text-brand-sandstone">
                <span className="uppercase tracking-[0.15em] text-brand-gold">
                  Most requested in {countyData.name}:
                </span>{" "}
                {primaryService.name}
              </p>
            ) : null}
            <p className="text-lg text-brand-cream/90 mb-8">
              Elevate HRG is a veteran-owned, NaVOBA-certified exterior renovation company serving{" "}
              {namedCities}
              {remainingCount > 0
                ? `, and ${remainingCount} more ${countyData.name} communities`
                : ""}{" "}
              — {countyData.driveTime}.
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

      {/* County-specific uniqueness */}
      <section className="py-20 lg:py-28 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 space-y-10">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
                  Working in {countyData.name}
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-6">
                  Built for {countyData.name} homes.
                </h2>
                <p className="text-lg text-brand-warm-gray mb-6">{countyData.intro}</p>
                <p className="text-lg text-brand-warm-gray">{countyData.localProject}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-6">
                  <div className="size-10 rounded-xl bg-brand-sandstone/30 flex items-center justify-center text-brand-gold-deep mb-3">
                    <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                    Permits &amp; code
                  </h3>
                  <p className="text-sm text-brand-warm-gray leading-relaxed">
                    {countyData.permitNote}
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-6">
                  <div className="size-10 rounded-xl bg-brand-sandstone/30 flex items-center justify-center text-brand-gold-deep mb-3">
                    <ThermometerSun className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                    {countyData.name} climate
                  </h3>
                  <p className="text-sm text-brand-warm-gray leading-relaxed">
                    {countyData.climateNote}
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-6">
                  <div className="size-10 rounded-xl bg-brand-sandstone/30 flex items-center justify-center text-brand-gold-deep mb-3">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                    From our shop
                  </h3>
                  <p className="text-sm text-brand-warm-gray leading-relaxed">
                    {countyData.name} is {countyData.driveTime} from {siteConfig.address}.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl mb-6">
                  Common questions in {countyData.name}
                </h2>
                <dl className="space-y-6">
                  {faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-2xl border border-brand-charcoal/10 bg-white p-6"
                    >
                      <dt className="font-display text-lg font-bold text-brand-charcoal mb-2">
                        {faq.question}
                      </dt>
                      <dd className="text-brand-warm-gray leading-relaxed">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-brand-charcoal text-brand-cream rounded-2xl p-8 shadow-xl">
                  <h3 className="font-display text-2xl font-bold mb-3 text-white">
                    Ready to start?
                  </h3>
                  <p className="text-brand-cream/80 mb-6 text-sm leading-relaxed">
                    Our {countyData.name} team is on call for free estimates and exterior project
                    consultations.
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
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-bronze mb-2">
                    License
                  </p>
                  <p className="text-brand-charcoal font-medium">
                    NJ HIC #{siteConfig.licenseNumber}
                  </p>
                  <p className="mt-3 text-xs text-brand-warm-gray">
                    {siteConfig.address} · {siteConfig.phone} · {siteConfig.email}
                  </p>
                  <p className="mt-3 text-xs text-brand-warm-gray">
                    Veteran-owned. {siteConfig.yearsExperience} years serving New Jersey exteriors.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
            Communities We Serve
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-4">
            Serving {namedCities}
            {remainingCount > 0
              ? `, and ${remainingCount} more ${countyData.name} communities`
              : ""}
            .
          </h2>
          <p className="text-lg text-brand-warm-gray mb-10 max-w-3xl">
            Same crews, same standards, same warranty across {countyData.name}. Pick your town to
            see local service details.
          </p>

          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {countyData.cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/service-areas/${countyData.slug}/${city.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-brand-charcoal/10 bg-brand-cream hover:border-brand-gold-deep hover:shadow-sm transition-all"
                >
                  <MapPin className="w-5 h-5 text-brand-gold-deep shrink-0" aria-hidden="true" />
                  <span className="font-medium text-brand-charcoal group-hover:text-brand-gold-deep transition-colors">
                    {city.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-brand-sandstone/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-bronze">
              What We Install
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl mb-4">
              Exterior services available in {countyData.name}
            </h2>
            <p className="text-lg text-brand-warm-gray">
              One accountable team from estimate to final walkthrough — no subcontracted hand-offs.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderedServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 p-6 rounded-2xl border border-brand-charcoal/10 bg-white hover:border-brand-gold-deep hover:shadow-md transition-all"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold text-brand-charcoal mb-2 group-hover:text-brand-gold-deep transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-brand-warm-gray leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold-deep">
                    View details
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
