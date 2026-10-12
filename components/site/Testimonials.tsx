"use client";

import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { realReviews } from "@/lib/reviews-data";

export function Testimonials() {
  const reviews = realReviews();

  return (
    <section className="bg-brand-cream py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MaskReveal>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-bronze mb-4">
              TESTIMONIAL
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text="What homeowners across New Jersey say." />
          {reviews.length === 0 && (
            <MaskReveal delay={0.1}>
              <p className="mt-6 text-lg leading-8 text-brand-charcoal/80">
                We&apos;re collecting written customer reviews for our BBB and Google profiles. Want
                to be the first?{" "}
                <a
                  className="font-semibold text-brand-bronze"
                  href="mailto:contact@elevate-hrg.com"
                >
                  Email contact@elevate-hrg.com
                </a>
                .
              </p>
            </MaskReveal>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <MaskReveal key={review.id} delay={0.1 * index}>
                <article className="bg-brand-sandstone/25 rounded-2xl p-8 shadow-sm ring-1 ring-brand-charcoal/8 h-full flex flex-col">
                  <blockquote className="flex-1 text-brand-charcoal/80 leading-relaxed mb-8">
                    &quot;{review.quote}&quot;
                  </blockquote>
                  <div className="mt-auto">
                    <p className="font-semibold text-brand-charcoal">{review.name}</p>
                    <p className="text-sm text-brand-charcoal/60 mt-1">
                      {review.city}, NJ <span className="mx-2">·</span> {review.service}
                    </p>
                  </div>
                </article>
              </MaskReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
