import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/service/ServicePageTemplate";
import { canonicalUrl, createMetadata, findPageSeo } from "@/lib/seo";
import { services as servicesData } from "@/lib/services-data";

const pageSeo = findPageSeo("/windows")!;
const serviceData = servicesData.windows;

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
        url: "/brand/og-windows.jpg",
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
    images: ["/brand/og-windows.jpg"],
  },
};

export default function WindowsPage() {
  return <ServicePageTemplate slug="windows" />;
}
