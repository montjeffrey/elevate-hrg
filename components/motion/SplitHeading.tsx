"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

type Stagger = "lines" | "chars" | "words";

type AsTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

const defaultTypography: Record<AsTag, string> = {
  h1: "font-display font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl",
  h2: "font-display font-semibold tracking-tight leading-tight text-3xl md:text-5xl",
  h3: "font-display font-semibold tracking-tight text-xl md:text-2xl",
  h4: "font-display font-semibold text-lg md:text-xl",
  h5: "font-display font-semibold text-base md:text-lg",
  h6: "font-display font-medium text-base",
  p: "",
  span: "",
  div: "",
};

/**
 * Heading reveal. The base render is plain server-rendered text — NO motion
 * library import. On mobile/minimal the entrance is pure CSS (globals.css, keyed
 * off the pre-paint html[data-motion] attribute via `data-reveal-text`). On the
 * full (desktop) tier the GSAP SplitText per-line stagger is layered on after
 * mount, fetched only on that tier (so the GSAP chunk never loads on mobile).
 */
export function SplitHeading({
  text,
  className,
  as = "h2",
  stagger = "lines",
  prerendered = false,
}: {
  text: string;
  className?: string;
  as?: AsTag;
  stagger?: Stagger;
  /**
   * Render the heading at its final state with no entrance enhancement. Use for
   * headings that sit behind an opaque overlay on load.
   */
  prerendered?: boolean;
}) {
  const tier = useMotionTier();
  const ref = useRef<HTMLElement | null>(null);
  // Gate the GSAP enhancement until after mount so the tier has settled to its
  // real client value — prevents the GSAP/SplitText chunk from being fetched on
  // mobile during the SSR("full")→hydrate→correct window.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!ready || prerendered || tier !== "full") return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let scrollHandler: (() => void) | undefined;

    const enhance = async () => {
      const [{ default: gsap }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/SplitText"),
      ]);
      if (cancelled || !el) return;
      gsap.registerPlugin(SplitText);

      const ctx = gsap.context(() => {
        const run = () => {
          if (cancelled || !el) return;
          const split = new SplitText(el, {
            type:
              stagger === "chars" ? "chars,words,lines" : stagger === "lines" ? "lines" : "words",
            linesClass: "split-line overflow-hidden pb-[0.18em]",
          });
          const targets =
            stagger === "lines" ? split.lines : stagger === "chars" ? split.chars : split.words;
          gsap.set(targets, { yPercent: 110, opacity: 0 });
          gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: stagger === "chars" ? 0.018 : 0.06,
          });
        };
        // Wait for fonts so SplitText measures correctly — prevents reflow flash.
        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(run);
        } else {
          run();
        }
      }, el);
      cleanup = () => ctx.revert();
    };

    const inView = () => el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (inView()) {
      enhance();
    } else {
      scrollHandler = () => {
        if (inView()) {
          if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
          enhance();
        }
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
    }

    return () => {
      cancelled = true;
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      cleanup?.();
    };
  }, [ready, tier, stagger, text, prerendered]);

  // Mobile/minimal entrance is pure CSS (data-reveal-text); full tier uses the
  // GSAP effect above. Built inline so we never mutate a props object holding `ref`.
  const revealAttrs = prerendered
    ? {}
    : {
        "data-reveal-text": "",
        ...(tier === "mobile" || tier === "minimal" ? { "data-mobile-reveal": "true" } : {}),
      };

  return createElement(
    as,
    // eslint-disable-next-line react-hooks/refs -- `as` is restricted to intrinsic heading/text tags.
    { ref, className: cn(defaultTypography[as], className), ...revealAttrs },
    text
  );
}
