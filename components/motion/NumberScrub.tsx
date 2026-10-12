"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

export function NumberScrub({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();
  const [displayValue, setDisplayValue] = useState(0);
  const renderedValue = tier === "minimal" ? value : displayValue;

  useEffect(() => {
    if (tier === "minimal") {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      const start = performance.now();
      const duration = tier === "mobile" ? 650 : 1000;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplayValue(Math.round(value * progress));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.disconnect();
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [tier, value]);

  return (
    <span data-motion-disabled={tier === "minimal" ? "true" : undefined} ref={ref}>
      {renderedValue.toLocaleString()}
      {suffix}
    </span>
  );
}
