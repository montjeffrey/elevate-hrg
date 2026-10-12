#!/usr/bin/env node
/**
 * Recover leads that Brevo accepted but never delivered.
 *
 * Brevo can return 2xx for a send and reject it afterwards, so the site
 * reports success and the lead never reaches Netlify's logs.
 *
 * Such leads are NOT lost, though: Brevo retains the rendered message body, and the
 * body is the lead — service, name, phone, email, ZIP, message, source page and
 * UTM attribution are all in the table this site generates. This script reads
 * them back out and prints a report the client can actually work from.
 *
 * Read-only. The API key comes from .env.local and is never printed.
 *
 * Usage:
 *   node scripts/recover-lost-leads.mjs
 *   node scripts/recover-lost-leads.mjs --all          # include delivered ones
 *   node scripts/recover-lost-leads.mjs --markdown     # emit a Markdown table
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const includeAll = args.includes("--all");
const asMarkdown = args.includes("--markdown");

const env = (() => {
  try {
    const out = {};
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq > 0) out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
    }
    return out;
  } catch {
    return {};
  }
})();

const key = process.env.BREVO_API_KEY || env.BREVO_API_KEY;
const inbox = args.find((a) => a.includes("@")) || "sales@example.com";
if (!key) {
  console.error("No BREVO_API_KEY in .env.local or the environment.");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Brevo rate-limits the per-message endpoint hard, and this script necessarily
 * makes one call per message. Back off on 429 rather than failing the whole
 * recovery partway through.
 */
const api = async (path, attempt = 0) => {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    headers: { "api-key": key, Accept: "application/json" },
  });
  if (res.status === 429 && attempt < 6) {
    await sleep(2000 * 2 ** attempt);
    return api(path, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return res.json();
};

/** Strip tags and decode the handful of entities escapeHtml() emits. */
const text = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();

/** The delivery email is a two-column <table> of label/value pairs. */
function parseLead(body) {
  const fields = {};
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let row;
  while ((row = rowRe.exec(body))) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => text(m[1]));
    if (cells.length >= 2 && cells[0]) fields[cells[0]] = cells[1];
  }
  return fields;
}

const et = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const list = await api(`/smtp/emails?limit=100&email=${encodeURIComponent(inbox)}`);
const messages = (list.transactionalEmails ?? []).sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

const rows = [];
for (const m of messages) {
  const detail = await api(`/smtp/emails/${m.uuid}`);
  await sleep(1200); // stay under the per-message rate limit
  const delivered = (detail.events ?? []).some((e) => e.name === "delivered");
  // Brevo keeps the rendered body only for messages it actually SENT. For one
  // it rejected it stores the literal "Mail content not available" — so for
  // exactly the messages worth recovering, the body is gone and the subject
  // line is all that survives.
  const hasBody = typeof detail.body === "string" && detail.body.includes("<");
  const lead = hasBody ? parseLead(detail.body) : {};
  if (!hasBody) {
    const parts = /New website lead:\s*(.+?)\s+[—-]\s+(.+)$/.exec(m.subject ?? "");
    if (parts) {
      lead.Service = parts[1].trim();
      lead.Name = parts[2].trim();
    }
    lead.Phone = lead.Email = lead.ZIP = lead.Message = "NOT RECOVERABLE";
  }
  const name = lead.Name ?? "";
  // Anything the developer sent while debugging is not a customer.
  const isTest = /test|deliverability|ignore/i.test(`${name} ${m.subject}`);
  if (!includeAll && (delivered || isTest)) continue;
  rows.push({ date: et(m.date), delivered, isTest, hasBody, lead });
}

if (asMarkdown) {
  console.log(`\n| When (ET) | Service | Name | Phone | Email | ZIP | Message |`);
  console.log(`| --- | --- | --- | --- | --- | --- | --- |`);
  for (const r of rows) {
    const c = (v) => (v ?? "—").replace(/\|/g, "\|");
    console.log(
      `| ${r.date} | ${c(r.lead.Service)} | ${c(r.lead.Name)} | ${c(r.lead.Phone)} | ${c(r.lead.Email)} | ${c(r.lead.ZIP)} | ${c(r.lead.Message)} |`
    );
  }
  console.log("");
} else {
  console.log(`\nUndelivered leads to ${inbox}: ${rows.length}`);
  if (rows.some((r) => !r.hasBody)) {
    console.log(
      "Brevo retains no content for rejected sends, so phone/email/ZIP are gone.\n" +
        "Name, service and timestamp survive in the subject line.\n"
    );
  }
  for (const r of rows) {
    console.log(`── ${r.date}${r.isTest ? "  [test]" : ""}${r.delivered ? "  [delivered]" : ""}`);
    for (const [k, v] of Object.entries(r.lead)) console.log(`   ${k.padEnd(12)} ${v}`);
    console.log("");
  }
}
