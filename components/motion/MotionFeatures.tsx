"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads the motion (framer) animation features for a subtree. Wrap any page that
 * renders `m.*` elements in this. Kept OUT of the global layout on purpose, so
 * the motion library only ships on routes that actually animate (home,
 * /our-process, the motion playground). Service pages and every other route —
 * which use only the now motion-free reveal primitives — stay off the motion
 * critical path entirely.
 */
export function MotionFeatures({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
