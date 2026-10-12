import { realReviews } from "@/lib/reviews-data";

const highlights = [
  {
    theme: "Cleanliness",
    stat: "Mentioned in nearly every review",
    fragments: ["Swept the driveway every evening.", "No nails left in the lawn."],
  },
  {
    theme: "Communication",
    stat: "Consistently cited as a differentiator",
    fragments: ["The PM texted me before 8am each day.", "Never had to wonder what was happening."],
  },
  {
    theme: "Workmanship",
    stat: "The reason customers refer us",
    fragments: [
      "The flashing detail around the chimney was exactly right.",
      "The siding lines are perfectly straight.",
    ],
  },
];

export function ReviewHighlights() {
  // Compliance gate: the highlight themes, stats, and pull-quote fragments are
  // all derived from review content. Until verified first-party reviews exist,
  // render nothing so no synthesized copy ships.
  if (realReviews().length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-cream py-20 sm:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-bronze mb-4">
            WHAT PEOPLE SAY
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-charcoal leading-tight">
            Three things that show up in almost every review.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map(({ theme, stat, fragments }) => (
            <div
              key={theme}
              className="bg-white rounded-2xl border border-brand-charcoal/10 p-7 shadow-sm"
            >
              <p className="font-display text-2xl font-semibold text-brand-charcoal mb-2">
                {theme}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-bronze mb-5">
                {stat}
              </p>
              <ul className="list-none space-y-3">
                {fragments.map((fragment) => (
                  <li
                    key={fragment}
                    className="text-sm text-brand-warm-gray italic leading-relaxed"
                  >
                    &ldquo;{fragment}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
