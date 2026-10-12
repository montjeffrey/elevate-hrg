#!/usr/bin/env node
/**
 * Send a test lead through the real delivery path.
 *
 * This exists because "Brevo returned 200" and "the email reached the inbox"
 * are different claims, and only the second one matters. The API cannot tell
 * you which happened. The only way to know is
 * to send a real message somewhere you can open it.
 *
 * It POSTs a realistic payload to /api/leads rather than reimplementing the
 * Brevo call, so what you are testing is genuinely the production code path:
 * validation, dispatch, provider failover, and all.
 *
 * Where the mail lands is controlled by LEADS_TO_EMAIL on the SERVER you point
 * at — not by this script. For a safe test, run the dev server with a .env.local
 * whose LEADS_TO_EMAIL is your own address (see --help).
 *
 * Usage:
 *   node scripts/send-test-lead.mjs                    # -> http://localhost:3000
 *   node scripts/send-test-lead.mjs --url https://staging.example.com
 *   node scripts/send-test-lead.mjs --production --confirm
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const value = (name, fallback) =>
  args
    .find((a) => a.startsWith(`--${name}=`))
    ?.split("=")
    .slice(1)
    .join("=") ??
  (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined) ??
  fallback;

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const green = (s) => `\u001b[32m${s}\u001b[0m`;
const red = (s) => `\u001b[31m${s}\u001b[0m`;
const yellow = (s) => `\u001b[33m${s}\u001b[0m`;
const dim = (s) => `\u001b[2m${s}\u001b[0m`;

if (has("help")) {
  console.log(`
${bold("Send a test lead through the real delivery path")}

  1. Create .env.local with the values from Netlify, but YOUR address as the
     recipient. LEADS_TO_EMAIL accepts a comma-separated list:

       BREVO_API_KEY=<copy from Netlify>
       LEADS_FROM_EMAIL=<copy from Netlify>
       LEADS_TO_EMAIL=you@example.com,test@srv1.mail-tester.com

  2. npm run dev
  3. node scripts/send-test-lead.mjs

${bold("Reading the result")}
  Gmail  → open the message → ⋮ → "Show original" → read SPF / DKIM / DMARC.
  mail-tester.com → grab a fresh address there, add it above, then reload their
  page after sending for a scored breakdown of exactly what fails.
`);
  process.exit(0);
}

// The client's real sales inbox. Named here so the script can refuse to email
// it by accident — this is a test tool, and a test lead in the sales inbox is
// indistinguishable from a real one.
const CLIENT_INBOX = "sales@example.com";
const PRODUCTION = "https://elevatehrg.com";

const base = has("production")
  ? PRODUCTION
  : (value("url", "http://localhost:3000") ?? "").replace(/\/$/, "");

/** Minimal .env parser — enough to echo back the addresses in play. */
function readEnvLocal() {
  try {
    const out = {};
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      out[trimmed.slice(0, eq).trim()] = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return null;
  }
}

const env = readEnvLocal();
const isLocal = base.includes("localhost") || base.includes("127.0.0.1");

console.log(`\n${bold("Test lead")}`);
console.log(`  target      ${base}`);

if (isLocal && env) {
  // Addresses, not secrets. The API key is deliberately never printed.
  console.log(`  from        ${env.LEADS_FROM_EMAIL ?? dim("(not set in .env.local)")}`);
  console.log(`  to          ${env.LEADS_TO_EMAIL ?? dim("(not set in .env.local)")}`);
  console.log(
    `  brevo key   ${env.BREVO_API_KEY ? green("set") : red("NOT SET — delivery will fail")}`
  );
  if ((env.LEADS_TO_EMAIL ?? "").includes(CLIENT_INBOX)) {
    console.log(`\n${yellow("⚠ LEADS_TO_EMAIL includes the client's sales inbox.")}`);
    console.log(dim("  Point it at your own address before testing.\n"));
    if (!has("confirm")) process.exit(2);
  }
} else if (isLocal && !env) {
  console.log(`  ${yellow("no .env.local found — the dev server has no Brevo credentials")}`);
  console.log(dim("  Run with --help for the setup recipe.\n"));
}

if (!isLocal) {
  console.log(`\n${red(bold("This targets a live site."))}`);
  console.log(yellow(`Whatever LEADS_TO_EMAIL is set to there WILL receive a real email —`));
  console.log(yellow(`on production that is the client's sales inbox.`));
  if (!has("confirm")) {
    console.log(`\nRe-run with ${bold("--confirm")} if that is genuinely what you want.\n`);
    process.exit(2);
  }
}

const stamp = new Date().toISOString();
const payload = {
  name: "Deliverability Test",
  phone: "612-555-0147",
  service: "Roofing",
  zip: "55401",
  email: "test@example.com",
  message: `Automated deliverability test sent ${stamp}. Safe to delete.`,
  sourcePath: "/scripts/send-test-lead",
  utmSource: "delivery-test",
};

console.log(dim(`\n  POST ${base}/api/leads`));

let response;
try {
  response = await fetch(`${base}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
} catch (error) {
  console.log(`\n${red("Could not reach the server.")} ${dim(String(error.message ?? error))}`);
  if (isLocal) console.log(dim("Is `npm run dev` running?\n"));
  process.exit(1);
}

const body = await response.text();
let parsed;
try {
  parsed = JSON.parse(body);
} catch {
  parsed = null;
}

console.log(`  ${response.ok ? green(`HTTP ${response.status}`) : red(`HTTP ${response.status}`)}`);
console.log(dim(`  ${body.slice(0, 400)}\n`));

if (response.status === 200) {
  console.log(green("Brevo ACCEPTED the message.") + dim(" That is not the same as it arriving."));
  console.log(`  leadId  ${parsed?.data?.leadId ?? "(none)"}\n`);
  console.log(bold("Now check the recipient inbox:"));
  console.log("  1. Did it land in the Inbox, or in Spam?");
  console.log('  2. Gmail → open it → ⋮ → "Show original"');
  console.log("  3. Read the SPF / DKIM / DMARC lines. Those three decide everything.");
  console.log(dim("     Note the From address shown there — that is your LEADS_FROM_EMAIL.\n"));
  process.exit(0);
}

if (response.status === 502) {
  console.log(red("Delivery FAILED — the provider rejected the send."));
  console.log(dim("Check the dev-server console for `[lead] delivery via ... failed:`.\n"));
} else if (response.status === 400) {
  console.log(
    red("Validation rejected the payload.") + dim(" The schema changed; update this script.\n")
  );
} else if (response.status === 429) {
  console.log(yellow("Rate limited — 60 requests per 10 minutes. Wait and retry.\n"));
}
process.exit(1);
