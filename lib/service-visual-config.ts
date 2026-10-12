import type { ServiceSlug } from "@/content/services";

export type ServiceVisualSectionId =
  | "intro"
  | "subServices"
  | "materials"
  | "process"
  | "financing"
  | "areas"
  | "featured"
  | "faq"
  | "related"
  | "uniqueHook";

export type ServiceVisualCallout =
  | {
      kind: "stat";
      stats: { value: string; label: string }[];
    }
  | {
      kind: "badges";
      badges: string[];
    }
  | {
      kind: "style-grid";
      styleLabels: string[];
    };

export type ServiceVisualConfig = {
  heroVariant: "full-bleed" | "split" | "overlay-light" | "centered";
  heroHeightClass?: string;
  gradientClass: string;
  accentClass: string;
  subEyebrow?: string;
  sectionOrder: ServiceVisualSectionId[];
  callout?: ServiceVisualCallout;
  subServicesStyle: "cards" | "checklist" | "icon-cards";
};

export const serviceVisualConfig: Record<ServiceSlug, ServiceVisualConfig> = {
  roofing: {
    heroVariant: "full-bleed",
    gradientClass:
      "bg-gradient-to-b from-brand-charcoal/65 via-brand-charcoal/55 to-brand-charcoal/85",
    accentClass: "bg-brand-gold",
    sectionOrder: [
      "intro",
      "uniqueHook",
      "subServices",
      "materials",
      "featured",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "badges",
      badges: [
        "GAF Certified installer",
        "NJ License 13VH13821400",
      ],
    },
    subServicesStyle: "icon-cards",
  },
  windows: {
    heroVariant: "split",
    gradientClass: "bg-gradient-to-r from-brand-charcoal/35 via-transparent to-transparent",
    accentClass: "bg-brand-gold/60",
    sectionOrder: [
      "intro",
      "materials",
      "subServices",
      "featured",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "stat",
      stats: [
        {
          value: "Up to 30%",
          label:
            "of home heating and cooling energy is lost through old windows. Full-frame replacement closes that gap.",
        },
      ],
    },
    subServicesStyle: "cards",
  },
  siding: {
    heroVariant: "overlay-light",
    gradientClass: "bg-gradient-to-r from-brand-charcoal/75 via-brand-charcoal/40 to-transparent",
    accentClass: "bg-brand-sandstone",
    sectionOrder: [
      "intro",
      "subServices",
      "uniqueHook",
      "materials",
      "featured",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "stat",
      stats: [
        { value: "R-3.5", label: "added insulation value with CedarMax foam-backed panels" },
        { value: "30+ yr", label: "manufacturer color and fade coverage on ProVia vinyl" },
      ],
    },
    subServicesStyle: "cards",
  },
  "soffit-fascia": {
    heroVariant: "full-bleed",
    heroHeightClass: "min-h-[60svh] sm:min-h-[68svh]",
    gradientClass:
      "bg-gradient-to-b from-brand-charcoal/70 via-brand-charcoal/45 to-brand-charcoal/85",
    accentClass: "bg-brand-gold",
    sectionOrder: [
      "intro",
      "subServices",
      "uniqueHook",
      "materials",
      "featured",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "badges",
      badges: ["Vented aluminum & engineered", "Rafter-tail protection", "NJ License 13VH13821400"],
    },
    subServicesStyle: "checklist",
  },
  gutters: {
    heroVariant: "full-bleed",
    heroHeightClass: "min-h-[60svh] sm:min-h-[68svh]",
    gradientClass: "bg-gradient-to-b from-[#0c1419]/88 via-[#0c1419]/70 to-brand-charcoal/90",
    accentClass: "bg-brand-gold",
    sectionOrder: [
      "intro",
      "uniqueHook",
      "subServices",
      "materials",
      "featured",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "stat",
      stats: [
        {
          value: '5" vs 6"',
          label:
            'Gutter size matched to the roof area. 6" handles ~40% more water — required on steep, large roofs.',
        },
      ],
    },
    subServicesStyle: "checklist",
  },
  "entry-doors": {
    heroVariant: "centered",
    gradientClass:
      "bg-gradient-to-b from-brand-charcoal/45 via-brand-charcoal/30 to-brand-charcoal/75",
    accentClass: "bg-brand-gold",
    sectionOrder: [
      "intro",
      "subServices",
      "featured",
      "uniqueHook",
      "materials",
      "process",
      "financing",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "style-grid",
      styleLabels: ["Craftsman", "Traditional 6-panel", "Full-glass", "Double / sidelight"],
    },
    subServicesStyle: "cards",
  },
  "attic-insulation": {
    heroVariant: "overlay-light",
    gradientClass:
      "bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/55 to-brand-charcoal/30",
    accentClass: "bg-brand-gold",
    subEyebrow: "ENERGY ENVELOPE",
    sectionOrder: [
      "intro",
      "financing",
      "subServices",
      "uniqueHook",
      "featured",
      "process",
      "areas",
      "faq",
      "related",
    ],
    callout: {
      kind: "stat",
      stats: [
        { value: "Up to 30%", label: "reduction in heating + cooling load" },
        { value: "R-49", label: "target for NJ climate zone attics" },
        { value: "~1 day", label: "typical job duration, most homes" },
      ],
    },
    subServicesStyle: "checklist",
  },
};
