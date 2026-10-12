"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProjectMedia } from "@/components/site/gallery/ProjectMedia";
import { hasAnyRealImage, projects } from "@/content/projects";
import type { ServiceSlug } from "@/content/services";

type FilterValue = "all" | ServiceSlug;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "roofing", label: "Roofing" },
  { value: "siding", label: "Siding" },
  { value: "windows", label: "Windows" },
  { value: "soffit-fascia", label: "Soffit & Fascia" },
  { value: "gutters", label: "Gutters" },
  { value: "entry-doors", label: "Entry Doors & Storm Doors" },
  { value: "attic-insulation", label: "Attic Insulation" },
];

function isFilterValue(value: string): value is FilterValue {
  return FILTERS.some((filter) => filter.value === value);
}

interface GalleryContentProps {
  activeFilter: string;
}

export function GalleryContent({ activeFilter }: GalleryContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizedFilter: FilterValue = isFilterValue(activeFilter) ? activeFilter : "all";

  const filteredProjects = useMemo(() => {
    // Only show projects that have at least one real photo — never brand-stock
    // placeholders dressed up as a real job. They reappear once a photo is added.
    const withPhotos = projects.filter(hasAnyRealImage);
    if (normalizedFilter === "all") {
      return withPhotos;
    }
    return withPhotos.filter((project) => project.service === normalizedFilter);
  }, [normalizedFilter]);

  const handleFilterClick = useCallback(
    (value: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("service");
      } else {
        params.set("service", value);
      }
      const query = params.toString();
      const url = query ? `${pathname}?${query}#gallery-grid` : `${pathname}#gallery-grid`;
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const count = filteredProjects.length;

  return (
    <div id="gallery-grid">
      {/* Sticky filter bar — utilitarian, secondary to the hero H1 */}
      <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-charcoal/10">
        <div className="container mx-auto px-4 md:px-8 py-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-warm-gray"
              aria-hidden="true"
            >
              Filter
            </span>
            <div
              role="group"
              aria-label="Filter projects by service"
              className="flex flex-wrap gap-x-1 gap-y-1"
            >
              {FILTERS.map((filter) => {
                const active = filter.value === normalizedFilter;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleFilterClick(filter.value)}
                    className={
                      active
                        ? "inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium transition-colors text-brand-charcoal bg-brand-charcoal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 focus-visible:ring-offset-brand-cream"
                        : "inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium transition-colors text-brand-warm-gray hover:text-brand-charcoal hover:bg-brand-charcoal/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 focus-visible:ring-offset-brand-cream"
                    }
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="bg-brand-cream py-12">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-sm text-brand-warm-gray mb-8">
            Showing {count} project{count === 1 ? "" : "s"}
          </p>

          {count === 0 ? (
            <p className="text-brand-warm-gray text-center py-12">
              No projects in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filteredProjects.map((project) => (
                <article key={project.id} className="flex flex-col">
                  <ProjectMedia
                    project={project}
                    className="mb-4 rounded-xl overflow-hidden shadow-sm ring-1 ring-brand-charcoal/10"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-bronze">
                      {project.serviceLabel}
                    </span>
                    <span className="text-brand-charcoal/30" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-sm text-brand-warm-gray">{project.location}</span>
                    {project.material ? (
                      <>
                        <span className="text-brand-charcoal/30" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-sm text-brand-warm-gray">{project.material}</span>
                      </>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
