"use client";

import { useSyncExternalStore } from "react";

export type MotionTier = "full" | "mobile" | "minimal";

// Media query strings — kept module-scoped so both the snapshot reader and the
// subscriber share identical definitions.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NARROW_VIEWPORT_QUERY = "(max-width: 1023px)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

function readClientTier(): MotionTier {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    return "minimal";
  }

  if (
    window.matchMedia(NARROW_VIEWPORT_QUERY).matches ||
    window.matchMedia(COARSE_POINTER_QUERY).matches
  ) {
    return "mobile";
  }

  return "full";
}

// Cache the last snapshot so useSyncExternalStore keeps a stable reference
// between calls when nothing has changed. Without this, returning a fresh
// primitive on every read is fine (primitives compare by value), but media
// queries can fire `change` rapidly; caching also lets us skip needless
// re-reads when subscribers force a refresh.
let cachedTier: MotionTier | null = null;

function getClientSnapshot(): MotionTier {
  if (cachedTier === null) {
    cachedTier = readClientTier();
  }
  return cachedTier;
}

function refreshSnapshot() {
  cachedTier = readClientTier();
}

function getServerSnapshot(): MotionTier {
  // The server has no viewport or pointer information. "full" is the safe
  // default: it matches the desktop-first render path the App Router emits
  // for the layout, so SSR markup lines up with the most common client tier
  // and avoids hydration-time class flicker on desktop. The client snapshot
  // will correct this immediately on hydration via useSyncExternalStore.
  return "full";
}

function subscribe(notify: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const queries = [
    window.matchMedia(REDUCED_MOTION_QUERY),
    window.matchMedia(NARROW_VIEWPORT_QUERY),
    window.matchMedia(COARSE_POINTER_QUERY),
  ];

  const handler = () => {
    refreshSnapshot();
    notify();
  };

  queries.forEach((query) => query.addEventListener("change", handler));

  return () => {
    queries.forEach((query) => query.removeEventListener("change", handler));
  };
}

export function useMotionTier(): MotionTier {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
