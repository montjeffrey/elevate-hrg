import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogSeeds } from "@/content/blog-seeds";
import { canonicalUrl, titleWithBrand } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const description =
  "Plain-spoken guidance on roofing, siding, windows, gutters, and exterior renovations for New Jersey homeowners — cost factors, material trade-offs, and what to ask before you hire.";
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const canonical = canonicalUrl("/blog");
const title = titleWithBrand("Exterior Renovation Insights");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  // Interim no-index hold: the blog templates render a title + description only
  // (no article body yet). Building real post content is a separate add-on; until
  // then the whole /blog section stays out of the index. noindex,follow preserves
  // internal link equity. Tracked in the website "finishing questions".
  robots: { index: false, follow: true },
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

export default function BlogPage() {
  return (
    <main id="main-content" className="bg-brand-cream pt-24">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-bronze">
            The Elevate HRG Blog
          </p>
          <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl md:text-5xl">
            Exterior renovation insights for New Jersey homeowners
          </h1>
          <p className="text-base leading-relaxed text-brand-warm-gray sm:text-lg">
            Straight answers on roofing, siding, windows, gutters, and full exterior projects — what
            things cost in NJ, how materials compare, and the questions worth asking before you sign
            anything.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogSeeds.map((post) => (
              <li key={post.slug} className="flex">
                <Link
                  href={post.href}
                  className="group flex w-full flex-col rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold-deep hover:shadow-xl"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-bronze">
                    {post.keyword}
                  </p>
                  <h2 className="mb-3 font-display text-xl font-semibold leading-snug text-brand-charcoal">
                    {post.title}
                  </h2>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-brand-warm-gray">
                    {post.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bronze">
                    Read article
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
