/**
 * Per-instance request throttle shared by the public form endpoints
 * (/api/leads and /api/careers).
 *
 * Honest limitation: the counters live in one serverless instance's memory, so
 * a request routed to a cold or parallel instance starts from zero and the
 * effective limit is (instances x max). It raises the cost of a naive flood and
 * does nothing against a distributed one. A durable counter (Netlify Blobs,
 * Upstash/Redis) or a captcha is the upgrade path; this is not a hard
 * guarantee and must not be described as one.
 */

/**
 * The address to throttle on.
 *
 * `x-nf-client-connection-ip` is set by Netlify's edge from the actual TCP
 * connection, so a client cannot choose it. The generic forwarding headers are
 * only a fallback for when it is absent (local `next start`, other hosts): a
 * client can send those itself, so they are never preferred over it.
 *
 * The User-Agent is deliberately NOT part of the key. It is entirely
 * client-controlled, so including it let anyone mint a fresh bucket per request.
 */
export function getClientKey(request: Request): string {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (netlifyIp) return netlifyIp;

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown-ip";
}

export type RateLimiterOptions = {
  windowMs: number;
  maxRequests: number;
  /** Upper bound on tracked keys, so the map cannot grow without limit. */
  maxTrackedKeys?: number;
};

export function createRateLimiter({
  windowMs,
  maxRequests,
  maxTrackedKeys = 5_000,
}: RateLimiterOptions) {
  // Map iteration order is insertion order; entries are re-inserted on every
  // hit, so the first key is always the least recently seen.
  const requests = new Map<string, number[]>();

  function pruneExpired(now: number) {
    for (const [key, timestamps] of requests) {
      const live = timestamps.filter((timestamp) => now - timestamp < windowMs);
      if (live.length === 0) requests.delete(key);
      else requests.set(key, live);
    }
  }

  return {
    /** Records the request and reports whether it is over the limit. */
    isLimited(request: Request): boolean {
      const now = Date.now();
      const key = getClientKey(request);

      const recent = (requests.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
      // Refreshes this key's position as most recently seen.
      requests.delete(key);

      if (recent.length >= maxRequests) {
        requests.set(key, recent);
        return true;
      }

      // Bound the map before adding a new key. No timer: serverless has no
      // background work, so this runs on the request path. Drop expired keys
      // first, then the least recently seen ones if every key is still live.
      if (requests.size >= maxTrackedKeys) {
        pruneExpired(now);
        while (requests.size >= maxTrackedKeys) {
          const oldest = requests.keys().next().value;
          if (oldest === undefined) break;
          requests.delete(oldest);
        }
      }

      recent.push(now);
      requests.set(key, recent);
      return false;
    },
    /** Number of tracked keys. Exposed for tests. */
    get size() {
      return requests.size;
    },
  };
}
