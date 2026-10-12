import type { Metadata } from "next";
import { pageSeo, type PageSeo } from "@/content/service-pages";
import { siteConfig } from "@/lib/site-config";

const DEVELOPMENT_ROUTES = new Set(["/playground/motion"]);

export function canonicalUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function titleWithBrand(title: string) {
  if (title.includes(siteConfig.name)) return title;

  const brandedTitle = `${title} | ${siteConfig.name}`;
  return brandedTitle.length <= 60 ? brandedTitle : title;
}

export function isNoIndexPath(path: string) {
  return DEVELOPMENT_ROUTES.has(path);
}

export function metadataDescription(page: PageSeo) {
  return page.description;
}

export function findPageSeo(path: string) {
  return pageSeo.find((page) => page.path === path);
}

export function createMetadata(page: PageSeo): Metadata {
  return {
    // `absolute` bypasses the root layout's `title.template`, which would
    // otherwise append the brand a SECOND time ("… | Elevate HRG | Elevate
    // HRG"). titleWithBrand() already adds it and enforces the 60-char budget
    // against the final string — the template ran after that check, silently
    // defeating it. Routes that set a bare string title still get the template.
    title: { absolute: titleWithBrand(page.title) },
    description: metadataDescription(page),
    alternates: {
      canonical: canonicalUrl(page.path),
    },
    robots: isNoIndexPath(page.path)
      ? {
          follow: false,
          index: false,
        }
      : undefined,
  };
}
