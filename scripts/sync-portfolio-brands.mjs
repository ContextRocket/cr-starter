#!/usr/bin/env node
/**
 * Crawl + pack every site in examples/portfolio-sites.json (ContextRocket portfolio).
 *
 *   node scripts/sync-portfolio-brands.mjs
 *   node scripts/sync-portfolio-brands.mjs --routine-only
 *   node scripts/sync-portfolio-brands.mjs --cmp-only
 *   node scripts/sync-portfolio-brands.mjs --platform-only
 *   node scripts/sync-portfolio-brands.mjs --research-only
 *   node scripts/sync-portfolio-brands.mjs --id zartis,grandpal
 *   node scripts/sync-portfolio-brands.mjs --skip-lab
 */

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const portfolioPath = path.join(repoRoot, "examples/portfolio-sites.json");

const args = process.argv.slice(2);
const routineOnly = args.includes("--routine-only");
const cmpOnly = args.includes("--cmp-only");
const platformOnly = args.includes("--platform-only");
const researchOnly = args.includes("--research-only");
const skipLab = args.includes("--skip-lab");
const idFlag = args.indexOf("--id");
const idFilter =
  idFlag >= 0
    ? new Set(
        String(args[idFlag + 1] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null;

const portfolio = JSON.parse(readFileSync(portfolioPath, "utf8"));
let sites = portfolio.sites || [];
if (routineOnly) sites = sites.filter((s) => s.role === "routine");
if (cmpOnly) sites = sites.filter((s) => s.role === "cmp-fixture");
if (platformOnly) sites = sites.filter((s) => s.role === "platform-fixture");
if (researchOnly) sites = sites.filter((s) => s.role === "research");
if (idFilter?.size) sites = sites.filter((s) => idFilter.has(s.id));

if (!sites.length) {
  console.error("No sites selected.");
  process.exit(1);
}

function run(cmd, cmdArgs) {
  console.log(`\n$ ${cmd} ${cmdArgs.join(" ")}`);
  const res = spawnSync(cmd, cmdArgs, {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });
  if (res.status !== 0) {
    throw new Error(`${cmd} exited ${res.status}`);
  }
}

const results = [];
for (const site of sites) {
  const row = { id: site.id, url: site.url, ok: false, error: null };
  try {
    run(process.execPath, [
      path.join(__dirname, "crawl-brand.mjs"),
      site.url,
    ]);
    // crawl dir slug from hostname
    const host = new URL(site.url).hostname.replace(/^www\./, "");
    const crawlSlug = host.replace(/\./g, "-");
    const crawlDir = path.join(
      repoRoot,
      "scratchpad/brand-crawls",
      crawlSlug,
    );
    if (!existsSync(path.join(crawlDir, "crawl.json"))) {
      throw new Error(`crawl.json missing at ${crawlDir}`);
    }
    run(process.execPath, [
      path.join(__dirname, "pack-from-crawl.mjs"),
      crawlDir,
      "--id",
      site.id,
      ...(site.displayName ? ["--name", site.displayName] : []),
    ]);
    row.ok = true;
  } catch (err) {
    row.error = String(err.message || err);
    console.error(`FAIL ${site.id}: ${row.error}`);
  }
  results.push(row);
}

if (!skipLab) {
  try {
    run(process.execPath, [path.join(__dirname, "build-brand-lab.mjs")]);
  } catch (err) {
    console.error(`Lab build failed: ${err.message}`);
  }
}

const ok = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok);
console.log(`\nPortfolio sync: ${ok}/${results.length} ok`);
for (const r of fail) console.log(`  ✗ ${r.id}: ${r.error}`);
process.exit(fail.length ? 1 : 0);
