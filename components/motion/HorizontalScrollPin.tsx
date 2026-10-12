"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

/**
 * HorizontalScrollPin
 *
 * On `full` tier (desktop, hover-capable, no reduced-motion):
 *   - The outer section is pinned in place while the user scrolls.
 *   - An inner flex track translates horizontally, driven by ScrollTrigger scrub.
 *   - Scroll distance = totalTrackWidth − viewportWidth.
 *
 * On `mobile` tier: normal vertical stack, no pin.
 * On `minimal` tier: normal vertical stack with data-motion-disabled.
 */
export function HorizontalScrollPin({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const tier = useMotionTier();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier !== "full") return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !sectionRef.current || !trackRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const getScrollDistance = () => track.scrollWidth - section.offsetWidth;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      // The dynamic GSAP import may resolve after the section has already
      // scrolled into the trigger range. Force ScrollTrigger to re-measure
      // and reapply progress against the current scroll position.
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier]);

  // Minimal: plain vertical stack, no animation
  if (tier === "minimal") {
    return (
      <div className={cn("flex flex-col gap-8", className)} data-motion-disabled="true">
        {children}
      </div>
    );
  }

  // Mobile: plain vertical stack
  if (tier === "mobile") {
    return <div className={cn("flex flex-col gap-8", className)}>{children}</div>;
  }

  // Full: GSAP-pinned horizontal scroll
  return (
    <div ref={sectionRef} className={cn("relative overflow-hidden bg-white", className)}>
      <div
        ref={trackRef}
        className="flex gap-8 will-change-transform"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}
