"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { siteConfig } from "@/lib/site-config";

export function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopLabelRef = useRef<HTMLParagraphElement>(null);
  const desktopBadgesRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  // Synchronously render the FROM state inline so it survives SSR/hydration,
  // matrix-readable via getComputedStyle().transform, and is in place BEFORE
  // the dynamic gsap chunk resolves. Tailwind v4 emits the modern `translate`
  // CSS property for `translate-y-*`, which would NOT show up in
  // getComputedStyle(...).transform — using inline `transform` keeps the test
  // and GSAP reading the same source of truth.
  const badgeFromStyle: CSSProperties | undefined =
    tier === "full"
      ? { transform: "translateY(36px)", opacity: 0.46, willChange: "transform, opacity" }
      : undefined;
  const labelFromStyle: CSSProperties | undefined =
    tier === "full"
      ? { transform: "translateY(18px)", opacity: 0.5, willChange: "transform, opacity" }
      : undefined;

  useEffect(() => {
    if (!sectionRef.current || tier === "minimal") return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const labelEl = desktopLabelRef.current;
    const badgesContainer = desktopBadgesRef.current;

    // For non-`full` desktop tiers (e.g. tablet "mobile" tier showing the
    // desktop layout between md and lg), the React render path did not apply
    // inline FROM styles, so there is nothing to clear. For `full`, GSAP's
    // immediateRender will rewrite the same values and then animate to TO.
    if (tier !== "full") {
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (!badgesContainer) return;
        const badges = gsap.utils.toArray<HTMLElement>(badgesContainer.children);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            // `top 82%` keeps the entrance below the splash-handoff and
            // above the fold once the user has begun scrolling.
            start: "top 82%",
            once: true,
            toggleActions: "play none none none",
          },
        });

        timeline
          .fromTo(
            labelEl,
            { autoAlpha: 0.5, y: 18 },
            {
              autoAlpha: 1,
              clearProps: "transform,opacity,visibility,willChange",
              duration: 0.55,
              ease: "power3.out",
              immediateRender: true,
              y: 0,
            },
            0
          )
          .fromTo(
            badges,
            { autoAlpha: 0.46, scale: 0.97, y: 36 },
            {
              autoAlpha: 1,
              clearProps: "transform,opacity,visibility,willChange",
              duration: 0.65,
              ease: "power3.out",
              immediateRender: true,
              scale: 1,
              stagger: 0.07,
              y: 0,
            },
            0.04
          );

        // Refresh after the trigger is wired up so ScrollTrigger recalculates
        // positions with the current scrollY. Without this, when the dynamic
        // gsap chunk arrives AFTER the user already scrolled the section into
        // view, ScrollTrigger could miss the entry and the timeline would
        // never play.
        ScrollTrigger.refresh();
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 overflow-hidden bg-brand-sandstone py-10 text-brand-charcoal"
    >
      {/* Desktop: label + badges share one container so they align on the same axis */}
      <div className="hidden md:block mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <p
          ref={desktopLabelRef}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-brand-espresso md:text-sm"
          style={labelFromStyle}
        >
          TRUSTED BY HOMEOWNERS. CERTIFIED BY THE BRANDS WE INSTALL.
        </p>
        <div
          ref={desktopBadgesRef}
          className="flex items-center justify-center gap-10 will-change-transform lg:gap-16"
        >
          <div
            className="flex items-center gap-2 text-base font-bold shrink-0"
            style={badgeFromStyle}
          >
            <span className="text-brand-gold-deep text-xl">★</span>
            <span>{siteConfig.avgRating} on Google</span>
          </div>
          <Image
            src="/certifications/gaf-certified-plus-logo.png"
            alt="GAF Certified installer"
            width={110}
            height={110}
            className="object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 shrink-0"
            style={badgeFromStyle}
          />
          <Image
            src="/brand/provia-logo.jpg"
            alt="ProVia"
            width={110}
            height={39}
            className="object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 mix-blend-multiply shrink-0"
            style={badgeFromStyle}
          />
          <Image
            src="/certifications/bbb-accredited.png"
            alt="BBB Accredited"
            width={90}
            height={90}
            className="object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 mix-blend-multiply shrink-0"
            style={badgeFromStyle}
          />
          <Image
            src="/brand/New_VOB_Logo_750-1.png"
            alt="Veteran-Owned Business"
            title="Veteran-Owned Business"
            width={84}
            height={34}
            className="object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 shrink-0"
            style={badgeFromStyle}
          />
        </div>
      </div>

      {/* Mobile: label above the marquee, same padding as the section */}
      <div className="block will-change-transform md:hidden">
        <p className="mb-6 px-6 text-center text-xs font-semibold uppercase tracking-[0.15em] text-brand-espresso">
          TRUSTED BY HOMEOWNERS. CERTIFIED BY THE BRANDS WE INSTALL.
        </p>
        <div className="will-change-transform">
          <VelocityMarquee baseVelocity={1} direction="right" trackTestId="trust-mobile-emblems">
            <div className="flex items-center gap-14 px-8">
              <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                <span className="text-brand-gold-deep text-lg">★</span>
                <span>{siteConfig.avgRating} on Google</span>
              </div>
              <Image
                src="/certifications/gaf-certified-plus-logo.png"
                alt="GAF Certified installer"
                width={90}
                height={90}
                className="object-contain opacity-80 shrink-0"
              />
              <Image
                src="/brand/provia-logo.jpg"
                alt="ProVia"
                width={90}
                height={32}
                className="object-contain opacity-80 mix-blend-multiply shrink-0"
              />
              <Image
                src="/certifications/bbb-accredited.png"
                alt="BBB Accredited"
                width={72}
                height={72}
                className="object-contain opacity-80 mix-blend-multiply shrink-0"
              />
              <Image
                src="/brand/New_VOB_Logo_750-1.png"
                alt="Veteran-Owned Business"
                title="Veteran-Owned Business"
                width={70}
                height={28}
                className="object-contain opacity-80 shrink-0"
              />
            </div>
          </VelocityMarquee>
        </div>
      </div>
    </section>
  );
}
