import type { Metadata } from "next";
import { Clock, Mail, Phone, ShieldCheck } from "lucide-react";
import { FinancingCalculator } from "@/components/financing/FinancingCalculator";
import { FinancingDisclosures } from "@/components/financing/FinancingDisclosures";
import { FinancingPlanCards } from "@/components/financing/FinancingPlanCards";
import { ShortLeadForm } from "@/components/forms/ShortLeadForm";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { financingFaqs } from "@/content/faqs";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/financing", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Financing options for NJ roofing, siding, window, and full-exterior projects through Pure Financial Group. Compare plans, estimate a monthly payment, and apply on the lender's site.";
const title = "Financing Your NJ Exterior Renovation | Elevate HRG";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
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
    title,
    description,
    images: [ogImage],
  },
};

const expectations = [
  {
    icon: Clock,
    title: "Reviewed during the estimate",
    body: "We price the project first, then walk through the monthly options against that number — no payment talk before there's a scope to attach it to.",
  },
  {
    icon: ShieldCheck,
    title: "Elevate is a contractor, not a lender",
    body: "Approval, rate, and term come from the lender, not from us. Whatever you're offered is laid out in writing before any work is scheduled.",
  },
  {
    icon: Phone,
    title: "Same-business-day call-back",
    body: "Send the form and we'll call the same business day to talk through the project and what the financing options actually look like for it.",
  },
];

export default function FinancingPage() {
  return (
    <main id="main-content" className="pt-24">
      <FAQJsonLd entries={financingFaqs} />

      <section className="bg-brand-charcoal py-24 text-white sm:py-32">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
            Financing Available
          </p>
          <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Financing for NJ Exterior Renovations
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80 md:text-xl">
            Don&apos;t let budget constraints delay essential exterior upgrades. Financing is
            available on roofing, siding, window, and full-exterior projects through Pure Financial
            Group and its lending partners.
          </p>
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-sandstone/30 py-20 sm:py-28" data-surface="financing-plans">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <MaskReveal>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
                FINANCING OPTIONS
              </p>
            </MaskReveal>
            <SplitHeading as="h2" text="Spread the project across the years it'll last." />
            <MaskReveal delay={0.12}>
              <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
                Applications are submitted on the lender&apos;s own site. Nothing on this page
                collects your financial information.
              </p>
            </MaskReveal>
          </div>

          <FinancingPlanCards />
        </div>
      </section>

      {/* ── Estimator + what to expect ────────────────────────────────────── */}
      <section className="bg-brand-cream py-20 sm:py-28" data-surface="financing">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <MaskReveal>
                <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
                  WHAT TO EXPECT
                </p>
              </MaskReveal>
              <SplitHeading as="h2" text="Start with the project. The payment follows." />
              <MaskReveal delay={0.12}>
                <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
                  There&apos;s no application and no credit pull involved in getting a project
                  price. Send us the details and we&apos;ll cover the financing options together,
                  with the real scope in front of both of us.
                </p>
              </MaskReveal>

              <ul className="mt-12 space-y-8">
                {expectations.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title}>
                      <MaskReveal delay={0.1 + index * 0.08}>
                        <div className="flex items-start gap-4">
                          <span className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                            <Icon aria-hidden="true" className="h-6 w-6" />
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-brand-charcoal">
                              {item.title}
                            </h3>
                            <p className="mt-1 leading-relaxed text-brand-warm-gray">{item.body}</p>
                          </div>
                        </div>
                      </MaskReveal>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <FinancingCalculator />
            </div>
          </div>

          {/* Full-width, not a third column. The lead form is ~750px tall while
              the copy beside it is ~250px, so parking it in one half of the
              two-column grid above left the other half empty for the whole
              height of the form. Spanning the container and centring the copy
              against it keeps the whitespace symmetric instead. */}
          <div className="mt-16 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brand-charcoal/5 sm:p-8 md:p-10 lg:mt-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h2 className="font-display text-2xl font-semibold text-brand-charcoal sm:text-3xl">
                  Prefer to talk it through?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-warm-gray">
                  Same-business-day call-back. Free, no-pressure consultation at your home.
                </p>

                <div className="mt-8 flex flex-col gap-4 border-t border-brand-charcoal/10 pt-8 sm:flex-row sm:gap-10 lg:flex-col lg:gap-5">
                  <a
                    className="inline-flex items-center gap-3 font-medium text-brand-charcoal transition-colors hover:text-brand-gold-deep"
                    data-cta="financing_phone"
                    href={siteConfig.phoneTel}
                  >
                    <Phone aria-hidden="true" className="h-5 w-5 text-brand-gold-deep" />
                    {siteConfig.phone}
                  </a>
                  <a
                    className="inline-flex items-center gap-3 font-medium text-brand-charcoal transition-colors hover:text-brand-gold-deep"
                    href={`mailto:${siteConfig.email}`}
                  >
                    <Mail aria-hidden="true" className="h-5 w-5 text-brand-gold-deep" />
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div>
                <ShortLeadForm formName="financing" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceFAQ entries={financingFaqs} heading="Financing questions, answered." />

      <FinancingDisclosures />

      <FinalCTA />
    </main>
  );
}
