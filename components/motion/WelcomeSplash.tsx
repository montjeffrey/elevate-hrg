// Server component — intentionally no "use client".
//
// The welcome splash is a pure CSS animation (see `.welcome-splash` in
// globals.css): the Elevate emblem "loads" with a breathing gold glow, then the
// doors swing open in 3D and cross-fade into the hero. It is rendered as static
// markup and every phase runs via CSS keyframes that start at first paint, so
// the reveal NEVER waits for React hydration. This is critical for Core Web
// Vitals: the hero <h1> is the LCP element, and when the splash was driven by
// motion/react it pinned LCP to JS hydration (~7s on slow connections).
// CSS-driven, the hero paints at first paint and LCP tracks it regardless of
// how long the intro plays.
//
// The intro plays on EVERY full page load (owner decision — it is the brand
// moment). A tiny inline script in app/layout.tsx pre-paint-hides it only for
// `?intro=skip` (Lighthouse CI's content-path audits) and the e2e suppression
// key, and otherwise holds the choreography paused until the first frame has
// actually been presented (`.splash-wait`) so the full sequence is always
// seen, even on slow devices. Client-side navigations never replay it because
// the document doesn't reload.

const LOGO_SIZES = "(min-width: 768px) 14rem, (min-width: 640px) 12rem, 10rem";

function DoorLogo() {
  return (
    <span className="welcome-splash-logo">
      {/* Breathing gold glow behind the emblem — the "loading" pulse. Each door
          clips it at the seam, so the two halves read as one centered glow. */}
      <span className="welcome-splash-glow" aria-hidden="true" />
      {/* Plain <img>: the SVG is already optimized and must paint immediately
          without going through the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/elevate-hrg-logo.svg"
        alt=""
        width={224}
        height={209}
        sizes={LOGO_SIZES}
        draggable={false}
      />
    </span>
  );
}

export function WelcomeSplash() {
  return (
    <div className="welcome-splash" aria-hidden="true">
      {/* The scene the doors reveal: the hero's opening frame, washed to match
          HeroHome and slowly drifting so it reads as already in motion. Sits
          behind the doors and cross-fades into the live hero on unmount — the
          poster IS the video's first frame, so the handoff is seamless. */}
      <div className="welcome-splash-scene" />
      <div className="welcome-splash-door welcome-splash-door-left">
        <DoorLogo />
      </div>
      <div className="welcome-splash-door welcome-splash-door-right">
        <DoorLogo />
      </div>
      <span className="welcome-splash-seam" />
    </div>
  );
}
