import type { FAQEntry } from "@/content/faqs";
import { createFAQSchema } from "@/lib/schema";

export function FAQJsonLd({ entries }: { entries: FAQEntry[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createFAQSchema(entries)),
      }}
    />
  );
}
