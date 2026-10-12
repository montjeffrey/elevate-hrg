"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { FAQEntry } from "@/content/faqs";

type ServiceFAQProps = {
  heading: string;
  entries: FAQEntry[];
};

export function ServiceFAQ({ heading, entries }: ServiceFAQProps) {
  if (entries.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="service-faq-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              FREQUENTLY ASKED
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text={heading} />
        </div>

        <MaskReveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-brand-charcoal/10 bg-white px-6 py-2 shadow-sm sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {entries.map((entry, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-base font-semibold text-brand-charcoal sm:text-lg">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-brand-warm-gray sm:text-base">
                    {entry.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </MaskReveal>
      </div>
    </section>
  );
}
