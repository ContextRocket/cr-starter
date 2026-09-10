#!/usr/bin/env node
/**
 * Lightweight post-build smoke check for critical static artifacts in dist/.
 * Skips cleanly when dist/ is missing (e.g. typecheck-only runs).
 *
 * Astro output: trailingSlash "always" + build.format "directory"
 * → pages are dist/<path>/index.html (or dist/<locale>/<path>/index.html).
 * Endpoint files (sitemap, robots, manifests) are flat files at dist root.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

if (!fs.existsSync(dist)) {
  console.log("smoke-routes: dist/ missing — skipping (run build first)");
  process.exit(0);
}

const site = JSON.parse(
  fs.readFileSync(path.join(root, "config/site.json"), "utf8"),
);
const locales = site.locales ?? ["en"];
const defaultLocale = site.defaultLocale ?? locales[0];
const multiLocale = locales.length > 1;
const features = site.features ?? {};

/** Prefer directory/index.html; also accept flat .html for host quirks. */
function pageExists(...segments) {
  const dirIndex = path.join(dist, ...segments, "index.html");
  if (fs.existsSync(dirIndex)) return dirIndex;
  const flat = path.join(dist, ...segments.slice(0, -1), `${segments.at(-1)}.html`);
  if (segments.length > 0 && fs.existsSync(flat)) return flat;
  return null;
}

function fileExists(...segments) {
  const filePath = path.join(dist, ...segments);
  return fs.existsSync(filePath) ? filePath : null;
}

const missing = [];

function requireFile(label, found) {
  if (!found) missing.push(label);
}

// Root discovery / hygiene files (always expected after a full build)
requireFile("sitemap.xml", fileExists("sitemap.xml"));
requireFile("robots.txt", fileExists("robots.txt"));
requireFile("llms.txt", fileExists("llms.txt"));
requireFile(".well-known/security.txt", fileExists(".well-known", "security.txt"));
requireFile(
  ".well-known/agent-card.json",
  fileExists(".well-known", "agent-card.json"),
);
requireFile(".well-known/mcp.json", fileExists(".well-known", "mcp.json"));
requireFile("manifest.webmanifest", fileExists("manifest.webmanifest"));

if (features.blog) {
  requireFile("feed.xml", fileExists("feed.xml"));
}

// Home + legal pages: multi-locale keeps /en/…; single-locale flattens to /
const homeSegments = multiLocale ? [defaultLocale] : [];
requireFile(
  multiLocale ? `${defaultLocale}/index.html` : "index.html",
  pageExists(...homeSegments) || fileExists(...homeSegments, "index.html"),
);

const legalKinds = ["privacy", "cookies", "terms"];
if (features.impressum) legalKinds.push("impressum");

for (const kind of legalKinds) {
  const segments = multiLocale ? [defaultLocale, kind] : [kind];
  const label = multiLocale
    ? `${defaultLocale}/${kind}/index.html`
    : `${kind}/index.html`;
  requireFile(label, pageExists(...segments));
}

if (missing.length > 0) {
  console.error("smoke-routes: missing critical dist artifacts:");
  for (const item of missing) {
    console.error(`  - ${item}`);
  }
  console.error(
    `Looked under ${dist} (multiLocale=${multiLocale}, defaultLocale=${defaultLocale}).`,
  );
  process.exit(1);
}

console.log("smoke-routes: ok");
