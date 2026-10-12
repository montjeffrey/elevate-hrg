import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogSeeds } from "@/content/blog-seeds";
import { canonicalUrl, titleWithBrand } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogSeeds.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSeeds.find((seed) => seed.slug === slug);

  if (!post) return {};

  return {
    title: titleWithBrand(post.title),
    description: post.description,
    alternates: {
      canonical: canonicalUrl(post.href),
    },
    // Interim no-index hold (see app/blog/page.tsx). Real article bodies are a
    // separate add-on; keep individual posts out of the index until then.
    robots: { index: false, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogSeeds.find((seed) => seed.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main id="main-content" className="bg-brand-cream pt-24">
      {/* Post header */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-bronze">
            {post.keyword}
          </p>
          <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-brand-warm-gray sm:text-lg">
            {post.description}
          </p>

          {/* In-fold CTA row */}
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href={siteConfig.quotePath}
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-7 py-3 text-sm font-semibold text-brand-charcoal shadow-lg transition-transform hover:scale-[1.03]"
            >
              Schedule a Free Estimate
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-bronze transition-colors hover:text-brand-charcoal"
            >
              ← All articles
            </Link>
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="pb-24 sm:pb-32">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <hr className="border-t border-brand-charcoal/10" />
          <p className="mt-8 text-center text-sm leading-relaxed text-brand-warm-gray">
            Talk to a New Jersey exterior renovation team that does roofing, siding, windows, and
            gutters — start with a free, no-pressure estimate.
          </p>
        </div>
      </section>
    </main>
  );
}
