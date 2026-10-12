#!/usr/bin/env node
/*
 * Integrity check for project before/after imagery referenced in
 * content/projects.ts vs. the files actually in /public/projects.
 *
 * It reports four classes of problem:
 *   1. MISSING   — a beforeImage/afterImage path with no file on disk.
 *   2. DRIFT     — MISSING_PROJECT_IMAGES in content/projects.ts is out of sync
 *                  with /public (a real bug: a backfilled photo would stay hidden,
 *                  or a known-404 path would be requested).
 *   3. ORPHAN    — a file in /public/projects that no project references. Usually
 *                  a stray, mis-named, or wrong-extension upload (e.g. a "-during"
 *                  or "-essex" file). When an orphan shares a project prefix with a
 *                  MISSING path, it is almost certainly a naming mistake — the photo
 *                  exists but under the wrong name, so the slider can't find it.
 *   4. COVERAGE  — per-project before/after status (PAIR / SINGLE / NONE) so the
 *                  team can see at a glance which projects still need real photos.
 *
 * Missing photos are non-fatal at runtime: the gallery renders a single on-brand
 * image instead of a fake comparison (see components/site/gallery/ProjectMedia.tsx
 * + hasBeforeAfterPair in content/projects.ts).
 *
 *   npm run check:images              # human-readable report
 *   npm run check:images -- --strict  # exits 1 if anything needs attention (CI)
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const projectsFile = path.join(root, "content", "projects.ts");
const publicDir = path.join(root, "public");
const projectsDir = path.join(publicDir, "projects");

const source = fs.readFileSync(projectsFile, "utf8");

// --- referenced before/after paths -----------------------------------------
const re = /(?:before|after)Image:\s*"(\/projects\/[^"]+)"/g;
const refs = [];
let match;
while ((match = re.exec(source)) !== null) {
  refs.push(match[1]);
}
const referenced = new Set(refs);
const exists = (ref) => fs.existsSync(path.join(publicDir, ref));
const missing = [...new Set(refs.filter((ref) => !exists(ref)))];

// --- 2) MISSING_PROJECT_IMAGES drift ---------------------------------------
const setBlock = source.match(/MISSING_PROJECT_IMAGES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/);
const declared = setBlock
  ? [...setBlock[1].matchAll(/"(\/projects\/[^"]+)"/g)].map((m) => m[1])
  : [];
const declaredSet = new Set(declared);
const staleDeclared = declared.filter((ref) => exists(ref));
const undeclaredMissing = missing.filter((ref) => !declaredSet.has(ref));
const hasDrift = staleDeclared.length > 0 || undeclaredMissing.length > 0;

// --- 3) orphan files on disk -----------------------------------------------
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return IMAGE_EXT.test(entry.name) ? [full] : [];
  });
}
const onDisk = walk(projectsDir).map(
  (full) => "/" + path.relative(publicDir, full).split(path.sep).join("/")
);
const orphans = onDisk.filter((rel) => !referenced.has(rel));

const projectKey = (ref) => ref.replace(/-(before|after)\.[a-z0-9]+$/i, "");
const missingKeys = new Set(missing.map(projectKey));
// An orphan whose stem (drop extension + the trailing -token) equals the key of a
// project that is STILL MISSING a side is high-signal: the photo is probably on
// disk but under the wrong name, so the referenced -before/-after path 404s.
const orphanStem = (rel) => rel.replace(/\.[a-z0-9]+$/i, "").replace(/-[a-z0-9]+$/i, "");
const suspiciousOrphans = orphans.filter((rel) => missingKeys.has(orphanStem(rel)));

// --- 4) per-project coverage ------------------------------------------------
const sideOf = (ref) => {
  const m = ref.match(/-(before|after)\.[a-z0-9]+$/i);
  return m ? m[1].toLowerCase() : null;
};
const byKey = new Map();
for (const ref of refs) {
  const key = projectKey(ref);
  const side = sideOf(ref);
  if (!side) continue;
  const rec = byKey.get(key) || { before: null, after: null };
  rec[side] = ref;
  byKey.set(key, rec);
}
const coverage = { pair: [], single: [], none: [] };
for (const [key, rec] of byKey) {
  const beforeReal = rec.before && exists(rec.before);
  const afterReal = rec.after && exists(rec.after);
  if (beforeReal && afterReal) coverage.pair.push(key);
  else if (beforeReal || afterReal) coverage.single.push(key);
  else coverage.none.push(key);
}

// --- report -----------------------------------------------------------------
if (missing.length === 0) {
  console.log(`✓ All ${refs.length} project images referenced in content/projects.ts exist under /public.`);
} else {
  console.log(`⚠ ${missing.length} of ${refs.length} project image paths are missing from /public:`);
  for (const ref of missing.sort()) console.log(`  - ${ref}`);
  console.log("\nThese render a single on-brand image (not a fake before/after) via ProjectMedia.");
  console.log("Drop the real photos into /public to replace them.");
}

if (hasDrift) {
  console.log("\n✗ MISSING_PROJECT_IMAGES in content/projects.ts is OUT OF SYNC with /public:");
  if (staleDeclared.length > 0) {
    console.log("  Listed as missing but the file now EXISTS — remove these so the real photo renders:");
    for (const ref of staleDeclared.sort()) console.log(`    - ${ref}`);
  }
  if (undeclaredMissing.length > 0) {
    console.log("  Missing from /public but NOT listed — add these so the UI skips the 404:");
    for (const ref of undeclaredMissing.sort()) console.log(`    - ${ref}`);
  }
} else if (declared.length > 0) {
  console.log(`\n✓ MISSING_PROJECT_IMAGES (${declared.length}) matches the missing-file set.`);
}

if (orphans.length > 0) {
  console.log(`\n⚠ ${orphans.length} orphan file(s) in /public/projects not referenced by any project:`);
  for (const rel of orphans.sort()) {
    const flag = suspiciousOrphans.includes(rel)
      ? "  ✗ stem matches a project STILL MISSING a side — likely mis-named (rename to the expected -before/-after path)"
      : "";
    console.log(`  - ${rel}${flag}`);
  }
  console.log("  Orphans are not served by the gallery. Rename to the expected -before/-after path, or remove.");
} else {
  console.log("\n✓ No orphan files in /public/projects.");
}

console.log(
  `\nCoverage: ${coverage.pair.length} pair (before+after) · ${coverage.single.length} single · ${coverage.none.length} no-photo`
);
if (coverage.single.length > 0) {
  console.log("  SINGLE (one real photo — shows a single image, needs the other side for a comparison):");
  for (const k of coverage.single.sort()) console.log(`    - ${k.replace("/projects/", "")}`);
}
if (coverage.none.length > 0) {
  console.log("  NO-PHOTO (on-brand placeholder — needs real before AND after):");
  for (const k of coverage.none.sort()) console.log(`    - ${k.replace("/projects/", "")}`);
}

const strict = process.argv.includes("--strict") || process.argv.includes("--ci");
// Always-fail conditions (real data bugs): MISSING_PROJECT_IMAGES drift, and a
// mis-named orphan that leaves a referenced side 404ing. Intentional extra assets
// (plain orphans like a "-during" shot) and "not backfilled yet" (missing / single
// / none) only fail under --strict.
const alwaysFail = hasDrift || suspiciousOrphans.length > 0;
const strictFail = strict && (missing.length > 0 || orphans.length > 0);
process.exit(alwaysFail || strictFail ? 1 : 0);
