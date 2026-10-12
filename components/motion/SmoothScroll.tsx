"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

// Lenis + GSAP are dynamically imported inside the effect below so neither
// library lands in the initial shared first-load chunk. They're only fetched
// once the motion tier resolves to `'full'` after hydration.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const tier = useMotionTier();
  // Gate until after mount so the tier has settled to its real client value;
  // prevents lenis/GSAP from being fetched on mobile during the
  // SSR("full")→hydrate→correct window.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!ready || tier !== "full") return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, gsapModule, scrollTriggerModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const gsap = gsapModule.default ?? gsapModule.gsap;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
      });

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const update = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(update);
        lenis.off("scroll", onScroll);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ready, tier]);

  return <>{children}</>;
}
