import { NextResponse } from "next/server";
import { dispatchLead } from "@/lib/lead-actions";
import { leadSubmissionSchema, toFieldErrors } from "@/lib/lead-validation";

const maxRequestBytes = 16_384;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 60;
const leadRequests = new Map<string, number[]>();

function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";
  return `${forwardedFor ?? realIp ?? "unknown-ip"}:${userAgent}`;
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const key = getRateLimitKey(request);
  const recentRequests = (leadRequests.get(key) ?? []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs
  );

  if (recentRequests.length >= maxRequestsPerWindow) {
    leadRequests.set(key, recentRequests);
    return true;
  }

  recentRequests.push(now);
  leadRequests.set(key, recentRequests);
  return false;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > maxRequestBytes) {
    return NextResponse.json(
      {
        error: {
          code: "request_too_large",
          message: "Request body is too large.",
        },
      },
      { status: 413 }
    );
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      {
        error: {
          code: "rate_limit_exceeded",
          message: "Too many requests. Please try again later.",
        },
      },
      {
        headers: {
          "Retry-After": String(Math.ceil(rateLimitWindowMs / 1000)),
        },
        status: 429,
      }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "invalid_json",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 }
    );
  }

  const parsed = leadSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Request validation failed.",
          details: toFieldErrors(parsed.error),
        },
      },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof dispatchLead>>;

  try {
    result = await dispatchLead(parsed.data);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "lead_dispatch_failed",
          message: "Lead request could not be accepted. Please try again.",
        },
      },
      { status: 503 }
    );
  }

  // Only report success when the lead was actually delivered. A stubbed/failed
  // delivery must surface as an error so the form never shows a false success.
  if (!result.delivered) {
    return NextResponse.json(
      {
        error: {
          code: "lead_delivery_failed",
          message: "We couldn't submit your request right now. Please call or email us.",
        },
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      data: {
        status: "accepted",
        leadId: result.leadId,
      },
    },
    { status: 200 }
  );
}
