export type PageSchemaType =
  | "AboutPage"
  | "Blog"
  | "BreadcrumbList"
  | "ContactPage"
  | "FAQPage"
  | "ImageGallery"
  | "LocalBusiness"
  | "Organization"
  | "RoofingContractor"
  | "Service"
  | "WebPage";

export type PageSeo = {
  label: string;
  path: string;
  h1: string;
  title: string;
  description: string;
  schema: PageSchemaType[];
};

export const pageSeo: PageSeo[] = [
  {
    label: "Home",
    path: "/",
    h1: "Roofs, windows, and siding built to outlast the weather.",
    title: "Elevate HRG | Roofing, Windows & Siding",
    description:
      "Full-service exterior renovations across Bergen, Essex, Hudson, Morris, Passaic, Somerset, and Union counties.",
    schema: ["LocalBusiness", "RoofingContractor", "Organization", "BreadcrumbList"],
  },
  {
    label: "Roofing",
    path: "/roofing",
    h1: "Roof replacement in New Jersey — GAF Certified installer.",
    title: "Roof Replacement in NJ | GAF Certified Roofer | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. GAF Certified roof replacements. Schedule a Consultation — same-day callback guaranteed.",
    schema: ["Service", "RoofingContractor", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Siding",
    path: "/siding",
    h1: "Siding installation in NJ — ProVia CedarMax leading installer.",
    title: "CedarMax & Insulated Vinyl Siding in NJ | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. ProVia CedarMax leading installer for insulated vinyl, fiber cement, and engineered wood siding. Schedule a Consultation today.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Windows",
    path: "/windows",
    h1: "Replacement windows in New Jersey — ProVia authorized installer.",
    title: "Replacement Windows in NJ — ProVia Authorized | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. ProVia authorized installer for ENERGY STAR-rated replacement windows. Full-frame installs. Schedule a Consultation — free estimate.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Soffit & Fascia",
    path: "/soffit-fascia",
    h1: "Soffit and fascia installation and repair in New Jersey.",
    title: "Soffit & Fascia Installation & Repair in NJ | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. Aluminum and engineered soffit and fascia with proper attic venting. Protects rafter tails and finishes the roofline. Schedule a Consultation.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Gutters",
    path: "/gutters",
    h1: "Seamless gutters in New Jersey — custom-fit on-site.",
    title: "Seamless Gutters & Leaf Guards in NJ | Elevate HRG",
    description:
      'Proudly Serving Homeowners Throughout New Jersey. Custom-fit 5" and 6" seamless aluminum gutters and micro-mesh leaf guards. Formed on-site, no field joints to fail. Schedule a Consultation.',
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Entry Doors & Storm Doors",
    path: "/entry-doors",
    h1: "Entry doors and storm doors in NJ — ProVia authorized installer.",
    title: "ProVia Entry & Storm Doors in NJ | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. ProVia authorized installer for fiberglass, steel, and storm door systems. Secure, energy-efficient. Schedule a Consultation.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Attic Insulation",
    path: "/attic-insulation",
    h1: "Attic insulation in New Jersey — blown-in and batt to NJ-zone R-values.",
    title: "Attic Insulation in NJ — Blown-In & Batt | Elevate HRG",
    description:
      "Proudly Serving Homeowners Throughout New Jersey. Air-seal first, then insulate. Blown-in and batt upgrades to NJ-zone R-values. Qualify for current utility rebates. Schedule a Consultation.",
    schema: ["Service", "FAQPage", "BreadcrumbList"],
  },
  {
    label: "Gallery",
    path: "/gallery",
    h1: "Real homes. Real before-and-afters.",
    title: "Project Gallery | Roofing, Siding & Windows | Elevate HRG",
    description:
      "Browse completed roofing, siding, window, and gutter projects across North Jersey.",
    schema: ["ImageGallery", "BreadcrumbList"],
  },
  {
    label: "About",
    path: "/about",
    h1: "Built locally. Built to last.",
    title: "About Elevate HRG | Roofing & Exterior Renovation",
    description: "Our story, crews, and project standards for exterior remodeling.",
    schema: ["AboutPage", "Organization"],
  },
  {
    label: "Service Areas",
    path: "/service-areas",
    h1: "Serving homeowners across New Jersey.",
    title: "Service Areas | Elevate HRG",
    description: "Counties and cities Elevate HRG serves across New Jersey.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Quote",
    path: "/quote",
    h1: "Request a project quote.",
    title: "Request a Quote | Elevate HRG",
    description: "Start an exterior renovation quote request with Elevate HRG.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Financing",
    path: "/financing",
    h1: "Financing for exterior renovations.",
    title: "Financing | Elevate HRG",
    description: "Financing information for roofing, windows, siding, and exterior renovations.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Warranty",
    path: "/warranty",
    h1: "Warranty standards for exterior remodeling.",
    title: "Warranty | Elevate HRG",
    description: "Warranty information for Elevate HRG exterior renovation projects.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Our Process",
    path: "/our-process",
    h1: "A clear process from inspection to closeout.",
    title: "Our Process | Elevate HRG",
    description:
      "How Elevate HRG scopes, schedules, installs, and closes out exterior renovations.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Reviews",
    path: "/reviews",
    h1: "Homeowner reviews.",
    title: "Reviews | Elevate HRG",
    description: "Review inventory for Elevate HRG exterior renovation projects.",
    schema: ["WebPage", "BreadcrumbList"],
  },
  {
    label: "Contact",
    path: "/contact",
    h1: "Reach Elevate HRG.",
    title: "Contact Elevate HRG",
    description: "Phone, hours, and service area for Elevate HRG.",
    schema: ["ContactPage", "LocalBusiness"],
  },
  {
    label: "Blog",
    path: "/blog",
    h1: "Roofing, siding, and exterior advice for New Jersey homeowners.",
    title: "Blog | Elevate HRG",
    description: "Practical guides on roofing, windows, siding, and energy efficiency.",
    schema: ["Blog", "BreadcrumbList"],
  },
];
