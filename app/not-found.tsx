import Link from "next/link";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold-deep">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-relaxed text-brand-warm-gray">
        Sorry — we couldn&rsquo;t find the page you were looking for. It may have moved, or the link
        may be out of date. Try one of the pages below, or reach out and we&rsquo;ll point you in
        the right direction.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild variant="gold" size="lg">
          <Link href={siteConfig.quotePath}>{siteConfig.ctaLabel}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={siteConfig.phoneTel}>Call {siteConfig.phone}</a>
        </Button>
      </div>

      <nav aria-label="Helpful links" className="mt-12 border-t border-brand-sandstone pt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-deep">
          Our services
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-brand-warm-gray sm:grid-cols-2">
          {serviceLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="underline-offset-4 hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-deep">
          More
        </p>
        <ul className="mt-4 grid gap-3 text-sm text-brand-warm-gray sm:grid-cols-2">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/service-areas" className="underline-offset-4 hover:underline">
              Service Areas
            </Link>
          </li>
          <li>
            <Link href="/contact" className="underline-offset-4 hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
