import Image from "next/image";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

/**
 * Photographic evidence for the process page.
 *
 * /our-process was entirely diagrams and type — a page about how the crew works
 * with no crew anywhere in it. These are real job-site photos, not stock.
 *
 * Captions describe only what is visibly in frame. Every one of these was opened
 * and checked before it was placed here: two show Elevate-branded shirts, one
 * shows ProVia packaging, one shows furniture sheeted inside the room. Do not
 * add a caption asserting anything the photo does not actually show — the
 * gallery already has an entry where a storm door is filed as a window, and that
 * is the failure mode to avoid.
 *
 * All source files are 1400x1867 (3:4). The tiles are portrait to match; do not
 * drop these into a landscape frame without re-cropping, or the people end up
 * outside the crop.
 */

type CrewShot = {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
};

const shots: readonly CrewShot[] = [
  {
    src: "/brand/process/crew-measuring-opening.jpg",
    alt: "Elevate HRG installer measuring a window rough opening with a tape measure",
    caption: "Every opening measured on site — not from the old unit.",
  },
  {
    src: "/brand/process/crew-provia-window-removal.jpg",
    alt: "Elevate HRG installer lifting an old window sash out of its opening, ProVia cartons stacked behind",
    caption: "Old unit out, ProVia stock staged and ready.",
  },
  {
    src: "/brand/process/crew-interior-protected.jpg",
    alt: "Elevate HRG installer standing in an open window frame, furniture inside covered with protective sheeting",
    caption: "Interiors covered before the first cut.",
  },
  {
    src: "/brand/process/crew-roofing-ridge-work.jpg",
    alt: "Two Elevate HRG roofers working shingles near the ridge of a New Jersey home",
    caption: "A foreman on the roof, every day it's open.",
  },
];

export function CrewAtWork() {
  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="crew-at-work">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              ON THE JOB
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text="This is what the four steps actually look like." />
          <MaskReveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-brand-warm-gray">
              Real crews on real North Jersey jobs. No stock photography.
            </p>
          </MaskReveal>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {shots.map((shot, index) => (
            <li key={shot.src}>
              <MaskReveal delay={0.08 * index}>
                <figure>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-sandstone/30">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm leading-relaxed text-brand-warm-gray">
                    {shot.caption}
                  </figcaption>
                </figure>
              </MaskReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
