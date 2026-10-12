"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useMotionTier } from "@/components/motion/useMotionTier";

export function HomeImageStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    tier === "minimal" ? ["0%", "0%"] : ["-3%", "3%"]
  );

  return (
    <section className="bg-brand-cream pb-24 sm:pb-32">
      <div
        ref={sectionRef}
        className="relative h-[280px] w-full overflow-hidden bg-brand-charcoal/10 sm:h-[380px] lg:h-[520px]"
      >
        <m.div className="absolute inset-x-0 -top-[10%] -bottom-[10%]" style={{ y }}>
          <Image
            src="/brand/Dark-gray-home-exterior-color-palette-DJI_0181-2880x1920-1-1536x1024.jpg"
            alt="Dark gray remodeled home exterior with updated roof, siding, and windows"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </m.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/35 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />
      </div>
    </section>
  );
}
