"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

/**
 * Motion-free reveal. The visual treatment lives in globals.css, keyed off the
 * pre-paint `html[data-motion]` attribute:
 *   - mobile  → CSS rise-in on mount (no JS, no IntersectionObserver)
 *   - minimal → CSS fade-in (reduced-motion users get instant content)
 *   - full    → clip-path wipe that this component triggers via `data-revealed`
 *               when the element scrolls into view (immediately if already in
 *               the initial viewport, so above-the-fold content wipes in on load)
 *
 * No `motion`/framer import — this primitive no longer ships the motion library
 * onto the critical path. Desktop keeps the exact clip-path wipe (same easing
 * and duration as the previous motion implementation).
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Mobile/minimal reveal entirely via CSS on mount — nothing to do here.
    if (tier !== "full") return;

    const el = ref.current;
    if (!el) return;

    const tryReveal = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        setRevealed(true);
        return true;
      }
      return false;
    };

    // Reveal immediately if already in view (above the fold), else on scroll.
    if (tryReveal()) return;

    const onScroll = () => {
      if (tryReveal()) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tier]);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-revealed={revealed ? "" : undefined}
      data-mobile-reveal={tier === "mobile" || tier === "minimal" ? "true" : undefined}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
