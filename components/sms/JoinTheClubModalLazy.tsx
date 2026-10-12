"use client";

import dynamic from "next/dynamic";

// Deferred, client-only load. JoinTheClubModal pulls in the SMS opt-in action
// (which carries Zod validation) plus a Radix Dialog — none of which is needed
// for the first paint of any route. Loading it through a client wrapper with
// ssr:false keeps that weight out of every route's shared chunk; the modal
// still mounts on the client and opens normally once hydrated. The trigger
// only appears after first paint anyway (requestAnimationFrame in the modal),
// so there is no visible regression.
const JoinTheClubModal = dynamic(
  () => import("@/components/sms/JoinTheClubModal").then((mod) => mod.JoinTheClubModal),
  { ssr: false }
);

export function JoinTheClubModalLazy() {
  return <JoinTheClubModal />;
}
