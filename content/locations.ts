/**
 * @deprecated Use `@/lib/locations-data` directly.
 *
 * This module used to host a parallel (smaller) county list and caused drift
 * with the routing source. It now re-exports from the canonical source so any
 * stale import continues to compile. Delete after 2026-07-01 once any external
 * references are removed.
 */
import { counties } from "@/lib/locations-data";

export type ServiceCity = {
  name: string;
  slug: string;
};

export type ServiceCounty = {
  name: string;
  slug: string;
  state: "NJ";
  cities: ServiceCity[];
};

export const serviceCounties: ServiceCounty[] = Object.values(counties).map((c) => ({
  name: c.name,
  slug: c.slug,
  state: "NJ" as const,
  cities: c.cities.map(({ name, slug }) => ({ name, slug })),
}));
