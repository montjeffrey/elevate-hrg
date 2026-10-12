"use client";

import { useMotionTier } from "@/components/motion/useMotionTier";

export function MotionTierLabel() {
  const tier = useMotionTier();

  return (
    <p className="mb-8 text-sm font-semibold text-brand-gold-deep" data-testid="motion-tier-label">
      Motion tier: {tier}
    </p>
  );
}
