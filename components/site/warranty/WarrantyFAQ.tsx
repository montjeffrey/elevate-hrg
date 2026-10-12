"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { warrantyFaqs } from "@/content/faqs";

export function WarrantyFAQ() {
  return (
    <section className="bg-brand-sandstone/20 py-20 sm:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
          FREQUENTLY ASKED
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-charcoal mb-12">
          Warranty questions, answered.
        </h2>

        <div className="rounded-2xl border border-brand-charcoal/10 bg-white px-6 py-2 shadow-sm sm:px-8">
          <Accordion type="single" collapsible className="w-full">
            {warrantyFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`warranty-faq-${index}`}>
                <AccordionTrigger className="text-base font-semibold text-brand-charcoal sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-brand-warm-gray sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
