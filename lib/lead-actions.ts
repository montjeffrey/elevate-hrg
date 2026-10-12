import { deliverLead } from "@/lib/lead-delivery";
import { archiveLead } from "@/lib/submission-archive";
import type { LeadSubmission } from "@/lib/lead-validation";
import { maskPhone } from "@/lib/lead-validation";

export type DispatchLeadResult = {
  leadId: string;
  delivered: boolean;
  channel: string;
  safeSummary: {
    service: string;
    zip: string;
    phone: string;
    sourcePath: string | undefined;
  };
};

export async function dispatchLead(lead: LeadSubmission): Promise<DispatchLeadResult> {
  const leadId = crypto.randomUUID();

  // Archive FIRST. Delivery can fail silently, and a stored lead is
  // recoverable where a sent one is not.
  await archiveLead(lead, leadId);

  const delivery = await deliverLead(lead, leadId);

  return {
    leadId,
    delivered: delivery.ok,
    channel: delivery.channel,
    // Non-PII summary safe to surface in success logs/metrics (phone masked).
    safeSummary: {
      service: lead.service,
      zip: lead.zip,
      phone: maskPhone(lead.phone),
      sourcePath: lead.sourcePath,
    },
  };
}

// ---------------------------------------------------------------------------
// TCPA-safe SMS opt-in ("Join the Club")
// ---------------------------------------------------------------------------
//
// The Server Action itself lives in `lib/sms-actions.ts` (a dedicated
// top-level "use server" module) because `submitSmsOptIn` is called from the
// JoinTheClubModal *client* component, and Next.js requires client-imported
// Server Actions to come from a file-level "use server" module. This file is
// also imported by the synchronous server-side `/api/leads` route, so it must
// NOT be a "use server" module — hence the split. See `lib/sms-actions.ts`.
