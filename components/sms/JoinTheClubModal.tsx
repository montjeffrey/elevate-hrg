"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { MessageCircle, X } from "lucide-react";
import { submitSmsOptIn } from "@/lib/sms-actions";

const CONSENT_TEXT =
  "I agree to receive recurring marketing text messages from Elevate Home Remodeling at the number provided, sent by autodialer. Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply.";

const DISMISSED_KEY = "elevate-join-club-dismissed";

type Status = "idle" | "submitting" | "success" | "error";

export function JoinTheClubModal() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showTrigger, setShowTrigger] = useState(false);

  const phoneId = useId();
  const consentId = useId();

  // Show the trigger only once the page's hero section has scrolled fully
  // out of view — never competing with the hero headline/CTA for attention
  // in the first viewport — and hide it if the user has already
  // dismissed/joined this browser. Reads localStorage in an effect so SSR
  // markup (no trigger) matches the first client render.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // localStorage unavailable (private mode) — still show trigger.
    }
    if (dismissed) return;

    // Every route's <main id="main-content"> opens with a <section> hero
    // (HeroHome, the per-service heroes, the inline page heroes) — a plain
    // document-order query needs no per-page wiring. Pages with no hero
    // section (e.g. the 404 page) fall back to the old show-after-first-paint
    // behavior instead of never showing the trigger at all.
    const hero = document.querySelector("#main-content section");
    if (!hero) {
      const id = window.requestAnimationFrame(() => setShowTrigger(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(([entry]) => setShowTrigger(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  function persistDismissed() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  }

  function handleDecline() {
    setOpen(false);
    setShowTrigger(false);
    persistDismissed();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setStatus("error");
      setErrorMsg("Please check the box to agree before joining.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    const result = await submitSmsOptIn({
      phone,
      consent: true,
      consentText: CONSENT_TEXT,
    });

    if (result.ok) {
      setStatus("success");
      persistDismissed();
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }

  if (!showTrigger && !open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label="Join the Club"
            // Icon-only circular FAB on mobile so the trigger never floats over
            // hero copy or CTAs on narrow screens; expands to a labeled pill at
            // lg. bottom-24 on mobile clears the StickyMobileCTA bar (fixed
            // bottom-0, lg:hidden); drops back to bottom-5 on lg where that bar
            // is gone.
            className="fixed bottom-24 right-4 z-40 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-brand-gold-deep text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 lg:bottom-5 lg:right-5 lg:h-auto lg:w-auto lg:px-5 lg:py-3"
            data-cta-reveal
            // Hook for app/globals.css to hide this FAB while the cookie
            // notice is up (two floating prompts at once is bad UX). Attribute
            // only — no behavior change. Kept separate from `data-cta-reveal`,
            // which is a motion hook and must not be repurposed.
            data-club-trigger
          >
            <MessageCircle className="h-6 w-6 lg:h-4 lg:w-4" aria-hidden />
            <span className="hidden lg:inline">Join the Club</span>
          </button>
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-charcoal/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in motion-reduce:animate-none" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/50 bg-brand-cream p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 motion-reduce:animate-none sm:p-8">
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-brand-warm-gray transition-colors hover:bg-brand-charcoal/10 hover:text-brand-charcoal"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </Dialog.Close>

          {status === "success" ? (
            <div className="text-center">
              <Dialog.Title className="font-display text-2xl font-semibold text-brand-charcoal">
                Almost there.
              </Dialog.Title>
              <Dialog.Description className="mt-3 leading-relaxed text-brand-warm-gray">
                Check your phone. Reply <strong>YES</strong> to the confirmation text to start
                receiving updates. You can reply <strong>STOP</strong> anytime.
              </Dialog.Description>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-brand-gold-deep px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-gold-deep/90"
                >
                  Done
                </button>
              </Dialog.Close>
            </div>
          ) : (
            <>
              <Dialog.Title className="font-display text-2xl font-semibold text-brand-charcoal">
                Join the Club!
              </Dialog.Title>
              <Dialog.Description className="mt-2 leading-relaxed text-brand-warm-gray">
                Get occasional texts on seasonal maintenance reminders, project specials, and
                openings in the schedule. Northern and central New Jersey only.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor={phoneId}
                    className="mb-1 block text-sm font-medium text-brand-charcoal"
                  >
                    Mobile number
                  </label>
                  <input
                    id={phoneId}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-brand-charcoal"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id={consentId}
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border text-brand-gold-deep"
                  />
                  <label
                    htmlFor={consentId}
                    className="text-xs leading-relaxed text-brand-warm-gray"
                  >
                    {CONSENT_TEXT}
                  </label>
                </div>

                <p className="text-xs leading-relaxed text-brand-warm-gray/90">
                  Reply STOP to unsubscribe or HELP for help at any time. See our{" "}
                  <Link href="/privacy" className="font-semibold text-brand-gold-deep underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="font-semibold text-brand-gold-deep underline">
                    Terms
                  </Link>
                  . We&apos;ll send a one-time confirmation text to verify your number before adding
                  you.
                </p>

                {status === "error" && (
                  <p className="text-sm text-red-600" role="alert">
                    {errorMsg}
                  </p>
                )}

                <div className="flex flex-col gap-3 pt-1 sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex-1 rounded-lg bg-brand-gold-deep px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-gold-deep/90 disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending..." : "Join the Club"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="rounded-lg border border-border px-6 py-3 font-semibold text-brand-charcoal transition-colors hover:bg-brand-charcoal/5"
                  >
                    No thanks
                  </button>
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
