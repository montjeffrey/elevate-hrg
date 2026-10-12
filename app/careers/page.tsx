import type { Metadata } from "next";
import { HardHat, HeartHandshake, Mail, ShieldCheck, TrendingUp } from "lucide-react";
import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { HeroFrostedStrip } from "@/components/service/HeroFrostedStrip";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/careers", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const title = "Careers at Elevate HRG | Now Hiring in New Jersey";
const description =
  "Join a veteran-owned exterior renovation team serving homeowners throughout New Jersey. Apply online for installer, crew lead, project manager, and office roles.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "An Elevate HRG crew on a job site" }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

const benefits = [
  {
    icon: TrendingUp,
    title: "Steady, year-round work",
    body: "Seven exterior trades across fourteen New Jersey counties means the schedule does not empty out when one season ends.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed and insured",
    body: `We work under NJ HIC license ${siteConfig.licenseNumber}, with the permits pulled and the paperwork handled before a crew arrives.`,
  },
  {
    icon: HardHat,
    title: "Manufacturer training",
    body: "Our GAF and ProVia certifications come with real product training, not just a badge on a website.",
  },
  {
    icon: HeartHandshake,
    title: "Veteran-owned",
    body: "A NaVOBA-certified veteran-owned business. Veterans and transitioning service members are strongly encouraged to apply.",
  },
];

const steps = [
  {
    title: "Send your application",
    body: "Fill out the form below and attach your resume as a PDF. It takes about three minutes.",
  },
  {
    title: "We review it",
    body: "Applications go straight to our hiring inbox. Every one gets read by a person.",
  },
  {
    title: "A conversation",
    body: "If your experience lines up with an opening, we call you to talk through the role, the schedule, and pay.",
  },
];

export default function CareersPage() {
  return (
    <main id="main-content" className="pt-24">
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
                Careers
              </p>
              <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                Build something that lasts.
              </h1>
              <p className="mb-12 text-lg leading-relaxed text-brand-warm-gray">
                Elevate Home Remodeling is a veteran-owned exterior renovation company with{" "}
                {siteConfig.yearsExperience} years of experience, based in {siteConfig.city} and
                serving homeowners throughout New Jersey. We hire installers, crew leads, project
                managers, and office staff who take the work seriously.
              </p>

              <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-brand-charcoal">
                Why work here
              </h2>
              <div className="mb-12 space-y-8">
                {benefits.map((benefit) => (
                  <div className="flex items-start gap-4" key={benefit.title}>
                    <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                      <benefit.icon aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-charcoal">{benefit.title}</h3>
                      <p className="mt-1 leading-relaxed text-brand-warm-gray">{benefit.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-brand-charcoal">
                How applying works
              </h2>
              <ol className="mb-12 space-y-6">
                {steps.map((step, index) => (
                  <li className="flex items-start gap-4" key={step.title}>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-deep font-semibold text-white"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-charcoal">{step.title}</h3>
                      <p className="mt-1 leading-relaxed text-brand-warm-gray">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-white p-6">
                <div className="mt-1 rounded-xl bg-brand-gold/10 p-3 text-brand-gold-deep">
                  <Mail aria-hidden="true" className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-charcoal">
                    Prefer to email us directly?
                  </h2>
                  <p className="mt-1 leading-relaxed text-brand-warm-gray">
                    Send your resume to{" "}
                    <a
                      className="font-medium text-brand-bronze hover:underline"
                      href={`mailto:${siteConfig.email}?subject=Job%20application`}
                    >
                      {siteConfig.email}
                    </a>{" "}
                    or call{" "}
                    <a
                      className="font-medium text-brand-bronze hover:underline"
                      href={siteConfig.phoneTel}
                    >
                      {siteConfig.phone}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:mt-0">
              <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-brand-charcoal">
                  Apply now
                </h2>
                <p className="mb-8 leading-relaxed text-brand-warm-gray">
                  Tell us about yourself and attach your resume. Every field except the last one is
                  required.
                </p>
                <CareerApplicationForm />
              </div>

              {/*
                Retention and deletion, stated plainly on the page because the
                site collects a resume. This wording is load-bearing: it must
                stay true to the architecture (no datastore — the inbox is the
                record of truth) and must stay consistent with app/privacy/page.tsx.
                Do not soften it into a vague "we respect your privacy" line.
              */}
              <div className="mt-6 rounded-2xl border border-border/50 bg-brand-cream/60 p-6">
                <h2 className="text-base font-semibold text-brand-charcoal">
                  What happens to your resume
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-warm-gray">
                  <li>
                    Your application is emailed to our hiring inbox. This website does not store it,
                    and no copy is kept on the site or published anywhere.
                  </li>
                  <li>
                    We use it only to evaluate you for employment. We do not sell it or share it
                    with advertisers.
                  </li>
                  <li>
                    Want it deleted? Email{" "}
                    <a
                      className="text-brand-bronze hover:underline"
                      href={`mailto:${siteConfig.email}?subject=Delete%20my%20application`}
                    >
                      {siteConfig.email}
                    </a>{" "}
                    and we will remove it from our inbox.
                  </li>
                  <li>Resumes must be PDF. Other file types are rejected.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </main>
  );
}
