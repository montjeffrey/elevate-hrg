import { expect, test } from "@playwright/test";
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
