#!/usr/bin/env node
/**
 * Ask Brevo directly what is set up, and what happened to a message.
 *
 * Every question this answers is otherwise locked behind the Brevo dashboard:
 * which senders are verified, whether any domain is actually authenticated,
 * the exact DNS records this account needs, and — critically — what became of
 * a message after the API returned 200. A 200 means "queued", nothing more;
 * delivered, blocked, and hard-bounced all look identical from the call site.
 *
 * The API key is read from .env.local and sent only to api.brevo.com. It is
 * never printed, logged, or written anywhere by this script.
 *
 * Usage:
 *   node scripts/brevo-status.mjs
 *   node scripts/brevo-status.mjs you@example.com
 */
import { readFileSync } from "node:fs";

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const green = (s) => `\u001b[32m${s}\u001b[0m`;
const red = (s) => `\u001b[31m${s}\u001b[0m`;
const yellow = (s) => `\u001b[33m${s}\u001b[0m`;
const cyan = (s) => `\u001b[36m${s}\u001b[0m`;
const dim = (s) => `\u001b[2m${s}\u001b[0m`;

function envLocal() {
  try {
    const out = {};
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      out[t.slice(0, eq).trim()] = t
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const env = envLocal();
const apiKey = process.env.BREVO_API_KEY || env.BREVO_API_KEY;
if (!apiKey) {
  console.log(red("\nNo BREVO_API_KEY found in .env.local or the environment.\n"));
  process.exit(2);
}

const args = process.argv.slice(2);
const days = Number(args.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 7);
// "all" drops the per-recipient filter, which is how you see whether OTHER
// addresses are failing too — the question that matters after a bad sender.
const target = args.find((a) => !a.startsWith("--"));
const recipient = target === "all" ? null : (target ?? env.LEADS_TO_EMAIL?.split(",")[0]?.trim());
const scope = target === "all" ? "ALL recipients" : recipient;

async function api(path) {
  try {
    const res = await fetch(`https://api.brevo.com/v3${path}`, {
      headers: { "api-key": apiKey, Accept: "application/json" },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* non-JSON error page */
    }
    return { ok: res.ok, status: res.status, json, text };
  } catch (error) {
    return { ok: false, status: 0, json: null, text: String(error.message ?? error) };
  }
}

/** Print whatever came back when the shape is not what we expected. */
const raw = (r) => dim(`    ${(r.text || "").slice(0, 400)}`);

console.log(`\n${bold("=== Brevo account ===")}`);
const account = await api("/account");
if (!account.ok) {
  console.log(red(`  HTTP ${account.status} — the API key was rejected.`));
  console.log(raw(account));
  process.exit(1);
}
console.log(`  ${account.json?.email ?? "?"}  ${dim(account.json?.companyName ?? "")}`);
for (const p of account.json?.plan ?? []) {
  console.log(dim(`  plan: ${p.type ?? "?"}  credits: ${p.credits ?? "n/a"}`));
}

console.log(`\n${bold("=== Verified senders ===")} ${dim("(lets Brevo ACCEPT a send)")}`);
const senders = await api("/senders");
if (senders.ok && Array.isArray(senders.json?.senders)) {
  if (senders.json.senders.length === 0) console.log(dim("  none"));
  for (const s of senders.json.senders) {
    console.log(
      `  ${s.active ? green("[active]") : red("[inactive]")} ${s.email}  ${dim(s.name ?? "")}`
    );
  }
} else {
  console.log(yellow(`  HTTP ${senders.status}`));
  console.log(raw(senders));
}

console.log(`\n${bold("=== Domain authentication ===")} ${dim("(lets GMAIL TRUST the mail)")}`);
const domains = await api("/senders/domains");
const list = domains.json?.domains ?? [];
if (domains.ok && Array.isArray(list)) {
  if (list.length === 0) console.log(red("  No domains configured — nothing is authenticated."));
  for (const d of list) {
    const authed = d.authenticated === true;
    console.log(
      `\n  ${authed ? green("AUTHENTICATED") : red("NOT AUTHENTICATED")}  ${bold(d.domain_name ?? d.domain ?? "?")}` +
        dim(`   verified=${d.verified}`)
    );
    const records = d.dns_records ?? {};
    const rows = Object.entries(records).filter(([, v]) => v && typeof v === "object");
    if (rows.length && !authed) {
      console.log(cyan("    v Give these to whoever controls DNS v"));
      for (const [label, rec] of rows) {
        console.log(`    ${bold(label)}  ${dim(rec.status ? `(${rec.status})` : "")}`);
        console.log(`      type  ${rec.type ?? "TXT"}`);
        console.log(`      host  ${rec.host_name ?? rec.hostname ?? "@"}`);
        console.log(`      value ${rec.value ?? ""}`);
      }
    }
  }
} else {
  console.log(yellow(`  HTTP ${domains.status} — raw response:`));
  console.log(raw(domains));
}

if (scope) {
  console.log(
    `
${bold("=== Delivery events:")} ${cyan(scope)} ${dim(`(last ${days}d)`)} ${bold("===")}`
  );
  const events = await api(
    `/smtp/statistics/events?limit=100&days=${days}` +
      (recipient ? `&email=${encodeURIComponent(recipient)}` : "")
  );
  const rows = events.json?.events ?? [];
  if (events.ok && Array.isArray(rows)) {
    if (rows.length === 0) {
      console.log(yellow("  No events in the last 7 days."));
      console.log(dim("  If a send returned 200, Brevo has no record of delivering it."));
    }
    const bad = ["hardBounce", "softBounce", "blocked", "spam", "error", "invalid", "deferred"];
    for (const e of rows) {
      console.log(
        `  ${dim(e.date ?? "")}  ${bad.includes(e.event) ? red(e.event) : green(e.event)}`
      );
      if (e.subject) console.log(dim(`      subject: ${e.subject}`));
      if (e.from) console.log(dim(`      from:    ${e.from}`));
      if (!recipient && e.email) console.log(dim(`      to:      ${e.email}`));
      // The receiving server's own words — the actual explanation.
      if (e.reason) console.log(`      ${red("reason:")}  ${e.reason}`);
    }
  } else {
    console.log(yellow(`  HTTP ${events.status}`));
    console.log(raw(events));
  }
}
console.log("");
