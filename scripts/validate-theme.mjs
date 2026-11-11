#!/usr/bin/env node
/** Validate the starter's single curated semantic palette. */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(readFileSync(resolve(root, "../config/site.json"), "utf8"));
const tokens = site.theme?.tokens;
const required = ["--background", "--foreground", "--card", "--primary", "--muted", "--muted-foreground", "--border", "--ring"];
const missing = required.filter((key) => typeof tokens?.[key] !== "string" || !tokens[key].trim());
if (missing.length) {
  console.error(`validate-theme: missing theme.tokens: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`validate-theme: OK -- ${Object.keys(tokens).length} semantic tokens.`);
