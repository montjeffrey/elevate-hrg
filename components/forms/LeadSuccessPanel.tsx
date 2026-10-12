"use client";

import { Check, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type LeadSuccessPanelProps = {
  /** Full name as submitted; only the first name is shown. */
  name?: string;
  /** Service the homeowner selected, e.g. "Roofing". */
  service?: string;
  /** Lead reference returned by /api/leads, shown so callers can quote it. */
  leadId?: string;
  /** Resets the parent form back to an empty, editable state. */
  onReset: () => void;
};

function getFirstName(name?: string) {
  const first = name?.trim().split(/\s+/)[0];
  return first && first.length > 1 ? first : null;
}

/**
 * Confirmation shown in place of a lead form after a successful submission.
 *
 * This replaces the whole form rather than appending a line of text: the forms
 * clear themselves on success, and a small inline note next to freshly emptied
 * fields reads as "my input was wiped" instead of "my request was sent".
 *
 * Deliberately NOT wrapped in an aria-live region — focus moves to the heading
 * below, which screen readers announce on arrival. Doing both double-announces.
 */
export function LeadSuccessPanel({ name, service, leadId, onReset }: LeadSuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstName = getFirstName(name);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Keyboard and screen-reader users must land on the confirmation rather
    // than at a form that silently vanished. Scrolling matters on the long
    // service pages where the form sits well below the fold.
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-brand-gold-deep text-white shadow-sm"
      >
        <Check className="size-8" strokeWidth={3} />
      </span>

      <div className="grid gap-3">
        <h3
          className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
          ref={headingRef}
          tabIndex={-1}
        >
          {firstName ? `Thanks, ${firstName} — your request is in.` : "Your request is in."}
        </h3>
        <p className="mx-auto max-w-md text-base text-muted-foreground">
          We&rsquo;ve received your{service ? ` ${service.toLowerCase()}` : ""} request and sent it
          straight to our team.
        </p>
      </div>

      <div className="w-full max-w-md rounded-card border border-border bg-muted/40 p-5 text-left">
        <p className="text-sm font-semibold text-foreground">What happens next</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A member of our team will call you to confirm the details and schedule your free estimate.
          We&rsquo;re reachable {siteConfig.hoursWeekdays} and {siteConfig.hoursWeekends}.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">Need to reach us sooner?</p>
        <Button asChild variant="gold" className="w-full sm:w-auto">
          <a href={siteConfig.phoneTel}>
            <Phone aria-hidden="true" className="size-4" />
            Call {siteConfig.phone}
          </a>
        </Button>
        <Button className="w-full sm:w-auto" onClick={onReset} type="button" variant="outline">
          Submit another request
        </Button>
      </div>

      {leadId ? (
        <p className="text-xs text-muted-foreground">
          Reference: <span className="font-mono">{leadId}</span>
        </p>
      ) : null}
    </div>
  );
}
