"use client";

import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.querySelector("[data-quote-form], [data-lead-form]");
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), {
      threshold: 0.1,
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!isVisible || formInView) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-sandstone bg-background/95 px-3 pt-3 shadow-2xl backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      data-testid="sticky-mobile-cta"
      data-cta-reveal
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <Button asChild size="lg" variant="outline">
          {/* phone_click is fired by the delegated PhoneClickTracker (see
              app/layout.tsx); an onClick here would double-count it. */}
          <a href={siteConfig.phoneTel} data-cta="phone-sticky">
            <Phone className="size-4" />
            Call
          </a>
        </Button>
        <Button asChild size="lg" variant="gold">
          <Link
            href={siteConfig.quotePath}
            onClick={() =>
              trackEvent("cta_click", { label: "sticky_schedule", location: "sticky" })
            }
          >
            <CalendarCheck className="size-4" />
            Schedule
          </Link>
        </Button>
      </div>
    </div>
  );
}
