import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteMultiStepForm } from "@/components/forms/QuoteMultiStepForm";
import { HeroFrostedStrip } from "@/components/service/HeroFrostedStrip";
import { FinalCTA } from "@/components/site/FinalCTA";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/contact", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Proudly Serving Homeowners Throughout New Jersey. Get in touch with Elevate Home Remodeling at 77 Paterson Ave, Wallington, NJ 07057. Same-business-day call-back on every estimate request.";

export const metadata: Metadata = {
  title: "Contact Elevate HRG | Free Estimate · Wallington, NJ",
  description,
  alternates: { canonical },
  openGraph: {
    title: "Contact Elevate HRG | Free Estimate · Wallington, NJ",
    description,
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Elevate HRG exterior renovation in New Jersey",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Elevate HRG | Free Estimate · Wallington, NJ",
    description,
    images: [ogImage],
  },
};

const mapQuery = encodeURIComponent(siteConfig.address);

export default function ContactPage() {
  return (
    <main id="main-content" className="pt-24">
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Contact Info */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
                Get In Touch With Us
              </p>
              <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                Get In Touch With Us.
              </h1>
              <p className="mb-12 text-lg leading-relaxed text-brand-warm-gray">
                Same-business-day call-back on every estimate request. Free, no-pressure
                consultation at your home.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">Call</h2>
                    <a
                      href={siteConfig.phoneTel}
                      className="mt-1 inline-flex min-h-11 items-center text-lg font-medium text-brand-bronze hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">Email</h2>
                    <p className="mt-1 text-brand-warm-gray">Replies within one business day.</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="mt-1 inline-flex min-h-11 items-center text-lg font-medium text-brand-bronze hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">Hours</h2>
                    <p className="mt-1 leading-relaxed text-brand-warm-gray">
                      {siteConfig.hoursWeekdays}
                      <br />
                      {siteConfig.hoursWeekends}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">Service Area</h2>
                    <p className="mt-1 leading-relaxed text-brand-warm-gray">
                      Based at {siteConfig.address}.
                      <br />
                      Proudly Serving Homeowners Throughout New Jersey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-12 overflow-hidden rounded-2xl border border-border/50 shadow-sm">
                <iframe
                  title={`Map to ${siteConfig.name}, ${siteConfig.address}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  width="100%"
                  height="320"
                  loading="lazy"
                  tabIndex={-1}
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full border-0"
                />
              </div>
            </div>

            {/* Quote Form */}
            <div className="lg:mt-0">
              <QuoteMultiStepForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-brand-charcoal">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <HeroFrostedStrip
            theme="dark"
            items={[
              { label: "GAF Certified installer" },
              { label: "NaVOBA Veteran-Owned" },
              { label: `NJ Lic ${siteConfig.licenseNumber}` },
            ]}
          />
          <div aria-hidden className="h-[2px] w-full bg-brand-gold" />
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
