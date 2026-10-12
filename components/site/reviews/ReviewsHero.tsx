import { ExternalLink } from "lucide-react";
import { realReviews } from "@/lib/reviews-data";

export function ReviewsHero() {
  const hasReviews = realReviews().length > 0;

  return (
    <section className="bg-brand-sandstone py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-bronze mb-5">
          HOMEOWNER REVIEWS
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-charcoal mb-6">
          {hasReviews
            ? "Homeowners across NJ keep saying the same thing."
            : "Hear it from New Jersey homeowners."}
        </h1>

        <p className="text-base text-brand-warm-gray leading-relaxed mb-8">
          {hasReviews
            ? "Read first-party reviews from the homeowners we've worked with, then find us on Google and BBB."
            : "We're building out our Google and BBB review profiles. Find us there to read and leave a review."}
        </p>

        {/* External links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.google.com/search?q=Elevate+HRG+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/20 bg-white px-5 py-2.5 text-sm font-medium text-brand-charcoal hover:border-brand-gold-deep transition-colors"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Find us on Google
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <a
            href="https://www.bbb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/20 bg-white px-5 py-2.5 text-sm font-medium text-brand-charcoal hover:border-brand-gold-deep transition-colors"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Find us on BBB
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
