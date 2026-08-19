#!/usr/bin/env node
/**
 * validate-theme.mjs -- validates that site.json theme light/dark blocks
 * have symmetric CSS variable names.
 *
 * Usage: node scripts/validate-theme.mjs
 * Exit code 0 = pass, 1 = fail.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteJsonPath = resolve(__dirname, "../config/site.json");

const siteData = JSON.parse(readFileSync(siteJsonPath, "utf-8"));
const { light, dark } = siteData.theme;

if (!light || !dark) {
  console.error("validate-theme: site.json theme.light or theme.dark missing");
  process.exit(1);
}

const lightKeys = Object.keys(light).sort();
const darkKeys = Object.keys(dark).sort();

const missingInDark = lightKeys.filter((k) => !darkKeys.includes(k));
const missingInLight = darkKeys.filter((k) => !lightKeys.includes(k));

let failed = false;

if (missingInDark.length > 0) {
  console.error("validate-theme: tokens in light but missing from dark:");
  for (const k of missingInDark) console.error(`  ${k}`);
  failed = true;
}

if (missingInLight.length > 0) {
  console.error("validate-theme: tokens in dark but missing from light:");
  for (const k of missingInLight) console.error(`  ${k}`);
  failed = true;
}

if (failed) {
  console.error("\nvalidate-theme: FAILED -- light and dark blocks must have the same tokens.");
  process.exit(1);
}

console.log(`validate-theme: OK -- ${lightKeys.length} tokens, light/dark symmetric.`);
