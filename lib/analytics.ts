import { isGranted, type ConsentModeSignals } from "@/lib/consent";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    /**
     * Defined by the pre-paint script in components/consent/ConsentBootstrap.tsx
     * — NOT by components/analytics/GoogleAnalytics.tsx, which loads too late to
     * issue a `consent default` before the first dataLayer entry.
     */
    gtag?: {
      (command: "event", eventName: string, payload?: AnalyticsPayload): void;
      (
        command: "consent",
        mode: "default" | "update",
        signals: ConsentModeSignals & { wait_for_update?: number }
      ): void;
      (command: "js", value: Date): void;
      (command: "config", targetId: string, config?: Record<string, unknown>): void;
      (command: "set", key: string, value: unknown): void;
    };
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  // ALWAYS: the internal DOM event. No storage, no network, no identifiers —
  // it is how our own components talk to each other, so gating it would be both
  // legally pointless and test-breaking. tests/e2e/lead-forms.spec.ts listens
  // for `generate_lead` and depends on this firing unconditionally, which is
  // why the dispatch is FIRST: no early return below can ever skip it.
  window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));

  // GATED: anything that can reach Google.
  if (!isGranted("analytics")) return;

  window.dataLayer?.push({ event: eventName, ...payload });
  window.gtag?.("event", eventName, payload);
}

const ATTRIBUTION_KEY = "elevate-hrg-attribution";

export type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

/**
 * Deliberately NOT consent-gated. This is session-scoped, first-party, and
 * carries no cross-site identifier: it exists only to route a lead the visitor
 * deliberately submitted to the right place. Classified `necessary` and
 * disclosed by name in the privacy policy's cookie inventory.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") ?? undefined;
    const utmMedium = params.get("utm_medium") ?? undefined;
    const utmCampaign = params.get("utm_campaign") ?? undefined;
    const utmTerm = params.get("utm_term") ?? undefined;
    const utmContent = params.get("utm_content") ?? undefined;
    const gclid = params.get("gclid") ?? undefined;

    if (!utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent && !gclid) {
      return;
    }

    const attribution: LeadAttribution = {};
    if (utmSource) attribution.utmSource = utmSource;
    if (utmMedium) attribution.utmMedium = utmMedium;
    if (utmCampaign) attribution.utmCampaign = utmCampaign;
    if (utmTerm) attribution.utmTerm = utmTerm;
    if (utmContent) attribution.utmContent = utmContent;

    if (gclid && !attribution.utmSource) {
      attribution.utmSource = "google";
      if (!attribution.utmMedium) attribution.utmMedium = "cpc";
    }

    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Swallow storage/parse errors; attribution is best-effort.
  }
}

export function getAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as LeadAttribution;
  } catch {
    return {};
  }
}
