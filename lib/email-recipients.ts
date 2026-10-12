/**
 * Recipient-list parsing for lead and job-application delivery.
 *
 * `LEADS_TO_EMAIL` and `CAREERS_TO_EMAIL` each accept a comma- or
 * semicolon-separated list, so one submission can land in more than one inbox.
 *
 * That redundancy is the whole point. There is no database — the inbox is the
 * record of truth (see lib/lead-delivery.ts), which makes a single inbox a
 * single point of failure. A second recipient on an unrelated mail provider
 * means a lead still arrives when the primary domain is having delivery
 * trouble. A single address behaves exactly as it always did.
 */

/** Providers reject oversized recipient lists; keep it small and deliberate. */
const MAX_RECIPIENTS = 10;

/**
 * Addresses that are plausibly well-formed AND contain no whitespace, quoting,
 * or bracket characters. These strings end up in a real `To:` header, and an
 * environment variable is not a trusted-by-construction input — a malformed
 * entry is dropped rather than passed to the provider, so one typo in the list
 * cannot fail the whole send.
 */
const ADDRESS = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;

export function parseRecipients(value: string | undefined | null): string[] {
  if (!value) return [];

  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const raw of value.split(/[,;]/)) {
    const address = raw.trim();
    if (!ADDRESS.test(address)) continue;

    // Dedupe case-insensitively: the same inbox listed twice would otherwise
    // deliver two copies of every lead.
    const key = address.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    recipients.push(address);
    if (recipients.length === MAX_RECIPIENTS) break;
  }

  return recipients;
}
