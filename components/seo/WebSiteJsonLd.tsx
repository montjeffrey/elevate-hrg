import { createWebSiteSchema } from "@/lib/schema";

export function WebSiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(createWebSiteSchema()),
      }}
    />
  );
}
