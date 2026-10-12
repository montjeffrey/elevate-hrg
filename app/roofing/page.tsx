import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/service/ServicePageTemplate";
import { canonicalUrl, createMetadata, findPageSeo } from "@/lib/seo";
import { services as servicesData } from "@/lib/services-data";

const pageSeo = findPageSeo("/roofing")!;
const serviceData = servicesData.roofing;

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
        url: "/brand/og-roofing.jpg",
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
    images: ["/brand/og-roofing.jpg"],
  },
};

export default function RoofingPage() {
  return <ServicePageTemplate slug="roofing" />;
}
