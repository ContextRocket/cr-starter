#!/usr/bin/env node
/**
 * Make a root-absolute Astro dist usable under a container path such as
 * `/site/`. Astro's `base` config already rewrites its generated asset URLs;
 * this pass rewrites the remaining site-authored root-absolute URLs in HTML,
 * CSS, and the web app manifest.
 *
 * The build stays a normal root build. The public domain keeps `/`, `/posts/`,
 * and the rest. Only the container preview is remounted under `CONTAINER_BASE`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, process.env.CONTAINER_DIST || "dist");
const rawBase = process.env.CONTAINER_BASE?.trim() || "";
const base = normalizeBase(rawBase);

if (!base) {
  console.log("containerize-dist: CONTAINER_BASE is empty, nothing to do");
  process.exit(0);
}

if (!fs.existsSync(dist)) {
  console.error(`containerize-dist: missing ${dist}; build first`);
  process.exit(1);
}

let changed = 0;

function normalizeBase(value) {
  const trimmed = value.replace(/\/+$/, "");
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function isExternal(url) {
  if (!url) return true;
  if (url.startsWith("#")) return true;
  if (url.startsWith("//")) return true;
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url);
}

function rewriteUrl(url) {
  if (!url || isExternal(url)) return url;
  if (url === base || url.startsWith(`${base}/`)) return url;
  if (!url.startsWith("/")) return url;
  changed += 1;
  return `${base}${url}`;
}

function rewriteSrcset(value) {
  if (!value || value.includes("data:")) return value;
  return value
    .split(",")
    .map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return candidate;
      const [url, ...rest] = trimmed.split(/\s+/);
      const next = rewriteUrl(url);
      return next === url ? trimmed : [next, ...rest].join(" ");
    })
    .join(", ");
}

function rewriteCss(value) {
  let next = value.replace(
    /url\(\s*(["']?)(\/[^"')\s]+)\1\s*\)/gi,
    (_match, quote, url) => {
      const rewritten = rewriteUrl(url);
      return `url(${quote}${rewritten}${quote})`;
    },
  );
  next = next.replace(
    /@import\s+(["'])(\/[^"']+)\1/gi,
    (_match, quote, url) => `@import ${quote}${rewriteUrl(url)}${quote}`,
  );
  return next;
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function encodeEntities(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rewriteIslandProps(value) {
  const decoded = decodeEntities(value);
  try {
    const parsed = JSON.parse(decoded);
    return `props="${encodeEntities(JSON.stringify(rewriteManifest(parsed)))}"`;
  } catch {
    return `props="${value}"`;
  }
}

function rewriteHtml(value) {
  let next = value.replace(
    /\b(href|src|poster|action)\s*=\s*(["'])(.*?)\2/gi,
    (_match, attr, quote, url) => `${attr}=${quote}${rewriteUrl(url)}${quote}`,
  );
  next = next.replace(
    /\b(srcset|data-srcset)\s*=\s*(["'])(.*?)\2/gi,
    (_match, attr, quote, value) => `${attr}=${quote}${rewriteSrcset(value)}${quote}`,
  );
  next = next.replace(/<meta\b[^>]*>/gi, (tag) => {
    const httpEquiv = tag.match(/\bhttp-equiv\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (httpEquiv?.toLowerCase() !== "refresh") return tag;
    return tag.replace(
      /(\bcontent\s*=\s*)(["'])(.*?)\2/i,
      (_match, prefix, quote, content) => {
        const rewritten = content.replace(
          /(\burl\s*=\s*)([^;\s]+)/i,
          (_urlMatch, urlPrefix, url) => `${urlPrefix}${rewriteUrl(url)}`,
        );
        return `${prefix}${quote}${rewritten}${quote}`;
      },
    );
  });
  next = next.replace(
    /\bprops\s*=\s*"([^"]*)"/g,
    (_match, value) => rewriteIslandProps(value),
  );
  return rewriteCss(next);
}

function rewriteManifest(value) {
  if (typeof value === "string") return rewriteUrl(value);
  if (Array.isArray(value)) return value.map(rewriteManifest);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rewriteManifest(entry)]),
    );
  }
  return value;
}

function rewriteDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteDir(full);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (ext === ".html" || ext === ".htm") {
      const source = fs.readFileSync(full, "utf8");
      const next = rewriteHtml(source);
      if (next !== source) fs.writeFileSync(full, next);
      continue;
    }
    if (ext === ".css") {
      const source = fs.readFileSync(full, "utf8");
      const next = rewriteCss(source);
      if (next !== source) fs.writeFileSync(full, next);
      continue;
    }
    if (ext === ".webmanifest") {
      const source = fs.readFileSync(full, "utf8");
      try {
        const next = `${JSON.stringify(rewriteManifest(JSON.parse(source)), null, 2)}\n`;
        if (next !== source) fs.writeFileSync(full, next);
      } catch {
        console.warn(`containerize-dist: skipped invalid manifest ${full}`);
      }
    }
  }
}

rewriteDir(dist);
console.log(
  `containerize-dist: rewrote ${changed} root-absolute URL(s) under ${base}/`,
);
