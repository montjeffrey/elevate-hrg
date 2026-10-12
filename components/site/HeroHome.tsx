"use client";

import { m, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useRef, useEffect } from "react";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { siteConfig } from "@/lib/site-config";

// The welcome splash plays on every full page load (see WelcomeSplash), so the
// hero heading is always pre-rendered at its final state — it must already be
// there the instant the doors open (the splash overlay otherwise blocks the
// IntersectionObserver inside SplitHeading's whileInView until reveal). The
// session-flag machinery that used to toggle this went away with the
// once-per-session gate.
const HERO_PRERENDERED = true;

// Pre-hydration hero-video bootstrap.
//
// Runs as an inline <script> placed immediately after the <video>, so it
// executes during HTML parse — before the React bundle has even downloaded.
// That matters on cellular: the previous version started the fetch from a
// useEffect, so nothing moved until the motion-heavy homepage had finished
// hydrating (seconds on LTE) and the hero sat as a still poster until then.
//
// It also owns rendition selection and the failure chain:
//   • Reduced motion is still the one opt-out, and it costs zero bytes —
//     `preload="none"` plus no `autoplay` means nothing is fetched until `src`
//     is assigned below, so bailing here downloads nothing at all.
//   • Coarse pointer (not a width breakpoint) picks the phone renditions. The
//     old `max-width: 767px` test missed landscape phones entirely — iPhone 12
//     landscape is 844px, Pixel 5 is 851px — so rotating a phone pulled the
//     3.3–4.6 MB desktop file over cellular.
//   • Assigning `src` bypasses <source> negotiation, which removes the
//     browser's built-in fallback. We rebuild it explicitly: undecodable types
//     are dropped up front via canPlayType, and an `error` listener walks to
//     the next candidate, so a stalled or broken rendition on flaky cellular
//     degrades to the next one instead of leaving the poster up forever.
const HERO_VIDEO_BOOTSTRAP = `(function(){
var v=document.querySelector('video[data-hero-video]');
if(!v)return;
try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;}catch(e){}
var coarse=false;
try{coarse=matchMedia('(pointer: coarse)').matches||matchMedia('(max-width: 1023px)').matches;}catch(e){}
var chain=coarse
?[['/brand/hero-loop.mobile.av1.webm','video/webm; codecs="av01.0.05M.08"'],['/brand/hero-loop.mobile.mp4','video/mp4']]
:[['/brand/hero-loop.av1.webm','video/webm; codecs="av01.0.08M.08"'],['/brand/hero-loop.vp9.webm','video/webm; codecs="vp9"'],['/brand/hero-loop.mp4','video/mp4']];
chain=chain.filter(function(c){try{return v.canPlayType(c[1])!=='';}catch(e){return true;}});
if(!chain.length)return;
var i=0;
function go(){v.src=chain[i][0];v.load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
v.addEventListener('error',function(){if(i<chain.length-1){i++;go();}});
go();
})();`;

export function HeroHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.defaultMuted = true;
    v.muted = true;
    v.volume = 0;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    // Reduced-motion is the only opt-out (an explicit OS-level accessibility
    // preference): keep the AVIF poster — the loop's first frame — in place and
    // never fetch the video. Everyone else always gets the moving hero; the
    // poster covers the gap until enough of the file has buffered.
    //
    // Source selection and the initial play() already happened pre-hydration in
    // HERO_VIDEO_BOOTSTRAP, so this effect only keeps playback alive. It must
    // not touch `src` — reassigning it here would restart the download that is
    // already in flight.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const resume = () => {
      void v.play().catch(() => {});
    };
    const onVisibility = () => {
      if (!document.hidden) resume();
    };
    // iOS Low Power Mode refuses muted autoplay outright, and the rejection is
    // indistinguishable from any other play() failure — the hero would just sit
    // on its poster forever. The first real user gesture lifts that block, so
    // take one shot at resuming there. Passive + once: no scroll cost, and it
    // is a no-op when playback is already running.
    const onFirstGesture = () => resume();

    resume();
    v.addEventListener("pause", resume);
    v.addEventListener("loadeddata", resume);
    v.addEventListener("canplay", resume);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });

    return () => {
      v.removeEventListener("pause", resume);
      v.removeEventListener("loadeddata", resume);
      v.removeEventListener("canplay", resume);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("pointerdown", onFirstGesture);
    };
  }, []);

  const tier = useMotionTier();
  const shingleMotionEnabled = tier !== "minimal";
  const heroPrerendered = HERO_PRERENDERED;

  // Scroll progress for mobile parallax — always call hooks unconditionally.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Subtle drift on mobile tier; zero on full and minimal.
  const mobileBgY = useTransform(
    scrollYProgress,
    [0, 1],
    tier === "mobile" ? ["0%", "-6%"] : ["0%", "0%"]
  );
  // Foreground text drifts up slightly faster than the background — creates a
  // gentle depth/parallax feel on mobile. Disabled on full and minimal.
  const mobileTextY = useTransform(
    scrollYProgress,
    [0, 1],
    tier === "mobile" ? ["0%", "-12%"] : ["0%", "0%"]
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[max(100dvh,700px)] flex-col items-center justify-start overflow-hidden bg-brand-charcoal pt-[calc(5rem+0.875rem)] pb-10 sm:pt-[calc(5rem+1rem)] md:pt-[calc(5rem+1.5rem)] short:pt-[4.5rem]! lg:pt-[calc(5rem+1.25rem)] lg:pb-0 2xl:pt-20"
    >
      {/*
        Background video layer — static on full/minimal, gentle motion-scroll
        parallax on mobile tier.
      */}
      <m.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={tier === "mobile" ? { y: mobileBgY } : undefined}
      >
        {/*
          No <source> children: HERO_VIDEO_BOOTSTRAP below assigns `src`
          directly so it can pick a rendition by pointer type and walk its own
          fallback chain on error. Phones get 720p AV1 (~0.9 MB) or 540p H.264
          (~2.4 MB); desktop gets 1080p AV1 (~3.3 MB) → VP9 (~4.2 MB) → H.264
          (~4.6 MB). All are silent, 24 fps, and the dark hero overlay plus
          gradient washes hide the compression. `preload="none"` with no
          `autoplay` guarantees zero bytes move until the script chooses.
        */}
        <video
          ref={videoRef}
          data-hero-video
          data-testid="hero-video"
          className="h-full w-full object-cover object-center pointer-events-none"
          loop
          muted
          playsInline
          preload="none"
          poster="/brand/hero-loop-poster.avif"
          disablePictureInPicture
          aria-hidden
          // HERO_VIDEO_BOOTSTRAP assigns `src` via an inline script that runs
          // during HTML parsing, before React hydrates — so the live DOM's
          // `src` legitimately differs from what was server-rendered. That's
          // the intended pre-hydration fetch kickoff, not a real mismatch.
          suppressHydrationWarning
        />
        <script dangerouslySetInnerHTML={{ __html: HERO_VIDEO_BOOTSTRAP }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(207,163,123,0.12),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(185,130,63,0.18),_transparent_60%)]" />
      </m.div>

      {/* Roof shingle scale pattern - CSS background-image for reliable cross-browser tiling. */}
      <div
        aria-hidden="true"
        className="hero-shingle-animation pointer-events-none absolute inset-[-10%] z-[15]"
        data-motion-disabled={shingleMotionEnabled ? undefined : "true"}
        data-motion-enabled={shingleMotionEnabled ? "true" : "false"}
        data-testid="hero-shingle-animation"
      />

      {/* Static base gradient — keeps text legible regardless of photo content. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-brand-charcoal/55 via-brand-charcoal/40 to-brand-charcoal/85" />

      <m.div
        className="relative z-20 w-full max-w-7xl px-6 text-center text-brand-cream md:px-10 lg:px-16"
        style={tier === "mobile" ? { y: mobileTextY } : undefined}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="relative mb-4 flex items-center justify-center md:mb-6 short:mb-3!">
            <div className="absolute h-24 w-24 rounded-full bg-brand-gold/30 blur-2xl sm:h-28 sm:w-28 md:h-32 md:w-32" />
            <Image
              src="/brand/elevate-hrg-logo.png"
              alt="Elevate Home Remodeling"
              width={220}
              height={220}
              className="relative h-20 w-auto drop-shadow-[0_0_36px_rgba(185,130,63,0.55)] sm:h-24 md:h-32"
              priority
            />
          </div>
          <div className="mb-6 flex flex-col items-center short:mb-3!">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold md:text-sm">
              The Premium Home Remodeling Company &middot; Wallington, NJ
            </span>
            <div className="mt-4 h-px w-12 bg-brand-gold short:mt-2!" />
          </div>

          <SplitHeading
            as="h1"
            stagger="lines"
            text="Premium Roofing, Siding, and Windows Built for New Jersey Weather."
            className="text-center font-display text-4xl font-semibold leading-[1.08] tracking-tight text-brand-cream sm:text-5xl md:text-6xl short:leading-[1.02]!"
            prerendered={heroPrerendered}
          />

          <p className="mt-5 text-base font-semibold tracking-wide text-brand-gold md:mt-6 md:text-lg short:mt-3!">
            Proudly Serving Homeowners Throughout New Jersey.
          </p>

          {/* On short laptop windows the long copy is the biggest height sink,
              so it clamps to a teaser there — keeping the logo + headline at
              full prominence — and shows in full once there's vertical room. */}
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-cream/90 md:mt-4 md:text-lg short:mt-2! short:line-clamp-2 shorter:mt-2! shorter:line-clamp-2">
            Veteran-owned, NaVOBA-certified exterior renovations — roofing, siding, windows,
            gutters, soffit, fascia, entry doors, and attic insulation. GAF Certified installer,
            ProVia CedarMax leading installer. Workmanship guarantee on every job.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-8 short:mt-4! shorter:mt-4!">
            <MagneticCTA>
              <Link
                href={siteConfig.quotePath}
                className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold px-8 font-medium text-brand-charcoal shadow-sm transition-colors hover:bg-brand-gold-deep hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
              >
                Schedule a Free Estimate
              </Link>
            </MagneticCTA>
            <a
              href={siteConfig.phoneTel}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 font-medium text-brand-cream transition-colors hover:bg-brand-sandstone/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
            >
              <Phone className="h-5 w-5 text-brand-gold" />
              <span>Or call {siteConfig.phone}</span>
            </a>
          </div>

          {/* Trust badges — wrap onto centered rows on phones (no clipped
              horizontal scroll); single nowrap line from md up. */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-medium tracking-wide text-brand-cream/80 sm:mt-6 md:mt-8 md:flex-nowrap md:gap-x-6 md:gap-y-0 md:text-sm lg:mt-6 short:mt-3! shorter:mt-3!">
            <span className="whitespace-nowrap">GAF Certified installer</span>
            <span className="hidden md:inline">&middot;</span>
            <span className="whitespace-nowrap">BBB Accredited</span>
            <span className="hidden md:inline">&middot;</span>
            <span className="whitespace-nowrap">Financing Available</span>
            <span className="hidden md:inline">&middot;</span>
            <span className="whitespace-nowrap">Veteran-Owned</span>
          </div>
        </div>
      </m.div>

      {/* Gold edge rule — static. */}
      <div className="absolute bottom-0 left-0 z-20 h-[2px] w-full bg-brand-gold" />
    </section>
  );
}
