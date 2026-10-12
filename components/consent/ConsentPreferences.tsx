"use client";

import { useId } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import {
  acceptAllCategories,
  rejectNonEssentialCategories,
  VISIBLE_CATEGORIES,
  type ConsentCategories,
  type ConsentCategory,
} from "@/lib/consent";

type ConsentPreferencesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Working copy of the categories, owned by ConsentManager. Lifting it means
   * the panel is re-seeded from the saved record in the *event handler* that
   * opens it, rather than in a synchronizing effect here — no cascading render,
   * and a cancelled edit can never leak into the next open.
   */
  draft: ConsentCategories;
  onDraftChange: (categories: ConsentCategories) => void;
  gpc: boolean;
  onSave: (categories: ConsentCategories) => void;
  /**
   * Radix restores focus on close via its `Dialog.Trigger` context, and this
   * dialog has no Trigger — it is opened programmatically from the notice, the
   * footer, and the privacy policy. Without this it hands focus back to
   * <body>, which strands keyboard users. ConsentManager records the opener and
   * restores it here.
   */
  onCloseAutoFocus: (event: Event) => void;
};

const CATEGORY_COPY: Record<
  (typeof VISIBLE_CATEGORIES)[number],
  { label: string; description: string }
> = {
  analytics: {
    label: "Analytics",
    description:
      "Google Analytics 4, so we can see which pages and services homeowners actually use. On by default; turning it off stops measurement and clears the cookies it already set.",
  },
  marketing: {
    label: "Advertising",
    description:
      "Ad measurement and personalization. Off by default — we do not run any advertising tags today, and this stays off unless you turn it on.",
  },
};

/**
 * The granular preferences panel. Unlike the notice, this one IS a real modal,
 * so it uses Radix Dialog — which gives, correctly and for free, the focus
 * trap, focus restoration, Escape handling, `aria-modal`, scroll lock, and a
 * portal to the end of <body>. Hand-rolling any of that is exactly where
 * home-grown consent banners fail accessibility audits.
 *
 * Each toggle is a NATIVE <input type="checkbox"> with a real <label htmlFor>:
 * keyboard-operable and state-announcing for free. Do not replace these with a
 * custom toggle-switch div. The 16px visual box is wrapped in a `min-h-11`
 * label row so the hit area clears the 44px `target-size` bar.
 */
export function ConsentPreferences({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  gpc,
  onSave,
  onCloseAutoFocus,
}: ConsentPreferencesProps) {
  const titleId = useId();
  const idPrefix = useId();

  const setCategory = (category: ConsentCategory, value: boolean) =>
    onDraftChange({ ...draft, [category]: value });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-brand-charcoal/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in motion-reduce:animate-none" />
        <Dialog.Content
          aria-labelledby={titleId}
          data-testid="consent-preferences"
          onCloseAutoFocus={onCloseAutoFocus}
          className="fixed left-1/2 top-1/2 z-[70] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border/50 bg-brand-cream p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 motion-reduce:animate-none sm:p-8"
        >
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close cookie preferences"
              className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-brand-warm-gray transition-colors hover:bg-brand-charcoal/10 hover:text-brand-charcoal"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </Dialog.Close>

          <Dialog.Title
            id={titleId}
            className="pr-12 font-display text-2xl font-semibold text-brand-charcoal"
          >
            Cookie preferences
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-brand-warm-gray">
            Choose what this site may use. Your choice is stored on this device and applies until
            you change it.
          </Dialog.Description>

          {gpc && (
            <p
              data-testid="consent-gpc-note"
              className="mt-4 rounded-lg border border-brand-bronze/40 bg-brand-sandstone/25 px-4 py-3 text-sm leading-relaxed text-brand-bronze"
            >
              Your browser is sending a Global Privacy Control signal. Advertising cookies are
              turned off and cannot be enabled here.
            </p>
          )}

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-border bg-white/60 p-4">
              <div className="flex min-h-11 items-center justify-between gap-4">
                <span className="font-semibold text-brand-charcoal">Strictly necessary</span>
                <span className="text-sm font-semibold text-brand-bronze">Always active</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-brand-warm-gray">
                Required for the site to work: this cookie choice, the intro-suppression key, and
                the campaign tag used to route a quote request you submit. No cross-site tracking.
              </p>
            </div>

            {VISIBLE_CATEGORIES.map((category) => {
              const disabled = category === "marketing" && gpc;
              const inputId = `${idPrefix}-${category}`;
              return (
                <div key={category} className="rounded-xl border border-border bg-white/60 p-4">
                  <div className="flex items-center gap-3">
                    {/* 24px is WCAG 2.5.8's floor; the surrounding 44px cell
                        supplies the spacing the audit's heuristic wants without
                        rendering an oversized native checkbox. Do NOT swap this
                        for a custom toggle-switch div — a native checkbox is
                        keyboard-operable and announces its state for free. */}
                    <span className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={draft[category]}
                        disabled={disabled}
                        onChange={(event) => setCategory(category, event.target.checked)}
                        className="h-6 w-6 rounded border-border accent-brand-gold-deep disabled:opacity-50"
                      />
                    </span>
                    <label
                      htmlFor={inputId}
                      className="inline-flex min-h-11 flex-1 items-center font-semibold text-brand-charcoal"
                    >
                      {CATEGORY_COPY[category].label}
                    </label>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-brand-warm-gray">
                    {CATEGORY_COPY[category].description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onSave(draft)}
              className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg bg-brand-gold-deep px-5 font-semibold text-white transition-colors hover:bg-brand-gold-deep/90"
            >
              Save preferences
            </button>
            <button
              type="button"
              onClick={() => onSave(acceptAllCategories())}
              className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg border border-brand-charcoal/30 px-5 font-semibold text-brand-charcoal transition-colors hover:bg-brand-charcoal/5"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => onSave(rejectNonEssentialCategories())}
              className="inline-flex min-h-11 min-w-11 flex-1 items-center justify-center rounded-lg border border-brand-charcoal/30 px-5 font-semibold text-brand-charcoal transition-colors hover:bg-brand-charcoal/5"
            >
              Reject non-essential
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
