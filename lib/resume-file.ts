/**
 * Resume upload safety.
 *
 * Threat model — a public, unauthenticated file upload on a serverless site
 * with no datastore, whose only sink is a transactional email attachment:
 *
 * 1. RCE. The danger in an upload is never the bytes themselves; it is any code
 *    that PARSES them. So this module deliberately does not parse. It never
 *    writes to disk (no path traversal, no upload-into-webroot, no execution),
 *    never shells out to a converter/thumbnailer/archiver, and never
 *    decompresses. The bytes are read into memory, sniffed, base64-encoded for
 *    the mail provider, and dropped.
 * 2. XSS. The filename is attacker-controlled and lands in an HTML email body.
 *    sanitizeResumeFilename() strips it to a conservative charset and forces the
 *    extension; callers must ALSO run it through escapeHtml() before
 *    interpolation. Separately, the file is never served from our own origin —
 *    hosting an uploaded file on elevatehrg.com would turn any HTML/SVG
 *    "resume" into stored XSS against the site itself. Attachment-only delivery
 *    designs that away.
 * 3. DoS. Size is capped well under the platform's function payload limit and
 *    checked twice: once against the declared Content-Length before the body is
 *    read at all, and again against the bytes actually received (a lying header
 *    must not get us to buffer an unbounded stream).
 *
 * PDF-only is a security decision, not a convenience one. DOCX/XLSX are ZIP
 * containers: their magic bytes (PK\x03\x04) are indistinguishable from a jar,
 * apk, or zip bomb, so accepting them means accepting "some archive" on the
 * strength of a filename. A PDF has a single unambiguous signature.
 */

/** Hard ceiling on the decoded resume, in bytes. */
export const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4 MB

/**
 * Ceiling on the whole multipart request.
 *
 * Netlify's synchronous function payload limit is 6 MB. Multipart encoding adds
 * boundaries and headers on top of the raw file, and the base64 we hand the mail
 * provider inflates by ~33% again downstream — so the raw-file cap above plus
 * this envelope both have to stay comfortably under that 6 MB wall, or the
 * platform rejects the request before our code ever runs and the applicant sees
 * an unexplained failure.
 */
export const MAX_REQUEST_BYTES = 5 * 1024 * 1024; // 5 MB

export const ACCEPTED_RESUME_MIME = "application/pdf";
export const ACCEPTED_RESUME_EXTENSION = ".pdf";

/** Human-facing size label, kept in one place so UI copy and the cap agree. */
export const MAX_RESUME_LABEL = "4 MB";

/** `%PDF-` — the PDF header, required at offset 0. */
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d];

/**
 * Verify PDF-ness from the bytes, not from what the client claimed.
 *
 * Browser-supplied `type` and the filename extension are both attacker-
 * controlled and worthless as a control. The spec technically tolerates the
 * header appearing anywhere in the first 1024 bytes; we require offset 0, which
 * every real producer emits and which denies an attacker the prefix bytes that
 * make a file simultaneously valid as two formats.
 */
export function hasPdfMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < PDF_MAGIC.length) return false;
  return PDF_MAGIC.every((byte, index) => bytes[index] === byte);
}

/**
 * Reduce an arbitrary client-supplied filename to something inert.
 *
 * Drops any directory component (defeats `../../etc/passwd` and Windows
 * separators), removes NUL and every character outside a conservative allowlist,
 * refuses a leading dot, caps the length, and forces the extension to `.pdf` so
 * a double extension like `resume.pdf.exe` cannot survive. The result is still
 * untrusted TEXT and must be escaped before it enters HTML.
 */
export function sanitizeResumeFilename(rawName: string): string {
  const base = rawName.split(/[\\/]/).pop() ?? "";

  const stem = base
    .replace(/\.[A-Za-z0-9]{1,8}$/, "") // drop the claimed extension entirely
    .replace(/[^A-Za-z0-9._-]+/g, "-") // allowlist; NUL and control chars fall out here
    .replace(/-{2,}/g, "-")
    .replace(/^[.-]+/, "") // no dotfiles, no leading-dash "flag" names
    .slice(0, 80);

  return `${stem || "resume"}${ACCEPTED_RESUME_EXTENSION}`;
}

export type ResumeRejection = "missing" | "too_large" | "empty" | "wrong_type" | "too_many_files";

export type ResumeCheck =
  | { ok: true; bytes: Uint8Array; filename: string; sizeBytes: number }
  | { ok: false; reason: ResumeRejection; message: string };

const rejectionMessages: Record<ResumeRejection, string> = {
  missing: "Attach your resume as a PDF.",
  too_large: `That file is larger than ${MAX_RESUME_LABEL}. Please attach a smaller PDF.`,
  empty: "That file is empty. Please attach your resume as a PDF.",
  wrong_type: "Resumes must be PDF files. Please export your resume as a PDF and try again.",
  too_many_files: "Attach a single PDF resume.",
};

function reject(reason: ResumeRejection): ResumeCheck {
  return { ok: false, reason, message: rejectionMessages[reason] };
}

/**
 * Validate an uploaded resume end to end.
 *
 * Checks the declared size before reading (so an oversized upload is refused
 * without buffering it) and the real size after, then sniffs the magic bytes.
 * Returns the bytes only when every check passes.
 */
export async function checkResumeUpload(value: FormDataEntryValue | null): Promise<ResumeCheck> {
  if (value === null || typeof value === "string") return reject("missing");

  const file = value as File;

  if (file.size === 0) return reject("empty");
  // Declared size first: refuse before allocating anything for the body.
  if (file.size > MAX_RESUME_BYTES) return reject("too_large");

  const bytes = new Uint8Array(await file.arrayBuffer());

  // Re-check against what actually arrived. `File.size` is metadata; a client
  // that lies about it must not get us to buffer past the cap unnoticed.
  if (bytes.byteLength === 0) return reject("empty");
  if (bytes.byteLength > MAX_RESUME_BYTES) return reject("too_large");

  if (!hasPdfMagicBytes(bytes)) return reject("wrong_type");

  return {
    ok: true,
    bytes,
    filename: sanitizeResumeFilename(file.name),
    sizeBytes: bytes.byteLength,
  };
}
