"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { processFaqs } from "@/content/faqs";

export function ProcessFAQ() {
  return (
    <section className="bg-brand-cream py-20 sm:py-28" data-testid="process-faq-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
            FREQUENTLY ASKED
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-charcoal md:text-5xl">
            Process questions, answered.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-brand-charcoal/10 bg-white px-6 py-2 shadow-sm sm:px-8">
          <Accordion type="single" collapsible className="w-full">
            {processFaqs.map((entry, index) => (
              <AccordionItem key={index} value={`process-faq-${index}`}>
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
      </div>
    </section>
  );
}
