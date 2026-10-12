// All 7 services are present below, INCLUDING "soffit-fascia" (a prior automated
// audit wrongly reported it missing — it IS in this union and the services array).
export type ServiceSlug =
  | "roofing"
  | "windows"
  | "siding"
  | "soffit-fascia"
  | "gutters"
  | "entry-doors"
  | "attic-insulation";

export type Service = {
  title: string;
  slug: ServiceSlug;
  href: `/${ServiceSlug}`;
  eyebrow: string;
  summary: string;
  description: string;
};

export const services: Service[] = [
  {
    title: "Roofing",
    slug: "roofing",
    href: "/roofing",
    eyebrow: "Roof replacements engineered for New Jersey weather.",
    summary: "Roofs that take the weather off your mind.",
    description:
      "GAF-certified asphalt and metal roof replacements installed by manufacturer-trained crews.",
  },
  {
    title: "Windows",
    slug: "windows",
    href: "/windows",
    eyebrow: "Replacement windows that quiet the house and cut the bill.",
    summary: "Replacement windows that quiet the house and the energy bill.",
    description: "ProVia and Energy Star-rated windows installed with full-frame care.",
  },
  {
    title: "Siding",
    slug: "siding",
    href: "/siding",
    eyebrow: "Siding installed to last decades, not seasons.",
    summary: "Siding that stops looking new in decades, not seasons.",
    description:
      "Insulated vinyl, fiber cement, and engineered wood installed with proper underlayment and flashing.",
  },
  {
    title: "Soffit & Fascia",
    slug: "soffit-fascia",
    href: "/soffit-fascia",
    eyebrow: "Soffit and fascia that finish the roofline right.",
    summary: "Finishing the roofline the way it should be finished.",
    description:
      "Vented aluminum and engineered fascia and soffit installed to feed the attic and protect the rafter tails.",
  },
  {
    title: "Gutters",
    slug: "gutters",
    href: "/gutters",
    eyebrow: "Seamless gutters that move water away from your home.",
    summary: "Seamless gutters that move water, not your foundation.",
    description:
      "Custom-fit aluminum and copper gutters formed on-site with optional micro-mesh guards.",
  },
  {
    title: "Entry Doors & Storm Doors",
    slug: "entry-doors",
    href: "/entry-doors",
    eyebrow: "Front doors that secure your home and define the curb.",
    summary: "Front doors that frame the rest of the house.",
    description:
      "ProVia steel and fiberglass entry systems sealed for security, efficiency, and curb appeal.",
  },
  {
    title: "Attic Insulation",
    slug: "attic-insulation",
    href: "/attic-insulation",
    eyebrow: "Insulation upgrades that pay for themselves.",
    summary: "Insulation that pays for itself, then keeps paying.",
    description:
      "Blown-in cellulose and fiberglass batt insulation that reduces drafts, ice dams, and energy loss.",
  },
];
