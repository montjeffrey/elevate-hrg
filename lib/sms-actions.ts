"use server";

import { createHash } from "node:crypto";

export type SmsOptInInput = {
  phone: string;
  consent: boolean;
  consentText: string;
};

export type SmsOptInResult = { ok: true } | { ok: false; error: string };

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
 * Until then this validates input and logs the consent record server-side.
 * Do NOT fabricate provider credentials.
 */
export async function submitSmsOptIn(input: SmsOptInInput): Promise<SmsOptInResult> {
  const phone = (input.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return { ok: false, error: "Please enter a valid mobile number." };
  }

  if (input.consent !== true) {
    return { ok: false, error: "You must agree to receive text messages to join." };
  }

  if (!input.consentText || input.consentText.trim().length === 0) {
    return { ok: false, error: "Consent text was missing. Please try again." };
  }

  const consentRecord = {
    phoneHash: createHash("sha256").update(digits).digest("hex").slice(0, 12),
    consentText: input.consentText,
    consentedAt: new Date().toISOString(),
    source: "join-the-club-modal",
  };

  // TODO(sms-provider): send double opt-in confirmation text + persist consent
  // record once the SMS provider (e.g. Twilio) and compliance store are wired.
  console.info("sms.optin.recorded", consentRecord);

  return { ok: true };
}
