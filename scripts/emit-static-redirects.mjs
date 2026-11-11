#!/usr/bin/env node
/** Emit provider-neutral redirect data and Cloudflare Pages / Netlify rules. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(fs.readFileSync(path.join(root, "config/site.json"), "utf8"));
const redirects = site.redirects ?? [];
if (!Array.isArray(redirects)) throw new TypeError("site redirects must be an array.");

const allowedStatuses = new Set([301, 302, 307, 308]);
const seenSources = new Set();
const rules = redirects.map((entry, index) => {
  const label = `redirects[${index}]`;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new TypeError(`${label} must be an object.`);
  }
  const { from, to, status = 301 } = entry;
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//") || /[\s?#\r\n]/.test(from)) {
    throw new TypeError(`${label}.from must be a path pattern beginning with one slash.`);
  }
  if (from.split("/").includes("..")) {
    throw new TypeError(`${label}.from cannot traverse above the site root.`);
  }
  if (typeof to !== "string" || (!to.startsWith("/") && !/^https:\/\//i.test(to)) || to.startsWith("//") || /[\r\n]/.test(to)) {
    throw new TypeError(`${label}.to must be a local path or an https URL.`);
  }
  if (to.startsWith("/")) {
    if (to.split(/[?#]/, 1)[0].split("/").includes("..")) {
      throw new TypeError(`${label}.to cannot traverse above the site root.`);
    }
  } else {
    let target;
    try {
      target = new URL(to);
    } catch {
      throw new TypeError(`${label}.to must be a valid https URL.`);
    }
    if (target.protocol !== "https:" || !target.hostname || target.username || target.password) {
      throw new TypeError(`${label}.to must be a valid https URL without credentials.`);
    }
  }
  if (!allowedStatuses.has(Number(status))) {
    throw new TypeError(`${label}.status must be 301, 302, 307, or 308.`);
  }
  if (seenSources.has(from)) throw new TypeError(`Duplicate redirect source: ${from}`);
  if (from === to) throw new TypeError(`Redirect cannot point to itself: ${from}`);
  seenSources.add(from);
  return { from, to, status: Number(status) };
});

const bySource = new Map(rules.map((rule) => [rule.from, rule]));
const byPattern = new Map(
  rules.map((rule) => [rule.from, rule]),
);
const asSourcePattern = (pathValue) => pathValue.replace(/:[A-Za-z][A-Za-z0-9_]*/g, "*");
for (const rule of rules) {
  const visited = new Set([rule.from]);
  let destination = rule.to;
  while (destination.startsWith("/")) {
    const nextRule = bySource.get(destination) ??
      (destination.includes(":") ? byPattern.get(asSourcePattern(destination)) : undefined);
    if (!nextRule) break;
    if (visited.has(nextRule.from)) throw new TypeError(`Redirect loop detected from ${rule.from}.`);
    visited.add(nextRule.from);
    destination = nextRule.to;
  }
}

const dist = path.join(root, "dist");
if (!fs.existsSync(dist)) throw new Error("dist/ is missing; build the site first.");
fs.writeFileSync(path.join(dist, "redirects.json"), `${JSON.stringify(rules, null, 2)}\n`);
fs.writeFileSync(path.join(dist, "_redirects"), [
  "# Generated from config/site.json redirects. Do not edit by hand.",
  ...rules.map(({ from, to, status }) => `${from} ${to} ${status}`),
  "",
].join("\n"));
console.log(`static redirects: emitted ${rules.length} rule(s)`);
