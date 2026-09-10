#!/usr/bin/env node
/**
 * After `astro build`, single-locale forks get clean URLs:
 * copy dist/<defaultLocale>/* up to dist/ and remove the locale folder.
 * Multi-locale sites are left unchanged (URLs stay /en/, /es/, ...).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(
  fs.readFileSync(path.join(root, "config/site.json"), "utf8"),
);
const locales = site.locales ?? ["en"];
if (locales.length !== 1) {
  console.log("flatten-single-locale: multi-locale site, skipping");
  process.exit(0);
}

const locale = site.defaultLocale ?? locales[0];
const dist = path.join(root, "dist");
const from = path.join(dist, locale);
if (!fs.existsSync(from)) {
  console.log(`flatten-single-locale: ${from} missing, skipping`);
  process.exit(0);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(from, dist);
fs.rmSync(from, { recursive: true, force: true });
// Drop the Astro redirect index that pointed at /en/ when present as a tiny HTML file
console.log(`flatten-single-locale: promoted /${locale}/ to /`);
