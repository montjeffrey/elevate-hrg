import { expect, test } from "@playwright/test";
import { deliverLead } from "@/lib/lead-delivery";
import type { LeadSubmission } from "@/lib/lead-validation";
import { submitSmsOptIn, type SmsOptInInput } from "@/lib/sms-actions";
import { csvCell } from "../../scripts/csv-cell.mjs";
import { createRateLimiter, getClientKey } from "@/lib/rate-limit";

/**
 * Regression tests for the 2026-11-14 security audit fixes. Everything here is
 * server-side behaviour, so the spec is listed in ENGINE_INDEPENDENT_SPECS
 * (playwright.config.ts) and runs once rather than once per browser engine.
 */

function req(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/leads", { method: "POST", headers });
}

test.describe("rate limiting (M1, L1)", () => {
  test("the client key ignores the User-Agent", () => {
    expect(
      getClientKey(req({ "x-nf-client-connection-ip": "203.0.113.7", "user-agent": "a" }))
    ).toBe(getClientKey(req({ "x-nf-client-connection-ip": "203.0.113.7", "user-agent": "b" })));
  });

  test("Netlify's client IP wins over client-supplied forwarding headers", () => {
    const key = getClientKey(
      req({
        "x-nf-client-connection-ip": "203.0.113.7",
        "x-forwarded-for": "198.51.100.1, 10.0.0.1",
        "x-real-ip": "198.51.100.2",
      })
    );
    expect(key).toBe("203.0.113.7");
  });

  test("falls back to x-forwarded-for, then x-real-ip, only when the Netlify header is absent", () => {
    expect(getClientKey(req({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }))).toBe("198.51.100.1");
    expect(getClientKey(req({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(getClientKey(req())).toBe("unknown-ip");
  });

  test("rotating User-Agent or X-Forwarded-For does not mint a new bucket", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });
    const results = Array.from({ length: 5 }, (_, i) =>
      limiter.isLimited(
        req({
          "x-nf-client-connection-ip": "203.0.113.7",
          "user-agent": `agent-${i}`,
          "x-forwarded-for": `198.51.100.${i}`,
        })
      )
    );
    expect(results).toEqual([false, false, false, true, true]);
    // A different real client is unaffected.
    expect(limiter.isLimited(req({ "x-nf-client-connection-ip": "203.0.113.8" }))).toBe(false);
  });

  test("the tracked-key map is bounded", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3, maxTrackedKeys: 50 });
    for (let i = 0; i < 500; i += 1) {
      limiter.isLimited(req({ "x-nf-client-connection-ip": `192.0.2.${i}` }));
      expect(limiter.size).toBeLessThanOrEqual(50);
    }
    expect(limiter.size).toBe(50);
  });

  test("/api/leads throttles one client even when its User-Agent changes every request", async ({
    request,
  }) => {
    const ip = `203.0.113.${Math.floor(Math.random() * 250)}-leads-${Date.now()}`;
    const statuses: number[] = [];
    // 60 per window is the configured ceiling. The body is invalid on purpose:
    // the limiter runs before validation, so no lead is archived or sent.
    for (let i = 0; i < 61; i += 1) {
      const response = await request.post("/api/leads", {
        data: {},
        headers: { "x-nf-client-connection-ip": ip, "user-agent": `bot-${i}` },
      });
      statuses.push(response.status());
    }
    expect(statuses.slice(0, 60).every((status) => status === 400)).toBe(true);
    expect(statuses[60]).toBe(429);
  });

  test("/api/careers throttles one client even when its User-Agent changes every request", async ({
    request,
  }) => {
    const ip = `203.0.113.${Math.floor(Math.random() * 250)}-careers-${Date.now()}`;
    const statuses: number[] = [];
    // 5 per window. Fields are missing on purpose, so nothing is archived or sent.
    for (let i = 0; i < 6; i += 1) {
      const response = await request.post("/api/careers", {
        multipart: { name: "x" },
        headers: { "x-nf-client-connection-ip": ip, "user-agent": `bot-${i}` },
      });
      statuses.push(response.status());
    }
    expect(statuses.slice(0, 5).every((status) => status === 400)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});

test.describe("lead delivery logging (L2)", () => {
  const lead: LeadSubmission = {
    honeypot: "",
    name: "Pat Sensitive",
    phone: "908-641-9827",
    email: "pat.sensitive@example.com",
    service: "Roofing",
    zip: "07057",
    message: "Gate code is 4471",
  };
  const leadId = "00000000-0000-4000-8000-000000000001";
  const pii = [lead.name, lead.phone, lead.email as string, lead.message as string, "4471"];

  async function captureErrors(run: () => Promise<unknown>) {
    const original = console.error;
    const lines: string[] = [];
    console.error = (...args: unknown[]) =>
      lines.push(
        args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ")
      );
    try {
      await run();
    } finally {
      console.error = original;
    }
    return lines.join("\n");
  }

  const envKeys = [
    "BREVO_API_KEY",
    "RESEND_API_KEY",
    "LEADS_FROM_EMAIL",
    "LEADS_TO_EMAIL",
  ] as const;

  async function withEnv(
    values: Partial<Record<(typeof envKeys)[number], string>>,
    run: () => Promise<void>
  ) {
    const saved = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
    const originalFetch = globalThis.fetch;
    for (const key of envKeys) delete process.env[key];
    Object.assign(process.env, values);
    try {
      await run();
    } finally {
      globalThis.fetch = originalFetch;
      for (const key of envKeys) {
        if (saved[key] === undefined) delete process.env[key];
        else process.env[key] = saved[key];
      }
    }
  }

  test("an unconfigured delivery logs the lead id and no lead data", async () => {
    await withEnv({}, async () => {
      let result: Awaited<ReturnType<typeof deliverLead>> | undefined;
      const logs = await captureErrors(async () => {
        result = await deliverLead(lead, leadId);
      });
      expect(result?.ok).toBe(false);
      expect(logs).toContain(leadId);
      for (const value of pii) expect(logs).not.toContain(value);
    });
  });

  test("a provider failure logs the lead id and status, never lead data or the provider body", async () => {
    await withEnv(
      {
        RESEND_API_KEY: "test-key",
        LEADS_FROM_EMAIL: "leads@example.com",
        LEADS_TO_EMAIL: "inbox@example.com",
      },
      async () => {
        globalThis.fetch = async () =>
          new Response(JSON.stringify({ message: `invalid reply_to ${lead.email}` }), {
            status: 422,
          });
        let result: Awaited<ReturnType<typeof deliverLead>> | undefined;
        const logs = await captureErrors(async () => {
          result = await deliverLead(lead, leadId);
        });
        expect(result?.ok).toBe(false);
        expect(logs).toContain(leadId);
        expect(logs).toContain("422");
        for (const value of pii) expect(logs).not.toContain(value);
      }
    );
  });
});

test.describe("honeypot (L3)", () => {
  const validLead = {
    honeypot: "",
    name: "Test Homeowner",
    phone: "908-641-9827",
    service: "Roofing",
    zip: "07057",
  };
  // Unique per test so the throttle never interferes.
  const isolate = (label: string) => ({
    "x-nf-client-connection-ip": `198.51.100.${Math.floor(Math.random() * 250)}-${label}-${Date.now()}`,
  });

  test("/api/leads answers a filled honeypot like an accepted lead and never names the field", async ({
    request,
  }) => {
    const response = await request.post("/api/leads", {
      data: { ...validLead, honeypot: "bot-filled" },
      headers: isolate("leads-hp"),
    });
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).not.toMatch(/honeypot|leave this field/i);
    const json = JSON.parse(text) as { data?: { status?: string; leadId?: string } };
    expect(json.data?.status).toBe("accepted");
    expect(json.data?.leadId).toMatch(/^[0-9a-f-]{36}$/);
  });

  test("/api/leads still reports ordinary validation errors, without the honeypot field, when it is filled", async ({
    request,
  }) => {
    const response = await request.post("/api/leads", {
      data: { ...validLead, name: "", honeypot: "bot-filled" },
      headers: isolate("leads-hp-invalid"),
    });
    expect(response.status()).toBe(400);
    const text = await response.text();
    expect(text).toContain("Name is required.");
    expect(text).not.toMatch(/honeypot|leave this field/i);
  });

  test("/api/careers answers a filled honeypot like an accepted application", async ({
    request,
  }) => {
    const response = await request.post("/api/careers", {
      multipart: {
        name: "Test Applicant",
        email: "applicant@example.com",
        phone: "908-641-9827",
        position: "Roofing Installer",
        experience: "1–3 years",
        honeypot: "bot-filled",
      },
      headers: isolate("careers-hp"),
    });
    const text = await response.text();
    expect(text).not.toMatch(/honeypot|leave this field/i);
    expect(response.status()).toBe(200);
    const json = JSON.parse(text) as { data?: { status?: string; applicationId?: string } };
    expect(json.data?.status).toBe("accepted");
    expect(json.data?.applicationId).toMatch(/^[0-9a-f-]{36}$/);
  });
});

test.describe("SMS opt-in server action (L5)", () => {
  const valid: SmsOptInInput = {
    phone: "908-641-9827",
    consent: true,
    consentText: "I agree to receive text messages.",
  };

  test("does not report success while nothing is stored or sent", async () => {
    const result = await submitSmsOptIn(valid);
    expect(result.ok).toBe(false);
  });

  test("rejects an oversized consent text", async () => {
    const result = await submitSmsOptIn({ ...valid, consentText: "x".repeat(1_001) });
    expect(result).toEqual({ ok: false, error: "Consent text was missing. Please try again." });
  });

  test("rejects an oversized phone value and wrong types without throwing", async () => {
    const bad = [
      { ...valid, phone: "9".repeat(5_000) },
      { ...valid, phone: 9086419827 },
      { ...valid, consentText: { toString: "x" } },
      { ...valid, consent: "true" },
      { phone: null, consent: null, consentText: null },
      null,
      "not an object",
    ];
    for (const input of bad) {
      const result = await submitSmsOptIn(input as unknown as SmsOptInInput);
      expect(result.ok).toBe(false);
    }
  });

  test("keeps the field-specific messages the modal shows", async () => {
    expect(await submitSmsOptIn({ ...valid, phone: "123" })).toEqual({
      ok: false,
      error: "Please enter a valid mobile number.",
    });
    expect(await submitSmsOptIn({ ...valid, consent: false })).toEqual({
      ok: false,
      error: "You must agree to receive text messages to join.",
    });
  });
});

test.describe("CSV export (L7)", () => {
  test("neutralises cells a spreadsheet would run as a formula", () => {
    for (const dangerous of [
      '=HYPERLINK("https://evil.example","Call me")',
      "+1 (908) 641-9827",
      "-2+3",
      "@SUM(A1:A9)",
      "\t=1+1",
      "\r=1+1",
    ]) {
      expect(csvCell(dangerous)).toBe(`"'${dangerous.replace(/"/g, '""')}"`);
    }
  });

  test("leaves ordinary values alone and still escapes quotes", () => {
    expect(csvCell("Pat Homeowner")).toBe('"Pat Homeowner"');
    expect(csvCell('He said "hi"')).toBe('"He said ""hi"""');
    expect(csvCell("a=b")).toBe('"a=b"');
    expect(csvCell(undefined)).toBe('""');
    expect(csvCell(null)).toBe('""');
    expect(csvCell(7)).toBe('"7"');
  });
});
