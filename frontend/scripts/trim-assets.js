#!/usr/bin/env node
/**
 * scripts/trim-assets.js
 *
 * Trims transparent padding from logo and favicon images in public/.
 *
 * Usage:
 *   node scripts/trim-assets.js                    # trim all logo/favicon files
 *   node scripts/trim-assets.js public/logo.png    # trim a single file
 *
 * Outputs trimmed copies as {name}-trimmed.{ext}. Original files are
 * untouched. Update site.config.ts assets.logo to point to the trimmed
 * version.
 *
 * Requires: sharp (pnpm add -D sharp)
 *
 * Why: logos scraped from Webflow/CDN often have huge transparent
 * padding (e.g. 1024×1024 with text in a 200×80 area). Trimming makes
 * the logo legible at navbar sizes without manual cropping.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

async function trimFile(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const trimmedPath = path.join(
    path.dirname(filePath),
    `${base}-trimmed${ext}`,
  );

  const metadata = await sharp(filePath).metadata();
  console.log(
    `Trimming ${path.basename(filePath)} (${metadata.width}×${metadata.height})...`,
  );

  const info = await sharp(filePath)
    .trim({ threshold: 10 })
    .toFile(trimmedPath);

  const saved = info.width * info.height;
  const original = (metadata.width || 1) * (metadata.height || 1);
  const reduction = ((1 - saved / original) * 100).toFixed(0);

  console.log(
    `  → ${path.basename(trimmedPath)} (${info.width}×${info.height}, ${reduction}% smaller)`,
  );
  return trimmedPath;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Trim specific files
    for (const arg of args) {
      const filePath = path.resolve(arg);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }
      await trimFile(filePath);
    }
  } else {
    // Auto-discover: trim all logo* and favicon* files in public/
    const files = fs.readdirSync(PUBLIC_DIR).filter((f) => {
      const lower = f.toLowerCase();
      return (
        (lower.startsWith("logo") || lower.startsWith("favicon")) &&
        /\.(png|jpg|jpeg|webp|avif)$/i.test(f) &&
        !f.includes("-trimmed") // skip already-trimmed
      );
    });

    if (files.length === 0) {
      console.log(
        "No logo/favicon files found in public/. Pass a file path to trim a specific image.",
      );
      console.log("Example: node scripts/trim-assets.js public/my-logo.png");
      return;
    }

    for (const file of files) {
      await trimFile(path.join(PUBLIC_DIR, file));
    }

    console.log(
      "\nDone. Update site.config.ts assets.logo to point to the trimmed version.",
    );
  }
}

main().catch((err) => {
  console.error("Trim failed:", err.message);
  process.exit(1);
});
