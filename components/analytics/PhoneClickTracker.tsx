"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * One document-level delegated listener covering every `tel:` link on the site
 * (30 of them). The alternative — an onClick on each — is a 30-file diff with
 * 30 chances to miss one, and today 27 of those 30 links fire nothing at all.
 *
 * Attribution: an explicit `data-cta` wins; otherwise a surface is derived from
 * the nearest meaningful ancestor, so a link with no attribute still reports
 * something useful ("header", "footer", "main") rather than nothing. As
 * `data-cta` is added to the remaining links, their labels sharpen with no
 * change here.
 *
 * Capture phase so the event is seen before anything calls stopPropagation, and
 * `passive` because the listener never calls preventDefault — navigation to the
 * dialer is never blocked or delayed.
 */
function resolveSurface(link: HTMLAnchorElement): string {
  const explicit = link.getAttribute("data-cta");
  if (explicit) return explicit;

  const surface = link.closest<HTMLElement>("[data-surface]")?.dataset.surface;
  if (surface) return surface;

  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest("[data-testid='sticky-mobile-cta']")) return "sticky";
  if (link.closest("main")) return "main";
  return "unknown";
}

export function PhoneClickTracker() {
  useEffect(() => {
    const onClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link) return;

      // `location` is kept alongside `cta` so the events the three explicit
      // handlers used to send stay comparable in GA4 after this replaces them.
      const surface = resolveSurface(link);
      trackEvent("phone_click", { cta: surface, location: surface });
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
