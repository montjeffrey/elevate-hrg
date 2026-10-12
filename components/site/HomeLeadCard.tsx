"use client";

import Link from "next/link";

import { ShortLeadForm } from "@/components/forms/ShortLeadForm";

export function HomeLeadCard() {
  return (
    <section className="w-full bg-brand-cream py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl border border-brand-charcoal/10 bg-brand-sandstone/15 p-8 shadow-sm md:p-10">
          <h2 className="font-display text-2xl font-semibold text-brand-charcoal sm:text-3xl">
            Schedule a free estimate.
          </h2>
          <p className="mt-3 text-base leading-7 text-brand-warm-gray">
            Tell us what you need. We&apos;ll call back the same business day with next steps — no
            pressure, no anchored discounts.
          </p>

          <div className="mt-6">
            <ShortLeadForm />
          </div>

          <p className="mt-2 text-sm text-brand-warm-gray">
            <Link
              href="/quote"
              className="inline-flex min-h-11 items-center font-semibold text-brand-bronze hover:underline"
            >
              Fill out the full project form
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
