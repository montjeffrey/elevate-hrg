"use server";

import { createHash } from "node:crypto";
import { z } from "zod";

export type SmsOptInInput = {
  phone: string;
  consent: boolean;
  consentText: string;
};

export type SmsOptInResult = { ok: true } | { ok: false; error: string };

// A Server Action is a public endpoint: its argument arrives from the network,
// not from the modal's types. The consent text the modal shows is well under
// this; the cap only stops an arbitrarily large string being accepted.
const MAX_CONSENT_TEXT_LENGTH = 1_000;

const smsOptInSchema = z.object({
  phone: z.string().max(40),
  consent: z.literal(true),
  consentText: z.string().trim().min(1).max(MAX_CONSENT_TEXT_LENGTH),
});

/**
 * Records a TCPA-safe SMS marketing opt-in ("Join the Club") with the consent
 * context compliance requires (timestamp + exact consent text shown). Invoked
 * as a Server Action from the JoinTheClubModal client component.
 *
 * NOTE: No SMS provider is wired in this environment — there are no Twilio (or
 * other) credentials configured. When the SMS channel is activated:
 *   1. Send the one-time double opt-in confirmation text to `phone`.
 *   2. Only add the number to the recurring list after they reply YES.
 *   3. Wire STOP / HELP keyword handling in the provider console.
 *   4. Persist the consent record (phone, consentText, timestamp, ip) to the
 *      compliance store so it can be produced on request.
 * Until then this validates input and reports that sign-ups are not available.
 * It must NOT return `ok: true`: nothing is stored or sent, and a visitor who is
 * told they joined would believe a consent record exists.
 * Do NOT fabricate provider credentials.
 */
export async function submitSmsOptIn(input: SmsOptInInput): Promise<SmsOptInResult> {
  const parsed = smsOptInSchema.safeParse(input);

  if (!parsed.success) {
    const failed = new Set(parsed.error.issues.map((issue) => issue.path[0]));
    if (failed.has("phone")) return { ok: false, error: "Please enter a valid mobile number." };
    if (failed.has("consent")) {
      return { ok: false, error: "You must agree to receive text messages to join." };
    }
    return { ok: false, error: "Consent text was missing. Please try again." };
  }

  const digits = parsed.data.phone.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return { ok: false, error: "Please enter a valid mobile number." };
  }

  // TODO(sms-provider): send the double opt-in confirmation text and persist the
  // consent record once the SMS provider (e.g. Twilio) and compliance store are
  // wired, then return { ok: true }. Until then nothing is recorded, so log a
  // non-identifying marker only.
  console.info("sms.optin.unavailable", {
    phoneHash: createHash("sha256").update(digits).digest("hex").slice(0, 12),
  });

  return { ok: false, error: "Text sign-ups aren't available yet. Please check back soon." };
}
