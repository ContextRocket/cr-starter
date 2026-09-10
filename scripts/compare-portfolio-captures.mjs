#!/usr/bin/env node
/**
 * Portfolio visual QA: screenshot live site vs Brand Lab landing side-by-side.
 *
 *   node scripts/compare-portfolio-captures.mjs
 *   node scripts/compare-portfolio-captures.mjs --id zartis,solarpath
 *   node scripts/compare-portfolio-captures.mjs --skip-live   # lab only
 *
 * Requires Brand Lab dist (runs build). Writes:
 *   scratchpad/brand-compare/<id>/{live,lab}.png
 *   scratchpad/brand-compare/index.html
 *   scratchpad/brand-compare/report.json
 */

import { chromium } from "playwright";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { dismissConsentChrome } from "./lib/consent-chrome.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const portfolioPath = path.join(repoRoot, "examples/portfolio-sites.json");
const labDist = path.join(repoRoot, "examples/lab/dist");
const outRoot = path.join(repoRoot, "scratchpad/brand-compare");

const args = process.argv.slice(2);
const skipLive = args.includes("--skip-live");
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

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Rebuild lab
const build = spawnSync(
  process.execPath,
  [path.join(__dirname, "build-brand-lab.mjs")],
  { cwd: repoRoot, stdio: "inherit" },
);
if (build.status !== 0) process.exit(build.status ?? 1);

const portfolio = JSON.parse(readFileSync(portfolioPath, "utf8"));
let sites = portfolio.sites || [];
if (idFilter?.size) sites = sites.filter((s) => idFilter.has(s.id));

mkdirSync(outRoot, { recursive: true });

/** Locale from TLD so CMPs render the same labels users see. */
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
  const packPath = path.join(repoRoot, "examples", site.id, "brand-pack.json");
  const row = {
    id: site.id,
    url: site.url,
    role: site.role,
    packOk: existsSync(packPath),
    liveOk: false,
    labOk: false,
    labSlug: null,
    colors: null,
    logoReason: null,
    consent: null,
    errors: [],
  };

  if (!row.packOk) {
    row.errors.push("missing brand-pack.json");
    report.push(row);
    console.log(`✗ ${site.id}: no pack`);
    continue;
  }

  const pack = JSON.parse(readFileSync(packPath, "utf8"));
  row.labSlug = slugify(pack.identity?.name || site.id);
  row.colors = {
    background: pack.colors?.background,
    foreground: pack.colors?.foreground,
    primary: pack.colors?.primary,
    accent: pack.colors?.accent,
    provenance: pack.colors?.provenance || null,
  };
  row.logoReason = pack.assets?.logoAnalysis?.reason || null;
  row.logoLightFit = pack.assets?.logoAnalysis?.fitsLightBackground ?? null;
  row.logoPalette = (pack.assets?.logoAnalysis?.palette || []).map((p) => p.hex);

  const siteOut = path.join(outRoot, site.id);
  mkdirSync(siteOut, { recursive: true });

  // --- Live screenshot ---
  if (!skipLive) {
    const loc = localeForUrl(site.url);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: loc.locale,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      extraHTTPHeaders: { "Accept-Language": loc.languages },
    });
    const page = await context.newPage();
    try {
      try {
        await page.goto(site.url, { waitUntil: "load", timeout: 60000 });
      } catch {
        await page.goto(site.url, {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        });
      }
      const consent = await dismissConsentChrome(page, {
        waitMs: 1800,
        retries: 3,
      });
      row.consent = {
        detected: consent.detected,
        closed: consent.closed,
        framework: consent.framework,
        action: consent.action,
        strategy: consent.strategy,
        notes: consent.notes,
      };
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(siteOut, "live.png"),
        fullPage: false,
        timeout: 20000,
      });
      row.liveOk = true;
    } catch (err) {
      row.errors.push(`live: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  // --- Lab screenshot (file://) ---
  const labIndex = path.join(labDist, row.labSlug, "index.html");
  if (!existsSync(labIndex)) {
    row.errors.push(`lab page missing: ${row.labSlug}`);
  } else {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    try {
      await page.goto(`file://${labIndex}`, {
        waitUntil: "load",
        timeout: 30000,
      });
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(siteOut, "lab.png"),
        fullPage: false,
        timeout: 15000,
      });
      row.labOk = true;
    } catch (err) {
      row.errors.push(`lab: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  const status =
    row.packOk && row.labOk && (skipLive || row.liveOk) ? "ok" : "partial";
  console.log(
    `${status === "ok" ? "✓" : "~"} ${site.id} live=${row.liveOk} lab=${row.labOk} primary=${row.colors?.primary || "-"} logo=${row.logoReason || "-"}`,
  );
  report.push(row);
}

await browser.close();

writeFileSync(
  path.join(outRoot, "report.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      skipLive,
      results: report,
    },
    null,
    2,
  ) + "\n",
);

const cards = report
  .map((r) => {
    const liveSrc = existsSync(path.join(outRoot, r.id, "live.png"))
      ? `./${esc(r.id)}/live.png`
      : null;
    const labSrc = existsSync(path.join(outRoot, r.id, "lab.png"))
      ? `./${esc(r.id)}/lab.png`
      : null;
    const swatches = ["background", "foreground", "primary", "accent"]
      .map((k) => {
        const hex = r.colors?.[k];
        if (!hex) return "";
        return `<span class="sw" title="${esc(k)} ${esc(hex)}" style="background:${esc(hex)}"></span>`;
      })
      .join("");
    return `
    <article class="card">
      <header>
        <h2>${esc(r.id)} <small>${esc(r.role || "")}</small></h2>
        <p class="meta">
          <a href="${esc(r.url)}" target="_blank" rel="noreferrer">${esc(r.url)}</a>
          · lab /${esc(r.labSlug || "")}/
          · logo ${esc(r.logoReason || "?")} lightFit=${r.logoLightFit}
        </p>
        <div class="swatches">${swatches}</div>
        ${r.errors.length ? `<p class="err">${esc(r.errors.join("; "))}</p>` : ""}
      </header>
      <div class="pair">
        <figure>
          ${liveSrc ? `<img src="${liveSrc}" alt="live ${esc(r.id)}" />` : "<p class='miss'>no live shot</p>"}
          <figcaption>Live (after consent dismiss)</figcaption>
        </figure>
        <figure>
          ${labSrc ? `<img src="${labSrc}" alt="lab ${esc(r.id)}" />` : "<p class='miss'>no lab shot</p>"}
          <figcaption>Brand Lab landing</figcaption>
        </figure>
      </div>
    </article>`;
  })
  .join("\n");

const ok = report.filter(
  (r) => r.packOk && r.labOk && (skipLive || r.liveOk),
).length;
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Portfolio capture compare</title>
  <style>
    :root { --bg:#fafafa; --fg:#171717; --muted:#737373; --line:#e5e5e5; }
    body { margin:0; font-family: ui-sans-serif, system-ui, sans-serif; background:var(--bg); color:var(--fg); }
    header.page { max-width: 72rem; margin: 0 auto; padding: 2rem 1.5rem 1rem; }
    header.page h1 { margin:0; font-size:1.5rem; letter-spacing:-0.03em; }
    header.page p { color:var(--muted); max-width:40rem; line-height:1.5; }
    .card { max-width: 72rem; margin: 0 auto 2rem; padding: 0 1.5rem; }
    .card > header { margin-bottom: 0.75rem; }
    .card h2 { margin:0; font-size:1.15rem; }
    .card h2 small { color:var(--muted); font-weight:500; font-size:0.75rem; text-transform:uppercase; }
    .meta { margin:0.35rem 0; font-size:0.85rem; color:var(--muted); }
    .meta a { color: inherit; }
    .swatches { display:flex; gap:0.35rem; margin-top:0.5rem; }
    .sw { width:1.25rem; height:1.25rem; border-radius:0.25rem; border:1px solid var(--line); }
    .err { color:#b91c1c; font-size:0.85rem; }
    .pair { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
    figure { margin:0; background:#fff; border:1px solid var(--line); border-radius:0.5rem; overflow:hidden; }
    figure img { display:block; width:100%; height:auto; }
    figcaption { padding:0.5rem 0.75rem; font-size:0.75rem; color:var(--muted); border-top:1px solid var(--line); }
    .miss { padding:2rem; color:var(--muted); text-align:center; }
    @media (max-width: 900px) { .pair { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header class="page">
    <h1>Portfolio capture compare</h1>
    <p>
      ${ok}/${report.length} sites with live + lab screenshots.
      Open this file locally to review style recognition vs the real homepage.
    </p>
  </header>
  ${cards}
</body>
</html>
`;

writeFileSync(path.join(outRoot, "index.html"), html);
console.log(`\nCompare gallery → ${path.relative(repoRoot, outRoot)}/index.html`);
console.log(`Report → ${path.relative(repoRoot, outRoot)}/report.json`);
console.log(`OK ${ok}/${report.length}`);
process.exit(ok === report.length ? 0 : 1);
