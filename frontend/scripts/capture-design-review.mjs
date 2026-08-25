#!/usr/bin/env node
/**
 * capture-design-review.mjs -- Take screenshots of all pages for design review.
 *
 * Usage:
 *   node scripts/capture-design-review.mjs [scenario] [options]
 *
 * Options:
 *   --screenshots <names>  Comma-separated list of screenshot names to capture
 *                          (e.g., "home-desktop-light,login-mobile-dark")
 *   --filter <pattern>     Filter screenshots by name pattern (e.g., "home*")
 *   --list                 List all available screenshot names and exit
 *   --sitemap              Use sitemap.xml to discover pages (default: false)
 *
 * Examples:
 *   node scripts/capture-design-review.mjs design-review --screenshots home-desktop-light
 *   node scripts/capture-design-review.mjs design-review --filter "home*"
 *   node scripts/capture-design-review.mjs design-review --list
 *   node scripts/capture-design-review.mjs design-review --sitemap
 *
 * Iterates through the sitemap, captures at 3 viewports x 2 themes,
 * and generates an HTML viewer.
 *
 * Requires: playwright to be installed (pnpm add -D playwright)
 */

import { chromium } from "playwright";
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

// Parse command line arguments
const args = process.argv.slice(2);
let scenario = "design-review";
let screenshotNames = null;
let filterPattern = null;
let listOnly = false;
let useSitemap = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--screenshots" && args[i + 1]) {
    screenshotNames = args[i + 1].split(",").map((s) => s.trim());
    i++;
  } else if (args[i] === "--filter" && args[i + 1]) {
    filterPattern = args[i + 1];
    i++;
  } else if (args[i] === "--list") {
    listOnly = true;
  } else if (args[i] === "--sitemap") {
    useSitemap = true;
  } else if (!args[i].startsWith("--")) {
    scenario = args[i];
  }
}

const outputDir = resolve(
  process.cwd(),
  "scratchpad",
  "design-review",
  scenario,
);

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Viewports to capture
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

// Themes to capture
const themes = ["light", "dark"];

// Public pages (should be in sitemap). Keep the reviewer-facing context next
// to the route so every generated card explains what screen it represents.
const publicPages = [
  {
    path: "/",
    name: "home",
    label: "Home",
    reviewContext:
      "Starter landing page: opening hero, reusable sections, blog teaser, and ChatFab.",
  },
  {
    path: "/blog",
    name: "blog",
    label: "Blog index",
    reviewContext:
      "Markdown-first blog listing with featured content and locale-aware post links.",
  },
  {
    path: "/faq",
    name: "faq",
    label: "FAQ",
    reviewContext: "Shared FAQ surface for common product and site questions.",
  },
  {
    path: "/privacy",
    name: "privacy",
    label: "Privacy",
    reviewContext:
      "Legal content surface; verify readable long-form content and footer navigation.",
  },
  {
    path: "/impressum",
    name: "impressum",
    label: "Impressum",
    reviewContext:
      "Legal notice surface; verify configuration-driven identity and contact details.",
  },
  {
    path: "/attribution",
    name: "attribution",
    label: "Attribution",
    reviewContext:
      "Asset and open-source attribution surface for the starter imagery and libraries.",
  },
];

// Error pages (NOT in sitemap, captured via non-existent URLs)
const errorPages = [
  {
    path: "/non-existent-page",
    name: "404",
    label: "Not found",
    reviewContext:
      "Intentional missing route; verify the error surface is clear and navigable.",
  },
];

// All pages to capture
const pages = [...publicPages, ...errorPages];

// Generate all possible screenshot names
function getAllScreenshotNames() {
  const names = [];
  for (const page of pages) {
    for (const viewport of viewports) {
      for (const theme of themes) {
        names.push(`${page.name}-${viewport.name}-${theme}`);
        names.push(`${page.name}-${viewport.name}-${theme}-full`);
      }
    }
  }
  return names;
}

// Filter screenshots by name pattern
function filterScreenshots(names, pattern) {
  if (!pattern) return names;
  const regex = new RegExp(
    "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
    "i",
  );
  return names.filter((name) => regex.test(name));
}

// List all available screenshot names
if (listOnly) {
  const allNames = getAllScreenshotNames();
  const filtered = filterPattern
    ? filterScreenshots(allNames, filterPattern)
    : allNames;
  console.log(`[design-review] Available screenshots (${filtered.length}):`);
  filtered.forEach((name) => console.log(`  ${name}`));
  process.exit(0);
}

// Determine which screenshots to capture
const allNames = getAllScreenshotNames();
const targetNames = screenshotNames
  ? screenshotNames
  : filterPattern
    ? filterScreenshots(allNames, filterPattern)
    : allNames;

const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ??
  `http://localhost:${process.env.FRONTEND_PORT ?? "3003"}`;

async function captureScreenshots() {
  console.log(`[design-review] Capturing screenshots to: ${outputDir}`);
  console.log(`[design-review] Base URL: ${BASE_URL}`);
  console.log(`[design-review] Screenshots to capture: ${targetNames.length}`);

  const browser = await chromium.launch({ headless: true });
  const screenshots = [];

  for (const viewport of viewports) {
    for (const theme of themes) {
      for (const page of pages) {
        // Check if this specific screenshot is requested
        const viewportName = `${page.name}-${viewport.name}-${theme}`;
        const fullName = `${page.name}-${viewport.name}-${theme}-full`;

        const captureViewport = targetNames.includes(viewportName);
        const captureFull = targetNames.includes(fullName);

        if (!captureViewport && !captureFull) continue;

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
        });
        const pageObj = await context.newPage();

        try {
          const url = `${BASE_URL}${page.path}`;
          console.log(
            `[design-review] Capturing: ${page.name} (${viewport.name}/${theme})`,
          );

          await pageObj.goto(url, { waitUntil: "networkidle", timeout: 30000 });
          await pageObj.waitForTimeout(1000); // Wait for animations

          // Viewport screenshot
          if (captureViewport) {
            const viewportFile = `${viewportName}.png`;
            await pageObj.screenshot({
              path: join(outputDir, viewportFile),
              fullPage: false,
            });
            screenshots.push({
              file: viewportFile,
              surface: page.name,
              surfaceLabel: page.label,
              reviewContext: page.reviewContext,
              route: page.path,
              viewport: viewport.name,
              viewportWidth: viewport.width,
              viewportHeight: viewport.height,
              theme,
              full: false,
              captureId: viewportName,
              name: `${page.label} — ${viewport.name} — ${theme}`,
            });
          }

          // Full page screenshot
          if (captureFull) {
            const fullFile = `${fullName}.png`;
            await pageObj.screenshot({
              path: join(outputDir, fullFile),
              fullPage: true,
            });
            screenshots.push({
              file: fullFile,
              surface: page.name,
              surfaceLabel: page.label,
              reviewContext: page.reviewContext,
              route: page.path,
              viewport: viewport.name,
              viewportWidth: viewport.width,
              viewportHeight: viewport.height,
              theme,
              full: true,
              captureId: fullName,
              name: `${page.label} — ${viewport.name} — ${theme} — full page`,
            });
          }
        } catch (error) {
          console.error(
            `[design-review] Error capturing ${page.name} (${viewport.name}/${theme}):`,
            error.message,
          );
        } finally {
          await context.close();
        }
      }
    }
  }

  await browser.close();
  return screenshots;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function generateViewer(screenshots) {
  const surfaces = [...new Set(screenshots.map((s) => s.surface))];
  const viewportsList = ["desktop", "tablet", "mobile"];
  const themesList = ["light", "dark"];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Review — ${scenario}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    background: #0d1117; color: #c9d1d9;
    padding: 1rem;
  }
  header {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 0; border-bottom: 1px solid #30363d; margin-bottom: 1rem;
  }
  header h1 { font-size: 1.2rem; color: #ff2b67; }
  header .scenario { color: #58a6ff; font-size: 0.9rem; }
  header .count { color: #8b949e; font-size: 0.8rem; margin-left: auto; }
  .controls {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    margin-bottom: 1rem; padding: 0.75rem;
    background: #161b22; border: 1px solid #30363d; border-radius: 6px;
  }
  .controls label { font-size: 0.75rem; color: #8b949e; margin-right: 0.25rem; }
  .controls button {
    background: #21262d; color: #c9d1d9; border: 1px solid #30363d;
    padding: 0.3rem 0.6rem; font-size: 0.75rem; cursor: pointer;
    font-family: inherit; border-radius: 3px;
    transition: background 0.15s, border-color 0.15s;
  }
  .controls button:hover { background: #30363d; }
  .controls button.active { background: #ff2b67; color: #fff; border-color: #ff2b67; }
  .controls .sep { width: 1px; background: #30363d; margin: 0 0.25rem; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1rem;
  }
  .card {
    background: #161b22; border: 1px solid #30363d; border-radius: 6px;
    overflow: hidden;
  }
  .card-header {
    padding: 0.5rem 0.75rem; font-size: 0.75rem;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #30363d;
  }
  .card-header .surface { color: #58a6ff; }
  .card-header .meta { color: #8b949e; }
  .card-context {
    display: grid; gap: 0.3rem; padding: 0.65rem 0.75rem;
    border-bottom: 1px solid #30363d; font-size: 0.7rem;
  }
  .card-context .name { color: #e6edf3; font-weight: bold; }
  .card-context .detail { color: #8b949e; word-break: break-word; }
  .card-context .context { color: #c9d1d9; line-height: 1.4; }
  .capture-id { color: #ff2b67; text-decoration: none; white-space: nowrap; }
  .card img {
    width: 100%; height: auto; display: block;
    cursor: pointer; transition: transform 0.2s;
  }
  .card img:hover { transform: scale(1.02); }
  .hidden { display: none !important; }
  .lightbox {
    display: none; position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.9); justify-content: center; align-items: center;
    cursor: zoom-out;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: 95vw; max-height: 95vh; object-fit: contain; }
  .kbd-hint {
    position: fixed; bottom: 1rem; right: 1rem;
    font-size: 0.7rem; color: #8b949e;
    background: #161b22; padding: 0.5rem 0.75rem;
    border: 1px solid #30363d; border-radius: 6px;
  }
  .kbd-hint kbd {
    background: #21262d; border: 1px solid #30363d; padding: 0.1rem 0.3rem;
    border-radius: 3px; font-family: inherit;
  }
</style>
</head>
<body>
<header>
  <h1>Design Review</h1>
  <span class="scenario">${escapeHtml(scenario)}</span>
  <span class="count">${screenshots.length} screenshots</span>
</header>

<div class="controls" id="controls">
  <label>Viewport:</label>
  <button data-filter="viewport" data-value="all" class="active">All</button>
  ${viewportsList.map((v) => `<button data-filter="viewport" data-value="${v}">${v}</button>`).join("\n  ")}
  <div class="sep"></div>
  <label>Theme:</label>
  <button data-filter="theme" data-value="all" class="active">All</button>
  ${themesList.map((t) => `<button data-filter="theme" data-value="${t}">${t}</button>`).join("\n  ")}
  <div class="sep"></div>
  <label>Surface:</label>
  <button data-filter="surface" data-value="all" class="active">All</button>
  ${surfaces.map((s) => `<button data-filter="surface" data-value="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("\n  ")}
  <div class="sep"></div>
  <label>Type:</label>
  <button data-filter="type" data-value="all" class="active">All</button>
  <button data-filter="type" data-value="viewport">Viewport</button>
  <button data-filter="type" data-value="full">Full page</button>
</div>

<div class="grid" id="grid">
${screenshots
  .map(
    (
      s,
    ) => `  <article id="capture-${escapeHtml(s.captureId ?? s.file.replace(/\.png$/i, ""))}" class="card" data-surface="${escapeHtml(s.surface)}" data-viewport="${escapeHtml(s.viewport)}" data-theme="${escapeHtml(s.theme)}" data-type="${s.full ? "full" : "viewport"}">
    <div class="card-header">
      <span class="surface">${escapeHtml(s.surfaceLabel ?? s.surface)}</span>
      <span class="meta">${escapeHtml(s.viewport)} (${s.viewportWidth}×${s.viewportHeight}) / ${escapeHtml(s.theme)}${s.full ? " / full" : ""}</span>
    </div>
    <div class="card-context">
      <span class="name">${escapeHtml(s.name ?? s.captureId ?? s.file)}</span>
      <span class="detail">${escapeHtml(s.route ?? "Route not recorded")}</span>
      <span class="context">${escapeHtml(s.reviewContext ?? "No additional surface context recorded.")}</span>
      <a class="capture-id" href="#capture-${escapeHtml(s.captureId ?? s.file.replace(/\.png$/i, ""))}">#${escapeHtml(s.captureId ?? s.file.replace(/\.png$/i, ""))}</a>
    </div>
    <img src="${escapeHtml(s.file)}" alt="${escapeHtml(s.name ?? `${s.surface} ${s.viewport} ${s.theme}`)}" loading="lazy" onclick="openLightbox(this.src)">
  </article>`,
  )
  .join("\n")}
</div>

<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <img id="lightbox-img" src="" alt="Full size">
</div>

<div class="kbd-hint">
  <kbd>Esc</kbd> close &middot;
  <kbd>&larr;</kbd><kbd>&rarr;</kbd> navigate &middot;
  <kbd>f</kbd> toggle full
</div>

<script>
  // Filtering
  const state = { viewport: "all", theme: "all", surface: "all", type: "all" };
  const controls = document.getElementById("controls");
  const grid = document.getElementById("grid");

  function applyFilters() {
    grid.querySelectorAll(".card").forEach((card) => {
      const show =
        (state.viewport === "all" || card.dataset.viewport === state.viewport) &&
        (state.theme === "all" || card.dataset.theme === state.theme) &&
        (state.surface === "all" || card.dataset.surface === state.surface) &&
        (state.type === "all" || card.dataset.type === state.type);
      card.classList.toggle("hidden", !show);
    });
  }

  controls.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    state[filter] = value;
    controls.querySelectorAll(\`[data-filter="\${filter}"]\`).forEach((b) => {
      b.classList.toggle("active", b.dataset.value === value);
    });
    applyFilters();
  });

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let lightboxImages = [];

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightboxImages = [...grid.querySelectorAll(".card:not(.hidden) img")].map(
      (img) => img.src,
    );
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const idx = lightboxImages.indexOf(lightboxImg.src);
      const next =
        e.key === "ArrowRight"
          ? (idx + 1) % lightboxImages.length
          : (idx - 1 + lightboxImages.length) % lightboxImages.length;
      lightboxImg.src = lightboxImages[next];
    }
  });
</script>
</body>
</html>`;

  const htmlPath = join(outputDir, "index.html");
  writeFileSync(htmlPath, html);
  const manifestPath = join(outputDir, "manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        version: 1,
        scenario,
        baseUrl: BASE_URL,
        captures: screenshots,
      },
      null,
      2,
    ),
  );
  console.log(`[design-review] Generated: ${htmlPath}`);
  console.log(`[design-review] Manifest: ${manifestPath}`);
  console.log(`[design-review] ${screenshots.length} screenshots indexed`);

  // Try to open in browser
  try {
    const cmd =
      process.platform === "darwin"
        ? `open "${htmlPath}"`
        : process.platform === "linux"
          ? `xdg-open "${htmlPath}"`
          : null;
    if (cmd) execSync(cmd, { stdio: "ignore" });
  } catch {
    // ignore — user can open manually
  }
}

// Main
async function main() {
  try {
    const screenshots = await captureScreenshots();
    generateViewer(screenshots);
    console.log("[design-review] Done!");
  } catch (error) {
    console.error("[design-review] Error:", error);
    process.exit(1);
  }
}

main();
