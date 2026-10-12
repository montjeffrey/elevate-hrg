import type { Metadata } from "next";
import { FinalCTA } from "@/components/site/FinalCTA";
import { ReviewsHero } from "@/components/site/reviews/ReviewsHero";
import { ReviewHighlights } from "@/components/site/reviews/ReviewHighlights";
import { ReviewsGrid } from "@/components/site/reviews/ReviewsGrid";
import { WriteAReviewStrip } from "@/components/site/reviews/WriteAReviewStrip";
import { siteConfig } from "@/lib/site-config";

const canonical = new URL("/reviews", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "Read what New Jersey homeowners say about Elevate HRG roofing, siding, window, and exterior renovation projects across northern and central New Jersey.";

export const metadata: Metadata = {
  title: "Homeowner Reviews | NJ Exterior Remodeling | Elevate HRG",
  description,
  alternates: { canonical },
  openGraph: {
    title: "Homeowner Reviews | NJ Exterior Remodeling | Elevate HRG",
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
    title: "Homeowner Reviews | NJ Exterior Remodeling | Elevate HRG",
    description,
    images: [ogImage],
  },
};

export default function ReviewsPage() {
  return (
    <main id="main-content">
      <ReviewsHero />
      <ReviewHighlights />
      <ReviewsGrid />
      <WriteAReviewStrip />
      <FinalCTA />
    </main>
  );
}
