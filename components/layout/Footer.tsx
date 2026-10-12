import Image from "next/image";
import Link from "next/link";
import { ConsentPreferencesLink } from "@/components/consent/ConsentPreferencesLink";
import { counties } from "@/lib/locations-data";
import { serviceLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

// Canonical county list (all 14) — source of truth that drives routing.
// `name` already carries the " County" suffix (e.g. "Bergen County").
const serviceAreaCounties = Object.values(counties);

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Financing", href: "/financing" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-charcoal text-brand-cream">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 pt-12 pb-28 lg:pb-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/brand/elevate-hrg-logo.svg"
            alt="Elevate Home Remodeling"
            width={480}
            height={448}
            className="mb-4 h-24 w-auto"
            unoptimized
          />
          <p className="mt-3 text-sm leading-6 text-brand-cream/75">{siteConfig.description}</p>
          <a
            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold"
            href={siteConfig.phoneTel}
          >
            {siteConfig.phone}
          </a>
        </div>
        <nav aria-label="Footer services">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Services
          </p>
          <ul className="mt-2 grid gap-0.5 text-sm text-brand-cream/75">
            {serviceLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center transition-colors hover:text-brand-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer service areas">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Service Areas
          </p>
          <ul className="mt-2 grid gap-0.5 text-sm text-brand-cream/75">
            {serviceAreaCounties.map((county) => (
              <li key={county.slug}>
                <Link
                  href={`/service-areas/${county.slug}`}
                  className="flex min-h-11 items-center transition-colors hover:text-brand-cream"
                >
                  {county.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer company">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Company
          </p>
          <ul className="mt-2 grid gap-0.5 text-sm text-brand-cream/75">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center transition-colors hover:text-brand-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-brand-cream/10">
        {/*
        pb-28 on mobile, not py-6. StickyMobileCTA is `fixed bottom-0` and 73px
        tall, and this legal row is the last thing on the page — measured at
        390x844 the row sat at y=659 with the bar starting at y=654, so every
        control in it, including the consent link the privacy policy names as
        the opt-out, was fully covered and untappable. The grid above carries
        its own pb-28 for the same reason; that clearance stopped working for
        this row once it was added below the grid.
      */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 pt-6 pb-28 text-xs text-brand-cream/60 sm:flex-row lg:pb-6">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. NJ HIC License #
            {siteConfig.licenseNumber}.
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            {/*
              First, not last. The Join-the-Club FAB is `fixed bottom-5 right-5`
              on desktop and sits over the right end of this row when the page is
              scrolled to the bottom — a pre-existing overlap that today lands on
              "Terms & Conditions". Appending the consent control would have made
              it the occluded one, which is unacceptable for a control the
              privacy policy points at as the way to exercise an opt-out.
            */}
            <ConsentPreferencesLink />
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center transition-colors hover:text-brand-cream"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center transition-colors hover:text-brand-cream"
            >
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
