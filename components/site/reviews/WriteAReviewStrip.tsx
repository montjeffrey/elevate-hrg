export function WriteAReviewStrip() {
  return (
    <section className="bg-brand-sandstone/20 py-12">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <p className="font-display text-xl font-semibold text-brand-charcoal mb-2">
          Had work done by Elevate HRG?
        </p>
        <p className="text-sm text-brand-warm-gray mb-6">
          Your review helps other NJ homeowners make confident decisions.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.google.com/search?q=Elevate+HRG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-charcoal px-6 text-sm font-medium text-white hover:bg-brand-charcoal/80 transition-colors"
          >
            Leave a Google Review
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <a
            href="https://www.bbb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-brand-charcoal/20 bg-white px-6 text-sm font-medium text-brand-charcoal hover:border-brand-gold-deep transition-colors"
          >
            Leave a BBB Review
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
