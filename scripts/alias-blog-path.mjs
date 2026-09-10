#!/usr/bin/env node
/**
 * Copy physical /[locale]/blog/ (and /blog/ after flatten) to the configured
 * public blog basePath when it differs from /blog.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { blogBasePath } = require(path.join(root, "blog.config.mjs"));
const base = blogBasePath();
if (base === "/blog") {
  console.log("alias-blog-path: default /blog, skipping");
  process.exit(0);
}

const dist = path.join(root, "dist");
const site = JSON.parse(
  fs.readFileSync(path.join(root, "config/site.json"), "utf8"),
);
const locales = site.locales ?? ["en"];
const targetSeg = base.replace(/^\//, "");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
  return true;
}

let copied = 0;
for (const locale of locales) {
  const from = path.join(dist, locale, "blog");
  const to = path.join(dist, locale, targetSeg);
  if (copyDir(from, to)) {
    console.log(`alias-blog-path: ${locale}/blog -> ${locale}/${targetSeg}`);
    copied++;
  }
}
// After single-locale flatten, blog may sit at dist/blog
const rootBlog = path.join(dist, "blog");
const rootTarget = path.join(dist, targetSeg);
if (copyDir(rootBlog, rootTarget)) {
  console.log(`alias-blog-path: /blog -> ${base}`);
  copied++;
}
if (!copied) {
  console.warn("alias-blog-path: no blog directories found to alias");
}
