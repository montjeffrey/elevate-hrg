import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Layers,
  Shield,
  Square,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ServiceIntro } from "@/components/service/ServiceIntro";
import { ServiceSubServices } from "@/components/service/ServiceSubServices";
import { ServiceMaterials } from "@/components/service/ServiceMaterials";
import { ServiceProcess } from "@/components/service/ServiceProcess";
import { ServiceFinancingTeaser } from "@/components/service/ServiceFinancingTeaser";
import { ServiceAreaMention } from "@/components/service/ServiceAreaMention";
import { ServiceFeaturedProjects } from "@/components/service/ServiceFeaturedProjects";
import { ServiceFAQ } from "@/components/service/ServiceFAQ";
import { ServiceFinalCTA } from "@/components/service/ServiceFinalCTA";
import { RoofSystemStack } from "@/components/service/RoofSystemStack";
import { SidingSwatchRail } from "@/components/service/SidingSwatchRail";
import { AtticHeatLossDiagram } from "@/components/service/AtticHeatLossDiagram";
import { EnergyZoneCallout } from "@/components/service/EnergyZoneCallout";
import { GutterFormingCallout } from "@/components/service/GutterFormingCallout";
import { SoffitFasciaProfileGrid } from "@/components/service/SoffitFasciaProfileGrid";
import { DoorAnatomyPanel } from "@/components/service/DoorAnatomyPanel";

// Bespoke per-page hero components — statically imported so next/image's
// priority preload (fetchpriority=high) is emitted for the LCP hero image.
import { RoofingHero } from "@/components/service/heroes/RoofingHero";
import { WindowsHero } from "@/components/service/heroes/WindowsHero";
import { SidingHero } from "@/components/service/heroes/SidingHero";
import { GuttersHero } from "@/components/service/heroes/GuttersHero";
import { SoffitFasciaHero } from "@/components/service/heroes/SoffitFasciaHero";
import { EntryDoorsHero } from "@/components/service/heroes/EntryDoorsHero";
import { AtticHero } from "@/components/service/heroes/AtticHero";

// Lazy-load GSAP-heavy motion components so the SplitText/ScrollTrigger
// bundle is split out of the initial client chunk for service routes.
// `ssr: true` preserves static HTML for SEO/CLS while shipping the JS
// in a separate async chunk after hydration.
const MaskReveal = dynamic(
  () => import("@/components/motion/MaskReveal").then((m) => m.MaskReveal),
  { ssr: true }
);
const SplitHeading = dynamic(
  () => import("@/components/motion/SplitHeading").then((m) => m.SplitHeading),
  { ssr: true }
);
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { services, type ServiceSlug } from "@/content/services";
import { serviceFaqs } from "@/content/faqs";
import { serviceContent, processStepsForService } from "@/content/service-content";
import { projects } from "@/content/projects";
import { services as servicesData } from "@/lib/services-data";
import { findPageSeo } from "@/lib/seo";
import { serviceVisualConfig, type ServiceVisualSectionId } from "@/lib/service-visual-config";

type ServicePageTemplateProps = {
  slug: ServiceSlug;
};

const roofingIconMap: Record<string, LucideIcon> = {
  "Asphalt Shingle Roof Replacement": Layers,
  "Metal Roofing Systems": Shield,
  "Flat & Low-Slope Roofing": Square,
  "Storm Damage & Insurance Work": Zap,
  "Decking, Ventilation & Flashing": Wrench,
  "Skylights & Daylighting": Sun,
};

export function ServicePageTemplate({ slug }: ServicePageTemplateProps) {
  const service = services.find((entry) => entry.slug === slug);
  const data = servicesData[slug];
  const content = serviceContent[slug];
  const faqs = serviceFaqs[slug];
  const pageSeo = findPageSeo(`/${slug}`);

  if (!service || !data || !content || !pageSeo) {
    throw new Error(`Missing service configuration for slug "${slug}"`);
  }

  const visualConfig = serviceVisualConfig[slug];

  const subServices =
    data.subServices ??
    (data.features ?? []).map((feature) => ({
      title: feature,
      description: "",
    }));

  const featuredProjects = content.featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  const introParagraphs = [data.fullDescription, content.intro].filter((text): text is string =>
    Boolean(text && text.trim().length > 0)
  );

  const relatedServices = content.relatedServices
    .map((relatedSlug) => services.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const renderSection = (id: ServiceVisualSectionId) => {
    switch (id) {
      case "intro":
        return (
          <ServiceIntro
            key="intro"
            eyebrow="THE SCOPE"
            heading={content.brandH2}
            paragraphs={introParagraphs}
            callout={visualConfig.callout}
          />
        );
      case "subServices":
        return (
          <ServiceSubServices
            key="subServices"
            heading={`What a ${service.title.toLowerCase()} project covers.`}
            items={subServices.filter((item) => Boolean(item.title))}
            style={visualConfig.subServicesStyle}
            iconMap={slug === "roofing" ? roofingIconMap : undefined}
          />
        );
      case "materials":
        return (
          <ServiceMaterials
            key="materials"
            heading="Materials and manufacturers we install."
            manufacturers={content.manufacturers ?? data.manufacturers ?? []}
          />
        );
      case "process":
        return (
          <ServiceProcess
            key="process"
            heading="Your Experience, Our Top Priority."
            steps={processStepsForService(slug)}
          />
        );
      case "financing":
        return <ServiceFinancingTeaser key="financing" />;
      case "areas":
        return <ServiceAreaMention key="areas" counties={data.counties} />;
      case "featured":
        return (
          <ServiceFeaturedProjects
            key="featured"
            heading="See the difference workmanship makes."
            projects={featuredProjects}
          />
        );
      case "faq":
        return (
          <ServiceFAQ key="faq" heading={`${service.title} questions, answered.`} entries={faqs} />
        );
      case "related":
        return relatedServices.length > 0 ? (
          <section
            key="related"
            className="bg-brand-sandstone/15 py-20 sm:py-28"
            data-testid="service-related-rail"
          >
            <div className="container mx-auto px-4 md:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <MaskReveal>
                  <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
                    RELATED SERVICES
                  </p>
                </MaskReveal>
                <SplitHeading as="h2" text="Often paired with this project." />
              </div>

              <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                {relatedServices.map((related, index) => (
                  <MaskReveal key={related.slug} delay={0.1 + index * 0.1}>
                    <Link
                      href={related.href}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-brand-charcoal/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div>
                        <div className="mb-4 h-0.5 w-10 bg-brand-gold-deep/70" aria-hidden="true" />
                        <h3 className="font-display text-xl font-semibold leading-snug text-brand-charcoal">
                          {related.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-brand-warm-gray">
                          {related.description}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center text-sm font-semibold text-brand-charcoal underline decoration-brand-gold-deep underline-offset-4">
                        Explore {related.title}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </MaskReveal>
                ))}
              </div>
            </div>
          </section>
        ) : null;
      case "uniqueHook":
        if (slug === "roofing") return <RoofSystemStack key="uniqueHook" />;
        if (slug === "siding") return <SidingSwatchRail key="uniqueHook" />;
        if (slug === "attic-insulation") return <AtticHeatLossDiagram key="uniqueHook" />;
        if (slug === "windows") return <EnergyZoneCallout key="uniqueHook" />;
        if (slug === "gutters") return <GutterFormingCallout key="uniqueHook" />;
        if (slug === "soffit-fascia") return <SoffitFasciaProfileGrid key="uniqueHook" />;
        if (slug === "entry-doors") return <DoorAnatomyPanel key="uniqueHook" />;
        return null;
      default:
        return null;
    }
  };

  return (
    <main id="main-content" className="bg-brand-cream pb-24 lg:pb-0">
      <ServiceJsonLd service={service} />
      <FAQJsonLd entries={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: pageSeo.label, path: pageSeo.path },
        ]}
      />

      {slug === "roofing" && (
        <RoofingHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "windows" && (
        <WindowsHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "siding" && (
        <SidingHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "gutters" && (
        <GuttersHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "soffit-fascia" && (
        <SoffitFasciaHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "entry-doors" && (
        <EntryDoorsHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}
      {slug === "attic-insulation" && (
        <AtticHero
          slug={slug}
          eyebrow={service.title}
          heading={pageSeo.h1}
          blurb={data.shortDescription}
          heroImage={data.heroImage}
          heroImageAlt={`${service.title} project by Elevate HRG`}
        />
      )}

      {visualConfig.sectionOrder.map((sectionId) => renderSection(sectionId))}

      <ServiceFinalCTA
        heading={`Ready to talk about your ${service.title.toLowerCase()} project?`}
        subheading="Free consultations. Honest estimates. Same-day call-back, every time."
      />
    </main>
  );
}
