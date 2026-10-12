import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { counties } from "@/lib/locations-data";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { canonicalUrl } from "@/lib/seo";

const ogImage = `${siteConfig.url}/brand/roofing-hero.avif`;
const seoTitle = "NJ Exterior Renovation Service Areas | Elevate HRG";
const seoDescription =
  "Proudly Serving Homeowners Throughout New Jersey. Explore Elevate HRG's county and city service areas, then schedule a free estimate.";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  alternates: { canonical: canonicalUrl("/service-areas") },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: canonicalUrl("/service-areas"),
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Elevate HRG exterior renovation service areas in New Jersey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [ogImage],
  },
};

export default function ServiceAreasPage() {
  const countyList = Object.values(counties);

  return (
    <main id="main-content" className="flex-1 bg-brand-cream">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/brand/Dark-gray-home-exterior-color-palette-DJI_0181-2880x1920-1-1536x1024.jpg"
            alt="Aerial view of a New Jersey home exterior in an Elevate HRG service area"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-brand-sandstone mb-6 text-sm font-medium"
          >
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span className="text-white">Service Areas</span>
          </nav>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-brand-gold">
            New Jersey Service Areas
          </p>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-white sm:text-6xl mb-6">
            Proudly Serving Homeowners Throughout New Jersey.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-brand-cream/90 mb-8">
            Based in Wallington, Elevate HRG provides roofing, siding, windows, gutters, soffit,
            fascia, entry doors, and attic insulation. Find your county below to see the communities
            we serve.
          </p>
        </div>
      </section>

      {/* Counties Grid */}
      <section className="py-20 lg:py-32 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countyList.map((county) => (
              <div
                key={county.slug}
                className="group flex flex-col bg-white border border-brand-charcoal/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-brand-sandstone/20 flex items-center justify-center text-brand-gold-deep">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-charcoal">{county.name}</h2>
                  </div>
                  <p className="text-brand-warm-gray mb-6">{county.intro}</p>
                  <p className="text-sm text-brand-warm-gray/90 mb-6">
                    {county.driveTime.charAt(0).toUpperCase() + county.driveTime.slice(1)}.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
                      Top Cities Served:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {county.cities.slice(0, 5).map((city) => (
                        <span
                          key={city.slug}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-sandstone/30 text-brand-charcoal"
                        >
                          {city.name}
                        </span>
                      ))}
                      {county.cities.length > 5 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-cream text-brand-warm-gray">
                          +{county.cities.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-brand-charcoal/10 bg-brand-cream/40">
                  <Link
                    href={`/service-areas/${county.slug}`}
                    className="flex items-center justify-center w-full py-2 text-sm font-bold text-brand-gold-deep hover:text-brand-charcoal transition-colors"
                  >
                    View all {county.name} areas
                    <ArrowRight
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-charcoal text-white text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Don&apos;t see your town listed?
          </h2>
          <p className="text-lg text-brand-cream/80 mb-10">
            Proudly Serving Homeowners Throughout New Jersey. Schedule a free estimate and we&apos;ll
            confirm the next steps for your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="bg-brand-gold-deep hover:bg-brand-gold text-white border-none"
            >
              <Link href={siteConfig.quotePath}>{siteConfig.ctaLabel}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/10 hover:text-white"
            >
              <a href={siteConfig.phoneTel}>Call {siteConfig.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
