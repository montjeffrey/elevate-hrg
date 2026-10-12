import type { Metadata } from "next";
import Image from "next/image";
import { Award, Hammer, ShieldCheck, Wrench } from "lucide-react";
import { FinalCTA } from "@/components/site/FinalCTA";
import { HeroFrostedStrip } from "@/components/service/HeroFrostedStrip";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/about", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Proudly Serving Homeowners Throughout New Jersey. Elevate Home Remodeling is a veteran-owned, NaVOBA-certified exterior renovation company with 25+ years of experience. NJ HIC #13VH13821400.";

export const metadata: Metadata = {
  title: "About Elevate HRG | Veteran-Owned NJ Exterior Renovations | 25+ years of experience",
  description,
  alternates: { canonical },
  openGraph: {
    title: "About Elevate HRG | Veteran-Owned NJ Exterior Renovations | 25+ years of experience",
    description,
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Elevate HRG exterior renovation crew on a New Jersey home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Elevate HRG | Veteran-Owned NJ Exterior Renovations | 25+ years of experience",
    description,
    images: [ogImage],
  },
};

const stats = [
  { label: "Years of NJ Exterior Work", value: siteConfig.yearsExperience },
  { label: "NJ Counties Served", value: "14" },
  { label: "Manufacturer Certifications", value: "2" },
  { label: "Workmanship Guarantee", value: "Every Job" },
];

const values = [
  {
    name: "Veteran-Owned, NaVOBA Certified",
    description:
      "Run with the same discipline as a service crew: morning briefings, end-of-day site reset, and a foreman on every job — not a salesman handing off to whoever's free.",
    icon: ShieldCheck,
  },
  {
    name: "Manufacturer-Certified Installers",
    description:
      "GAF Certified installer and ProVia authorized. The certifications that unlock the manufacturers' best material warranties stay valid only with crews like ours.",
    icon: Award,
  },
  {
    name: "Built for NJ Climate Zone 4",
    description:
      "Ice-and-water shield to code, R-49 attic targets, full-frame window replacements sized for original openings — specified for nor'easters, not generic spec sheets.",
    icon: Hammer,
  },
  {
    name: "Same-Day Callbacks, Written Quotes",
    description:
      "Quote requests get a same-business-day callback. Estimates are in writing with line-item materials, not napkin numbers. Final invoice matches the quote unless you sign a change order.",
    icon: Wrench,
  },
];

const credentials = [
  "GAF Certified installer",
  "ProVia authorized installer",
  "BBB Accredited",
  "NaVOBA Veteran-Owned",
  `NJ HIC #${siteConfig.licenseNumber}`,
];

export default function AboutPage() {
  return (
    <main id="main-content" className="pt-24">
      {/* Hero Section */}
      <section className="relative flex flex-col overflow-hidden bg-brand-charcoal py-24 text-white sm:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/Dark-gray-home-exterior-color-palette-DJI_0181-2880x1920-1-1536x1024.jpg"
            alt="Aerial view of an Elevate HRG NJ exterior renovation"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/70 to-brand-charcoal"
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl flex-1 px-4 text-center md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
            Proudly Serving Homeowners Throughout New Jersey.
          </p>
          <h1 className="mb-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Veteran-owned exterior renovations with 25+ years of experience.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-brand-cream/85 md:text-xl">
            Veteran-owned and NJ-licensed (Lic {siteConfig.licenseNumber}). Proudly Serving
            Homeowners Throughout New Jersey. With 25+ years of experience, our Wallington team
            brings GAF Certified installer and ProVia authorized credentials to every project.
          </p>
        </div>

        <div className="relative z-10 mt-16">
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-brand-cream py-16">
        <div className="container mx-auto px-4 md:px-8">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-brand-warm-gray">{stat.label}</dt>
                <dd className="order-first font-display text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
            Our Story
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
            One full-service crew for the entire exterior of your home.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-brand-warm-gray">
            <p>
              Proudly Serving Homeowners Throughout New Jersey. Elevate Home Remodeling is a
              veteran-owned, NaVOBA-certified exterior renovation company based in Wallington, NJ,
              with 25+ years of experience. Roofing, siding, windows, gutters, soffit, fascia, entry
              doors, and attic insulation &mdash; delivered with an iron-clad commitment to
              craftsmanship and backed by a workmanship guarantee and registered manufacturer
              warranties.
            </p>
            <p>
              We run every job the way we were trained to operate in service: one project manager
              from the first site visit to the final walkthrough, no subcontracted sales reps, and a
              site that gets reset at the end of every day. The certifications matter, but so does
              showing up when we say we will.
            </p>
            <p className="text-base text-brand-warm-gray/90">
              NJ Home Improvement Contractor Lic. #{siteConfig.licenseNumber}.
            </p>
          </div>
        </div>
      </section>

      {/* The Crew Section */}
      <section className="bg-brand-sandstone/20 py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Portrait frame on purpose. The crew photography is shot 3:4, and the
                previous aspect-[4/3] box cropped the ladder climber straight out of
                frame — which is the one detail the heading beside it depends on. */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/brand/process/crew-roofing-full-team.jpg"
                alt="Four Elevate HRG crew members working a roof replacement on a New Jersey home, one climbing a ladder to the eave"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
                The Crew
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
                The people on the ladder are the people we vouch for.
              </h2>
              <p className="mt-6 text-lg leading-8 text-brand-warm-gray">
                Our installers are manufacturer-credentialed and led by a foreman on every job.
                There is no &ldquo;whoever&rsquo;s free&rdquo; crew and no handoff to a stranger
                after you sign. You meet the people doing the work, and the project manager who
                quoted the job is the one who walks it with you at the end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              Credentials
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              Verifiable, current, and registered on every job.
            </h2>
          </div>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {credentials.map((credential) => (
              <li
                key={credential}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-white px-5 py-4 text-brand-charcoal shadow-sm"
              >
                <Award className="h-5 w-5 shrink-0 text-brand-gold-deep" />
                <span className="font-medium">{credential}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The Elevate Difference */}
      <section className="bg-brand-sandstone/20 py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
              The Elevate Difference
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
              Four standards we hold every job to.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-warm-gray">
              No upsells, no subcontracted sales reps. One project manager from the first site visit
              to the final walkthrough.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.name}
                className="rounded-2xl border border-border/50 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10">
                  <value.icon className="h-6 w-6 text-brand-gold-deep" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-charcoal">{value.name}</h3>
                <p className="leading-relaxed text-brand-warm-gray">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze">
            Service Area
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
            Proudly Serving Homeowners Throughout New Jersey.
          </h2>
          <p className="mt-6 text-lg leading-8 text-brand-warm-gray">
            From our shop at {siteConfig.address}, our crews are routinely on jobs in Wallington,
            Clifton, Linden, and communities throughout New Jersey.
          </p>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
