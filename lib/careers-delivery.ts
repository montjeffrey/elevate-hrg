import type { CareerApplication } from "@/lib/careers-validation";
import { parseRecipients } from "@/lib/email-recipients";
import { assertBrevoSenderUsable } from "@/lib/brevo-sender";
import { escapeHtml } from "@/lib/html-escape";

/**
 * Job-application delivery.
 *
 * Same provider-agnostic shape as lib/lead-delivery.ts, and the same launch
 * constraint: there is NO database. The hiring inbox is the record of truth,
 * which is exactly why the resume travels as an email attachment and is never
 * persisted, indexed, or served by this site.
 *
 * NOTE ON MALWARE: nothing here scans the attachment, and nothing here can.
 * We forward bytes we have verified to be a PDF but have not inspected. The
 * real control is the recipient mail provider's own attachment scanning
 * (Google Workspace / Microsoft 365 both do this on delivery). That is a
 * deliberate, documented boundary.
 */

export type CareerDeliveryResult = { ok: boolean; channel: string; error?: string };

export type ResumeAttachment = {
  /** Sanitized, extension-forced filename. Still untrusted text — escape it. */
  filename: string;
  /** Verified PDF bytes. */
  bytes: Uint8Array;
};

interface CareerDeliveryProvider {
  readonly name: string;
  isConfigured(): boolean;
  /** Resolves on success; throws on failure. */
  send(
    application: CareerApplication,
    resume: ResumeAttachment,
    applicationId: string
  ): Promise<void>;
}

// Applications go to CAREERS_TO_EMAIL when it names at least one usable
// address, and otherwise follow the sales inbox. Either variable may list
// several inboxes — see lib/email-recipients.ts. Falling back on "no usable
// address" rather than "unset" means a typo in CAREERS_TO_EMAIL still delivers
// somewhere instead of silently routing applications nowhere.
function careerRecipients(): string[] {
  const careers = parseRecipients(process.env.CAREERS_TO_EMAIL);
  return careers.length > 0 ? careers : parseRecipients(process.env.LEADS_TO_EMAIL);
}

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

/**
 * Build the subject line.
 *
 * `position` is a closed enum, but `name` is free-form user input, so CR/LF are
 * stripped as header-injection defense-in-depth (these are JSON APIs, not raw
 * SMTP, but the provider ultimately writes this into a real header) and the
 * result is length-capped.
 */
function buildSubject(application: CareerApplication): string {
  return `Job application: ${application.position} — ${application.name}`
    .replace(/[\r\n]+/g, " ")
    .slice(0, 200);
}

function buildEmailBody(
  application: CareerApplication,
  resume: ResumeAttachment,
  applicationId: string
): { text: string; html: string } {
  const utm = [
    application.utmSource,
    application.utmMedium,
    application.utmCampaign,
    application.utmTerm,
    application.utmContent,
  ]
    .filter(Boolean)
    .join(" / ");

  const rows: [string, string][] = [
    ["Position", application.position],
    ["Name", application.name],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Experience", application.experience],
    ["Message", application.message ?? "—"],
    ["Resume", `${resume.filename} (attached)`],
    ["Source page", application.sourcePath ?? "—"],
    ["UTM", utm || "—"],
    ["Application ID", applicationId],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  // Every cell is escaped, including the filename — an applicant-controlled
  // string reaching the recipient's HTML mail renderer unescaped is XSS.
  const html = `<h2>New job application</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="border:1px solid #e5e5e5"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #e5e5e5">${escapeHtml(value)}</td></tr>`
    )
    .join("")}</table>`;

  return { text, html };
}

// Brevo: attachments are `attachment: [{ content: <base64>, name }]`, and `pdf`
// is on Brevo's supported-extension allowlist. Auth header is `api-key`, and a
// successful send returns 201 rather than 200.
const brevoProvider: CareerDeliveryProvider = {
  name: "brevo-email",
  isConfigured() {
    return Boolean(
      process.env.BREVO_API_KEY && process.env.LEADS_FROM_EMAIL && careerRecipients().length > 0
    );
  },
  async send(application, resume, applicationId) {
    const { text, html } = buildEmailBody(application, resume, applicationId);
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
        sender: { email: process.env.LEADS_FROM_EMAIL, name: "Elevate HRG Careers" },
        to: careerRecipients().map((email) => ({ email })),
        // Reply goes straight to the applicant. Safe to pass through: the
        // schema has already proven this parses as an email address, so it
        // cannot carry a newline.
        replyTo: { email: application.email },
        subject: buildSubject(application),
        textContent: text,
        htmlContent: html,
        attachment: [{ content: toBase64(resume.bytes), name: resume.filename }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Brevo responded ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};

// Resend: attachments are `attachments: [{ content: <base64>, filename }]`.
// Registered as an unset fallback exactly as it is for leads.
const resendProvider: CareerDeliveryProvider = {
  name: "resend-email",
  isConfigured() {
    return Boolean(
      process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL && careerRecipients().length > 0
    );
  },
  async send(application, resume, applicationId) {
    const { text, html } = buildEmailBody(application, resume, applicationId);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_FROM_EMAIL,
        to: careerRecipients(),
        reply_to: application.email,
        subject: buildSubject(application),
        text,
        html,
        attachments: [{ content: toBase64(resume.bytes), filename: resume.filename }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 200)}`);
    }
  },
};

const providers: CareerDeliveryProvider[] = [brevoProvider, resendProvider];

export async function deliverApplication(
  application: CareerApplication,
  resume: ResumeAttachment,
  applicationId: string
): Promise<CareerDeliveryResult> {
  const active = providers.filter((provider) => provider.isConfigured());

  if (active.length === 0) {
    // Do NOT report success. Unlike a lead, the payload is deliberately NOT
    // logged: it carries a resume's worth of applicant PII and the file bytes
    // themselves. Log the identifier only — enough to correlate with the
    // applicant's own reference number when they follow up.
    console.error(
      "[careers] delivery not configured — application NOT delivered:",
      JSON.stringify({ applicationId, position: application.position })
    );
    return {
      ok: false,
      channel: "unconfigured",
      error: "Application delivery is not configured.",
    };
  }

  for (const provider of active) {
    try {
      await provider.send(application, resume, applicationId);
      return { ok: true, channel: provider.name };
    } catch (error) {
      console.error(
        `[careers] delivery via ${provider.name} failed:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return { ok: false, channel: "all-failed", error: "All delivery channels failed." };
}
