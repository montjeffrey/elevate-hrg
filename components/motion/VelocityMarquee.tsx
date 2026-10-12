"use client";

import { m } from "motion/react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

export function VelocityMarquee({
  children,
  className,
  baseVelocity = 1,
  direction = "left",
  trackTestId,
}: {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  direction?: "left" | "right";
  trackTestId?: string;
}) {
  const tier = useMotionTier();

  if (tier === "minimal") {
    return (
      <div
        className={cn("flex flex-wrap gap-3 overflow-hidden", className)}
        data-motion-disabled="true"
      >
        {children}
      </div>
    );
  }

  const duration = tier === "mobile" ? 30 / baseVelocity : 18 / baseVelocity;

  return (
    <div className={cn("overflow-hidden", className)}>
      <m.div
        animate={{ x: direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"] }}
        className="flex w-max"
        data-testid={trackTestId}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="flex w-max justify-around items-center shrink-0">{children}</div>
        <div className="flex w-max justify-around items-center shrink-0">{children}</div>
      </m.div>
    </div>
  );
}
