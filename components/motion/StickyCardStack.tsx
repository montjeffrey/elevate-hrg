"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

/**
 * Sticky card stack — the homepage's signature scroll moment.
 *
 * On `full` motion tier (desktop, no reduced-motion), each child is wrapped
 * in a sticky container. As the user scrolls, each card sticks beneath the
 * header, and the previous card scrubs slightly back (scale + yPercent + alpha)
 * to give a layered material-sample feel.
 *
 * On `mobile` and `minimal` tiers, falls back to a normal grid.
 */
export function StickyCardStack({
  children,
  className,
  stickyItemClassName,
}: {
  children: ReactNode;
  className?: string;
  stickyItemClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const items = Children.toArray(children);

  useEffect(() => {
    if (tier !== "full" || !containerRef.current) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = containerRef.current!.querySelectorAll<HTMLElement>("[data-stack-card]");
        const tail = containerRef.current!.querySelector<HTMLElement>("[data-stack-card-tail]");

        cards.forEach((card, index) => {
          const isLast = index === cards.length - 1;
          const trigger = isLast ? tail : cards[index + 1];
          if (!trigger) return;

          const inner = card.querySelector<HTMLElement>("[data-stack-card-inner]");
          if (!inner) return;

          gsap.set(inner, { transformOrigin: "50% 0%" });

          gsap.to(inner, {
            scale: 0.92,
            yPercent: -2,
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "top center",
              scrub: 0.6,
            },
          });
        });
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, items.length]);

  if (tier !== "full") {
    return <div className={cn("grid grid-cols-1 gap-6 sm:gap-8", className)}>{items}</div>;
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {items.map((child, index) => (
        <div
          key={index}
          data-stack-card
          className={cn("sticky top-28 mb-[18vh]", stickyItemClassName)}
          style={{ zIndex: index + 1 }}
        >
          <div data-stack-card-inner className="will-change-transform">
            {child}
          </div>
        </div>
      ))}
      <div data-stack-card-tail aria-hidden="true" className="h-[60vh]" />
    </div>
  );
}
