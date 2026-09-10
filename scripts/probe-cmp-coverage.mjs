#!/usr/bin/env node
/**
 * Probe portfolio (+ optional extras) for CMP fingerprint and dismiss success.
 *
 *   node scripts/probe-cmp-coverage.mjs
 *   node scripts/probe-cmp-coverage.mjs --id didomi,osano,cookiefirst
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dismissConsentChrome } from "./lib/consent-chrome.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const portfolio = JSON.parse(
  readFileSync(path.join(repoRoot, "examples/portfolio-sites.json"), "utf8"),
);

const idFlag = process.argv.indexOf("--id");
const idFilter =
  idFlag >= 0
    ? new Set(
        String(process.argv[idFlag + 1] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null;

let sites = portfolio.sites || [];
if (idFilter?.size) sites = sites.filter((s) => idFilter.has(s.id));

function localeForUrl(url) {
  try {
    const host = new URL(url).hostname;
    if (/\.de$/i.test(host) || /\.at$/i.test(host))
      return { locale: "de-DE", languages: "de-DE,de;q=0.9,en;q=0.8" };
    if (/\.fr$/i.test(host))
      return { locale: "fr-FR", languages: "fr-FR,fr;q=0.9,en;q=0.8" };
    if (/\.es$/i.test(host))
      return { locale: "es-ES", languages: "es-ES,es;q=0.9,en;q=0.8" };
    if (/\.ie$/i.test(host))
      return { locale: "en-IE", languages: "en-IE,en;q=0.9" };
  } catch {
    /* ignore */
  }
  return { locale: "en-US", languages: "en-US,en;q=0.9" };
}

const browser = await chromium.launch({ headless: true });
const report = [];

for (const site of sites) {
  const loc = localeForUrl(site.url);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: loc.locale,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    extraHTTPHeaders: { "Accept-Language": loc.languages },
  });
  const page = await context.newPage();
  const row = {
    id: site.id,
    url: site.url,
    role: site.role,
    expectedCmp: site.cmp || null,
    framework: null,
    closed: false,
    action: null,
    strategy: null,
    notes: [],
    error: null,
  };
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    const consent = await dismissConsentChrome(page, { waitMs: 1800, retries: 2 });
    row.framework = consent.framework;
    row.closed = consent.closed;
    row.action = consent.action;
    row.strategy = consent.strategy;
    row.notes = consent.notes.slice(0, 8);
  } catch (err) {
    row.error = err.message.slice(0, 160);
  }
  await context.close();
  report.push(row);
  const mark = row.closed ? "✓" : row.framework ? "·" : "-";
  console.log(
    `${mark} ${site.id.padEnd(20)} expect=${(site.cmp || "-").padEnd(12)} ` +
      `got=${(row.framework || "-").padEnd(12)} closed=${row.closed} ` +
      `${row.action || "-"} ${row.strategy || "-"}${row.error ? " ERR " + row.error : ""}`,
  );
}

await browser.close();

const outDir = path.join(repoRoot, "scratchpad/cmp-coverage");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "report.json");
writeFileSync(
  outPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), results: report }, null, 2) +
    "\n",
);

const withCmp = report.filter((r) => r.expectedCmp || r.framework);
const closed = withCmp.filter((r) => r.closed).length;
console.log(`\nClosed ${closed}/${withCmp.length} detected/expected CMP rows`);
console.log(`Report → ${outPath}`);
