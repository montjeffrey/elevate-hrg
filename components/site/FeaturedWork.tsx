"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectMedia } from "@/components/site/gallery/ProjectMedia";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { featuredProjects } from "@/content/projects";

// Single source of truth: the home page features the same project entries the
// gallery uses (titles, locations, materials, and before/after handling all come
// from content/projects.ts), so labels never drift between home and gallery.
const projects = featuredProjects(2);

export function FeaturedWork() {
  return (
    <section className="bg-brand-sandstone/10 py-24 sm:py-32" data-testid="featured-work-section">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MaskReveal>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-bronze mb-4">
              INSPIRATION
            </p>
          </MaskReveal>
          <SplitHeading as="h2" text="Recent New Jersey home remodeling projects." />
          <MaskReveal delay={0.1}>
            <p className="mt-6 text-lg leading-8 text-brand-charcoal/80">
              Transform your space, elevate your life — real before-and-afters from homes across
              northern and central New Jersey. No stock photos.
            </p>
          </MaskReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div key={project.id} className="flex flex-col">
              <MaskReveal delay={0.1 * index}>
                <div>
                  <ProjectMedia
                    project={project}
                    className="mb-6 shadow-sm ring-1 ring-brand-charcoal/5"
                  />
                  <p className="text-center text-sm font-medium text-brand-charcoal/80">
                    <span className="text-brand-bronze font-semibold">{project.serviceLabel}</span>
                    <span className="mx-2 text-brand-charcoal/30">·</span>
                    {project.location}
                    {project.material ? (
                      <>
                        <span className="mx-2 text-brand-charcoal/30">·</span>
                        {project.material}
                      </>
                    ) : null}
                  </p>
                </div>
              </MaskReveal>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <MaskReveal delay={0.3}>
            <Link
              href="/gallery"
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand-gold-deep px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-deep"
            >
              View the Full Gallery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
