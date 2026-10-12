#!/usr/bin/env node
/**
 * Read the durable submission archive back out.
 *
 * lib/submission-archive.ts writes every lead and job application to Netlify
 * Blobs before delivery is attempted, so the record survives any email failure.
 * This is how you get at it from outside the Netlify runtime.
 *
 * Inside a deployed function the blobs context is implicit; from a laptop it is
 * not, so this needs a site ID and a personal access token:
 *
 *   NETLIFY_SITE_ID    Site configuration -> General -> Site ID
 *   NETLIFY_AUTH_TOKEN User settings -> Applications -> Personal access tokens
 *
 * Put both in .env.local. They are needed ONLY for this script — production
 * writes need neither.
 *
 * Usage:
 *   node scripts/export-submissions.mjs                     # leads, table
 *   node scripts/export-submissions.mjs --store=careers     # applications
 *   node scripts/export-submissions.mjs --csv > leads.csv   # for the client
 *   node scripts/export-submissions.mjs --json
 */
import { readFileSync } from "node:fs";
import { getStore } from "@netlify/blobs";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const val = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d;

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

const siteID = process.env.NETLIFY_SITE_ID || env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_AUTH_TOKEN || env.NETLIFY_AUTH_TOKEN;
if (!siteID || !token) {
  console.error(
    "\nNeed NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN (in .env.local or the environment).\n" +
      "Site ID: Netlify -> Site configuration -> General.\n" +
      "Token:   Netlify -> User settings -> Applications -> Personal access tokens.\n"
  );
  process.exit(2);
}

const which = val("store", "leads");
const storeName = which === "careers" ? "career-applications" : which;

const store = getStore({ name: storeName, siteID, token });
const { blobs } = await store.list();

// Keys are ISO-timestamp-prefixed, so lexicographic order is chronological.
const keys = blobs.map((b) => b.key).sort();
const rows = [];
for (const key of keys) {
  const value = await store.get(key, { type: "json" });
  if (value) rows.push(value);
}

if (rows.length === 0) {
  console.error(`No entries in the "${storeName}" store yet.`);
  process.exit(0);
}

if (flag("json")) {
  console.log(JSON.stringify(rows, null, 2));
} else if (flag("csv")) {
  // Union of keys across rows — the schema can grow over time.
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log(cols.join(","));
  for (const r of rows) console.log(cols.map((c) => cell(r[c])).join(","));
} else {
  console.log(`\n${storeName}: ${rows.length} entr${rows.length === 1 ? "y" : "ies"}\n`);
  for (const r of rows) {
    const when = r.receivedAt
      ? new Date(r.receivedAt).toLocaleString("en-US", { timeZone: "America/New_York" })
      : "?";
    console.log(`── ${when} ET`);
    for (const [k, v] of Object.entries(r)) {
      if (k === "receivedAt") continue;
      console.log(`   ${k.padEnd(16)} ${v ?? "—"}`);
    }
    console.log("");
  }
}
