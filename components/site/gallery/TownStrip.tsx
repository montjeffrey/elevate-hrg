const TOWNS = [
  "Madison",
  "Chatham",
  "Morristown",
  "Summit",
  "Westfield",
  "Ridgewood",
  "Montclair",
  "Livingston",
  "Tenafly",
  "Maplewood",
  "South Orange",
  "Florham Park",
  "Warren",
  "Basking Ridge",
  "Bernardsville",
  "Millburn",
  "Short Hills",
  "Glen Ridge",
  "Verona",
  "Cedar Grove",
];

export function TownStrip() {
  return (
    <section className="bg-brand-sandstone/30 py-12 sm:py-16" data-testid="town-strip">
      <div className="container mx-auto px-4 md:px-8">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-brand-bronze text-center">
          COMMUNITIES WE&apos;VE WORKED IN
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {TOWNS.map((town) => (
            <span key={town} className="text-sm font-medium text-brand-charcoal/70">
              {town}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
