"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

/**
 * Global tier wrapper. Exposes the resolved motion tier on a data attribute
 * (plus an sr-only label consumed by e2e tests). It deliberately does NOT load
 * the motion library — that lives in `MotionFeatures`, included only by routes
 * that animate — so motion stays off the critical path for service pages and
 * every other route.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const tier = useMotionTier();
  const syncedOnce = useRef(false);

  // Keep html[data-motion] (the attribute the CSS reveal rules key off) in sync
  // with the live tier when it CHANGES after load — viewport crossing 1024px,
  // rotation, pointer/reduced-motion change — so a [data-reveal] element can
  // never be stranded clipped/invisible after a media-query flip. The initial
  // value is owned by the pre-paint inline script in the root layout; we skip
  // the first run here so that correct, flash-free value is never disturbed on
  // load (the first post-hydration render can briefly carry the SSR tier).
  useEffect(() => {
    if (!syncedOnce.current) {
      syncedOnce.current = true;
      return;
    }
    document.documentElement.setAttribute("data-motion", tier);
  }, [tier]);

  return (
    <div data-motion-tier={tier}>
      <span data-testid="motion-tier-label" className="sr-only">
        {tier}
      </span>
      {children}
    </div>
  );
}
