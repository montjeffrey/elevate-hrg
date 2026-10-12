import { createLocalBusinessSchema } from "@/lib/schema";

export function LocalBusinessJsonLd({ areaServed }: { areaServed?: string | string[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createLocalBusinessSchema(areaServed)),
      }}
    />
  );
}
