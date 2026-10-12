import { createBreadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createBreadcrumbSchema(items)),
      }}
    />
  );
}
