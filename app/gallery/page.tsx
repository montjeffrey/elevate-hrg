import type { Metadata } from "next";
import { Suspense } from "react";
import { FinalCTA } from "@/components/site/FinalCTA";
import { GalleryHero } from "@/components/site/gallery/GalleryHero";
import { GalleryContent } from "@/components/site/gallery/GalleryContent";
import { TownStrip } from "@/components/site/gallery/TownStrip";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/gallery", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Browse real exterior remodeling before-and-afters across northern and central New Jersey. Roofing, siding, windows, soffit, fascia, gutters, and entry doors.";

export const metadata: Metadata = {
  title: "NJ Exterior Renovation Project Gallery | Elevate HRG",
  description,
  alternates: { canonical },
  openGraph: {
    title: "NJ Exterior Renovation Project Gallery | Elevate HRG",
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
    title: "NJ Exterior Renovation Project Gallery | Elevate HRG",
    description,
    images: [ogImage],
  },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const activeFilter = service ?? "all";

  return (
    <main id="main-content">
      <GalleryHero />
      <Suspense fallback={null}>
        <GalleryContent activeFilter={activeFilter} />
      </Suspense>
      <TownStrip />
      <FinalCTA />
    </main>
  );
}
