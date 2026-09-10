#!/usr/bin/env node
/**
 * Copy crawl viewport/fullpage screenshots into existing brand packs
 * and refresh brand-pack.json screenshot pointers (no re-crawl).
 *
 *   node scripts/backfill-pack-screenshots.mjs
 */
import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.join(repoRoot, "examples");
const crawlsDir = path.join(repoRoot, "scratchpad/brand-crawls");

function crawlSlugFromUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.replace(/\./g, "-");
  } catch {
    return null;
  }
}

let updated = 0;
for (const id of readdirSync(examplesDir)) {
  if (id.startsWith("_") || id === "lab") continue;
  const packPath = path.join(examplesDir, id, "brand-pack.json");
  if (!existsSync(packPath)) continue;
  const pack = JSON.parse(readFileSync(packPath, "utf8"));
  const slug =
    crawlSlugFromUrl(pack.source?.url || pack.identity?.siteUrl || "") ||
    id.replace(/-/g, "-");
  const crawlDir = path.join(crawlsDir, slug);
  const assetsOut = path.join(examplesDir, id, "assets");
  if (!existsSync(crawlDir) || !existsSync(assetsOut)) continue;

  const shots = {};
  for (const shot of ["viewport.png", "fullpage.png"]) {
    const src = path.join(crawlDir, shot);
    if (!existsSync(src)) continue;
    copyFileSync(src, path.join(assetsOut, shot));
    shots[shot.replace(".png", "")] = `./assets/${shot}`;
  }
  if (!Object.keys(shots).length) continue;
  pack.assets = pack.assets || {};
  pack.assets.screenshots = {
    viewport: shots.viewport,
    fullpage: shots.fullpage,
  };
  writeFileSync(packPath, JSON.stringify(pack, null, 2) + "\n");
  updated += 1;
  console.log(`✓ ${id} ← ${slug}`);
}
console.log(`Updated ${updated} packs with screenshots`);
