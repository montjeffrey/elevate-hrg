"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

type ConsentPreferencesLinkProps = {
  /** Override for surfaces other than the footer (e.g. the privacy policy). */
  className?: string;
  children?: React.ReactNode;
  /** Distinct id per surface so a page carrying two of these stays selectable. */
  testId?: string;
};

const FOOTER_CLASSES = "inline-flex min-h-11 items-center transition-colors hover:text-brand-cream";

/**
 * The permanent "Cookie Preferences" entry point. It exists as its own tiny
 * Client Component for one reason: components/layout/Footer.tsx is a Server
 * Component and must stay one, so it cannot carry an onClick itself. The DOM
 * event bus (rather than React Context) is what makes that possible.
 *
 * Classes match its <nav aria-label="Legal"> siblings exactly.
 */
export function ConsentPreferencesLink({
  className,
  children,
  testId = "consent-preferences-link",
}: ConsentPreferencesLinkProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))}
      className={className ?? FOOTER_CLASSES}
    >
      {children ?? "Cookie Preferences"}
    </button>
  );
}
