import { Star } from "lucide-react";
import { realReviews } from "@/lib/reviews-data";
import { siteConfig } from "@/lib/site-config";

export function ReviewsGrid() {
  const reviews = realReviews();

  return (
    <section className="bg-brand-cream pb-20 sm:pb-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-charcoal leading-tight mb-4">
            What {siteConfig.primaryState} homeowners are saying.
          </h2>
          {reviews.length > 0 && (
            <p className="text-base text-brand-warm-gray leading-relaxed">
              First-party reviews from homeowners we&rsquo;ve worked with across New Jersey.
            </p>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="mx-auto max-w-xl text-center">
            <p className="text-base text-brand-warm-gray leading-relaxed">
              We&rsquo;re collecting written customer reviews for our BBB and Google profiles. Want
              to be the first? Email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-brand-gold-deep underline underline-offset-4 hover:text-brand-espresso"
              >
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4" role="img" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-brand-gold-deep text-brand-gold-deep"
                      aria-hidden
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 mb-5">
                  <p className="text-base leading-relaxed text-brand-charcoal">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Attribution */}
                <footer>
                  <cite className="not-italic">
                    <span className="text-sm font-semibold text-brand-charcoal">{review.name}</span>
                    <span className="text-sm text-brand-warm-gray"> · {review.city}, NJ</span>
                  </cite>
                  <p className="text-xs text-brand-warm-gray/70 mt-1">
                    {review.service} · {review.date}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
