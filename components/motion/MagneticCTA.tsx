"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

/**
 * Magnetic hover, motion-free. The cursor-follow is a direct transform set on
 * pointer move plus a CSS transition for the ease-back — visually equivalent to
 * the previous spring, without importing the motion library. The effect only
 * runs on the full (desktop, fine-pointer) tier; touch never fires mousemove, so
 * mobile is a plain static wrapper.
 */
export function MagneticCTA({ children }: { children: ReactNode }) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (tier !== "full" || !el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  if (tier === "minimal") {
    return <div data-motion-disabled="true">{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={{
        transition: "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
