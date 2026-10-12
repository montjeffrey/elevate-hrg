/**
 * Preflight check: may Brevo actually send as this address?
 *
 * Brevo's POST /v3/smtp/email returns 2xx to accept the REQUEST, then validates
 * the sender and rejects asynchronously. From the call site an accepted send and
 * a doomed one are identical.
 *
 * This closes that gap by asking Brevo up front. A definitive "no" throws, so
 * the caller's existing failure path runs: the payload is logged and the visitor
 * gets the "call us" fallback instead of a thank-you for a lead nobody received.
 *
 * A sender is usable if EITHER is true:
 *   1. the exact address is a verified sender, or
 *   2. its domain is authenticated (which validates every address on it).
 * Checking only the first would reject the correct end-state config, where
 * `leads@elevatehrg.com` works because the DOMAIN is authenticated and no
 * individual sender is listed.
 */

const SENDERS_URL = "https://api.brevo.com/v3/senders";
const DOMAINS_URL = "https://api.brevo.com/v3/senders/domains";

type Verdict = "usable" | "unusable";

// One network round-trip per sender per cold start. Only DEFINITIVE verdicts
// are cached — an outage must not pin a wrong answer for the process lifetime.
const cache = new Map<string, Promise<Verdict>>();

/** Exported for tests and for a future admin endpoint; not used in the request path. */
export function clearBrevoSenderCache() {
  cache.clear();
}

async function getJson(url: string, apiKey: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "api-key": apiKey, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.json();
}

async function resolveVerdict(from: string, apiKey: string): Promise<Verdict> {
  const address = from.toLowerCase();
  const domain = address.split("@")[1] ?? "";

  const [senders, domains] = await Promise.all([
    getJson(SENDERS_URL, apiKey),
    getJson(DOMAINS_URL, apiKey),
  ]);

  const senderList =
    (senders as { senders?: { email?: string; active?: boolean }[] }).senders ?? [];
  if (senderList.some((s) => s.email?.toLowerCase() === address && s.active !== false)) {
    return "usable";
  }

  const domainList =
    (domains as { domains?: { domain_name?: string; authenticated?: boolean }[] }).domains ?? [];
  if (domainList.some((d) => d.domain_name?.toLowerCase() === domain && d.authenticated === true)) {
    return "usable";
  }

  return "unusable";
}

/**
 * Throws when Brevo will definitely reject `from`.
 *
 * Deliberately fails OPEN when the check itself cannot complete: blocking a
 * send because a status endpoint timed out would lose a lead for certain, while
 * allowing it merely returns to the previous behaviour. The warning is the
 * signal in that case.
 */
export async function assertBrevoSenderUsable(from: string, apiKey: string): Promise<void> {
  let pending = cache.get(from);

  if (!pending) {
    pending = resolveVerdict(from, apiKey);
    cache.set(from, pending);
    // Never let a transient failure become a cached verdict.
    pending.catch(() => cache.delete(from));
  }

  let verdict: Verdict;
  try {
    verdict = await pending;
  } catch (error) {
    console.warn(
      "[brevo] could not verify sender before sending — proceeding anyway:",
      error instanceof Error ? error.message : String(error)
    );
    return;
  }

  if (verdict === "unusable") {
    throw new Error(
      `Brevo will reject this send: "${from}" is neither a verified sender nor on an ` +
        `authenticated domain. Verify it under Senders, Domains & Dedicated IPs, or ` +
        `set LEADS_FROM_EMAIL to an address that is.`
    );
  }
}
