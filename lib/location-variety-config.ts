import type { ServiceSlug } from "@/content/services";

/**
 * Per-county hero/visual differentiation for the location-page templates.
 *
 * The 14 county pages (and ~130 city pages that inherit from them) previously
 * rendered the SAME hardcoded "/brand/roofing-hero.avif" hero with one fixed
 * gradient — a doorway-page risk that measured CRITICAL (variety 0.075).
 *
 * This config spreads REAL existing /public/brand/ images across counties using
 * Domain-5 housing-stock logic, so adjacent counties differ visibly. Each county
 * gets a hero image matched to its dominant housing stock, a primaryService
 * ServiceSlug matching that image, and an accentGlow (a CSS color for a radial
 * overlay) that varies by county.
 */
export interface CountyVarietyFields {
  /** Hero background image under /public/brand/. */
  heroImage?: string;
  /** The service that best represents this county's housing stock. */
  primaryService?: ServiceSlug;
  /** CSS color string for a subtle radial glow overlay on the hero. */
  accentGlow?: string;
  /** Optional section-ordering variant for future layout differentiation. */
  sectionVariant?: "standard" | "projects-first" | "climate-first";
}

// Per-city content now lives in `lib/city-variety-config.ts` (the `CityVariety`
// type + `cityVariety()` accessor), generated as data and wired into the city
// page template. The earlier `CityVarietyFields` stub here was never used.

// Brand image constants (all confirmed present under /public/brand/).
const IMG_ROOFING_HERO = "/brand/roofing-hero.avif";
const IMG_ROOFING_PHOTO = "/brand/Roofing-photo.png";
const IMG_SIDING = "/brand/siding-yellow-clapboard-wide.jpg";
const IMG_WINDOWS = "/brand/windows.jpg";
const IMG_WINDOW_UPGRADE = "/brand/window-upgrade.jpg";
const IMG_GUTTERS = "/brand/gutters.jpg";
const IMG_WHOLE_HOME =
  "/brand/Dark-gray-home-exterior-color-palette-DJI_0181-2880x1920-1-1536x1024.jpg";
const IMG_DOOR = "/brand/door.jpg";
// Real finished split-level/Cape exterior (clean clouds + lawn) — used for the
// multi-level Morris rooflines so it no longer reuses a shared roofing hero.
const IMG_MULTILEVEL_HOME = "/brand/siding-after.png";

// Accent glow palette — keyed to service family, varied per county below.
const GLOW_BRONZE = "rgba(149,98,34,0.18)"; // roofing
const GLOW_TEAL = "rgba(40,80,90,0.18)"; // gutters / low-slope
const GLOW_WARM = "rgba(178,118,58,0.18)"; // siding
const GLOW_SLATE = "rgba(70,90,120,0.18)"; // windows / older homes
const GLOW_GRAY = "rgba(90,96,104,0.18)"; // whole-home / suburban
const GLOW_AMBER = "rgba(196,140,52,0.18)"; // doors / curb appeal

/**
 * Filled for all 14 counties. Neighbors are deliberately given different images
 * and glows so the location set no longer reads as one templated doorway page.
 */
export const locationVarietyConfig: Record<string, CountyVarietyFields> = {
  // Home county — roofing-strong prewar Colonials & Tudors. Stays roofing-hero.
  bergen: {
    heroImage: IMG_ROOFING_HERO,
    primaryService: "roofing",
    accentGlow: GLOW_BRONZE,
    sectionVariant: "standard",
  },
  // Grand Victorians & 1920s Colonials in Montclair/Maplewood — siding work.
  essex: {
    heroImage: IMG_SIDING,
    primaryService: "siding",
    accentGlow: GLOW_WARM,
    sectionVariant: "projects-first",
  },
  // Densest county — brownstones, flat & low-slope roofs, tight urban lots.
  hudson: {
    heroImage: IMG_GUTTERS,
    primaryService: "gutters",
    accentGlow: GLOW_TEAL,
    sectionVariant: "standard",
  },
  // Rural restored 18th/19th-c farmhouses & river-town Victorians — re-side/restore.
  hunterdon: {
    heroImage: IMG_SIDING,
    primaryService: "siding",
    accentGlow: GLOW_WARM,
    sectionVariant: "projects-first",
  },
  // Urban Trenton rowhomes + Princeton — low-slope & gutter-heavy mix.
  mercer: {
    heroImage: IMG_GUTTERS,
    primaryService: "gutters",
    accentGlow: GLOW_TEAL,
    sectionVariant: "standard",
  },
  // Sprawling postwar Capes/ranches/splits — whole-home suburban replacements.
  middlesex: {
    heroImage: IMG_WHOLE_HOME,
    primaryService: "siding",
    accentGlow: GLOW_GRAY,
    sectionVariant: "standard",
  },
  // Coastal Victorian & shingle-style shore homes — salt-air siding & trim.
  monmouth: {
    heroImage: IMG_SIDING,
    primaryService: "siding",
    accentGlow: GLOW_WARM,
    sectionVariant: "climate-first",
  },
  // Multi-level 1950-85 rooflines with step flashing — complex roofing.
  // Uses a real finished multi-level home exterior (distinct from Bergen's
  // roofing-hero.avif and Ocean's coastal roof shot).
  morris: {
    heroImage: IMG_MULTILEVEL_HOME,
    primaryService: "roofing",
    accentGlow: GLOW_GRAY,
    sectionVariant: "standard",
  },
  // Harshest coastal wind/UV exposure — storm-tough roofing systems.
  // The roof-over-water photo reads as a shore-county roof and no longer
  // duplicates Bergen's roofing-hero.avif.
  ocean: {
    heroImage: IMG_ROOFING_PHOTO,
    primaryService: "roofing",
    accentGlow: GLOW_TEAL,
    sectionVariant: "climate-first",
  },
  // Early-1900s two/three-families — older window stock, near our shop.
  passaic: {
    heroImage: IMG_WINDOWS,
    primaryService: "windows",
    accentGlow: GLOW_SLATE,
    sectionVariant: "standard",
  },
  // Horse-country estates + suburbs — curb-appeal entry & whole-home work.
  somerset: {
    heroImage: IMG_DOOR,
    primaryService: "entry-doors",
    accentGlow: GLOW_AMBER,
    sectionVariant: "projects-first",
  },
  // High, cold ski-country — steep-pitch snow-load roofs & chalets.
  sussex: {
    heroImage: IMG_ROOFING_HERO,
    primaryService: "roofing",
    accentGlow: GLOW_BRONZE,
    sectionVariant: "climate-first",
  },
  // Stately 1920s Colonials & Tudors — older-home window replacements.
  union: {
    heroImage: IMG_WINDOW_UPGRADE,
    primaryService: "windows",
    accentGlow: GLOW_SLATE,
    sectionVariant: "standard",
  },
  // Rural farmhouses & river-town homes — older window/envelope upgrades.
  warren: {
    heroImage: IMG_WINDOW_UPGRADE,
    primaryService: "windows",
    accentGlow: GLOW_SLATE,
    sectionVariant: "projects-first",
  },
};

/** Safe accessor — returns the county's variety fields, or an empty object. */
export function countyVariety(slug: string): CountyVarietyFields {
  return locationVarietyConfig[slug] ?? {};
}
