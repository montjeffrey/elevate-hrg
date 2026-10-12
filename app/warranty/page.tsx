import type { Metadata } from "next";
import { FinalCTA } from "@/components/site/FinalCTA";
import { WarrantyHero } from "@/components/site/warranty/WarrantyHero";
import { CoverageMatrix } from "@/components/site/warranty/CoverageMatrix";
import { WorkmanshipPromise } from "@/components/site/warranty/WorkmanshipPromise";
import { WarrantyFAQ } from "@/components/site/warranty/WarrantyFAQ";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { warrantyFaqs } from "@/content/faqs";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/warranty", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "See the exact materials and workmanship warranties Elevate HRG offers on every NJ exterior project. Written workmanship guarantee, manufacturer warranties registered the day we close out.";

export const metadata: Metadata = {
  title: "NJ Exterior Renovation Warranties | Elevate HRG",
  description,
  alternates: { canonical },
  openGraph: {
    title: "NJ Exterior Renovation Warranties | Elevate HRG",
    description,
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Elevate HRG exterior renovation in New Jersey",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NJ Exterior Renovation Warranties | Elevate HRG",
    description,
    images: [ogImage],
  },
};

export default function WarrantyPage() {
  return (
    <main id="main-content" className="pt-24">
      <FAQJsonLd entries={warrantyFaqs} />
      <WarrantyHero />
      <CoverageMatrix />
      <WorkmanshipPromise />
      <WarrantyFAQ />
      <FinalCTA />
    </main>
  );
}
