#!/usr/bin/env node
/**
 * Sending-domain authentication check.
 *
 * Lead and job-application email is sent through Brevo, but the `From:` address
 * decides whether it lands in the inbox or the spam folder. Brevo returns 200
 * either way, so a misconfigured sending domain is INVISIBLE from the API
 * response and from the Netlify logs. This
 * script is the check that failure mode does not have.
 *
 * It queries public DNS directly (8.8.8.8 / 1.1.1.1) rather than the system
 * resolver, so it reports what a receiving mail server actually sees — not
 * whatever a local or corporate cache is holding.
 *
 * Usage:
 *   node scripts/check-email-auth.mjs                  # domain from LEADS_FROM_EMAIL
 *   node scripts/check-email-auth.mjs elevatehrg.com   # explicit domain
 *
 * Exit code is 0 only when every REQUIRED record is present, so this is safe to
 * run in a gate or hand to whoever administers DNS as a definition of "done".
 */
import { Resolver } from "node:dns/promises";

const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const green = (s) => `\u001b[32m${s}\u001b[0m`;
const red = (s) => `\u001b[31m${s}\u001b[0m`;
const yellow = (s) => `\u001b[33m${s}\u001b[0m`;
const dim = (s) => `\u001b[2m${s}\u001b[0m`;

const domain = process.argv[2] ?? process.env.LEADS_FROM_EMAIL?.split("@")[1] ?? "elevatehrg.com";

/** Absent records throw ENODATA/ENOTFOUND; that is an answer, not an error. */
async function lookup(kind, name) {
  try {
    const records =
      kind === "TXT" ? await resolver.resolveTxt(name) : await resolver.resolveCname(name);
    // resolveTxt returns arrays of string chunks — a long DKIM key is split
    // across 255-byte segments and must be rejoined before matching.
    return kind === "TXT" ? records.map((chunks) => chunks.join("")) : records;
  } catch {
    return [];
  }
}

const results = [];
const record = (required, label, ok, detail, hint) =>
  results.push({ required, label, ok, detail, hint });

const apexTxt = await lookup("TXT", domain);

// 1. Brevo ownership code — proves to Brevo that you control the domain.
const brevoCode = apexTxt.find((t) => t.toLowerCase().includes("brevo-code"));
record(
  true,
  "Brevo code (TXT @ apex)",
  Boolean(brevoCode),
  brevoCode ?? "not found",
  "Brevo → Senders, Domains & Dedicated IPs → Domains → Authenticate this domain"
);

// 2. DKIM — the signature that actually authorizes Brevo to send as this
// domain. Brevo has used several selector names across account vintages, and
// publishes them as CNAME or TXT depending on the flow, so accept any of them.
const SELECTORS = ["mail._domainkey", "mail2._domainkey", "brevo._domainkey"];
const dkimFound = [];
for (const selector of SELECTORS) {
  const host = `${selector}.${domain}`;
  const [cname, txt] = await Promise.all([lookup("CNAME", host), lookup("TXT", host)]);
  if (cname.length) dkimFound.push(`${selector} → ${cname[0]} (CNAME)`);
  else if (txt.some((t) => t.includes("DKIM1"))) dkimFound.push(`${selector} (TXT)`);
}
record(
  true,
  "DKIM signature",
  dkimFound.length > 0,
  dkimFound.length ? dkimFound.join(", ") : `none of: ${SELECTORS.join(", ")}`,
  "Copy the DKIM record Brevo displays; values are per-account and cannot be guessed"
);

// 3. DMARC — tells receivers what to do when alignment fails. Brevo asks for
// it, and without any record Gmail falls back to its own heuristics.
const dmarc = (await lookup("TXT", `_dmarc.${domain}`)).find((t) =>
  t.toLowerCase().startsWith("v=dmarc1")
);
record(
  true,
  "DMARC (TXT @ _dmarc)",
  Boolean(dmarc),
  dmarc ?? "not found",
  "Start at p=none; tightening before DKIM is live will bounce legitimate mail"
);

// 4. SPF — informational. Brevo routes bounces through its own return-path
// domain and states an SPF include is NOT required. Reported because an
// existing hard-fail SPF is worth knowing about.
const spf = apexTxt.find((t) => t.toLowerCase().startsWith("v=spf1"));
record(
  false,
  "SPF (TXT @ apex)",
  true,
  spf ?? "none — fine, Brevo does not require an SPF include",
  spf?.includes("-all") ? "Hard-fail SPF present; confirm it does not cover Brevo's path" : null
);

// 5. MX — informational. Sending needs no mailbox, but without MX the From
// address silently discards replies and bounce notifications.
const mx = await resolver.resolveMx(domain).catch(() => []);
record(
  false,
  "MX (can the From address receive?)",
  true,
  mx.length ? mx.map((m) => m.exchange).join(", ") : "no MX — send-only domain",
  mx.length ? null : "Fine for sending. Reply-To is the customer, so replies still work."
);

console.log(`\n${bold(`Sending-domain authentication: ${domain}`)}\n`);
for (const { required, label, ok, detail, hint } of results) {
  const mark = !required ? yellow("i") : ok ? green("PASS") : red("FAIL");
  console.log(`  ${mark.padEnd(required ? 14 : 12)} ${bold(label)}`);
  console.log(`  ${dim(`     ${detail}`)}`);
  if (hint && (!ok || !required)) console.log(`  ${dim(`     → ${hint}`)}`);
  console.log("");
}

const missing = results.filter((r) => r.required && !r.ok);
if (missing.length === 0) {
  console.log(green(`${domain} is authenticated. Safe to use as LEADS_FROM_EMAIL.\n`));
  process.exit(0);
}
console.log(
  red(`${missing.length} required record(s) missing — do NOT point LEADS_FROM_EMAIL here yet.`)
);
console.log(dim("Mail sent from this domain will be accepted by Brevo and filtered by Gmail.\n"));
process.exit(1);
