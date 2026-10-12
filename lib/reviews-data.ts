export type Review = {
  id: string;
  name: string; // First name + last initial only (e.g. "Patricia M.")
  city: string;
  county: string;
  service: string; // e.g. "Roofing Replacement"
  quote: string; // 1-3 sentences
  date: string; // e.g. "March 2024"
  synthesized?: boolean;
};

// NOTE: All entries below are marked `synthesized: true` until the owner
// supplies first-party copy. Names, cities, and counties are realistic NJ
// service-area towns; quotes describe outcomes consistent with our crew
// commitments (punctuality, daily cleanup, communication, registered
// warranties). Replace before launch.
export const reviews: Review[] = [
  {
    id: "patricia-m-ridgewood",
    name: "Patricia M.",
    city: "Ridgewood",
    county: "Bergen",
    service: "Roof Replacement",
    quote:
      "The crew showed up at 7:55 every morning and tarped the entire perimeter before they pulled the first shingle. We walked the yard with a magnet bar at the end of day three and found exactly one nail.",
    date: "April 2024",
    synthesized: true,
  },
  {
    id: "robert-a-chatham",
    name: "Robert A.",
    city: "Chatham",
    county: "Morris",
    service: "Roof Replacement",
    quote:
      "The ridge vent and ice-and-water work alone was worth the call. We'd had ice dam problems for three winters running and last January was the first one without a leak in the kitchen ceiling.",
    date: "March 2024",
    synthesized: true,
  },
  {
    id: "linda-k-montclair",
    name: "Linda K.",
    city: "Montclair",
    county: "Essex",
    service: "Siding Replacement",
    quote:
      "The siding lines along the front gable are perfectly straight, even where it meets the original 1920s trim. The PM walked us through the J-channel detail before they started so we knew what to expect.",
    date: "October 2024",
    synthesized: true,
  },
  {
    id: "david-h-westfield",
    name: "David H.",
    city: "Westfield",
    county: "Union",
    service: "Window Replacement",
    quote:
      "Eighteen windows in two days, including the bay in the dining room. The interior trim was reused where we asked and replaced cleanly where the old casing was beyond saving. Drafts are gone.",
    date: "November 2024",
    synthesized: true,
  },
  {
    id: "maria-s-edison",
    name: "Maria S.",
    city: "Edison",
    county: "Middlesex",
    service: "Gutters & Leaf Guards",
    quote:
      "They re-pitched the back run that the previous installer left dead-flat, and the seamless sections are tight to the fascia. First heavy rain after install, water actually went where it was supposed to.",
    date: "September 2024",
    synthesized: true,
  },
  {
    id: "james-r-summit",
    name: "James R.",
    city: "Summit",
    county: "Union",
    service: "Roof Replacement",
    quote:
      "The flashing detail around our chimney was exactly right -- step flashing, counter flashing, the works. Our previous roof had been patched with caulk for fifteen years. The warranty paperwork was registered with GAF within 48 hours.",
    date: "August 2024",
    synthesized: true,
  },
  {
    id: "susan-b-madison",
    name: "Susan B.",
    city: "Madison",
    county: "Morris",
    service: "Entry Door",
    quote:
      "The PM texted me before 8am every day with the schedule and a photo when the door was set. The threshold and weatherstripping seal cleanly -- I can't feel the cold spot we used to have in the foyer.",
    date: "February 2024",
    synthesized: true,
  },
  {
    id: "thomas-d-livingston",
    name: "Thomas D.",
    city: "Livingston",
    county: "Essex",
    service: "Siding & Gutters",
    quote:
      "Two crews, three days, and the driveway was swept every evening before they left. The dumpster was on plywood the entire time so the apron didn't get scratched. Small detail, but it told me everything.",
    date: "June 2024",
    synthesized: true,
  },
  {
    id: "karen-w-paramus",
    name: "Karen W.",
    city: "Paramus",
    county: "Bergen",
    service: "Attic Insulation",
    quote:
      "They air-sealed the can lights and top plates before blowing in the cellulose, which the last contractor we got a quote from skipped entirely. Heating bill in February dropped about $80 from the year before.",
    date: "January 2025",
    synthesized: true,
  },
];

/**
 * Compliance gate: only reviews NOT flagged `synthesized` are real, first-party
 * customer reviews. Components that render review content (Testimonials,
 * ReviewMarquee) MUST use this helper so fabricated copy never ships. Today all
 * entries are `synthesized: true`, so this returns [] and the consuming
 * components render their compliant fallback / nothing.
 */
export function realReviews(): Review[] {
  return reviews.filter((review) => !review.synthesized);
}
