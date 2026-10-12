"use client";

import Image from "next/image";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import {
  hasBeforeAfterPair,
  projectImageFallback,
  resolveProjectImage,
  singleProjectImage,
  type ProjectEntry,
} from "@/content/projects";
import { cn } from "@/lib/utils";

type ProjectMediaProps = {
  project: ProjectEntry;
  className?: string;
};

/**
 * Renders project imagery honestly:
 *  - When a genuine pair (real before AND real after on disk) exists, show the
 *    interactive BeforeAfterSlider.
 *  - Otherwise show a single real photo (preferring the finished "after"), or an
 *    on-brand service image when no real photo exists yet — WITHOUT before/after
 *    framing, so we never present a placeholder or a duplicated image as a
 *    "before/after" comparison.
 *
 * As real photos are dropped into /public/projects (and removed from
 * MISSING_PROJECT_IMAGES), a project automatically upgrades to the slider.
 */
export function ProjectMedia({ project, className }: ProjectMediaProps) {
  if (hasBeforeAfterPair(project)) {
    const detail = `${project.location}${project.material ? `, ${project.material}` : ""}`;
    return (
      <BeforeAfterSlider
        beforeImage={resolveProjectImage(project, "before", { fallbackToBrand: true })}
        afterImage={resolveProjectImage(project, "after", { fallbackToBrand: true })}
        beforeFallback={projectImageFallback(project, "before")}
        afterFallback={projectImageFallback(project, "after")}
        beforeAlt={`${project.serviceLabel} before — ${detail}`}
        afterAlt={`${project.serviceLabel} after — ${detail}`}
        className={className}
      />
    );
  }

  const single = singleProjectImage(project);
  const src = single?.src ?? projectImageFallback(project, "after");
  const detail = `${project.location}${project.material ? `, ${project.material}` : ""}`;
  const alt = single
    ? `${project.serviceLabel} ${single.side === "before" ? "before" : "completed project"} — ${detail}`
    : `${project.serviceLabel} project — ${project.location}`;

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-xl bg-brand-sandstone/20",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
