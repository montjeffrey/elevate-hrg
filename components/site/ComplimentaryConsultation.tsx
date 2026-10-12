import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ComplimentaryConsultation() {
  return (
    <section className="bg-brand-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-bronze">
          Complimentary Consultation
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-charcoal sm:text-3xl lg:text-4xl">
          Every project starts with a free, no-obligation walkthrough.
        </h2>
        <p className="mt-5 text-lg text-brand-warm-gray">
          We&apos;ll come out, measure what&apos;s actually there, talk through what&apos;s worth
          doing now and what can wait, and leave you with a written scope. No high-pressure sales,
          no anchored discounts that disappear in 24 hours.
        </p>
        <div className="mt-8">
          <Button asChild variant="primary" size="lg">
            <Link href={siteConfig.quotePath ?? "/quote"}>Start Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
