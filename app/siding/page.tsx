import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/service/ServicePageTemplate";
import { canonicalUrl, createMetadata, findPageSeo } from "@/lib/seo";
import { services as servicesData } from "@/lib/services-data";

const pageSeo = findPageSeo("/siding")!;
const serviceData = servicesData.siding;

export const metadata: Metadata = {
  ...createMetadata(pageSeo),
  openGraph: {
    title: pageSeo.title,
    description: pageSeo.description,
    url: canonicalUrl(pageSeo.path),
    siteName: "Elevate HRG",
    type: "website",
    images: [
      {
        url: "/brand/og-siding.jpg",
        width: 1200,
        height: 630,
        alt: serviceData.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSeo.title,
    description: pageSeo.description,
    images: ["/brand/og-siding.jpg"],
  },
};

export default function SidingPage() {
  return <ServicePageTemplate slug="siding" />;
}
