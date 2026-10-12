import type { Metadata } from "next";
import { HeroHome } from "@/components/site/HeroHome";
import { TrustStrip } from "@/components/site/TrustStrip";
import { HomeLeadCard } from "@/components/site/HomeLeadCard";
import { WhatWeDo } from "@/components/site/WhatWeDo";
import { Services } from "@/components/site/Services";
import { WhyElevate } from "@/components/site/WhyElevate";
import { Process } from "@/components/site/Process";
import { ComplimentaryConsultation } from "@/components/site/ComplimentaryConsultation";
import { HomeImageStrip } from "@/components/site/HomeImageStrip";
import { FeaturedWork } from "@/components/site/FeaturedWork";
import { ReviewMarquee } from "@/components/site/ReviewMarquee";
import { Testimonials } from "@/components/site/Testimonials";
import { ServiceAreas } from "@/components/site/ServiceAreas";
import { FinalCTA } from "@/components/site/FinalCTA";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { MotionFeatures } from "@/components/motion/MotionFeatures";

export const metadata: Metadata = {
  title: "Roofing, Siding & Windows in NJ | Elevate HRG — Veteran-Owned",
  description:
    "Proudly Serving Homeowners Throughout New Jersey. Veteran-owned, NaVOBA-certified roofing, siding, windows & gutters with workmanship guaranteed.",
  alternates: { canonical: "https://elevatehrg.com/" },
  openGraph: {
    title: "Roofing, Siding & Windows in NJ | Elevate HRG — Veteran-Owned",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. Veteran-owned, NaVOBA-certified full-service exterior renovations.",
    url: "https://elevatehrg.com/",
    siteName: "Elevate HRG",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/brand/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Elevate HRG — veteran-owned roofing, siding & window renovations in New Jersey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roofing, Siding & Windows in NJ | Elevate HRG — Veteran-Owned",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. Veteran-owned, NaVOBA-certified full-service exterior renovations.",
    images: ["/brand/og-default.jpg"],
  },
};

export default function Home() {
  return (
    <MotionFeatures>
      <main id="main-content" className="flex min-h-dvh w-full flex-col">
        <WebSiteJsonLd />
        <HeroHome />
        <TrustStrip />
        <ReviewMarquee />
        <HomeLeadCard />
        <WhatWeDo />
        <WhyElevate />
        <Services />
        <Process />
        <ComplimentaryConsultation />
        <HomeImageStrip />
        <FeaturedWork />
        <Testimonials />
        <ServiceAreas />
        <FinalCTA />
      </main>
    </MotionFeatures>
  );
}
