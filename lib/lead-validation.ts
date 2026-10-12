import { z } from "zod";

export const leadServiceOptions = [
  "Roofing",
  "Siding",
  "Windows",
  "Soffit & Fascia",
  "Gutters",
  "Entry Doors & Storm Doors",
  "Attic Insulation",
  "Multiple",
] as const;

const optionalString = (max = 200) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().max(max).optional()
  );

const usPhoneRegex = /^(?:\+?1[\s.-]?)?(?:\(?[2-9]\d{2}\)?[\s.-]?)?[2-9]\d{2}[\s.-]?\d{4}$/;

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .refine((value) => usPhoneRegex.test(value), "Enter a valid US phone number."),
  service: z.enum(leadServiceOptions, {
    error: "Select a service.",
  }),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "ZIP must be exactly 5 digits."),
  message: optionalString(500),
  honeypot: z.string().max(0, "Leave this field empty.").optional().default(""),
  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().email("Enter a valid email address.").optional()
  ),
  sourcePath: optionalString(),
  utmSource: optionalString(),
  utmMedium: optionalString(),
  utmCampaign: optionalString(),
  utmTerm: optionalString(),
  utmContent: optionalString(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
export type LeadSubmissionInput = z.input<typeof leadSubmissionSchema>;

export function toFieldErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
    code: issue.code,
  }));
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const lastFour = digits.slice(-4);
  return lastFour ? `***-***-${lastFour}` : "***";
}
