// Deprecated route. The canonical IA is top-level service URLs:
// /roofing, /windows, /siding, /gutters, /entry-doors, /attic-insulation.
//
// `next.config.ts` `redirects()` rewrites /services* → top-level routes at
// the routing layer (308 permanent), so this file should never render.
// The runtime redirect below is a safety net in case the config redirect
// is removed or misconfigured.

import { permanentRedirect } from "next/navigation";

export default function DeprecatedServicesHubPage(): never {
  permanentRedirect("/roofing");
}
