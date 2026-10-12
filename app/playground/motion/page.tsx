import { Button } from "@/components/ui/button";
import { HorizontalScrollPin } from "@/components/motion/HorizontalScrollPin";
import { HoverDistortion } from "@/components/motion/webgl/HoverDistortion";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { NumberScrub } from "@/components/motion/NumberScrub";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { StickyCardStack } from "@/components/motion/StickyCardStack";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { createMetadata } from "@/lib/seo";
import { MotionFeatures } from "@/components/motion/MotionFeatures";

export const metadata = createMetadata({
  label: "Motion Playground",
  path: "/playground/motion",
  h1: "Motion Playground",
  title: "Motion Playground",
  description: "Temporary motion primitive development route.",
  schema: ["WebPage"],
});

const cards = [
  { title: "Inspect", body: "Document rooflines, openings, drainage, and insulation needs." },
  { title: "Scope", body: "Translate findings into a focused exterior remodeling plan." },
  { title: "Install", body: "Coordinate materials, crews, cleanup, and closeout details." },
];

export default function MotionPlaygroundPage() {
  return (
    <MotionFeatures>
      <main id="main-content" className="mx-auto w-full max-w-6xl px-6 py-28">
        <section className="grid gap-10">
          <div data-testid="mask-reveal-demo">
            <MaskReveal>
              <p className="text-xl font-semibold">Masked reveal content for section entrances.</p>
            </MaskReveal>
          </div>

          <div data-testid="split-heading-demo">
            <SplitHeading
              className="text-4xl font-semibold tracking-tight"
              text="Exterior remodeling motion primitives"
            />
          </div>

          <div data-testid="parallax-demo">
            <ParallaxLayer>
              <div className="rounded-card bg-card p-8 shadow-sm">Parallax layer demo</div>
            </ParallaxLayer>
          </div>

          <div data-testid="sticky-card-stack-demo">
            <StickyCardStack>
              {cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
                </article>
              ))}
            </StickyCardStack>
          </div>

          <div data-testid="horizontal-scroll-pin-demo">
            <HorizontalScrollPin>
              {cards.map((card) => (
                <article className="w-72 rounded-card border bg-card p-6" key={card.title}>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
                </article>
              ))}
            </HorizontalScrollPin>
          </div>

          <div data-testid="velocity-marquee-demo">
            <VelocityMarquee baseVelocity={2}>
              {["Roofing", "Windows", "Siding", "Gutters", "Doors"].map((item) => (
                <span
                  className="rounded-pill border border-border bg-card px-4 py-2 text-sm mx-2"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </VelocityMarquee>
          </div>

          <div data-testid="magnetic-cta-demo">
            <MagneticCTA>
              <Button size="lg" variant="gold">
                Magnetic CTA
              </Button>
            </MagneticCTA>
          </div>

          <div className="text-5xl font-semibold" data-testid="number-scrub-demo">
            <NumberScrub suffix="+" value={27} />
          </div>

          <div data-testid="hover-distortion-demo">
            <HoverDistortion className="bg-brand-charcoal p-8 text-brand-cream">
              <p className="text-2xl font-semibold">Hover distortion WebGL boundary</p>
            </HoverDistortion>
          </div>
        </section>
      </main>
    </MotionFeatures>
  );
}
