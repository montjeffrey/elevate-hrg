import {
  LucideIcon,
  Shield,
  Wrench,
  Clock,
  BadgeCheck,
  Zap,
  Droplets,
  Sun,
  Home,
  Layers,
} from "lucide-react";

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  icon: LucideIcon;
  benefits: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  features: string[];
  manufacturers?: {
    name: string;
    logo?: string;
    blurb?: string;
  }[];
  subServices?: {
    title: string;
    description: string;
  }[];
  counties: string[];
}

export const services: Record<string, ServiceData> = {
  roofing: {
    id: "srv-roofing",
    slug: "roofing",
    title: "Expert Roofing Services",
    shortDescription:
      "Asphalt and metal roof systems engineered for NJ's wind, snow, and freeze-thaw cycles. Proudly Serving Homeowners Throughout New Jersey.",
    fullDescription:
      "Roofing scope is either a full tear-off to the deck or an overlay where code and deck condition allow. Crews install GAF shingle systems with ice-and-water shield at eaves and valleys to NJ code, synthetic underlayment across the field, drip edge, step and counter flashing, and balanced ridge-vent and soffit intake before the ridge cap goes on. Every roof is registered for its manufacturer's system warranty, covering both materials and our workmanship.",
    heroImage: "/brand/roofing-hero.avif",
    icon: Shield,
    benefits: [
      {
        title: "Weather Resistance",
        description:
          "Engineered to withstand high winds, heavy rain, and extreme temperature fluctuations.",
        icon: Zap,
      },
      {
        title: "Extended Lifespan",
        description: "Premium materials and expert installation ensure your roof lasts longer.",
        icon: Clock,
      },
    ],
    features: [
      "Asphalt Shingle Roofing",
      "Metal Roofing Systems",
      "Flat Roof Solutions",
      "Thorough Inspections",
      "Storm Damage Repair",
      "Ventilation Upgrades",
    ],
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
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
  windows: {
    id: "srv-windows",
    slug: "windows",
    title: "Energy-Efficient Windows",
    shortDescription:
      "ProVia authorized installer placing replacement windows full-frame with ENERGY STAR-rated glass packages, corrected flashing, and weather seals.",
    fullDescription:
      "Old windows can account for up to 30% of a home's heating and cooling energy loss. Our replacement windows are installed full-frame where it matters — flashing, wraps, sills, and seals corrected at the same time — so the new glass actually performs the way the spec sheet promises.",
    heroImage: "/brand/windows.jpg",
    icon: Sun,
    benefits: [
      {
        title: "Energy Savings",
        description:
          "Low-E glass, argon fills, and tight installs reduce drafts and seasonal energy loss.",
        icon: Zap,
      },
      {
        title: "Noise Reduction",
        description: "Modern dual-pane systems quiet road noise and outdoor activity meaningfully.",
        icon: Shield,
      },
      {
        title: "Enhanced Security",
        description: "Reinforced locks, laminated glass options, and tight frames raise the bar.",
        icon: BadgeCheck,
      },
    ],
    features: [
      "Double-Hung Windows",
      "Casement & Awning Windows",
      "Bay & Bow Windows",
      "Sliding Windows",
      "Custom Shapes & Sizes",
      "ENERGY STAR-Rated Glass Packages",
    ],
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
          "Windows specified with ENERGY STAR-rated glass packages for the Northern climate zone — Low-E coatings and argon-filled insulated glass.",
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
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
  siding: {
    id: "srv-siding",
    slug: "siding",
    title: "Vinyl & Insulated Vinyl Siding",
    shortDescription:
      "ProVia CedarMax authorized installer — insulated vinyl and quality vinyl siding systems installed with corrected wrap, flashing, and fascia.",
    fullDescription:
      "Siding is a system, not a panel. Old cladding comes off, the wall is inspected for rot and old water entry, the wrap and flashing are corrected, and then the new siding goes on with proper trim, soffit, and fascia detail. The result holds color, sheds water, and looks right at the curb for decades.",
    heroImage: "/brand/siding-yellow-clapboard-wide.jpg",
    icon: Home,
    benefits: [
      {
        title: "Curb Appeal",
        description: "Refresh the home with modern profiles, deeper colors, and crisp trim lines.",
        icon: Zap,
      },
      {
        title: "Low Maintenance",
        description: "No paint cycle. Engineered siding resists fading, chipping, and cracking.",
        icon: Shield,
      },
      {
        title: "Added Insulation",
        description:
          "Insulated vinyl options reduce thermal bridging at the studs and quiet the home.",
        icon: Layers,
      },
    ],
    features: [
      "ProVia CedarMax Siding",
      "Insulated Vinyl",
      "Engineered Wood",
      "Seamless Installation",
      "Fascia & Soffit Replacement",
      "Color-Match Guarantee",
    ],
    manufacturers: [
      {
        name: "ProVia",
        logo: "/brand/provia-logo.jpg",
        blurb:
          "ProVia Authorized Installer for CedarMax insulated vinyl and Heritage vinyl siding lines — color, profile, and trim package matched to the home.",
      },
      {
        name: "Quality Vinyl Siding",
        blurb:
          "Standard and premium vinyl panel options selected for color retention, panel rigidity, and Northeast weather performance.",
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
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
  "soffit-fascia": {
    id: "srv-soffit-fascia",
    slug: "soffit-fascia",
    title: "Soffit & Fascia",
    shortDescription:
      "Aluminum and engineered soffit and fascia installed with venting that feeds the attic and protects the rafter tails. Proudly Serving Homeowners Throughout New Jersey.",
    fullDescription:
      "Soffit and fascia are the finish line of the roof — and the most common entry point for water and pests when they're neglected. Rotted fascia board is cut back to sound framing and replaced, then wrapped in baked-enamel aluminum or finished with engineered profiles, and vented soffit panels are sized to feed the attic so the ridge vent above has air to pull. Scoped alongside roof and gutter work, the whole roofline sequences and ages as one system.",
    heroImage: "/brand/soffits&fascia.png",
    icon: Layers,
    benefits: [
      {
        title: "Closes Entry Points",
        description:
          "Replacing rotted fascia and sealing the eaves shuts out the water and pests that work into a neglected roofline.",
        icon: Shield,
      },
      {
        title: "Balanced Attic Venting",
        description:
          "Vented soffit sized to the attic's intake gives the ridge exhaust the air it needs to keep the attic dry.",
        icon: Wrench,
      },
      {
        title: "Low-Maintenance Finish",
        description:
          "Baked-enamel aluminum wrap holds color and sheds weather without the paint cycle a wood roofline demands.",
        icon: BadgeCheck,
      },
    ],
    features: [
      "Fascia Board Replacement",
      "Vented Soffit Installation",
      "Aluminum Wrap & Trim",
      "Ridge & Soffit Ventilation Balance",
      "Gutter-Line Coordination",
      "Color Matching",
    ],
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
          "Soffit and fascia scoped alongside gutter and roof work so the whole roofline sequences correctly.",
      },
    ],
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
  gutters: {
    id: "srv-gutters",
    slug: "gutters",
    title: "Seamless Gutter Systems",
    shortDescription:
      "Aluminum K-style seamless gutters formed on-site, sized to the roof, hung tight to the fascia with optional micro-mesh guards.",
    fullDescription:
      "A gutter is only doing its job if it can keep up with the roof above it. Crews measure pitch and square footage, form the gutter on-site from a continuous coil, hang it at the right slope, set downspouts where the grade actually carries water away, and offer micro-mesh guards where tree coverage makes them worth it.",
    heroImage: "/brand/gutters.jpg",
    icon: Droplets,
    benefits: [
      {
        title: "Leak Prevention",
        description:
          "Continuous seamless runs eliminate the joint failures that plague sectional gutters.",
        icon: Shield,
      },
      {
        title: "Custom Fit",
        description: "Each run is formed on-site to the exact length and pitch the roof requires.",
        icon: Wrench,
      },
      {
        title: "Foundation Protection",
        description:
          "Properly placed downspouts and extensions move water away from the foundation and landscaping.",
        icon: Shield,
      },
    ],
    features: [
      "5-inch & 6-inch Seamless Gutters",
      "Aluminum & Copper Options",
      "Gutter Guards & Covers",
      "Custom Color Matching",
      "Downspout Installation",
      "Fascia Repair",
    ],
    manufacturers: [
      {
        name: "Aluminum K-Style Seamless",
        blurb:
          "Heavier-gauge aluminum coil formed on-site into continuous 5-inch and 6-inch K-style runs in baked-on color finishes.",
      },
      {
        name: "Copper (Optional)",
        blurb:
          "Half-round and K-style copper for accent runs, porches, and historic homes — soldered seams and copper downspouts.",
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
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
  "entry-doors": {
    id: "srv-entry-doors",
    slug: "entry-doors",
    title: "Custom Entry Doors",
    shortDescription:
      "ProVia Authorized Installer for fiberglass and steel entry systems, storm doors, and patio doors — sealed frame, threshold, and lockset together.",
    fullDescription:
      "An entry door is a system: slab, frame, threshold, weatherseals, hinges, lockset, and the trim that ties it back to the wall. We install ProVia fiberglass and steel doors and matching storm doors, replacing the frame and threshold where needed so the seal is honest and the deadbolt strike lands where it should.",
    heroImage: "/brand/door.jpg",
    icon: Home,
    benefits: [
      {
        title: "Enhanced Security",
        description:
          "Reinforced frames, multi-point lock options, and properly set strike plates raise the door's actual security level.",
        icon: Shield,
      },
      {
        title: "Energy Efficiency",
        description:
          "Insulated cores plus tight weatherstripping and a corrected threshold cut drafts at the entry.",
        icon: Zap,
      },
      {
        title: "Customized Style",
        description:
          "Slab style, glass package, finish color, and hardware selected to fit the house — not the inventory shelf.",
        icon: BadgeCheck,
      },
    ],
    features: [
      "Fiberglass & Steel Entry Doors",
      "Sliding Patio Doors",
      "French Doors",
      "Storm Doors",
      "Custom Glass Designs",
      "Professional Installation",
    ],
    manufacturers: [
      {
        name: "ProVia",
        logo: "/brand/provia-logo.jpg",
        blurb:
          "ProVia Authorized Installer for Signet and Heritage fiberglass entry doors, Legacy steel doors, and Spectrum storm doors — built and finished to spec for the home.",
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
    counties: [
      "Bergen",
      "Essex",
      "Hudson",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Somerset",
      "Union",
    ],
  },
  "attic-insulation": {
    id: "srv-attic-insulation",
    slug: "attic-insulation",
    title: "Attic Insulation",
    shortDescription:
      "Air seal the top plates, review ventilation, and dial blown-in or batt insulation to the right depth for North Jersey winters and summers.",
    fullDescription:
      "Attic work is one of the highest-leverage upgrades a home can get. The order matters: clear the deck, air-seal the top plates and penetrations, review intake and exhaust ventilation, then add blown-in cellulose or batt insulation to a target depth. Done in that sequence, the house holds temperature longer, the HVAC cycles less, and the roof above stays drier in winter.",
    heroImage: "/brand/attic-insulation-hero.jpg",
    icon: Layers,
    benefits: [
      {
        title: "Lower Energy Bills",
        description:
          "Less heat moves out in winter and in during summer once the attic is air-sealed and properly insulated.",
        icon: Zap,
      },
      {
        title: "Year-Round Comfort",
        description:
          "Even temperatures between rooms and floors, with fewer drafts and cold spots.",
        icon: Sun,
      },
      {
        title: "HVAC Protection",
        description:
          "Less duty cycling means furnaces and AC systems work less hard for the same indoor temperature.",
        icon: Shield,
      },
    ],
    features: [
      "Blown-In Insulation",
      "Fiberglass Batts",
      "Air Sealing",
      "Ventilation Assessment",
      "Energy Audits",
      "Old Insulation Removal",
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
    counties: [
      "Bergen",
      "Essex",
      "Hunterdon",
      "Mercer",
      "Middlesex",
      "Monmouth",
      "Morris",
      "Ocean",
      "Passaic",
      "Somerset",
      "Sussex",
      "Union",
      "Warren",
    ],
  },
};
