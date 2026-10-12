"use client";

import dynamic from "next/dynamic";

/**
 * Client-only loader for the consent layer. `ssr: false` is load-bearing for
 * three separate reasons — none of them cosmetic:
 *
 * 1. NO HYDRATION MISMATCH. The consent record lives in localStorage, which the
 *    server cannot see. Rendering the notice on the server would guarantee a
 *    mismatch for every returning visitor. (JoinTheClubModalLazy documents the
 *    same reasoning for the same reason.)
 * 2. PRERENDER SAFETY. The alternative — a cookie read in a Server Component or
 *    middleware — would opt every route into dynamic rendering and lose
 *    `X-Nextjs-Prerender: 1` on all nine Lighthouse CI URLs. localStorage plus
 *    `ssr: false` plus the pre-paint script keeps the HTML byte-identical for
 *    consenting and non-consenting visitors; all divergence is client-side and
 *    happens before first paint.
 * 3. BUNDLE ISOLATION. Radix Dialog and the preferences panel stay out of every
 *    route's shared chunk.
 */
const ConsentManager = dynamic(
  () => import("@/components/consent/ConsentManager").then((mod) => mod.ConsentManager),
  { ssr: false }
);

export function ConsentManagerLazy() {
  return <ConsentManager />;
}
