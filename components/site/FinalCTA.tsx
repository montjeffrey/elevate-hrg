import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { siteConfig } from "@/lib/site-config";

export function FinalCTA() {
  return (
    <section
      className="relative bg-brand-charcoal text-white py-24 sm:py-32 overflow-hidden"
      data-testid="final-cta-section"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold-deep/20 via-brand-charcoal to-brand-charcoal opacity-70 pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-8 text-center max-w-4xl">
        <SplitHeading as="h2" text="Ready to elevate your home? Let's talk." />

        <MaskReveal delay={0.1}>
          <p className="mt-6 text-xl md:text-2xl leading-relaxed text-white/80 font-light mb-12">
            Free consultations. Honest estimates. Same-business-day call-back on every request.
          </p>
        </MaskReveal>

        <MaskReveal
          delay={0.2}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <MagneticCTA>
            <Link
              href="/quote"
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-brand-gold-deep px-8 text-base font-medium text-brand-charcoal shadow-sm transition-colors hover:bg-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
            >
              Schedule a Free Estimate
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </MagneticCTA>

          <Link
            href={siteConfig.phoneTel}
            className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full border-2 border-white/20 px-8 text-base font-medium text-white transition-colors hover:bg-white/10 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
          >
            <Phone className="mr-2 h-5 w-5" />
            Or call {siteConfig.phone}
          </Link>
        </MaskReveal>

        <MaskReveal delay={0.3}>
          <p className="mt-8 text-sm text-white/60">
            Veteran-owned &middot; NaVOBA certified &middot; NJ HIC #{siteConfig.licenseNumber}{" "}
            &middot; BBB Accredited &middot; GAF Certified Plus
          </p>
        </MaskReveal>
      </div>
    </section>
  );
}
