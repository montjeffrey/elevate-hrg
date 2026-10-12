/**
 * One-shot dev script — NOT runtime code.
 * Compresses three large brand PNGs in-place using sharp.
 * Target: ≤400 KB per file at original dimensions (or ≤2000px on long edge).
 *
 * Usage (from repo root): node scripts/compress-brand-pngs.cjs
 */

"use strict";

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const BRAND_DIR = path.join(__dirname, "..", "public", "brand");
const MAX_LONG_EDGE = 2000;
const TARGET_BYTES = 400 * 1024; // 400 KB

const FILES = [
  "siding-after.png",
  "sliding-door-after.png",
  "sliding-door-before.png",
];

async function compressFile(filename) {
  const filePath = path.join(BRAND_DIR, filename);
  const originalSize = fs.statSync(filePath).size;

  const meta = await sharp(filePath).metadata();
  const { width, height } = meta;

  // Determine if we need to downscale (long edge > 2000px)
  const longEdge = Math.max(width, height);
  let resizeOpts = null;
  if (longEdge > MAX_LONG_EDGE) {
    resizeOpts =
      width >= height
        ? { width: MAX_LONG_EDGE, withoutEnlargement: true }
        : { height: MAX_LONG_EDGE, withoutEnlargement: true };
  }

  function makePipeline(srcPath) {
    let p = sharp(srcPath);
    if (resizeOpts) p = p.resize(resizeOpts);
    return p;
  }

  // Pass 1: PNG compressionLevel 9
  const pngBuffer = await makePipeline(filePath)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  let finalBuffer = pngBuffer;
  let strategy = "PNG compressionLevel=9";

  if (pngBuffer.length > TARGET_BYTES) {
    // Pass 2: WebP quality=85 — Next.js Image Optimization re-encodes on serve
    // so the on-disk format mismatch (webp bytes in a .png file) is safe for
    // next/image srcs; direct <img> refs would need extension update, but these
    // files are only consumed through next/image in FeaturedWork.tsx / projects.ts.
    const webpBuffer = await makePipeline(filePath)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    if (webpBuffer.length < finalBuffer.length) {
      finalBuffer = webpBuffer;
      strategy = "WebP quality=85";
    }

    if (finalBuffer.length > TARGET_BYTES) {
      // Pass 3: WebP quality=80 + 1600px long-edge for aggressive reduction
      const newLongEdge = Math.min(longEdge, 1600);
      const aggressiveResize =
        width >= height
          ? { width: newLongEdge, withoutEnlargement: true }
          : { height: newLongEdge, withoutEnlargement: true };

      const aggressiveBuffer = await sharp(filePath)
        .resize(aggressiveResize)
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

      if (aggressiveBuffer.length < finalBuffer.length) {
        finalBuffer = aggressiveBuffer;
        strategy = "WebP quality=80 + 1600px long-edge resize";
      }
    }
  }

  fs.writeFileSync(filePath, finalBuffer);
  const newSize = fs.statSync(filePath).size;
  const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
  const budgetMet = newSize <= TARGET_BYTES ? "PASS" : "OVER BUDGET";

  console.log(`${filename}`);
  console.log(`  Original  : ${(originalSize / 1024).toFixed(0)} KB (${originalSize} bytes)`);
  console.log(`  New       : ${(newSize / 1024).toFixed(0)} KB (${newSize} bytes)  [${reduction}% saved]`);
  console.log(`  Strategy  : ${strategy}`);
  console.log(`  400 KB budget: ${budgetMet}`);
  console.log();
}

(async () => {
  console.log("Compressing brand PNGs...\n");
  for (const f of FILES) {
    await compressFile(f);
  }
  console.log("Done.");
})();
