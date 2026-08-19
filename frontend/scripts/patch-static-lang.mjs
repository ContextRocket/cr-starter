#!/usr/bin/env node
/**
 * patch-static-lang.mjs -- bake the correct <html lang> into each locale folder.
 *
 * During static export the root layout has no request context (no headers), so
 * it renders <html lang={siteConfig.defaultLocale}> for every page. This script
 * runs AFTER `next build` (output:"export") and rewrites the opening <html lang>
 * in each locale folder's HTML to match that folder's locale.
 *
 * It discovers the locale list the same way generate-locale-registry.mjs does
 * (top-level <locale>.ts barrels in i18n/messages/), so adding a language needs
 * no edit here. It only touches the <html lang="…"> OPENING tag, never hreflang
 * link attributes or any other "lang=" occurrence.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.resolve(here, "../i18n/messages");
const outDir = path.resolve(here, "../out");

// Top-level files that are NOT locale barrels (mirror of generate-locale-registry.mjs).
const EXCLUDE = new Set(["index.ts", "registry.ts", "loaders.ts"]);

const locales = readdirSync(messagesDir)
  .filter((f) => f.endsWith(".ts") && !EXCLUDE.has(f))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

// siteConfig.defaultLocale (site.config.ts) -- the value the root layout emits
// when it has no request context (static export).
const DEFAULT_LANG = "en";

function collectHtml(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectHtml(full, acc);
    } else if (entry.endsWith(".html")) {
      acc.push(full);
    }
  }
  return acc;
}

let patched = 0;
for (const locale of locales) {
  if (locale === DEFAULT_LANG) continue;
  const localeDir = path.join(outDir, locale);
  if (!statSync(localeDir, { throwIfNoEntry: false })?.isDirectory()) continue;

  for (const file of collectHtml(localeDir)) {
    const html = readFileSync(file, "utf8");
    const next = html.replace(
      `<html lang="${DEFAULT_LANG}"`,
      `<html lang="${locale}"`,
    );
    if (next !== html) {
      writeFileSync(file, next);
      patched += 1;
    }
  }
}

console.log(`patch-static-lang: fixed <html lang> in ${patched} file(s)`);
