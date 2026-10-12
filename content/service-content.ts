import type { ServiceSlug } from "@/content/services";

export type ServiceProcessStep = {
  num: string;
  title: string;
  body: string;
};

export type ServiceContentEntry = {
  /** Live-verbatim branded H2 rendered above the intro on each service page. */
  brandH2: string;
  intro: string;
  manufacturers?: {
    name: string;
    logo?: string;
    blurb?: string;
    url?: string;
  }[];
  subServices?: {
    title: string;
    description: string;
  }[];
  processSteps?: ServiceProcessStep[];
  featuredProjectIds: string[];
  relatedServices: ServiceSlug[];
};

const defaultProcessSteps: ServiceProcessStep[] = [
  {
    num: "01",
    title: "Initial Consultation & Inspection",
    body: "On-site review of what's actually there — decking, ventilation, framing, flashings, or the rough opening, depending on the job. We photograph everything and walk you through what's wrong before we quote.",
  },
  {
    num: "02",
    title: "Project Planning & Launch",
    body: "Itemized written scope, materials list, manufacturer warranty registration plan, and a start date. Permits pulled where the town requires them.",
  },
  {
    num: "03",
    title: "Swift and Seamless Execution",
    body: "One accountable crew, one schedule. We protect the landscaping and interior, work clean, and button up the site at the end of each day.",
  },
  {
    num: "04",
    title: "Final Cleanup & Project Completion",
    body: "Magnet sweep for nails, debris hauled, walkthrough with the project manager, and warranties registered the same day.",
  },
];

export const serviceContent: Record<ServiceSlug, ServiceContentEntry> = {
  roofing: {
    brandH2: "Elevating Roofing to the Next Level.",
    intro:
      "Every roof starts with what's under the shingles. We pull the existing roof, inspect the decking, replace any rotted plywood, install full ice-and-water shield at eaves and valleys, layer synthetic underlayment, then flash chimneys and pipe boots in real metal — not caulk. Soffit intake and ridge exhaust get balanced before we close the deck. That's the part you can't see, done the way it should be. Proudly Serving Homeowners Throughout New Jersey.",
    manufacturers: [
      {
        name: "GAF",
        logo: "/certifications/gaf-certified-plus-logo.png",
        blurb:
          "GAF Certified installer using Timberline UHDZ and Camelot II shingle systems, installed from underlayment through ridge cap to keep the manufacturer warranty intact.",
      },
    ],
    subServices: [
      {
        title: "Asphalt Shingle Roof Replacement",
        description:
          "Architectural asphalt shingle systems engineered for North Jersey wind, snow, and freeze-thaw cycles.",
      },
      {
        title: "Metal Roofing Systems",
        description:
          "Standing-seam and metal shingle options for long-life roofs that handle ice, snow load, and wind.",
      },
      {
        title: "Flat & Low-Slope Roofing",
        description:
          "Membrane systems for additions, porches, and modern low-slope sections that need a dependable seal.",
      },
      {
        title: "Storm Damage & Insurance Work",
        description:
          "Documentation, scope review, and replacement coordination for homeowners working through a storm claim.",
      },
      {
        title: "Decking, Ventilation & Flashing",
        description:
          "Decking replacement, intake and exhaust ventilation correction, and step and counter flashing rebuilt where needed.",
      },
      {
        title: "Skylights & Daylighting",
        description:
          "Skylights and sun tunnels integrated cleanly into the new roof system on the same install when daylight is part of the project.",
      },
    ],
    processSteps: [
      {
        num: "01",
        title: "Initial Consultation & Inspection",
        body: "On-site walk of the roof, decking check, attic and ventilation review, and a clear written scope — photographed top to bottom before we quote.",
      },
      {
        num: "02",
        title: "Project Planning & Launch",
        body: "Shingle color, system tier, manufacturer warranty registration plan, and financing reviewed line by line, with a start date and permits pulled where the town requires them.",
      },
      {
        num: "03",
        title: "Swift and Seamless Execution",
        body: "Landscaping protected, full tear-off, decking and flashing corrected, and the new GAF system installed in a tight window by one accountable crew.",
      },
      {
        num: "04",
        title: "Final Cleanup & Project Completion",
        body: "Magnet sweep of the property for nails, debris hauled out, walkthrough with the project manager, and the manufacturer warranty registered the day we finish.",
      },
    ],
    featuredProjectIds: ["roofing-franklin-1", "roofing-west-milford-1"],
    relatedServices: ["gutters", "soffit-fascia", "siding"],
  },
  windows: {
    brandH2: "Experience Your Home in a New Light.",
    intro:
      'Most "replacement" windows on the market are inserts shoved into the old frame with foam. We do full-frame replacement where the existing frame is rotted or out of square — the long-term right answer. Where insert replacement is correct, we still strip back the trim to inspect the rough opening, flash the sill, and seal the perimeter with low-expansion foam and backer rod, not the can.',
    manufacturers: [
      {
        name: "ProVia",
        logo: "/brand/provia-logo.jpg",
        blurb:
          "ProVia authorized installer for the Endure, Aspect, and ecoLite window lines — vinyl and composite frames built and finished in the U.S.",
      },
      {
        name: "ENERGY STAR",
        blurb:
          "Windows specified with ENERGY STAR-rated glass packages for the Northern climate zone — Low-E coatings and argon-filled insulated glass. The right spec for New Jersey.",
      },
    ],
    subServices: [
      {
        title: "Full-frame replacement",
        description:
          "Removing the existing window down to the rough opening to correct flashing, sills, and wrap before the new unit goes in.",
      },
      {
        title: "Insert / pocket replacement",
        description:
          "New window set into an intact existing frame when the surrounding sash, sill, and flashing are sound.",
      },
      {
        title: "Bay & bow windows",
        description:
          "Multi-unit bay and bow assemblies with seat boards, head boards, and reinforced cable supports installed level and weather-tight.",
      },
      {
        title: "Egress & basement windows",
        description:
          "Code-compliant egress sizing for bedrooms plus glass block and slider replacements for basement openings.",
      },
      {
        title: "Specialty shapes",
        description:
          "Custom geometric, arched, and transom units matched to the existing trim package and aligned with surrounding windows.",
      },
      {
        title: "Glass package upgrades",
        description:
          "Low-E coatings, argon fills, laminated security glass, and acoustic packages selected for the room's exposure and use.",
      },
    ],
    featuredProjectIds: ["windows-nj-3", "bay-window-nj-1"],
    relatedServices: ["entry-doors", "siding", "attic-insulation"],
  },
  siding: {
    brandH2: "Siding Done Differently.",
    intro:
      "Siding goes wrong at the details: J-channel cut tight to the window, kick-out flashing where the roof meets the wall, proper overlap of weather-resistive barrier behind every panel. Our crews don't side over rot. We tear off, inspect the sheathing, replace anything compromised, install the WRB correctly, then panel — so the wall actually drains and dries the way the manufacturer specs.",
    manufacturers: [
      {
        name: "ProVia",
        logo: "/brand/provia-logo.jpg",
        blurb:
          "ProVia CedarMax leading installer — one of the top tiers ProVia certifies — which lets us register ProVia's superior siding warranty on every CedarMax job. CedarMax delivers the look of real cedar shake with insulated vinyl performance and effectively maintenance-free upkeep. We also install fiber cement and engineered wood from James Hardie where the project calls for it.",
      },
    ],
    subServices: [
      {
        title: "Full siding replacement",
        description:
          "Tear-off, wall inspection, wrap and flashing correction, then the new siding system installed with the right trim package.",
      },
      {
        title: "Insulated vinyl",
        description:
          "ProVia CedarMax and similar foam-backed panels for added R-value, panel rigidity, and reduced thermal bridging.",
      },
      {
        title: "Engineered wood & specialty profiles",
        description:
          "Board-and-batten, shake, and engineered wood accents to add depth to gables, dormers, and front elevations.",
      },
      {
        title: "Soffit & fascia coordination",
        description:
          "Soffit, fascia, frieze, and corner trim replaced alongside the siding so the whole envelope ages together.",
      },
      {
        title: "House wrap & flashing",
        description:
          "Drainable wrap and corrected window, door, and penetration flashing — the part nobody sees that decides how the wall ages.",
      },
      {
        title: "Color & profile matching",
        description:
          "Color, shadow line, and profile selected against existing roof, brick, and stone so the elevations read together.",
      },
    ],
    featuredProjectIds: ["siding-wallington-1", "siding-nj-2"],
    relatedServices: ["windows", "soffit-fascia", "gutters"],
  },
  "soffit-fascia": {
    brandH2: "Finishing the roofline the way it should be finished.",
    intro:
      "Soffit and fascia are where water and pests get into a roof. We tear off rotted fascia board down to sound framing, replace it, then wrap in aluminum or install engineered profiles with vented soffit panels sized to the attic's intake needs — so the ridge vent above actually has air to pull. Done right, it closes the entry points and keeps the attic breathing. Proudly Serving Homeowners Throughout New Jersey.",
    manufacturers: [
      {
        name: "Aluminum & Engineered Profiles",
        blurb:
          "Vented aluminum soffit and fascia wrap in baked-enamel colors matched to your existing trim — coordinated with any roof, ridge-vent, or gutter work.",
      },
    ],
    subServices: [
      {
        title: "Fascia replacement",
        description:
          "Rotted fascia board cut back to sound framing and replaced before wrap or gutters go up.",
      },
      {
        title: "Vented soffit installation",
        description:
          "Soffit panels sized to feed the attic's intake so ridge exhaust has air to pull.",
      },
      {
        title: "Aluminum wrap & trim",
        description:
          "Color-matched aluminum wrap on fascia, frieze, and corner trim for a finished, low-maintenance roofline.",
      },
      {
        title: "Gutter & ventilation coordination",
        description:
          "Soffit/fascia scoped alongside gutter and roof work so the whole roofline sequences correctly.",
      },
    ],
    featuredProjectIds: [],
    relatedServices: ["gutters", "roofing", "siding"],
  },
  gutters: {
    brandH2: "Redefining Gutter Protection.",
    intro:
      'A gutter system fails at the slope, the corners, and the downspout transitions. We run a string line on every job to set actual slope, miter aluminum corners on-site (not pre-fab box corners that leak), strap to fascia with hidden hangers at 24" on-center, and tie downspouts into above-grade extensions or existing leader pipes. Where the fascia is rotted from a previous bad gutter, we replace the fascia first.',
    manufacturers: [
      {
        name: "Aluminum K-Style Seamless",
        blurb:
          "Seamless gutters are cut from a single roll of heavy-gauge aluminum on-site, so the only seams are at corners and outlets — dramatically fewer leak points than sectional gutters. Finished in baked-enamel colors matched to your trim, with optional micro-mesh leaf guards that shed leaves and pine needles instead of cupping them.",
      },
      {
        name: "Micro-Mesh Gutter Guards",
        blurb:
          "Stainless micro-mesh guard panels recommended for homes under tree coverage to keep leaves, needles, and shingle grit out of the trough.",
      },
    ],
    subServices: [
      {
        title: "Seamless gutter forming & install",
        description:
          "Aluminum coil run on-site into a single continuous gutter — no field joints to fail along the length of the run.",
      },
      {
        title: "Gutter guards",
        description:
          "Micro-mesh guard panels added where tree coverage and roof debris would otherwise clog the trough every season.",
      },
      {
        title: "Downspouts & drainage",
        description:
          "Downspout count and placement matched to the roof area above, with extensions or buried tie-ins to move water away from the foundation.",
      },
      {
        title: "Fascia & soffit repair",
        description:
          "Rotten fascia and damaged soffit replaced before new gutters go up so the hanger fasteners hold for the long term.",
      },
      {
        title: "Pairing with roof replacement",
        description:
          "Gutters scoped, removed, and rehung as part of a roof project so flashing, drip edge, and gutter line all sequence correctly.",
      },
      {
        title: "Color & profile match",
        description:
          "Baked-on aluminum color matched to soffit, fascia, or trim — and 5-inch vs 6-inch sizing chosen based on roof area.",
      },
    ],
    featuredProjectIds: ["gutters-northvale-1"],
    relatedServices: ["roofing", "soffit-fascia", "siding"],
  },
  "entry-doors": {
    brandH2: "Redefining Entry Door Style and Elegance.",
    intro:
      "A door installation is only as good as the rough opening behind it. We pull the existing slab and jamb, check the framing for plumb and rot, sister the king studs where needed, flash the sill pan, then set the new unit with non-foaming insulation in the perimeter and a real bottom sweep. Strike-plate screws go into the framing, not just the jamb. That's how a door still closes correctly in year 15.",
    manufacturers: [
      {
        name: "ProVia",
        logo: "/brand/provia-logo.jpg",
        blurb:
          "ProVia authorized installer for the Signet and Heritage fiberglass, Legacy steel, and Embarq fiberglass entry door lines, plus the Spectrum storm door series. ProVia's hardware, glass packages, and panel options run deeper than the big-box doors most contractors sell — and the warranty registration covers both the unit and the install when we do the work.",
      },
    ],
    subServices: [
      {
        title: "Front entry doors",
        description:
          "ProVia fiberglass and steel entry slabs with new frames, weatherstripping, and corrected threshold for a tight overall seal.",
      },
      {
        title: "Storm doors",
        description:
          "ProVia Spectrum storm doors fit to the existing or new entry, with full-view, retractable-screen, and ventilating options.",
      },
      {
        title: "Patio & French doors",
        description:
          "Sliding patio doors and hinged French door pairs with full-frame replacement and threshold rebuild where needed.",
      },
      {
        title: "Sidelights & transoms",
        description:
          "Sidelight and transom packages added or replaced to scale the entry to the wall and bring usable daylight into the foyer.",
      },
      {
        title: "Multi-point lock & hardware upgrades",
        description:
          "Multi-point lock systems, smart deadbolts, and premium handle sets installed with strike plates set into solid blocking.",
      },
      {
        title: "Glass & decorative options",
        description:
          "Decorative, privacy, and impact-rated glass packages selected for light, sightlines, and security across the entry.",
      },
    ],
    featuredProjectIds: ["entry-doors-wallington-2"],
    relatedServices: ["windows", "siding", "roofing"],
  },
  "attic-insulation": {
    brandH2: "Transforming Your Home with Expert Attic Insulation Solutions.",
    intro:
      "Most attic insulation jobs are done backwards: a contractor blows new fiberglass over old without sealing the air leaks underneath, and a year later the homeowner gets the same heat loss with thicker insulation. We air-seal top plates, can-light cans, plumbing chases, and the attic hatch first — then add blown-in cellulose or fiberglass batt to the depth the NJ energy code calls for (R-49 in most jobs).",
    manufacturers: [
      {
        name: "Air-Seal-First Insulation",
        blurb:
          "The right attic upgrade cuts winter heat loss, drops summer cooling load, and ends the ice-dam cycle that wrecks gutters and roof edges. Done correctly, the job usually qualifies for current New Jersey utility rebates and the federal energy-efficient home improvement credit. Ask for a free estimate and we'll walk you through what's eligible.",
      },
    ],
    subServices: [
      {
        title: "Blown-in cellulose",
        description:
          "Loose-fill cellulose blown to a measured depth over the attic floor — fills around wires, framing, and odd geometry better than batts.",
      },
      {
        title: "Fiberglass batt insulation",
        description:
          "Batt insulation between joists or in knee walls where loose-fill isn't the right fit, sized and seated for full coverage.",
      },
      {
        title: "Air sealing",
        description:
          "Top plates, can lights, plumbing chases, attic hatches, and other penetrations sealed before new insulation goes down.",
      },
      {
        title: "Ventilation review",
        description:
          "Intake at the soffit and exhaust at the ridge or gables reviewed and corrected so the attic stays balanced after the upgrade.",
      },
      {
        title: "Old insulation removal",
        description:
          "Compressed, contaminated, or rodent-damaged insulation vacuumed out before the attic is air-sealed and re-insulated.",
      },
      {
        title: "Pairing with roof work",
        description:
          "Insulation and ventilation upgrades scoped alongside a roof replacement to lock in the most efficient envelope.",
      },
    ],
    featuredProjectIds: [],
    relatedServices: ["roofing", "windows", "soffit-fascia"],
  },
};

export function processStepsForService(slug: ServiceSlug): ServiceProcessStep[] {
  return serviceContent[slug].processSteps ?? defaultProcessSteps;
}
