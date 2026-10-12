import { parseRecipients } from "@/lib/email-recipients";
import { assertBrevoSenderUsable } from "@/lib/brevo-sender";
import { escapeHtml } from "@/lib/html-escape";
import type { LeadSubmission } from "@/lib/lead-validation";

// Provider-agnostic lead delivery.
//
// Launch design (website service): there is NO database — the sales inbox is
// the record of truth, reached via a transactional email provider. Delivery is
// abstracted behind LeadDeliveryProvider so additional channels can be added
// without touching call sites.
//
// Extension point: a CRM provider can be registered in `providers` below.
// It must read its secrets from server env only and never be imported by a
// client component.

export type LeadDeliveryResult = { ok: boolean; channel: string; error?: string };

interface LeadDeliveryProvider {
  readonly name: string;
  isConfigured(): boolean;
  /** Resolves on success; throws on failure. */
  send(lead: LeadSubmission, leadId: string): Promise<void>;
}

// LEADS_TO_EMAIL may name several inboxes. Resolved per send rather than at
// module load, matching the rest of this file — nothing here caches env, so a
// recipient change takes effect on redeploy without a code change.
function leadRecipients(): string[] {
  return parseRecipients(process.env.LEADS_TO_EMAIL);
}

function buildEmailBody(lead: LeadSubmission, leadId: string): { text: string; html: string } {
  const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm, lead.utmContent]
    .filter(Boolean)
    .join(" / ");

  const rows: [string, string][] = [
    ["Service", lead.service],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email ?? "—"],
    ["ZIP", lead.zip],
    ["Message", lead.message ?? "—"],
    ["Source page", lead.sourcePath ?? "—"],
    ["UTM", utm || "—"],
    ["Lead ID", leadId],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<h2>New website lead</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="border:1px solid #e5e5e5"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #e5e5e5">${escapeHtml(value)}</td></tr>`
    )
    .join("")}</table>`;

  return { text, html };
}

// Transactional email via Resend (https://resend.com). Uses fetch — no SDK
// dependency. Swap or add providers without changing callers.
const resendProvider: LeadDeliveryProvider = {
  name: "resend-email",
  isConfigured() {
    return Boolean(
      process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL && leadRecipients().length > 0
    );
  },
  async send(lead, leadId) {
    const { text, html } = buildEmailBody(lead, leadId);
    // Strip CR/LF from the subject as header-injection defense-in-depth (the
    // Resend JSON API isn't raw-SMTP, but name is free-form user input).
    const subject = `New website lead: ${lead.service} — ${lead.name}`
      .replace(/[\r\n]+/g, " ")
      .slice(0, 200);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL,
        to: leadRecipients(),
        // Let sales reply straight to the homeowner when they provided an email.
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};

// Transactional email via Brevo, formerly Sendinblue (https://brevo.com).
// Same shape as the Resend provider: fetch only, no SDK. Two Brevo quirks that
// differ from Resend: the auth header is `api-key` (NOT `Authorization: Bearer`),
// and a successful send returns 201 Created rather than 200.
const brevoProvider: LeadDeliveryProvider = {
  name: "brevo-email",
  isConfigured() {
    return Boolean(
      process.env.BREVO_API_KEY && process.env.LEADS_FROM_EMAIL && leadRecipients().length > 0
    );
  },
  async send(lead, leadId) {
    const { text, html } = buildEmailBody(lead, leadId);
    // Same CRLF strip as Resend — `name` is free-form user input.
    const subject = `New website lead: ${lead.service} — ${lead.name}`
      .replace(/[\r\n]+/g, " ")
      .slice(0, 200);
    // Ask before sending: a 2xx from Brevo does not mean the sender is valid.
    await assertBrevoSenderUsable(
      process.env.LEADS_FROM_EMAIL as string,
      process.env.BREVO_API_KEY as string
    );

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY as string,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: process.env.LEADS_FROM_EMAIL, name: "Elevate HRG Website" },
        to: leadRecipients().map((email) => ({ email })),
        // Let sales reply straight to the homeowner when they provided an email.
        ...(lead.email ? { replyTo: { email: lead.email } } : {}),
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Brevo responded ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};

// Active delivery channels, tried in order until one succeeds. Only providers
// whose env vars are ALL present are attempted, so setting BREVO_API_KEY alone
// is enough to switch — Resend stays registered as a drop-in fallback and is
// simply skipped when RESEND_API_KEY is unset.
const providers: LeadDeliveryProvider[] = [brevoProvider, resendProvider];

export async function deliverLead(
  lead: LeadSubmission,
  leadId: string
): Promise<LeadDeliveryResult> {
  const active = providers.filter((provider) => provider.isConfigured());

  if (active.length === 0) {
    // No channel configured yet. Do NOT report success. Log the full lead so a
    // submission during the pre-config window is recoverable from server logs.
    // (Contains PII — server-side only, emitted exclusively on the failure path
    // because there is no datastore to fall back to. Configure a provider to
    // stop this logging.)
    console.error(
      "[lead] delivery not configured — lead NOT delivered:",
      JSON.stringify({ leadId, ...lead })
    );
    return { ok: false, channel: "unconfigured", error: "Lead delivery is not configured." };
  }

  for (const provider of active) {
    try {
      await provider.send(lead, leadId);
      return { ok: true, channel: provider.name };
    } catch (error) {
      console.error(
        `[lead] delivery via ${provider.name} failed:`,
        error instanceof Error ? error.message : String(error)
      );
      // Last-resort recovery: there is no datastore, so log the undelivered
      // lead (PII, server-side, failure path only) before trying the next channel.
      console.error("[lead] undelivered lead payload:", JSON.stringify({ leadId, ...lead }));
    }
  }

  return { ok: false, channel: "all-failed", error: "All lead delivery channels failed." };
}
