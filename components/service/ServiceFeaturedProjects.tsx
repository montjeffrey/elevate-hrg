import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectMedia } from "@/components/site/gallery/ProjectMedia";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { type ProjectEntry } from "@/content/projects";

type ServiceFeaturedProjectsProps = {
  heading: string;
  projects: ProjectEntry[];
};

export function ServiceFeaturedProjects({ heading, projects }: ServiceFeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section
      className="bg-brand-sandstone/10 py-20 sm:py-28"
      data-testid="service-featured-projects"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <MaskReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bronze">
              RECENT PROJECTS
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text={heading} />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <MaskReveal key={project.id} delay={0.1 + index * 0.1}>
              <div className="flex flex-col">
                <ProjectMedia
                  project={project}
                  className="mb-5 shadow-sm ring-1 ring-brand-charcoal/5"
                />
                <p className="text-center text-sm font-medium text-brand-charcoal/80">
                  <span className="font-semibold text-brand-charcoal underline underline-offset-4 decoration-brand-gold-deep">
                    {project.serviceLabel}
                  </span>
                  <span className="mx-2 text-brand-charcoal/30">·</span>
                  {project.location}
                  {project.material ? (
                    <>
                      <span className="mx-2 text-brand-charcoal/30">·</span>
                      {project.material}
                    </>
                  ) : null}
                </p>
                {project.caption ? (
                  <p className="mt-2 text-center text-sm leading-relaxed text-brand-warm-gray">
                    {project.caption}
                  </p>
                ) : null}
              </div>
            </MaskReveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <MaskReveal delay={0.3}>
            <Link
              href="/gallery"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-brand-charcoal underline underline-offset-4 decoration-brand-gold-deep transition-colors hover:text-brand-espresso"
            >
              See more projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
