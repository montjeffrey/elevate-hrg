import { z } from "zod";

/**
 * Open roles. The value is what lands in the email subject and the applicant's
 * confirmation, so it is a closed enum rather than free text — an attacker
 * cannot inject arbitrary content into the subject line through this field.
 */
export const careerPositionOptions = [
  "Roofing Installer",
  "Siding Installer",
  "Window & Door Installer",
  "Gutter Technician",
  "Insulation Technician",
  "Crew Lead / Foreman",
  "Project Manager",
  "Sales Consultant",
  "Office & Administrative",
  "General Application",
] as const;

export type CareerPosition = (typeof careerPositionOptions)[number];

export const experienceOptions = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
] as const;

const usPhoneRegex = /^(?:\+?1[\s.-]?)?(?:\(?[2-9]\d{2}\)?[\s.-]?)?[2-9]\d{2}[\s.-]?\d{4}$/;

const optionalString = (max = 200) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max).optional()
  );

/**
 * Field validation for a job application. Deliberately mirrors
 * `leadSubmissionSchema` in shape and message tone so the two forms fail the
 * same way. The resume file itself is NOT described here — a File cannot be
 * meaningfully validated by zod, and its checks live in lib/resume-file.ts
 * where the byte-level reasoning is documented.
 */
export const careerApplicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .refine((value) => usPhoneRegex.test(value), "Enter a valid US phone number."),
  position: z.enum(careerPositionOptions, { error: "Select a position." }),
  experience: z.enum(experienceOptions, { error: "Select your years of experience." }),
  message: optionalString(2000),
  // Bot trap. A real browser never fills a visually hidden field; anything
  // non-empty here is rejected the same way a validation failure is, so a
  // scripted submitter learns nothing from the response.
  honeypot: z.string().max(0, "Leave this field empty.").optional().default(""),
  sourcePath: optionalString(),
  utmSource: optionalString(),
  utmMedium: optionalString(),
  utmCampaign: optionalString(),
  utmTerm: optionalString(),
  utmContent: optionalString(),
});

export type CareerApplication = z.infer<typeof careerApplicationSchema>;
export type CareerApplicationInput = z.input<typeof careerApplicationSchema>;

export function toCareerFieldErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
    code: issue.code,
  }));
}
