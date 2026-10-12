import type { Metadata } from "next";
import { FileCheck, MessageSquareOff, ShieldCheck } from "lucide-react";
import { QuoteMultiStepForm } from "@/components/forms/QuoteMultiStepForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HeroFrostedStrip } from "@/components/service/HeroFrostedStrip";
import { FinalCTA } from "@/components/site/FinalCTA";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/quote", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Two-step quote request for NJ exterior renovations — roofing, siding, windows, gutters, entry doors, or attic insulation. Same-business-day callback. Written estimates only.";

export const metadata: Metadata = {
  title: "Get a Free Project Estimate | Elevate HRG NJ",
  description,
  alternates: { canonical },
  openGraph: {
    title: "Get a Free Project Estimate | Elevate HRG NJ",
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
    title: "Get a Free Project Estimate | Elevate HRG NJ",
    description,
    images: [ogImage],
  },
};

const nextSteps = [
  {
    num: "01",
    title: "Same-business-day call-back",
    body: "We call to confirm the details and set a time that works — usually the same business day you reach out.",
  },
  {
    num: "02",
    title: "On-site walkthrough",
    body: "A project manager measures and photographs what's actually there. No commitment, no high-pressure pitch.",
  },
  {
    num: "03",
    title: "Written, itemized estimate",
    body: "Line-item materials, labor, manufacturer warranty terms, and financing options on paper — no anchored discounts.",
  },
];

const trustPoints = [
  {
    icon: MessageSquareOff,
    title: "No high-pressure sales",
    body: 'One project manager, no commissioned closers, no "today-only" pricing.',
  },
  {
    icon: ShieldCheck,
    title: "Licensed & insured",
    body: `NJ Lic ${siteConfig.licenseNumber}. Veteran-owned, NaVOBA certified.`,
  },
  {
    icon: FileCheck,
    title: "Quote in writing",
    body: "Line-item materials and labor. Final invoice matches unless you sign a change order.",
  },
];

export default function QuotePage() {
  return (
    <main id="main-content" className="pt-24">
      {/* Dark Hero */}
      <section className="relative flex flex-col overflow-hidden bg-brand-charcoal py-20 text-white sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold-deep/15 via-brand-charcoal to-brand-charcoal"
        />
        <div className="container relative z-10 mx-auto max-w-4xl flex-1 px-4 text-center md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
            Free, no-pressure consultation
          </p>
          <SplitHeading as="h1" text="Get your project estimate." className="text-brand-cream" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-cream/85 md:text-xl">
            Two quick steps. Tell us what you&apos;re considering and how to reach you. We call back the
            same day with next steps — no email blast,
            no auto-dialer.
          </p>
        </div>

        <div className="relative z-10 mt-12">
          <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <HeroFrostedStrip
              theme="dark"
              items={[
                { label: "NaVOBA Veteran-Owned" },
                { label: `NJ Lic ${siteConfig.licenseNumber}` },
                { label: "Same-day callbacks" },
              ]}
            />
            <div aria-hidden className="h-[2px] w-full bg-brand-gold" />
          </div>
        </div>
      </section>

      {/* Cream Form Section */}
      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Reassurance column */}
            <aside className="lg:pt-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
                What to Expect
              </p>
              <h2 className="mb-8 font-display text-2xl font-semibold leading-tight text-brand-charcoal sm:text-3xl">
                The estimate process, in plain terms.
              </h2>
              <ul className="space-y-6">
                {trustPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold-deep">
                      <point.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-brand-charcoal">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-brand-warm-gray">
                        {point.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-border/50 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
                  Prefer to talk?
                </p>
                <p className="mt-2 text-base leading-relaxed text-brand-warm-gray">
                  Call{" "}
                  <a
                    href={siteConfig.phoneTel}
                    className="font-medium text-brand-charcoal hover:underline"
                  >
                    {siteConfig.phone}
                  </a>{" "}
                  &mdash; {siteConfig.hoursWeekdays}.
                </p>
              </div>
            </aside>

            {/* Form column */}
            <div className="mx-auto w-full max-w-3xl">
              <QuoteMultiStepForm />
            </div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-brand-sandstone/20 py-20 sm:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              What Happens Next
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              From request to written estimate, in three steps.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {nextSteps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-border/50 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 font-display text-3xl font-bold text-brand-gold/40">
                  {step.num}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-charcoal">{step.title}</h3>
                <p className="leading-relaxed text-brand-warm-gray">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
