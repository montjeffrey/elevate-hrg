import type { MetadataRoute } from "next";
import { counties } from "@/lib/locations-data";
import { pageSeo } from "@/content/service-pages";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

const servicePaths = new Set<string>(services.map((service) => service.href));
const serviceCounties = Object.values(counties);

// Legal pages: not in pageSeo (no schema needed) but should be crawlable at low priority.
const legalRoutes = ["/privacy", "/terms"];

// Careers: deliberately NOT a pageSeo entry. pageSeo drives createMetadata(),
// and app/careers/page.tsx declares its own richer metadata (OG image, Twitter
// card) — a pageSeo row would be dead config that silently disagrees with the
// page. It still belongs in the sitemap, so it is listed here instead.
const standaloneRoutes = ["/careers"];

function priorityFor(path: string): number {
  if (path === "/") return 1.0;
  // Below the service pages it supports, above the legal boilerplate.
  if (path === "/careers") return 0.5;
  if (servicePaths.has(path)) return 0.9;
  // /service-areas hub
  if (path === "/service-areas") return 0.8;
  // County pages: /service-areas/<county>  (depth 3 segments)
  if (path.startsWith("/service-areas/") && path.split("/").length === 3) return 0.8;
  // City pages: /service-areas/<county>/<city>  (depth 4 segments)
  if (path.startsWith("/service-areas/") && path.split("/").length === 4) return 0.6;
  // Blog posts
  if (path.startsWith("/blog/")) return 0.6;
  // Legal pages
  if (legalRoutes.includes(path)) return 0.3;
  return 0.7;
}

function toSitemapEntry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: priorityFor(path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = pageSeo.map((page) => page.path).filter((path) => path !== "/blog");
  const countyRoutes = serviceCounties.map((county) => `/service-areas/${county.slug}`);
  const cityRoutes = serviceCounties.flatMap((county) =>
    county.cities.map((city) => `/service-areas/${county.slug}/${city.slug}`)
  );
  // Blog is on an interim no-index hold (see app/blog/page.tsx), so its URLs are
  // intentionally excluded from the sitemap to avoid mixed indexing signals.
  return [...staticRoutes, ...countyRoutes, ...cityRoutes, ...standaloneRoutes, ...legalRoutes].map(
    toSitemapEntry
  );
}
