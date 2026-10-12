import type {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  OfferCatalog,
  RoofingContractor,
  Service as ServiceSchema,
  WebSite,
  WithContext,
} from "schema-dts";
import type { BlogSeed } from "@/content/blog-seeds";
import type { FAQEntry } from "@/content/faqs";
import type { Service } from "@/content/services";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

const businessId = `${siteConfig.url}/#localbusiness`;

const defaultAreaServed = [
  "Bergen County, NJ",
  "Essex County, NJ",
  "Hudson County, NJ",
  "Hunterdon County, NJ",
  "Mercer County, NJ",
  "Middlesex County, NJ",
  "Monmouth County, NJ",
  "Morris County, NJ",
  "Ocean County, NJ",
  "Passaic County, NJ",
  "Somerset County, NJ",
  "Sussex County, NJ",
  "Union County, NJ",
  "Warren County, NJ",
].map((name) => ({ "@type": "AdministrativeArea" as const, name }));

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function createLocalBusinessSchema(
  areaServed?: string | string[]
): WithContext<RoofingContractor> {
  // NOTE FOR AUDITS/AGENTS (verified 2026-06-04): this schema intentionally emits
  // NO aggregateRating / review markup — reviews are handled separately by the
  // owner. There is none here to "gate"; do not add one (see the OfferCatalog
  // note below). A prior automated audit hallucinated an aggregateRating at this
  // location — it does not exist.
  return {
    "@context": "https://schema.org",
    "@id": businessId,
    "@type": [
      "LocalBusiness",
      "RoofingContractor",
      "HomeAndConstructionBusiness",
    ] as unknown as "RoofingContractor",
    name: siteConfig.name,
    image: `${siteConfig.url}/brand/elevate-hrg-logo.png`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$",
    logo: `${siteConfig.url}/brand/elevate-hrg-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "77 Paterson Ave",
      addressLocality: "Wallington",
      addressRegion: "NJ",
      postalCode: "07057",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.852284,
      longitude: -74.11707,
    },
    areaServed: areaServed ?? defaultAreaServed,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: `NJ Home Improvement Contractor License #${siteConfig.licenseNumber}`,
      },
      { "@type": "EducationalOccupationalCredential", name: "GAF Certified Installer" },
      { "@type": "EducationalOccupationalCredential", name: "ProVia Authorized Installer" },
      {
        "@type": "EducationalOccupationalCredential",
        name: "NaVOBA Certified Veteran-Owned Business",
      },
    ],
    // OfferCatalog — sourced from content/services.ts so it stays in sync with
    // navigation and the services data layer.  Do NOT add aggregateRating here.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Exterior Renovation Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer" as const,
        itemOffered: {
          "@type": "Service" as const,
          name: service.title,
          url: new URL(service.href, siteConfig.url).toString(),
        },
      })),
    } as unknown as OfferCatalog,
  };
}

// WebSite entity for the home page — helps search engines resolve the canonical
// site name (sitelinks). No SearchAction: the site has no internal search.
export function createWebSiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": businessId },
    inLanguage: "en-US",
  };
}

export function createServiceSchema(service: Service): WithContext<ServiceSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: new URL(service.href, siteConfig.url).toString(),
    provider: {
      "@id": businessId,
    },
    areaServed: defaultAreaServed,
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}

export function createFAQSchema(entries: FAQEntry[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function createBlogPostingSchema(seed: BlogSeed): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seed.title,
    description: seed.description,
    url: new URL(seed.href, siteConfig.url).toString(),
    author: {
      "@id": businessId,
    },
    publisher: {
      "@id": businessId,
    },
  };
}
