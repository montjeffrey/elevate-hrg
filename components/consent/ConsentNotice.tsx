"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type ConsentNoticeProps = {
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onManagePreferences: () => void;
};

/**
 * The cookie notice bar. Passive and non-modal by design: deliberately NOT
 * `role="dialog"`, NOT `aria-modal`, and with no focus trap. Under the
 * opt-out posture (see DEFAULT_POSTURE in lib/consent.ts) it is informational
 * and must never block the visitor's task, so it also never steals focus on
 * mount — a bottom bar that grabs focus mid-read is itself an a11y defect and
 * would break the keyboard flows tests/e2e/accessibility.spec.ts asserts.
 *
 * ZERO-CLS CONTRACT — do not break this:
 * - The bar is `position: fixed`, so it is out of flow and cannot shift
 *   in-flow content.
 * - Its entry animation is `opacity` + `translateY` ONLY (see the
 *   `.consent-notice` rules in app/globals.css). NEVER animate or transition
 *   `bottom`, `top`, `height`, `margin`, or `padding` on this element: moving
 *   a fixed element via a positional property DOES generate layout-shift
 *   entries, whereas moving it via `transform` does not. CLS ≤ 0.1 is a CI
 *   error on all nine Lighthouse URLs.
 * - The measured height is published to `--consent-notice-h` and
 *   `<html data-consent-notice="open">` is set, so the sticky mobile CTA can
 *   slide clear with a transform (again: transform, never `bottom`).
 *
 * Every control is `min-h-11 min-w-11` (44px) with `gap-3` between siblings.
 * The `target-size` Lighthouse audit is asserted at minScore 1 — one 40px
 * control fails the build.
 */
export function ConsentNotice({
  onAcceptAll,
  onRejectNonEssential,
  onManagePreferences,
}: ConsentNoticeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    const root = document.documentElement;
    if (!node) return;

    root.setAttribute("data-consent-notice", "open");

    const publishHeight = () => {
      root.style.setProperty("--consent-notice-h", `${Math.round(node.offsetHeight)}px`);
    };

    publishHeight();

    const observer = new ResizeObserver(publishHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
      root.removeAttribute("data-consent-notice");
      root.style.removeProperty("--consent-notice-h");
    };
  }, []);

  return (
    <section
      ref={ref}
      role="region"
      aria-label="Cookie notice"
      data-testid="consent-notice"
      className="consent-notice fixed inset-x-0 bottom-0 z-[60] border-t border-brand-cream/15 bg-brand-charcoal text-brand-cream shadow-2xl"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 pt-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Kept deliberately short. A text-bearing fixed bar entering the
            viewport is technically an LCP candidate, and on a 390x844 mobile
            audit every extra line of copy is another 3% of the viewport. The
            full detail lives in the preferences panel and /privacy. */}
        <p className="max-w-2xl text-[13px] leading-5 text-brand-cream/85 sm:text-sm sm:leading-6">
          We use cookies to run this site and measure how it is used.{" "}
          <strong className="font-semibold text-brand-cream">Analytics is on</strong> by default;{" "}
          <strong className="font-semibold text-brand-cream">advertising is off</strong>.{" "}
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center font-semibold text-brand-gold underline underline-offset-4 transition-colors hover:text-brand-cream"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
          <button
            type="button"
            onClick={onAcceptAll}
            className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg bg-brand-gold-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-deep/90 lg:flex-none"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={onRejectNonEssential}
            className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg bg-brand-gold-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-deep/90 lg:flex-none"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={onManagePreferences}
            className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg border border-brand-cream/40 px-5 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-cream/10 lg:flex-none"
          >
            Manage preferences
          </button>
        </div>
      </div>
    </section>
  );
}
