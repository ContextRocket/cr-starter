#!/usr/bin/env node
/**
 * Favicon / PWA-icon generator.
 *
 * Reads ONE square source PNG (a filled-background brand icon that reads at
 * 16px) and emits the full favicon + PWA icon set into `public/`, overwriting
 * whatever is there. This is the single source of truth for all app icons — do
 * not hand-edit the generated PNGs; replace the source art (or tweak the
 * padding/sizes below) and re-run this script.
 *
 * FORKING THIS STARTER (the whole point of this script):
 *   1. Replace `public/favicon-source.png` with your OWN square logo PNG,
 *      ideally >=512px (1024px is best). Keep the same generic filename so you
 *      only ever swap one file. A SOLID background matters — transparent
 *      favicons look bad in a browser tab, and Android's maskable mask will
 *      clip a transparent icon.
 *   2. Run:  pnpm generate-favicons
 *   3. Commit the regenerated public/*.png + public/favicon.ico and your new
 *      public/favicon-source.png. site.config already points at these fixed
 *      output paths, so no config change is needed.
 *
 * Overriding the source path (optional — the default is favicon-source.png):
 *   FAVICON_SOURCE=path/to/logo.png node scripts/generate-favicons.mjs
 *   node scripts/generate-favicons.mjs path/to/logo.png
 *
 * The source is a raster PNG so a fork does not need any SVG tooling; `sharp`
 * resizes it down to every favicon / PWA size. (It will also accept an SVG or
 * other sharp-readable input if you point FAVICON_SOURCE at one.)
 *
 * Requires `sharp` (already a dependency).
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(FRONTEND_ROOT, "public");

// Source PNG: CLI arg > env var > the shipped ContextRocket rocket (red bg).
const DEFAULT_SOURCE = path.join(PUBLIC_DIR, "favicon-source.png");
const rawSource =
  process.argv[2] || process.env.FAVICON_SOURCE || DEFAULT_SOURCE;
const SOURCE = path.isAbsolute(rawSource)
  ? rawSource
  : path.resolve(FRONTEND_ROOT, rawSource);

// Standard "edge-to-edge" icons: the artwork fills the whole square. The source
// art already carries its own solid background, so we just resize it.
const FLUSH_ICONS = [
  { file: "favicon-16x16.png", size: 16 },
  { file: "favicon-32x32.png", size: 32 },
  { file: "apple-icon-180x180.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

// Maskable icons: Android applies an arbitrary mask (circle, squircle, etc.) and
// only the inner ~80% "safe zone" is guaranteed visible. We render the artwork
// into the inner region with ~10% padding on every side over a solid background
// so the mask never clips the rocket.
const MASKABLE_ICONS = [
  { file: "icon-192-maskable.png", size: 192 },
  { file: "icon-512-maskable.png", size: 512 },
];
const MASKABLE_PADDING = 0.1; // 10% safe-zone padding on each side.

// Multi-resolution .ico embedded inside favicon.ico. 16/32/48 is the classic
// Windows / browser set.
const ICO_SIZES = [16, 32, 48];

/**
 * Solid background colour used to fill maskable padding. We sample it from the
 * source's top-left pixel so a fork's own brand colour is picked up
 * automatically — no per-brand constant to maintain.
 */
async function sampleBackgroundColor(sourceBuffer) {
  // Read the actual top-left pixel. Resizing to 1x1 averages the whole image,
  // which turns a branded background into a muddy colour when the foreground
  // artwork covers a substantial part of the source.
  const { data } = await sharp(sourceBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], alpha: 1 };
}

/** Render the flush (edge-to-edge) artwork at a given size. */
async function renderFlush(sourceBuffer, size) {
  return sharp(sourceBuffer, { density: 512 })
    .resize(size, size, { fit: "cover" })
    .png()
    .toBuffer();
}

/** Render a maskable icon: artwork centred in the safe zone over a solid bg. */
async function renderMaskable(sourceBuffer, size, background) {
  const inner = Math.round(size * (1 - MASKABLE_PADDING * 2));
  const art = await sharp(sourceBuffer, { density: 512 })
    .resize(inner, inner, { fit: "contain", background })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
}

/**
 * Pack a set of PNG buffers into a single multi-resolution .ico file.
 *
 * The ICONDIR / ICONDIRENTRY layout below is the documented Windows .ico
 * container. Each entry can hold a raw PNG payload (supported by every modern
 * browser and OS since Vista), so we embed the sharp-produced PNGs directly
 * rather than BMP bitmaps. This keeps the generator pure-`sharp` with no extra
 * ico-packer dependency. (Limitation: this writes PNG-encoded .ico entries, not
 * legacy BMP entries — fine for browsers/macOS/modern Windows; ancient
 * pre-Vista Windows would not render it, which is not a target here.)
 */
function packIco(pngEntries) {
  const count = pngEntries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4); // number of images

  const dirEntrySize = 16;
  let offset = header.length + dirEntrySize * count;

  const dirEntries = [];
  const imageData = [];
  for (const { size, buffer } of pngEntries) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 => 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 => 256)
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(entry);
    imageData.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

async function main() {
  console.log(`[favicons] source: ${SOURCE}`);
  const sourceBuffer = await sharp(SOURCE).toBuffer(); // fail fast if unreadable.
  const background = await sampleBackgroundColor(sourceBuffer);
  console.log(
    `[favicons] sampled background rgb(${background.r}, ${background.g}, ${background.b})`,
  );

  // Flush edge-to-edge icons.
  for (const { file, size } of FLUSH_ICONS) {
    const out = path.join(PUBLIC_DIR, file);
    const buf = await renderFlush(sourceBuffer, size);
    writeFileSync(out, buf);
    console.log(`[favicons] wrote ${file} (${size}x${size})`);
  }

  // Maskable icons with safe-zone padding.
  for (const { file, size } of MASKABLE_ICONS) {
    const out = path.join(PUBLIC_DIR, file);
    const buf = await renderMaskable(sourceBuffer, size, background);
    writeFileSync(out, buf);
    console.log(
      `[favicons] wrote ${file} (${size}x${size}, ${MASKABLE_PADDING * 100}% safe-zone padding)`,
    );
  }

  // Multi-size favicon.ico.
  const icoEntries = [];
  for (const size of ICO_SIZES) {
    icoEntries.push({ size, buffer: await renderFlush(sourceBuffer, size) });
  }
  const icoBuffer = packIco(icoEntries);
  writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log(`[favicons] wrote favicon.ico (${ICO_SIZES.join("/")})`);

  console.log("[favicons] done.");
}

main().catch((err) => {
  console.error("[favicons] failed:", err);
  process.exit(1);
});
