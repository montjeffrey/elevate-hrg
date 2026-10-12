import type { ServiceSlug } from "@/content/services";

/**
 * A real, completed project. Sourced from Elevate HRG's Instagram feed
 * (@elevate_hrg) so we can point at actual work on the public site.
 *
 * Image conventions:
 *   /projects/{countySlug}/{service}-{townSlug}-{n}-{before|after}.{ext}
 *
 * Each entry includes the source Instagram post URL via `sourceUrl` so the
 * marketing team can re-pull the original image if a higher-res copy is needed.
 * If a project photo hasn't been saved to /public/projects/ yet, the image
 * paths still follow the convention; the file just needs to be dropped in.
 */
export type ProjectEntry = {
  id: string;
  service: ServiceSlug;
  serviceLabel: string;
  /** Free-text town + state for display, e.g. "Wallington, NJ" */
  location: string;
  /**
   * Slug matching `lib/locations-data.ts` keys, e.g. "bergen".
   *
   * Optional: some projects arrive as photos with no confirmed town. We would
   * rather omit the county than assert one we cannot verify — the gallery
   * publishes under a real contractor licence, so every location claim has to be
   * true. Entries without a county are simply skipped by `projectsForCounty()`;
   * they still render in the gallery and on service pages.
   */
  county?: CountySlug;
  /** Slug for the town within that county; matches lib/locations-data.ts city slugs when applicable */
  townSlug?: string;
  material?: string;
  beforeImage: string;
  afterImage: string;
  caption?: string;
  /** Original Instagram post URL — keeps the file traceable to the source */
  sourceUrl?: string;
};

export type CountySlug =
  | "bergen"
  | "essex"
  | "hudson"
  | "hunterdon"
  | "mercer"
  | "middlesex"
  | "monmouth"
  | "morris"
  | "ocean"
  | "passaic"
  | "somerset"
  | "sussex"
  | "union"
  | "warren";

// Existing brand assets used as fallback hero/placeholder imagery until the
// matching real photo is saved into /public/projects/. The build won't break
// while real photos are still being collected.
const PLACEHOLDER = {
  roofing: "/brand/roofing-hero.avif",
  siding: { before: "/brand/siding-before.jpg", after: "/brand/siding-after.png" },
  windows: { before: "/brand/window-upgrade.jpg", after: "/brand/windows.jpg" },
  entryDoor: "/brand/door.jpg",
  slidingDoor: {
    before: "/brand/sliding-door-before.png",
    after: "/brand/sliding-door-after.png",
  },
  gutters: "/brand/gutters.jpg",
  exterior: "/brand/attic-insulation-hero.jpg",
} as const;

export const projects: ProjectEntry[] = [
  // ---------- Bergen County ----------
  {
    id: "windows-wallington-1",
    service: "windows",
    serviceLabel: "Windows",
    location: "Wallington, NJ",
    county: "bergen",
    townSlug: "wallington",
    material: "ProVia double-hung replacement windows",
    beforeImage: "/projects/bergen/windows-wallington-1-before.jpg",
    afterImage: "/projects/bergen/windows-wallington-1-after.jpg",
    caption:
      "Full-frame window upgrade tightening the exterior, lifting curb appeal, and cutting drafts on a brick-front Bergen County home.",
    sourceUrl: "https://www.instagram.com/p/DYA5c5CkfMV/",
  },
  {
    id: "siding-wallington-1",
    service: "siding",
    serviceLabel: "Siding",
    location: "Wallington, NJ",
    county: "bergen",
    townSlug: "wallington",
    material: "Insulated vinyl siding (modern color upgrade)",
    beforeImage: "/projects/bergen/siding-wallington-1-before.jpg",
    afterImage: "/projects/bergen/siding-wallington-1-after.jpg",
    caption:
      "Full siding refresh on a two-story Wallington home — clean color upgrade, crisp trim lines, and durable weather protection.",
    sourceUrl: "https://www.instagram.com/p/DXrmiuNFVgl/",
  },
  {
    id: "entry-doors-wallington-1",
    service: "entry-doors",
    serviceLabel: "Entry Door",
    location: "Wallington, NJ",
    county: "bergen",
    townSlug: "wallington",
    material: "ProVia entry door, stained wood finish",
    beforeImage: "/projects/bergen/entry-doors-wallington-1-before.jpg",
    afterImage: "/projects/bergen/entry-doors-wallington-1-after.jpg",
    caption:
      "ProVia entry door install with sidelights — security, energy efficiency, and a strong first impression at the curb.",
    sourceUrl: "https://www.instagram.com/p/DXlzyGMlK60/",
  },
  {
    id: "entry-doors-wallington-2",
    service: "entry-doors",
    serviceLabel: "Sliding Patio Door",
    location: "Wallington, NJ",
    county: "bergen",
    townSlug: "wallington",
    material: "ProVia sliding patio door",
    beforeImage: "/projects/bergen/entry-doors-wallington-2-before.jpg",
    afterImage: "/projects/bergen/entry-doors-wallington-2-after.jpg",
    caption:
      "Patio slider replacement — brighter interior, smoother operation, and a tighter seal against the elements.",
    sourceUrl: "https://www.instagram.com/p/DXj_CCWlVf7/",
  },
  {
    id: "roofing-wood-ridge-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "Wood-Ridge, NJ",
    county: "bergen",
    material: "GAF Timberline UHDZ shingles",
    beforeImage: "/projects/bergen/roofing-wood-ridge-1-before.jpg",
    afterImage: "/projects/bergen/roofing-wood-ridge-1-after.jpg",
    caption:
      "Full roof replacement with GAF Timberline UHDZ shingles — installed to GAF system standards for the lifetime warranty.",
    sourceUrl: "https://www.instagram.com/p/DTkoSX7jsaj/",
  },
  {
    id: "soffit-fascia-teaneck-1",
    service: "soffit-fascia",
    serviceLabel: "Soffit & Fascia",
    location: "Teaneck, NJ",
    county: "bergen",
    townSlug: "teaneck",
    material: "Vented aluminum soffit and color-matched fascia wrap",
    beforeImage: "/projects/bergen/soffit-fascia-teaneck-1-before.jpg",
    afterImage: "/projects/bergen/soffit-fascia-teaneck-1-after.jpg",
    caption:
      "Rotted fascia cut back to sound framing and rewrapped, with vented soffit sized to feed the attic — a finished, low-maintenance roofline in Teaneck.",
  },
  {
    id: "gutters-northvale-1",
    service: "gutters",
    serviceLabel: "Gutters",
    location: "Northvale, NJ",
    county: "bergen",
    townSlug: "northvale",
    material: 'Seamless 6" K-style aluminum gutters with micro-mesh guards',
    beforeImage: "/projects/bergen/gutters-northvale-1-before.jpg",
    afterImage: "/projects/bergen/gutters-northvale-1-after.jpg",
    caption:
      'Seamless 6" aluminum gutters formed on-site and strapped to freshly wrapped fascia, with micro-mesh guards added under heavy tree coverage in Northvale.',
  },
  {
    id: "siding-township-of-washington-1",
    service: "siding",
    serviceLabel: "Siding",
    location: "Township of Washington, NJ",
    county: "bergen",
    townSlug: "township-of-washington",
    material: "ProVia CedarMax insulated vinyl siding",
    beforeImage: "/projects/bergen/siding-township-of-washington-1-before.jpg",
    afterImage: "/projects/bergen/siding-township-of-washington-1-after.jpg",
    caption:
      "ProVia CedarMax insulated vinyl over corrected house wrap and flashing — a full envelope refresh in the Township of Washington.",
  },

  // ---------- Passaic County ----------
  {
    id: "roofing-west-milford-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "West Milford, NJ",
    county: "passaic",
    material: "GAF IronClad Roofing System, Timberline shingles",
    beforeImage: "/projects/passaic/roofing-west-milford-1-before.jpg",
    afterImage: "/projects/passaic/roofing-west-milford-1-after.jpg",
    caption:
      "Start-to-finish roof replacement using the GAF IronClad system — full tear-off, underlayment correction, ventilation upgrade, and certified install.",
    sourceUrl: "https://www.instagram.com/p/DNWzw9wsc92/",
  },
  {
    id: "windows-clifton-1",
    service: "windows",
    serviceLabel: "Windows",
    location: "Clifton, NJ",
    county: "passaic",
    townSlug: "clifton",
    material: "ProVia Endure vinyl double-hung",
    beforeImage: "/projects/passaic/windows-clifton-1-before.jpg",
    afterImage: "/projects/passaic/windows-clifton-1-after.jpg",
    caption:
      "Whole-home window replacement in Clifton with ProVia Endure — energy-efficient vinyl with full-frame seals and corrected flashing.",
    sourceUrl: "https://www.instagram.com/p/DNOt0Bsz-b0/",
  },
  {
    id: "windows-clifton-2",
    service: "windows",
    serviceLabel: "Windows",
    location: "Clifton, NJ",
    county: "passaic",
    townSlug: "clifton",
    material: "ProVia Endure vinyl windows",
    beforeImage: "/projects/passaic/windows-clifton-2-before.jpg",
    afterImage: "/projects/passaic/windows-clifton-2-after.jpg",
    caption:
      "Front and side elevation window upgrades on a Clifton home — clean trim lines and tighter seals.",
    sourceUrl: "https://www.instagram.com/p/DNOsM-rzKHG/",
  },
  {
    id: "roofing-clifton-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "Clifton, NJ",
    county: "passaic",
    townSlug: "clifton",
    material: "GAF Timberline UHDZ shingles in Charcoal",
    beforeImage: "/projects/passaic/roofing-clifton-1-before.jpg",
    afterImage: "/projects/passaic/roofing-clifton-1-after.jpg",
    caption: "GAF Timberline UHDZ Charcoal shingle replacement with full ventilation correction.",
    sourceUrl: "https://www.instagram.com/p/DNJj_EzzkLC/",
  },

  // ---------- Essex County ----------
  {
    id: "roofing-irvington-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "Irvington, NJ",
    county: "essex",
    townSlug: "irvington",
    material: "GAF IronClad Roofing System (certified install)",
    beforeImage: "/projects/essex/roofing-irvington-1-before.jpg",
    afterImage: "/projects/essex/roofing-irvington-1-after.jpg",
    caption:
      "Insurance-saving roof rescue for new homeowners — GAF IronClad certified install with lifetime warranty after a failing inspection report.",
    sourceUrl: "https://www.instagram.com/p/DNTr9erBLTG/",
  },

  // ---------- Union County ----------
  {
    id: "siding-linden-1",
    service: "siding",
    serviceLabel: "Siding",
    location: "Linden, NJ",
    county: "union",
    townSlug: "linden",
    material: "ProVia CedarMax insulated vinyl siding, Sea Slate color",
    beforeImage: "/projects/union/siding-linden-1-before.jpg",
    afterImage: "/projects/union/siding-linden-1-after.jpg",
    caption:
      "ProVia CedarMax insulated vinyl install in Sea Slate — Amish-made siding with house wrap, flashing, and trim coordination.",
    sourceUrl: "https://www.instagram.com/p/DTkpaa5DtUv/",
  },

  // ---------- Morris County ----------
  {
    id: "roofing-dover-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "Dover, NJ",
    county: "morris",
    townSlug: "dover",
    material: "GAF Timberline UHDZ shingles with ventilation upgrade",
    beforeImage: "/projects/morris/roofing-dover-1-before.jpg",
    afterImage: "/projects/morris/roofing-dover-1-after.jpg",
    caption:
      "Dover roof replacement with GAF Timberline UHDZ and corrected ridge-to-soffit ventilation balance.",
    sourceUrl: "https://www.instagram.com/p/DM0FVnZMbSi/",
  },

  // ---------- Somerset County ----------
  {
    id: "roofing-franklin-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "Franklin Township, NJ",
    county: "somerset",
    townSlug: "franklin-township",
    material: "GAF Timberline UHDZ architectural shingles",
    beforeImage: "/projects/somerset/roofing-franklin-1-before.jpg",
    afterImage: "/projects/somerset/roofing-franklin-1-after.jpg",
    caption:
      "Full roof replacement on a Somerset County ranch home — stripped to rafters, compromised decking replaced, and re-shingled with GAF Timberline UHDZ architectural shingles.",
  },

  // ===== LOCK: DO NOT ALTER THESE ENTRIES, THEIR IMAGE PATHS, OR THEIR CROPS =====
  // Client-approved additions (Aug 2026). The three image pairs below are
  // pre-cropped to 16:9 with deliberately MATCHED framing so the BeforeAfterSlider
  // (aspect-video) wipes cleanly between them. Re-cropping one side alone, or
  // substituting a portrait original, will break the comparison.
  // ---------- Town not yet confirmed ----------
  //
  // Sourced from Elevate HRG's own crew photos (shared via the company Discord,
  // Aug 2026). The photos are genuine and the before/after pairs are verified as
  // the same property, but the town, county, and product line were NOT supplied
  // with them. Captions therefore describe only what is visible in the frame —
  // no town, material, brand, or warranty claims. When the office confirms the
  // job details, add `county`, `townSlug`, `material`, and a richer caption, and
  // move the entry up into its county section.
  {
    id: "roofing-nj-1",
    service: "roofing",
    serviceLabel: "Roofing",
    location: "New Jersey",
    beforeImage: "/projects/nj/roofing-nj-1-before.jpg",
    afterImage: "/projects/nj/roofing-nj-1-after.jpg",
    caption:
      "Full roof replacement on a split-level home — aged, algae-streaked shingles stripped and replaced with clean architectural shingles, with the gutter line and roof edge reset behind them.",
  },
  {
    id: "windows-nj-1",
    service: "windows",
    serviceLabel: "Windows",
    location: "New Jersey",
    beforeImage: "/projects/nj/windows-nj-1-before.jpg",
    afterImage: "/projects/nj/windows-nj-1-after.jpg",
    caption:
      "Tired grid windows pulled out and replaced with a wide picture window flanked by double-hungs — more daylight, a tighter seal, and clean exterior trim.",
  },
  {
    id: "windows-nj-2",
    service: "windows",
    serviceLabel: "Windows",
    location: "New Jersey",
    // No confirmed "before" frame for this job — only the finished result and
    // mid-install shots, so this renders as a single completed photo rather than
    // a before/after comparison. See ProjectMedia / hasBeforeAfterPair.
    beforeImage: "",
    afterImage: "/projects/nj/windows-nj-2-after.jpg",
    caption:
      "Twin double-hung replacements with colonial grids, trimmed clean where the home's stone facade meets brick.",
  },
  // ===== END LOCK =====

  // ---------- Additional Verified Work ----------
  {
    id: "windows-nj-3",
    service: "windows",
    serviceLabel: "Windows",
    location: "New Jersey",
    material: "ProVia double-hung replacement windows and custom 4-lite bay window",
    beforeImage: "/projects/nj/windows-nj-3-before.jpg",
    afterImage: "/projects/nj/windows-nj-3-after.jpg",
    caption:
      "Whole-home window upgrade — replacing failing double-hungs and a dated dark bay window with energy-efficient custom vinyl units and crisp white exterior casing.",
  },
  {
    id: "bay-window-nj-1",
    service: "windows",
    serviceLabel: "Bay Window",
    location: "New Jersey",
    material: "Custom 4-lite bay window with insulated head & seat boards",
    beforeImage: "",
    afterImage: "/projects/nj/bay-window-nj-1-after.jpg",
    caption:
      "Close-up architectural detail of a custom white 4-lite bay window installation over brick, featuring high-performance insulated glass.",
  },
  {
    id: "siding-nj-2",
    service: "siding",
    serviceLabel: "Siding",
    location: "New Jersey",
    material: "Insulated vinyl siding with matching window trim",
    beforeImage: "",
    afterImage: "/projects/nj/siding-nj-2-after.jpg",
    caption:
      "Gable-end siding installation trimmed out around white double-hung windows, sealed tight against New Jersey weather.",
  },
  {
    id: "windows-nj-4",
    service: "windows",
    serviceLabel: "Windows",
    location: "New Jersey",
    material: "Vinyl slider window with custom picture-frame interior trim",
    beforeImage: "",
    afterImage: "/projects/nj/windows-nj-4-after.jpg",
    caption:
      "Interior view of a newly installed slider window with custom picture-frame casing, showing room-brightening daylight and precision trim carpentry.",
  },
];

// ---------- Helpers ----------

export function projectsForService(slug: ServiceSlug): ProjectEntry[] {
  return projects.filter((project) => project.service === slug);
}

export function projectsForCounty(slug: CountySlug): ProjectEntry[] {
  return projects.filter((project) => project.county === slug);
}

export function featuredProjects(limit = 2): ProjectEntry[] {
  // Prefer projects with distinct before/after pairs and strong visuals.
  // Currently we hand-pick by id to keep the home page punchy. Keep these limited
  // to genuine before/after pairs (see hasBeforeAfterPair) so the home page never
  // features a single-image / placeholder project as a comparison.
  const featuredIds = ["siding-wallington-1", "windows-wallington-1", "windows-clifton-2"];
  return featuredIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is ProjectEntry => Boolean(p))
    .slice(0, limit);
}

// ---------- Placeholder fallbacks (transitional) ----------
//
// While real photos are being downloaded into /public/projects/, the Image
// component will 404 on missing files. To prevent broken hero images during
// the transition, callers can use `resolveProjectImage()` which falls back to
// an existing /brand/ stock asset if the real file isn't there yet.

const SERVICE_FALLBACK: Record<ServiceSlug, { before: string; after: string }> = {
  roofing: { before: PLACEHOLDER.roofing, after: PLACEHOLDER.roofing },
  siding: { before: PLACEHOLDER.siding.before, after: PLACEHOLDER.siding.after },
  windows: { before: PLACEHOLDER.windows.before, after: PLACEHOLDER.windows.after },
  "soffit-fascia": { before: PLACEHOLDER.gutters, after: PLACEHOLDER.gutters },
  gutters: { before: PLACEHOLDER.gutters, after: PLACEHOLDER.gutters },
  "entry-doors": { before: PLACEHOLDER.entryDoor, after: PLACEHOLDER.entryDoor },
  "attic-insulation": { before: PLACEHOLDER.exterior, after: PLACEHOLDER.exterior },
};

/**
 * Project photo paths that follow the naming convention but have NOT yet been
 * saved into /public/projects/ (real photos are still being collected). Rendering
 * one directly makes the image optimizer 404 (→ HTTP 400) and, under a parallel
 * page crawl, funnels extra concurrent optimizer load onto the brand fallback
 * assets. `resolveProjectImage(..., { fallbackToBrand: true })` consults this set
 * so the slider requests the on-brand placeholder DIRECTLY instead of a known-404
 * path. (The slider's onError swap is still wired as a second safety net.)
 *
 * Keep this in sync with /public — `npm run check:images` reports drift: a path
 * listed here that now exists (remove it), or a missing file not listed here (add
 * it). When the real photo is dropped in, delete its entry so the slider shows it.
 */
const MISSING_PROJECT_IMAGES: ReadonlySet<string> = new Set([
  "/projects/bergen/entry-doors-wallington-1-before.jpg",
  "/projects/bergen/roofing-wood-ridge-1-before.jpg",
  "/projects/bergen/roofing-wood-ridge-1-after.jpg",
  "/projects/bergen/soffit-fascia-teaneck-1-before.jpg",
  "/projects/bergen/soffit-fascia-teaneck-1-after.jpg",
  "/projects/bergen/gutters-northvale-1-before.jpg",
  "/projects/bergen/gutters-northvale-1-after.jpg",
  "/projects/bergen/siding-township-of-washington-1-before.jpg",
  "/projects/bergen/siding-township-of-washington-1-after.jpg",
  "/projects/passaic/roofing-clifton-1-before.jpg",
  "/projects/passaic/roofing-clifton-1-after.jpg",
  "/projects/union/siding-linden-1-before.jpg",
  "/projects/union/siding-linden-1-after.jpg",
  "/projects/morris/roofing-dover-1-before.jpg",
  "/projects/morris/roofing-dover-1-after.jpg",
]);

/**
 * Returns the path to render for a project image. By default returns the
 * configured path verbatim. Pass `{ fallbackToBrand: true }` to substitute the
 * on-brand service placeholder whenever the real photo is not on disk yet (see
 * MISSING_PROJECT_IMAGES) — this avoids requesting a known-404 path for the photo.
 */
export function resolveProjectImage(
  project: ProjectEntry,
  side: "before" | "after",
  opts: { fallbackToBrand?: boolean } = {}
): string {
  const configured = side === "before" ? project.beforeImage : project.afterImage;
  if (!opts.fallbackToBrand) return configured;
  if (!configured || MISSING_PROJECT_IMAGES.has(configured)) {
    return SERVICE_FALLBACK[project.service][side];
  }
  return configured;
}

/**
 * On-brand placeholder for a project image, keyed by service. Used as the
 * `onError` fallback in the gallery and featured-project sliders so a missing
 * real photo degrades to an on-brand image instead of a broken tile. Unlike
 * `resolveProjectImage`, this returns the brand asset unconditionally — it is
 * meant to be passed as the fallback the slider swaps to when the configured
 * path fails to load.
 */
export function projectImageFallback(project: ProjectEntry, side: "before" | "after"): string {
  return SERVICE_FALLBACK[project.service][side];
}

/**
 * Whether the *real* project photo for a side is present on disk — i.e. a path is
 * configured and it is NOT in MISSING_PROJECT_IMAGES (the on-disk source of truth,
 * kept in sync by `npm run check:images`). Use this to decide whether to render a
 * genuine before/after comparison, so the UI never presents a brand placeholder
 * (or the same image twice) as if it were a real "before/after".
 */
export function hasRealImage(project: ProjectEntry, side: "before" | "after"): boolean {
  const configured = side === "before" ? project.beforeImage : project.afterImage;
  return Boolean(configured) && !MISSING_PROJECT_IMAGES.has(configured);
}

/** True only when BOTH a real before AND a real after exist — a genuine comparison. */
export function hasBeforeAfterPair(project: ProjectEntry): boolean {
  return hasRealImage(project, "before") && hasRealImage(project, "after");
}

/**
 * True when the project has at least one real photo (before or after). Projects
 * with NO real photo only have an on-brand stock placeholder, which looks like
 * filler in the gallery — callers use this to hide them until a real photo is
 * dropped in, rather than display brand stock as if it were a real job.
 */
export function hasAnyRealImage(project: ProjectEntry): boolean {
  return hasRealImage(project, "before") || hasRealImage(project, "after");
}

/**
 * The single best real image to show when a project lacks a genuine before/after
 * pair: prefer a real "after" (the finished result), else a real "before", else
 * null — in which case the caller should fall back to an on-brand service image.
 */
export function singleProjectImage(
  project: ProjectEntry
): { src: string; side: "before" | "after" } | null {
  if (hasRealImage(project, "after")) return { src: project.afterImage, side: "after" };
  if (hasRealImage(project, "before")) return { src: project.beforeImage, side: "before" };
  return null;
}
