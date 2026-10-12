import type { Service } from "@/content/services";
import { createServiceSchema } from "@/lib/schema";

export function ServiceJsonLd({ service }: { service: Service }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createServiceSchema(service)),
      }}
    />
  );
}
