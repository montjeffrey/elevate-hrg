/**
 * Cookie-consent state model. No React, no DOM writes, no storage side effects
 * beyond the explicit read/write helpers — so it can be imported from a Server
 * Component, a Client Component, or a test without pulling anything in.
 *
 * Design notes (see docs/GA4_CONSENT_IMPLEMENTATION_PLAN.md):
 *
 * - PERSISTENCE is localStorage, not a cookie. Nothing server-side reads the
 *   record, and a cookie read in a Server Component or middleware would opt the
 *   marketing routes out of static prerendering (they are prerendered today —
 *   `X-Nextjs-Prerender: 1`). If a server-side conversion tool (e.g. Meta CAPI)
 *   ever ships, the server WILL need to read consent and localStorage cannot
 *   provide it. That migration is why `v` exists: bump to `v: 2`, write both
 *   localStorage and a first-party `SameSite=Lax` cookie, and have the pre-paint
 *   script prefer whichever is newer.
 *
 * - The in-memory mirror `window.__elevateConsent` is populated by the pre-paint
 *   script (components/consent/ConsentBootstrap.tsx). `isGranted()` reads the
 *   mirror and never localStorage, so `trackEvent` stays synchronous and costs
 *   no storage hit per event.
 *
 * - Communication with React is a DOM event bus (CONSENT_CHANGE_EVENT /
 *   CONSENT_OPEN_EVENT) rather than React Context, because
 *   components/layout/Footer.tsx is a Server Component and must stay one.
 */

export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

export type ConsentCategories = Record<ConsentCategory, boolean>;

export type ConsentSource = "default" | "explicit" | "gpc";

export type ConsentRecord = {
  v: 1;
  /** Epoch ms. Drives the 365-day re-prompt. */
  ts: number;
  source: ConsentSource;
  categories: ConsentCategories;
};

/** Matches the repo's storage-key convention (`elevate-*`). */
export const CONSENT_STORAGE_KEY = "elevate-consent-v1";

export const CONSENT_VERSION = 1;

/** 365 days. Older records are treated as "never asked". */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export type ConsentPosture = "notice" | "opt-in";

/**
 * THE single flip point for the legal posture.
 *
 * "notice"  — analytics granted by default, advertising denied by default. The
 *             notice is a passive, NON-BLOCKING bottom bar. This is the shape
 *             the New Jersey Data Privacy Act implies (an opt-out statute), and
 *             it is what ships today.
 * "opt-in"  — nothing but `necessary` granted until the visitor chooses.
 *
 * ⚠️ ACCESSIBILITY COUPLING — READ BEFORE FLIPPING THIS.
 * The notice mounts as the LAST child of <body> and deliberately does not steal
 * focus, which means a keyboard-only visitor reaches it last in tab order. That
 * is acceptable ONLY because analytics defaults to granted: the notice is
 * informational and never blocks the task. Under "opt-in" the notice would have
 * to BLOCK to be meaningful, which makes it a modal — and a modal that is last
 * in document order and never takes focus is an accessibility defect. Flipping
 * this constant is therefore NOT a one-line change: it also requires
 * ConsentNotice to become a focus-trapping dialog, and it invalidates the
 * "skip link is the first focusable element" resolution that
 * tests/e2e/accessibility.spec.ts and tests/e2e/consent.spec.ts both assert.
 */
export const DEFAULT_POSTURE: ConsentPosture = "notice";

/**
 * Categories that get a visible row in the preferences modal.
 * `necessary` renders as a locked "Always active" row instead.
 * `functional` is modelled and persisted but not rendered — reserved for when a
 * tool that actually needs its own row ships (Clarity, CallRail, a
 * personalization tool). Adding the row is a one-element edit here; the
 * persisted schema already round-trips the key.
 */
export const VISIBLE_CATEGORIES = ["analytics", "marketing"] as const;

export const CONSENT_CHANGE_EVENT = "elevate:consent-change";
export const CONSENT_OPEN_EVENT = "elevate:open-consent-preferences";

/**
 * gtag.js loads unconditionally once NEXT_PUBLIC_GA4_ID is set, with Consent
 * Mode signals doing the gating rather than the script tag. Deliberate: it is
 * Google's recommended pattern, it preserves conversion modeling for deniers,
 * and — the CI-relevant part — it keeps total-blocking-time identical across
 * consent states so the Lighthouse budgets stay deterministic.
 *
 * Flip to `false` only if "no request at all on denial" becomes a requirement,
 * and expect TBT to differ between consented and unconsented Lighthouse runs.
 */
export const GA4_LOAD_WHEN_ANALYTICS_DENIED = true;

declare global {
  interface Window {
    __elevateConsent?: {
      categories: ConsentCategories;
      resolved: boolean;
      gpc: boolean;
    };
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export function defaultCategories(posture: ConsentPosture = DEFAULT_POSTURE): ConsentCategories {
  const optIn = posture === "opt-in";
  return {
    necessary: true,
    functional: !optIn,
    analytics: !optIn,
    marketing: false,
  };
}

export function acceptAllCategories(): ConsentCategories {
  return { necessary: true, functional: true, analytics: true, marketing: true };
}

export function rejectNonEssentialCategories(): ConsentCategories {
  return { necessary: true, functional: false, analytics: false, marketing: false };
}

/** True when the browser is sending a Global Privacy Control signal. */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  try {
    return navigator.globalPrivacyControl === true;
  } catch {
    return false;
  }
}

/**
 * GPC wins over anything the UI could say. Honoring the signal while letting a
 * toggle override it would be the worst of both worlds.
 */
export function applyGlobalPrivacyControl(categories: ConsentCategories): ConsentCategories {
  return { ...categories, marketing: false };
}

type ConsentSignalValue = "granted" | "denied";

export type ConsentModeSignals = {
  ad_storage: ConsentSignalValue;
  ad_user_data: ConsentSignalValue;
  ad_personalization: ConsentSignalValue;
  analytics_storage: ConsentSignalValue;
  functionality_storage: ConsentSignalValue;
  personalization_storage: ConsentSignalValue;
  security_storage: ConsentSignalValue;
};

export function toConsentModeSignals(categories: ConsentCategories): ConsentModeSignals {
  const grant = (value: boolean): ConsentSignalValue => (value ? "granted" : "denied");
  return {
    ad_storage: grant(categories.marketing),
    ad_user_data: grant(categories.marketing),
    ad_personalization: grant(categories.marketing),
    analytics_storage: grant(categories.analytics),
    functionality_storage: grant(categories.functional),
    personalization_storage: grant(categories.functional),
    // Reserved (honeypot / reCAPTCHA path). Never user-toggleable.
    security_storage: "granted",
  };
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Partial<ConsentRecord>;
  if (record.v !== CONSENT_VERSION) return false;
  if (typeof record.ts !== "number" || !Number.isFinite(record.ts)) return false;
  if (typeof record.categories !== "object" || record.categories === null) return false;
  return true;
}

export function isRecordFresh(record: ConsentRecord, now = Date.now()): boolean {
  return now - record.ts < CONSENT_MAX_AGE_MS;
}

/**
 * Returns the stored record, or null when it is missing, unparseable, the wrong
 * version, expired, or storage is denied. A storage-denied browser (Safari
 * private mode) therefore behaves exactly like a first-time visitor rather than
 * throwing — the same try/catch posture as JoinTheClubModal and
 * lib/analytics.ts.
 */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentRecord(parsed)) return null;
    if (!isRecordFresh(parsed)) return null;
    return {
      v: CONSENT_VERSION,
      ts: parsed.ts,
      source: parsed.source === "gpc" || parsed.source === "default" ? parsed.source : "explicit",
      categories: {
        necessary: true,
        functional: parsed.categories.functional !== false,
        analytics: parsed.categories.analytics === true,
        marketing: parsed.categories.marketing === true,
      },
    };
  } catch {
    return null;
  }
}

export function writeConsent(record: ConsentRecord): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

export function makeConsentRecord(
  categories: ConsentCategories,
  source: ConsentSource
): ConsentRecord {
  return { v: CONSENT_VERSION, ts: Date.now(), source, categories };
}

/**
 * Reads the in-memory mirror written by the pre-paint script. Never touches
 * localStorage — this is on the hot path of every tracked event.
 *
 * Falls back to the posture defaults if the mirror is missing (script blocked,
 * SSR, a unit-test environment) so analytics behaves the same as a first-time
 * visitor rather than silently going dark.
 */
export function isGranted(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  if (typeof window === "undefined") return false;
  const mirror = window.__elevateConsent;
  if (!mirror) return defaultCategories()[category];
  return mirror.categories[category] === true;
}

export function readMirror(): ConsentCategories {
  if (typeof window === "undefined") return defaultCategories();
  return window.__elevateConsent?.categories ?? defaultCategories();
}

export function writeMirror(categories: ConsentCategories, resolved: boolean, gpc: boolean) {
  if (typeof window === "undefined") return;
  window.__elevateConsent = { categories, resolved, gpc };
}

/**
 * Best-effort removal of GA's own cookies when analytics is withdrawn.
 * Consent Mode stops NEW writes but does not clear prior ones, and leaving
 * `_ga` in place would contradict what the UI just told the visitor.
 */
export function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  try {
    const names = document.cookie
      .split(";")
      .map((entry) => entry.split("=")[0]?.trim() ?? "")
      .filter((name) => name === "_ga" || name.startsWith("_ga_") || name.startsWith("_gid"));

    if (names.length === 0) return;

    const host = window.location.hostname;
    const parts = host.split(".");
    const registrable = parts.length > 2 ? parts.slice(-2).join(".") : host;
    const domains = ["", host, `.${host}`, `.${registrable}`];

    for (const name of names) {
      for (const domain of domains) {
        const scope = domain ? `; domain=${domain}` : "";
        document.cookie = `${name}=; Max-Age=0; path=/${scope}`;
      }
    }
  } catch {
    // Cookie access can throw in locked-down contexts; removal is best-effort.
  }
}
