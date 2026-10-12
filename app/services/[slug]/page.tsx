// Deprecated route. The canonical IA is top-level service URLs:
// /roofing, /windows, /siding, /gutters, /entry-doors, /attic-insulation.
//
// `next.config.ts` `redirects()` rewrites /services/* → top-level routes at
// the routing layer (308 permanent), so this file should never render.
// The runtime redirect below is a safety net in case the config redirect
// is removed or misconfigured.

import { permanentRedirect } from "next/navigation";

const slugMap: Record<string, string> = {
  roofing: "/roofing",
  windows: "/windows",
  siding: "/siding",
  gutters: "/gutters",
  doors: "/entry-doors",
  "entry-doors": "/entry-doors",
  insulation: "/attic-insulation",
  "attic-insulation": "/attic-insulation",
};

interface DeprecatedServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function DeprecatedServicePage({
  params,
}: DeprecatedServicePageProps): Promise<never> {
  const { slug } = await params;
  permanentRedirect(slugMap[slug] ?? "/roofing");
}
