"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConsentNotice } from "@/components/consent/ConsentNotice";
import {
  acceptAllCategories,
  applyGlobalPrivacyControl,
  clearAnalyticsCookies,
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  defaultCategories,
  makeConsentRecord,
  readMirror,
  rejectNonEssentialCategories,
  toConsentModeSignals,
  writeConsent,
  writeMirror,
  type ConsentCategories,
  type ConsentSource,
} from "@/lib/consent";

// Nested dynamic import: the preferences modal pulls in Radix Dialog, and
// realistically under 2% of visitors ever open it. Keeping it behind a second
// chunk means the other 98% never download it.
const ConsentPreferences = dynamic(
  () => import("@/components/consent/ConsentPreferences").then((mod) => mod.ConsentPreferences),
  { ssr: false }
);

/** Reveal delay after the welcome splash's cross-fade ends. */
const POST_SPLASH_DELAY_MS = 400;
/** Reveal delay when the splash is suppressed entirely. */
const NO_SPLASH_DELAY_MS = 600;
/**
 * Backstop in case `.welcome-splash` is missing or `animationend` is dropped
 * (WebKit occasionally does when an element becomes `visibility: hidden` in the
 * same frame). The splash's own choreography finishes at ~3.44s.
 */
const REVEAL_FALLBACK_MS = 4200;

/**
 * Persist a choice and push it to gtag.
 *
 * `previous` exists only to detect a WITHDRAWAL of analytics consent, which
 * additionally clears GA's cookies: Consent Mode stops new writes but never
 * removes existing ones, and leaving `_ga` behind would contradict what the UI
 * just told the visitor.
 *
 * Deliberately a module-level function, not a component method — it touches
 * only external systems (localStorage, gtag, the DOM, the event bus) and holds
 * no React state, so it stays trivially callable from effects and handlers
 * alike.
 */
function commit(next: ConsentCategories, source: ConsentSource, previous?: ConsentCategories) {
  const before = previous ?? readMirror();
  const record = makeConsentRecord(next, source);

  writeConsent(record);
  writeMirror(next, true, window.__elevateConsent?.gpc ?? false);

  try {
    document.documentElement.dataset.consent = "resolved";
  } catch {
    // dataset is always available in practice; never let it break the commit.
  }

  window.gtag?.("consent", "update", toConsentModeSignals(next));
  window.gtag?.("set", "ads_data_redaction", !next.marketing);

  if (before.analytics && !next.analytics) {
    clearAnalyticsCookies();
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }));
}

/**
 * Owns all consent behavior that needs React: when the notice may appear, the
 * `CONSENT_OPEN_EVENT` bus, writing the record, and issuing `consent update`.
 *
 * Always rendered through ConsentManagerLazy (`ssr: false`) and mounted as the
 * LAST child of <body>. Both facts are load-bearing — see that file, and the
 * comment at the mount site in app/layout.tsx.
 */
export function ConsentManager() {
  // This component only ever renders on the client (ssr: false), so reading the
  // pre-paint mirror in a lazy initializer is safe — and avoids the cascading
  // render that a setState-in-effect would cause.
  const [initial] = useState(() => {
    const mirror = typeof window === "undefined" ? undefined : window.__elevateConsent;
    const gpc = mirror?.gpc ?? false;
    const resolved = mirror?.resolved ?? false;
    const stored = mirror?.categories ?? defaultCategories();
    // A stored record that predates the GPC signal can still say marketing is
    // granted. GPC wins, and the record gets rewritten so what is persisted
    // matches what is actually being honored.
    const needsGpcCorrection = resolved && gpc && stored.marketing;
    return {
      gpc,
      resolved,
      stored,
      needsGpcCorrection,
      categories: needsGpcCorrection ? applyGlobalPrivacyControl(stored) : stored,
    };
  });

  const [showNotice, setShowNotice] = useState(false);
  const [preferencesRequested, setPreferencesRequested] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(initial.categories);

  useEffect(() => {
    if (!initial.needsGpcCorrection) return;
    commit(initial.categories, "gpc", initial.stored);
  }, [initial]);

  // Reveal gating. The notice appears strictly AFTER the welcome splash
  // finishes: the splash is the deliberate brand moment, it is z-ordered above
  // the notice, and cross-fading a cookie bar through a door-opening animation
  // would make the bar look like it "develops" through the fade.
  //
  // Event-driven with a timer backstop rather than a hard-coded 3400ms, so the
  // notice self-adjusts if the splash timings are retuned (they have been).
  useEffect(() => {
    if (initial.resolved) return;

    let settled = false;
    const timers: number[] = [];
    const root = document.documentElement;
    const splash = document.querySelector(".welcome-splash");

    const reveal = () => {
      if (settled) return;
      settled = true;
      setShowNotice(true);
    };

    const revealAfter = (delay: number) => {
      timers.push(window.setTimeout(reveal, delay));
    };

    const onAnimationEnd = (event: Event) => {
      if ((event as AnimationEvent).animationName !== "splash-overlay-hide") return;
      revealAfter(POST_SPLASH_DELAY_MS);
    };

    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // matchMedia unavailable — fall through to the splash path.
    }

    // `splash-hidden` is set pre-paint by app/layout.tsx for `?intro=skip` and
    // the `elevate-splash-suppress` e2e key; reduced-motion hides the splash via
    // CSS. In both cases there is no animation to wait for.
    if (!splash || reducedMotion || root.classList.contains("splash-hidden")) {
      revealAfter(NO_SPLASH_DELAY_MS);
    } else {
      splash.addEventListener("animationend", onAnimationEnd);
    }

    revealAfter(REVEAL_FALLBACK_MS);

    return () => {
      settled = true;
      timers.forEach((id) => window.clearTimeout(id));
      splash?.removeEventListener("animationend", onAnimationEnd);
    };
  }, [initial.resolved]);

  // The element that opened the panel, so focus can be handed back to it on
  // close. Radix does this itself only when a <Dialog.Trigger> is used; this
  // dialog is opened programmatically from three different surfaces, so
  // without this focus lands on <body> and a keyboard user is stranded.
  const openerRef = useRef<HTMLElement | null>(null);

  const openPreferences = useCallback(() => {
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement ? active : null;
    // Seed the panel from the mirror rather than component state, so it is
    // always current no matter what wrote last.
    setDraft(readMirror());
    setPreferencesRequested(true);
    setPreferencesOpen(true);
  }, []);

  const restoreFocus = useCallback((event: Event) => {
    const opener = openerRef.current;
    // If the opener is gone (e.g. the notice detached after a save), let Radix
    // fall back to its own default rather than focusing a detached node.
    if (!opener || !opener.isConnected) return;
    event.preventDefault();
    opener.focus();
  }, []);

  // Footer link, the in-policy link, anything else on the bus.
  useEffect(() => {
    window.addEventListener(CONSENT_OPEN_EVENT, openPreferences);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openPreferences);
  }, [openPreferences]);

  const choose = useCallback((next: ConsentCategories) => {
    // GPC is never overridable from the UI.
    const effective = window.__elevateConsent?.gpc ? applyGlobalPrivacyControl(next) : next;
    commit(effective, "explicit");
    setDraft(effective);
    setShowNotice(false);
    setPreferencesOpen(false);
  }, []);

  const handleAcceptAll = useCallback(() => choose(acceptAllCategories()), [choose]);
  const handleReject = useCallback(() => choose(rejectNonEssentialCategories()), [choose]);

  return (
    <>
      {showNotice && (
        <ConsentNotice
          onAcceptAll={handleAcceptAll}
          onRejectNonEssential={handleReject}
          onManagePreferences={openPreferences}
        />
      )}
      {preferencesRequested && (
        <ConsentPreferences
          open={preferencesOpen}
          onOpenChange={setPreferencesOpen}
          draft={draft}
          onDraftChange={setDraft}
          gpc={initial.gpc}
          onSave={choose}
          onCloseAutoFocus={restoreFocus}
        />
      )}
    </>
  );
}
