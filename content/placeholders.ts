export const requiredBusinessFacts = {
  phone: "{{phone}}",
  phoneTel: "{{phone_tel}}",
  insuranceStatement: "{{insurance_statement}}",
  foundingYear: "{{founding_year}}",
  projectCount: "{{project_count}}",
} as const;

export const serviceAreaCounties = [
  { name: "Bergen County", slug: "bergen" },
  { name: "Essex County", slug: "essex" },
  { name: "Hudson County", slug: "hudson" },
  { name: "Morris County", slug: "morris" },
  { name: "Passaic County", slug: "passaic" },
  { name: "Somerset County", slug: "somerset" },
  { name: "Union County", slug: "union" },
] as const;
