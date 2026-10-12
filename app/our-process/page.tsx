import type { Metadata } from "next";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Process } from "@/components/site/Process";
import { CrewAtWork } from "@/components/site/process/CrewAtWork";
import { OnSiteCommitments } from "@/components/site/process/OnSiteCommitments";
import { ProcessFAQ } from "@/components/site/process/ProcessFAQ";
import { processFaqs } from "@/content/faqs";
import { ProcessHero } from "@/components/site/process/ProcessHero";
import { StepArtifacts } from "@/components/site/process/StepArtifacts";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { siteConfig } from "@/lib/site-config";
import { MotionFeatures } from "@/components/motion/MotionFeatures";

const canonical = new URL("/our-process", siteConfig.url).toString();
const ogImage = new URL("/brand/roofing-hero.avif", siteConfig.url).toString();
const description =
  "From free consultation to final walkthrough — see exactly what Elevate HRG's NJ remodeling process looks like and what you get at every step.";

export const metadata: Metadata = {
  title: "Our 4-Step Exterior Remodeling Process | Elevate HRG NJ",
  description,
  alternates: { canonical },
  openGraph: {
    title: "Our 4-Step Exterior Remodeling Process | Elevate HRG NJ",
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
    title: "Our 4-Step Exterior Remodeling Process | Elevate HRG NJ",
    description,
    images: [ogImage],
  },
};

export default function ProcessPage() {
  return (
    <MotionFeatures>
      <main id="main-content">
        <FAQJsonLd entries={processFaqs} />
        <ProcessHero />
        <Process hideHeading />
        <StepArtifacts />
        <CrewAtWork />
        <OnSiteCommitments />
        <ProcessFAQ />
        <FinalCTA />
      </main>
    </MotionFeatures>
  );
}
