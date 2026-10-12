"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

export function ParallaxLayer({ children, rate = -10 }: { children: ReactNode; rate?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mobileRate = Math.max(Math.min(rate, 4), -4);
  const y = useTransform(scrollYProgress, [0, 1], [`${-rate}%`, `${rate}%`]);
  const yMobile = useTransform(scrollYProgress, [0, 1], [`${-mobileRate}%`, `${mobileRate}%`]);

  if (tier === "minimal") return <div data-motion-disabled="true">{children}</div>;

  return (
    <m.div ref={ref} style={{ y: tier === "mobile" ? yMobile : y }}>
      {children}
    </m.div>
  );
}
