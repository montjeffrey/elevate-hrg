import { NextResponse } from "next/server";
import { deliverApplication } from "@/lib/careers-delivery";
import { archiveApplication } from "@/lib/submission-archive";
import { careerApplicationSchema, toCareerFieldErrors } from "@/lib/careers-validation";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkResumeUpload, MAX_REQUEST_BYTES } from "@/lib/resume-file";

// Node runtime: this route needs Buffer for base64 encoding, and the Edge
// runtime's smaller body limits would reject valid resumes before our own,
// clearer size error could run.
export const runtime = "nodejs";
// Never cached, never prerendered — it is a write endpoint with a rate limiter.
export const dynamic = "force-dynamic";

const rateLimitWindowMs = 60 * 60 * 1000; // 1 hour
const maxApplicationsPerWindow = 5;
// Per-instance throttle with a bounded key map; see lib/rate-limit.ts for the
// honest limitations. The controls that actually bound a flood here are the
// request-size ceiling below and the platform's own concurrency limits.
const applicationLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: maxApplicationsPerWindow,
});

function errorResponse(
  code: string,
  message: string,
  status: number,
  extra?: { details?: unknown; headers?: Record<string, string> }
) {
  return NextResponse.json(
    { error: { code, message, ...(extra?.details ? { details: extra.details } : {}) } },
    { status, ...(extra?.headers ? { headers: extra.headers } : {}) }
  );
}

export async function POST(request: Request) {
  // Size gate FIRST, before the body is touched. Refusing on the declared
  // Content-Length is what keeps an oversized upload from being buffered at all;
  // lib/resume-file.ts re-checks the bytes that actually arrive, because a
  // client is free to lie in this header.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("request_too_large", "That upload is too large.", 413);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return errorResponse(
      "unsupported_media_type",
      "Applications must be submitted as multipart/form-data.",
      415
    );
  }

  if (applicationLimiter.isLimited(request)) {
    return errorResponse(
      "rate_limit_exceeded",
      "Too many applications from this device. Please try again later.",
      429,
      { headers: { "Retry-After": String(Math.ceil(rateLimitWindowMs / 1000)) } }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("invalid_form_data", "Request body could not be read.", 400);
  }

  // Exactly one resume. Several parts under the same name is either a confused
  // client or someone probing for a handler that concatenates them.
  const resumeEntries = form.getAll("resume");
  if (resumeEntries.length > 1) {
    return errorResponse("validation_error", "Attach a single PDF resume.", 400, {
      details: [{ field: "resume", message: "Attach a single PDF resume.", code: "custom" }],
    });
  }

  const fields = {
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    position: form.get("position"),
    experience: form.get("experience"),
    message: form.get("message"),
    honeypot: form.get("honeypot") ?? "",
    sourcePath: form.get("sourcePath"),
    utmSource: form.get("utmSource"),
    utmMedium: form.get("utmMedium"),
    utmCampaign: form.get("utmCampaign"),
    utmTerm: form.get("utmTerm"),
    utmContent: form.get("utmContent"),
  };

  // Only accept text parts for text fields. A File smuggled into `name` would
  // otherwise reach zod as an object.
  const textFields = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, typeof value === "string" ? value : ""])
  );

  const parsed = careerApplicationSchema.safeParse(textFields);
  if (!parsed.success) {
    return errorResponse("validation_error", "Request validation failed.", 400, {
      details: toCareerFieldErrors(parsed.error),
    });
  }

  // Magic-byte verification, size re-check, and filename sanitization.
  const resume = await checkResumeUpload(resumeEntries[0] ?? null);
  if (!resume.ok) {
    return errorResponse("validation_error", "Request validation failed.", 400, {
      details: [{ field: "resume", message: resume.message, code: resume.reason }],
    });
  }

  const applicationId = crypto.randomUUID();

  // Same rule as leads: persist before attempting delivery. Metadata only —
  // the resume itself is never written to the archive.
  await archiveApplication(parsed.data, applicationId, resume.filename);

  let delivery: Awaited<ReturnType<typeof deliverApplication>>;
  try {
    delivery = await deliverApplication(
      parsed.data,
      { filename: resume.filename, bytes: resume.bytes },
      applicationId
    );
  } catch {
    return errorResponse(
      "application_dispatch_failed",
      "Your application could not be accepted. Please try again.",
      503
    );
  }

  // Same rule as /api/leads: a stubbed or failed send must never surface as a
  // false success, or an applicant walks away believing they applied.
  if (!delivery.ok) {
    return errorResponse(
      "application_delivery_failed",
      "We couldn't submit your application right now. Please call or email us.",
      502
    );
  }

  return NextResponse.json(
    { data: { status: "accepted", applicationId } },
    {
      status: 200,
      // Belt-and-braces: this response echoes nothing user-supplied, but the
      // endpoint accepts uploads, so pin the interpretation anyway.
      headers: { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" },
    }
  );
}
