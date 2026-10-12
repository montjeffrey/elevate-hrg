export const serviceLinks = [
  { label: "Roofing", href: "/roofing" },
  { label: "Siding", href: "/siding" },
  { label: "Windows", href: "/windows" },
  { label: "Soffit & Fascia", href: "/soffit-fascia" },
  { label: "Gutters", href: "/gutters" },
  { label: "Entry Doors & Storm Doors", href: "/entry-doors" },
  { label: "Attic Insulation", href: "/attic-insulation" },
] as const;

export const primaryNav = [
  { label: "Services", href: "/roofing", children: serviceLinks },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Warranty", href: "/warranty" },
  { label: "Financing", href: "/financing" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
] as const;
