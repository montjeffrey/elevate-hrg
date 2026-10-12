import { getStore } from "@netlify/blobs";
import type { CareerApplication } from "@/lib/careers-validation";
import type { LeadSubmission } from "@/lib/lead-validation";

/**
 * Durable archive for everything the public forms capture.
 *
 * The site has no database, so without this the inbox would be the only
 * record of a lead, and an email provider can accept a send and still never
 * deliver it.
 *
 * Netlify Blobs is part of the runtime the site
 * already deploys to, so it adds no service, no account and no credentials in
 * production. Every submission is written here BEFORE any delivery is attempted,
 * which is the whole point: a submission survives even if every email channel
 * fails at once.
 *
 * Two rules this module must never break:
 *
 *   1. **It never throws.** An archive failure must not cost a lead. Callers do
 *      not need try/catch, and a lead still reaches the inbox if this is broken.
 *   2. **It never stores a resume.** Career applications archive their metadata
 *      only; the PDF stays in the email attachment and nowhere else, preserving
 *      the guarantee that this site does not persist
 *      resume files.
 */

const LEAD_STORE = "leads";
const APPLICATION_STORE = "career-applications";

/**
 * Sortable, unique, and safe as a blob key. The ISO timestamp leads so a plain
 * lexicographic listing comes back in chronological order.
 */
function archiveKey(id: string, at: Date): string {
  return `${at.toISOString().replace(/[:.]/g, "-")}__${id}`;
}

async function write(storeName: string, key: string, value: unknown, label: string) {
  try {
    await getStore(storeName).setJSON(key, value);
  } catch (error) {
    // Outside the Netlify runtime (local `next dev`, tests) there is no blobs
    // context and this throws. That is expected and must stay non-fatal.
    console.warn(
      `[archive] could not store ${label} — delivery is unaffected:`,
      error instanceof Error ? error.message : String(error)
    );
  }
}

export async function archiveLead(lead: LeadSubmission, leadId: string): Promise<void> {
  const receivedAt = new Date();
  // `honeypot` is spam-trap plumbing, not lead data.
  const fields: Record<string, unknown> = { ...lead };
  delete fields.honeypot;

  await write(
    LEAD_STORE,
    archiveKey(leadId, receivedAt),
    { leadId, receivedAt: receivedAt.toISOString(), ...fields },
    `lead ${leadId}`
  );
}

export async function archiveApplication(
  application: CareerApplication,
  applicationId: string,
  resumeFilename: string
): Promise<void> {
  const receivedAt = new Date();

  await write(
    APPLICATION_STORE,
    archiveKey(applicationId, receivedAt),
    {
      applicationId,
      receivedAt: receivedAt.toISOString(),
      ...application,
      // Deliberately the NAME only. The file itself is never persisted here.
      resumeFilename,
    },
    `application ${applicationId}`
  );
}
