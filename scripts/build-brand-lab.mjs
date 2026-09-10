#!/usr/bin/env node
/**
 * Build a static brand-lab gallery from examples/<brand>/brand-pack.json.
 *
 * Style only (colors, logo, font). Copy is shared boilerplate.
 * Output: examples/lab/dist/
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANDING_BOILERPLATE } from "../examples/landing-boilerplate.mjs";
import { matchGoogleFont } from "../examples/font-match.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.join(repoRoot, "examples");
const outDir = path.join(examplesDir, "lab", "dist");

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveFont(pack) {
  const match = matchGoogleFont(
    pack.typography?.fontFamily || pack.typography?.requestedFontFamily,
  );
  return match;
}

function googleFontLink(family) {
  if (!family) return "";
  const q = encodeURIComponent(family);
  return `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${q}:wght@400;600;700&display=swap" rel="stylesheet" />`;
}

function loadPortfolioOrder() {
  const portfolioPath = path.join(examplesDir, "portfolio-sites.json");
  if (!existsSync(portfolioPath)) return { order: [], byId: new Map() };
  const portfolio = JSON.parse(readFileSync(portfolioPath, "utf8"));
  const order = [];
  const byId = new Map();
  for (const site of portfolio.sites || []) {
    order.push(site.id);
    byId.set(site.id, site);
  }
  return { order, byId };
}

function loadPacks() {
  const { order: portfolioOrder, byId: portfolioById } = loadPortfolioOrder();
  const portfolioRank = new Map(portfolioOrder.map((id, i) => [id, i]));
  const packs = [];
  for (const entry of readdirSync(examplesDir)) {
    if (entry.startsWith("_") || entry === "lab") continue;
    const dir = path.join(examplesDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const packPath = path.join(dir, "brand-pack.json");
    if (!existsSync(packPath)) continue;
    const pack = JSON.parse(readFileSync(packPath, "utf8"));
    const site = portfolioById.get(entry);
    packs.push({
      id: entry,
      dir,
      pack,
      slug: slugify(pack.identity?.name || entry),
      portfolio: Boolean(site),
      portfolioRole: site?.role || null,
      portfolioUrl: site?.url || null,
    });
  }
  // Portfolio first (fixture order), then experimental packs alphabetically.
  packs.sort((a, b) => {
    const ar = portfolioRank.has(a.id) ? portfolioRank.get(a.id) : 1000;
    const br = portfolioRank.has(b.id) ? portfolioRank.get(b.id) : 1000;
    if (ar !== br) return ar - br;
    return a.slug.localeCompare(b.slug);
  });
  return packs;
}

function copyAsset(packDir, rel, destAbs) {
  if (!rel) return null;
  const src = path.resolve(packDir, rel);
  if (!existsSync(src)) return null;
  mkdirSync(path.dirname(destAbs), { recursive: true });
  copyFileSync(src, destAbs);
  return path.basename(destAbs);
}

function lightboxScript() {
  return `<script>
(function () {
  const root = document.getElementById("lab-lightbox");
  if (!root) return;
  const img = root.querySelector("img");
  const caption = root.querySelector("[data-lb-caption]");
  const counter = root.querySelector("[data-lb-counter]");
  let images = [];
  let index = 0;

  function openAt(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    const item = images[index];
    img.src = item.src;
    img.alt = item.alt || "";
    caption.textContent = item.caption || item.alt || "";
    counter.textContent = images.length > 1 ? (index + 1) + " / " + images.length : "";
    root.hidden = false;
    document.body.style.overflow = "hidden";
    root.querySelector("[data-lb-close]").focus();
  }
  function close() {
    root.hidden = true;
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-lightbox-group]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-lightbox-group");
      images = [...document.querySelectorAll('[data-lightbox-group="' + group + '"]')].map((el) => ({
        src: el.getAttribute("data-lightbox-src") || el.querySelector("img")?.src,
        alt: el.getAttribute("data-lightbox-alt") || "",
        caption: el.getAttribute("data-lightbox-caption") || "",
      }));
      const start = Number(btn.getAttribute("data-lightbox-index") || 0);
      openAt(start);
    });
  });
  root.addEventListener("click", (e) => {
    if (e.target === root || e.target.closest("[data-lb-close]")) close();
  });
  root.querySelector("[data-lb-prev]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openAt(index - 1);
  });
  root.querySelector("[data-lb-next]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openAt(index + 1);
  });
  document.addEventListener("keydown", (e) => {
    if (root.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openAt(index - 1);
    if (e.key === "ArrowRight") openAt(index + 1);
  });
})();
</script>`;
}

function lightboxMarkup() {
  return `
<div id="lab-lightbox" class="lab-lightbox" hidden role="dialog" aria-modal="true" aria-label="Screenshot">
  <button type="button" class="lb-close" data-lb-close aria-label="Close">×</button>
  <button type="button" class="lb-nav lb-prev" data-lb-prev aria-label="Previous">‹</button>
  <figure>
    <img alt="" />
    <figcaption><span data-lb-caption></span> <span data-lb-counter></span></figcaption>
  </figure>
  <button type="button" class="lb-nav lb-next" data-lb-next aria-label="Next">›</button>
</div>`;
}

function capturePanel(pack, assetUrls) {
  const c = pack.colors || {};
  const font = resolveFont(pack);
  const fontLabel = font.fallback && font.requested
    ? `${esc(font.requested)} → ${esc(font.google)}`
    : esc(font.google);
  const analysis = pack.assets?.logoAnalysis || {};
  const candidates = pack.assets?.candidates || [];
  const provenance = c.provenance || {};
  const observed = c.observed || [];
  const swatch = (label, hex, note) => {
    if (!hex) {
      return `
    <div class="swatch-card missing">
      <div class="swatch missing-swatch"></div>
      <div class="swatch-meta"><span>${esc(label)}</span><code>not observed</code>${note ? `<em>${esc(note)}</em>` : ""}</div>
    </div>`;
    }
    return `
    <div class="swatch-card">
      <div class="swatch" style="background:${esc(hex)}"></div>
      <div class="swatch-meta"><span>${esc(label)}</span><code>${esc(hex)}</code>${note ? `<em>${esc(note)}</em>` : ""}</div>
    </div>`;
  };
  const fitBadge = (a) => {
    if (!a || a.fitsLightBackground == null) return "";
    const ok = a.fitsLightBackground;
    const plate = a.solidPlate ? ` plate ${a.plateHex || ""}` : "";
    return `<span class="badge ${ok ? "ok" : "warn"}">${ok ? "fits light" : "needs plate"}${esc(plate)}</span>`;
  };
  const figures = [];
  if (assetUrls.logo) {
    const needsDark =
      analysis.fitsLightBackground === false &&
      analysis.fitsDarkBackground === true;
    figures.push(`<figure class="asset ${needsDark ? "on-dark" : analysis.fitsLightBackground === false ? "on-checkered" : ""}"><img src="${esc(assetUrls.logo)}" alt="logo" /><figcaption>logo (source) ${fitBadge(analysis)}${analysis.reason ? ` · ${esc(analysis.reason)}` : ""}</figcaption></figure>`);
  }
  if (assetUrls.logoLight) {
    const la = pack.assets?.logoLightAnalysis || {};
    figures.push(`<figure class="asset"><img src="${esc(assetUrls.logoLight)}" alt="logo light" /><figcaption>logo (light adapt) ${fitBadge(la)}${la.ink ? ` · ink ${esc(la.ink)}` : ""}</figcaption></figure>`);
  }
  if (assetUrls.logoWordmarkLight || assetUrls.logoWordmark) {
    const src = assetUrls.logoWordmarkLight || assetUrls.logoWordmark;
    figures.push(`<figure class="asset"><img src="${esc(src)}" alt="wordmark" /><figcaption>wordmark layer${assetUrls.logoWordmarkLight ? " (light)" : ""}</figcaption></figure>`);
  }
  if (assetUrls.logoSymbol) {
    figures.push(`<figure class="asset"><img src="${esc(assetUrls.logoSymbol)}" alt="symbol" /><figcaption>symbol layer</figcaption></figure>`);
  }
  if (assetUrls.favicon) {
    figures.push(`<figure class="asset"><img src="${esc(assetUrls.favicon)}" alt="favicon" /><figcaption>favicon${/\.svg$/i.test(assetUrls.favicon) ? " (svg)" : ""}</figcaption></figure>`);
  }
  if (assetUrls.faviconFallback) {
    figures.push(`<figure class="asset"><img src="${esc(assetUrls.faviconFallback)}" alt="favicon fallback" /><figcaption>favicon fallback</figcaption></figure>`);
  }
  if (assetUrls.apple) {
    const appleMeta = candidates.find((x) => x.role === "apple-touch") || {};
    figures.push(`<figure class="asset"><img src="${esc(assetUrls.apple)}" alt="apple-touch" /><figcaption>apple-touch ${fitBadge(appleMeta)}</figcaption></figure>`);
  }
  for (const cand of candidates) {
    if (cand.role === "logo" || cand.role === "favicon" || cand.role === "apple-touch") continue;
    const rel = cand.file?.replace("./", "./") || "";
    const src = rel.startsWith("./assets/") ? rel : null;
    if (!src) continue;
    figures.push(`<figure class="asset"><img src="${esc(src)}" alt="${esc(cand.role)}" /><figcaption>${esc(cand.role)} ${fitBadge(cand)}</figcaption></figure>`);
  }

  const shotButtons = [];
  if (assetUrls.viewport) {
    shotButtons.push(`
      <button type="button" class="shot-thumb" data-lightbox-group="source" data-lightbox-index="0"
        data-lightbox-src="${esc(assetUrls.viewport)}" data-lightbox-alt="Viewport after consent dismiss"
        data-lightbox-caption="Source viewport (after consent dismiss)">
        <img src="${esc(assetUrls.viewport)}" alt="Viewport screenshot of source site" loading="lazy" />
        <span>Viewport · click to enlarge</span>
      </button>`);
  }
  if (assetUrls.fullpage) {
    const idx = shotButtons.length ? 1 : 0;
    shotButtons.push(`
      <button type="button" class="shot-thumb" data-lightbox-group="source" data-lightbox-index="${idx}"
        data-lightbox-src="${esc(assetUrls.fullpage)}" data-lightbox-alt="Full page after consent dismiss"
        data-lightbox-caption="Source full page (after consent dismiss)">
        <img src="${esc(assetUrls.fullpage)}" alt="Full-page screenshot of source site" loading="lazy" />
        <span>Full page · click to enlarge</span>
      </button>`);
  }
  const evidence = shotButtons.length
    ? `<h3>Source evidence</h3>
      <p class="capture-note">Crawl screenshots of the live site — compare against the generated hero and assets above.</p>
      <div class="shot-row">${shotButtons.join("")}</div>`
    : `<h3>Source evidence</h3>
      <p class="capture-note">No crawl screenshots in this pack. Re-run <code>pnpm brand:pack</code> after crawl.</p>`;

  const observedRow = observed.length
    ? `<h3>Observed samples</h3>
      <div class="swatch-row">
        ${observed
          .slice(0, 12)
          .map((o) => swatch(o.role, o.hex, o.source))
          .join("")}
      </div>`
    : "";
  const logoPalette = analysis.palette || [];
  const logoPaletteRow = logoPalette.length
    ? `<h3>Logo palette</h3>
      <div class="swatch-row">
        ${logoPalette.map((o) => swatch("from logo", o.hex, `sat ${o.saturation ?? "?"}`)).join("")}
      </div>`
    : "";
  return `
    <section class="capture" aria-label="Captured brand style">
      <h2>Brand capture</h2>
      <p class="capture-note">Only extracted signals — missing roles stay blank. No invented blues.</p>
      ${evidence}
      <h3>Assigned roles</h3>
      <div class="swatch-row">
        ${swatch("background", c.background, provenance.background)}
        ${swatch("foreground", c.foreground, provenance.foreground)}
        ${swatch("primary", c.primary, provenance.primary)}
        ${swatch("accent", c.accent, provenance.accent)}
      </div>
      ${observedRow}
      ${logoPaletteRow}
      <h3>Type</h3>
      <p class="type-line" style="font-family: var(--font)">${fontLabel}</p>
      <h3>Brand assets</h3>
      <div class="asset-grid">${figures.join("") || "<p class='capture-note'>No assets</p>"}</div>
      ${
        pack.tech
          ? `<h3>Stack signals</h3>
      <p class="capture-note">${[
        pack.tech.cmp?.vendor
          ? `CMP: ${esc(pack.tech.cmp.vendor)}${pack.tech.cmp.closed ? " (dismissed)" : ""}`
          : null,
        pack.tech.platform?.label
          ? `Platform: ${esc(pack.tech.platform.label)}`
          : pack.tech.generator
            ? `Generator: ${esc(pack.tech.generator)}`
            : null,
      ]
        .filter(Boolean)
        .join(" · ") || "No CMP/platform signal captured."}</p>`
          : ""
      }
    </section>`;
}

function landingHtml(entry, assetUrls) {
  const { pack } = entry;
  const c = pack.colors || {};
  const font = resolveFont(pack);
  const family = font.google;
  const copy = LANDING_BOILERPLATE;
  const name = pack.identity.name;
  const fontNote = font.fallback && font.requested
    ? `${esc(font.requested)} → ${esc(family)}`
    : esc(family);

  const logoAnalysis = pack.assets?.logoAnalysis || {};
  const logoLightAnalysis = pack.assets?.logoLightAnalysis || {};
  const logoLightOk =
    !!assetUrls.logoLight &&
    logoLightAnalysis.fitsLightBackground !== false;
  // Prefer wordmark-light when lockup was spatially split; else full light adapt.
  const navLogo = logoLightOk
    ? assetUrls.logoWordmarkLight || assetUrls.logoLight
    : assetUrls.logo;
  const needsDarkNav =
    !logoLightOk &&
    logoAnalysis.fitsLightBackground === false &&
    (logoAnalysis.fitsDarkBackground === true ||
      /light-ink|transparent/i.test(String(logoAnalysis.reason || "")));
  const navPlate =
    (needsDarkNav && logoAnalysis.plateHex) ||
    (needsDarkNav ? "#111111" : null);
  const navClass = needsDarkNav ? "nav nav--dark-plate" : "nav";
  const navLabelNote = logoLightOk
    ? assetUrls.logoWordmarkLight
      ? "Example navbar · light canvas (wordmark layer, remapped ink)"
      : "Example navbar · light canvas (logo adapted from light-ink source)"
    : needsDarkNav
      ? "Example navbar · dark plate (logo is light-ink / transparent)"
      : "Example navbar";

  const tech = pack.tech || {};
  const metaChips = [];
  if (tech.cmp?.vendor) {
    metaChips.push({
      k: "CMP",
      v: tech.cmp.vendor,
      note: tech.cmp.closed ? "dismissed" : tech.cmp.detected ? "detected" : "",
    });
  }
  if (tech.platform?.label) {
    metaChips.push({
      k: "Platform",
      v: tech.platform.label,
      note: (tech.platform.signals || []).slice(0, 2).join(", "),
    });
  } else if (tech.generator) {
    metaChips.push({ k: "Generator", v: tech.generator, note: "" });
  }
  for (const extra of tech.platforms || []) {
    if (tech.platform?.id && extra.id === tech.platform.id) continue;
    if (metaChips.length >= 4) break;
    if (extra.confidence >= 0.7) {
      metaChips.push({ k: "Also", v: extra.label, note: "" });
    }
  }
  const techStrip =
    metaChips.length > 0
      ? `<div class="tech-meta" aria-label="Detected stack">
      ${metaChips
        .map(
          (chip) =>
            `<span class="tech-chip"><em>${esc(chip.k)}</em> ${esc(chip.v)}${chip.note ? ` <small>${esc(chip.note)}</small>` : ""}</span>`,
        )
        .join("")}
    </div>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(name)} — Brand Lab</title>
  ${assetUrls.favicon ? `<link rel="icon"${/\.svg$/i.test(assetUrls.favicon) ? ' type="image/svg+xml"' : /\.png$/i.test(assetUrls.favicon) ? ' type="image/png"' : ""} href="${esc(assetUrls.favicon)}" />` : ""}
  ${assetUrls.faviconFallback ? `<link rel="alternate icon" href="${esc(assetUrls.faviconFallback)}" />` : ""}
  ${googleFontLink(family)}
  <style>
    :root {
      --bg: ${esc(c.background || "#ffffff")};
      --fg: ${esc(c.foreground || c.primary || "#111111")};
      --primary: ${esc(c.primary || c.foreground || "#111111")};
      --accent: ${esc(c.accent || c.primary || c.foreground || "#111111")};
      --muted: color-mix(in srgb, var(--fg) 55%, transparent);
      --line: color-mix(in srgb, var(--fg) 12%, transparent);
      --font: "${family}", ui-sans-serif, system-ui, sans-serif;
      --nav-surface: ${navPlate ? esc(navPlate) : "color-mix(in srgb, var(--fg) 2.5%, var(--bg))"};
      --nav-ink: ${needsDarkNav ? "#f5f5f5" : "var(--fg)"};
      --nav-muted: ${needsDarkNav ? "rgb(245 245 245 / 65%)" : "var(--muted)"};
      --nav-line: ${needsDarkNav ? "rgb(255 255 255 / 14%)" : "var(--line)"};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100svh;
      font-family: var(--font);
      background: var(--bg);
      color: var(--fg);
    }
    .lab-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.4rem 1.25rem;
      font-size: 0.75rem;
      background: color-mix(in srgb, var(--fg) 4%, var(--bg));
      border-bottom: 1px solid var(--line);
    }
    .lab-bar a { color: var(--muted); text-decoration: none; }
    .lab-bar a:hover { color: var(--fg); }
    .brand-masthead {
      max-width: 56rem;
      margin: 0 auto;
      padding: 2.25rem 1.5rem 0.75rem;
    }
    .brand-masthead .brand-name {
      margin: 0;
      font-size: clamp(2.25rem, 6vw, 3.75rem);
      line-height: 1.05;
      letter-spacing: -0.035em;
      font-weight: 700;
      color: var(--fg);
    }
    .tech-meta {
      display: flex; flex-wrap: wrap; gap: 0.45rem;
      max-width: 56rem;
      margin: 0 auto;
      padding: 0 1.5rem 1rem;
    }
    .tech-chip {
      display: inline-flex; align-items: baseline; gap: 0.35rem;
      padding: 0.28rem 0.55rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: color-mix(in srgb, var(--fg) 3%, var(--bg));
      font-size: 0.72rem;
      color: var(--fg);
    }
    .tech-chip em {
      font-style: normal;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.62rem;
      color: var(--muted);
    }
    .tech-chip small { color: var(--muted); font-size: 0.65rem; }
    .nav {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      height: 3.5rem;
      max-width: 56rem;
      margin: 0 auto;
      padding: 0 1.5rem;
      border: 1px solid var(--nav-line);
      border-radius: 0.5rem;
      background: var(--nav-surface);
      color: var(--nav-ink);
    }
    .nav-wrap {
      max-width: 56rem;
      margin: 0 auto;
      padding: 0 1.5rem 0.5rem;
    }
    .nav-label {
      margin: 0 0 0.45rem;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .nav-brand {
      display: inline-flex; align-items: center; gap: 0.75rem;
      color: inherit; text-decoration: none; font-weight: 600; font-size: 0.9rem;
    }
    .nav-brand img {
      height: 1.75rem; width: auto; max-width: 10rem; object-fit: contain;
      /* Avoid CSS filters on hover that wash out transparent / currentColor marks. */
      opacity: 1;
      filter: none;
    }
    .nav-brand:hover img,
    .nav-brand:focus-visible img {
      opacity: 1;
      filter: none;
    }
    .nav-links {
      display: none; gap: 1.25rem; align-items: center;
      font-size: 0.8rem; color: var(--nav-muted);
    }
    @media (min-width: 640px) {
      .nav-links { display: inline-flex; }
    }
    .nav-links span { opacity: 0.9; }
    .nav-cta {
      display: inline-flex; align-items: center;
      padding: 0.45rem 0.9rem;
      border-radius: 0.375rem;
      background: var(--primary);
      color: ${needsDarkNav ? "#ffffff" : "var(--bg)"};
      font-size: 0.75rem;
      font-weight: 600;
      text-decoration: none;
    }
    .nav--dark-plate .nav-cta {
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 12%);
    }
    main {
      position: relative;
      max-width: 56rem;
      margin: 0 auto;
      padding: 4.5rem 1.5rem 3.5rem;
      min-height: calc(100svh - 5.5rem);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    main::before {
      content: "";
      position: absolute; inset: 0; z-index: -1; pointer-events: none;
      background: radial-gradient(ellipse at top, var(--accent) 0%, transparent 50%);
      opacity: 0.1;
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1.1;
      letter-spacing: -0.03em;
      max-width: 16ch;
    }
    .sub {
      margin: 1.5rem 0 0;
      max-width: 36rem;
      font-size: 1.125rem;
      line-height: 1.6;
      color: var(--muted);
    }
    .actions {
      margin-top: 2.25rem;
      display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; align-items: center;
    }
    .btn {
      display: inline-flex; align-items: center;
      padding: 0.75rem 1.35rem;
      border-radius: 0.375rem;
      background: var(--primary);
      color: var(--bg);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
    }
    .link {
      color: color-mix(in srgb, var(--fg) 75%, transparent);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
    }
    .meta {
      margin-top: 2.5rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
    .swatches { display: flex; gap: 0.4rem; margin-top: 1rem; }
    .swatch {
      width: 1.5rem; height: 1.5rem; border-radius: 0.3rem;
      border: 1px solid var(--line);
    }
    .capture {
      margin-top: 3.5rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--line);
    }
    .capture h2 {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .capture h3 {
      margin: 1.35rem 0 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .capture-note { margin: 0.5rem 0 0; font-size: 0.85rem; color: var(--muted); max-width: 40rem; }
    .swatch-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .swatch-card {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.45rem 0.65rem;
      border: 1px solid var(--line);
      border-radius: 0.5rem;
      min-width: 9.5rem;
    }
    .swatch-card .swatch {
      width: 1.75rem; height: 1.75rem; border-radius: 0.35rem;
      border: 1px solid var(--line); flex: none;
    }
    .swatch-meta { display: flex; flex-direction: column; gap: 0.1rem; font-size: 0.72rem; }
    .swatch-meta code { font-size: 0.7rem; color: var(--muted); }
    .swatch-meta em { font-style: normal; color: var(--muted); font-size: 0.65rem; max-width: 9rem; }
    .swatch-card.missing { opacity: 0.7; border-style: dashed; }
    .missing-swatch {
      background: repeating-linear-gradient(
        -45deg,
        #f5f5f5,
        #f5f5f5 4px,
        #e5e5e5 4px,
        #e5e5e5 8px
      ) !important;
    }
    .type-line { margin: 0; font-size: 1.35rem; font-weight: 600; letter-spacing: -0.02em; }
    .asset-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .asset-grid figure.asset {
      margin: 0; padding: 0.75rem; border: 1px dashed var(--line);
      border-radius: 0.5rem; text-align: center; min-width: 8rem;
      background: color-mix(in srgb, var(--fg) 3%, var(--bg));
    }
    .asset-grid figure.on-checkered {
      background:
        linear-gradient(45deg, #eee 25%, transparent 25%),
        linear-gradient(-45deg, #eee 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #eee 75%),
        linear-gradient(-45deg, transparent 75%, #eee 75%);
      background-size: 12px 12px;
      background-position: 0 0, 0 6px, 6px -6px, -6px 0;
      background-color: #fff;
    }
    .asset-grid figure.on-dark {
      background: #111;
      border-color: #333;
    }
    .asset-grid figure.on-dark figcaption { color: #a3a3a3; }
    .asset-grid img {
      display: block; max-height: 3.5rem; max-width: 11rem;
      margin: 0 auto 0.5rem; object-fit: contain;
    }
    .asset-grid figcaption { font-size: 0.7rem; color: var(--muted); }
    .badge {
      display: inline-block; margin-left: 0.25rem; padding: 0.05rem 0.35rem;
      border-radius: 999px; font-size: 0.65rem; font-weight: 600;
    }
    .badge.ok { background: color-mix(in srgb, #16a34a 18%, transparent); color: #166534; }
    .badge.warn { background: color-mix(in srgb, #ca8a04 22%, transparent); color: #854d0e; }
    .shot-row { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); }
    .shot-thumb {
      display: block; width: 100%; padding: 0; margin: 0;
      border: 1px solid var(--line); border-radius: 0.5rem; overflow: hidden;
      background: #0a0a0a; cursor: zoom-in; text-align: left; font: inherit; color: inherit;
    }
    .shot-thumb img {
      display: block; width: 100%; height: 8.5rem; object-fit: cover; object-position: top center;
    }
    .shot-thumb span {
      display: block; padding: 0.45rem 0.6rem; font-size: 0.7rem; color: var(--muted);
      background: color-mix(in srgb, var(--fg) 4%, var(--bg));
      border-top: 1px solid var(--line);
    }
    .shot-thumb:hover { border-color: color-mix(in srgb, var(--fg) 35%, transparent); }
    .lab-lightbox[hidden] { display: none !important; }
    .lab-lightbox {
      position: fixed; inset: 0; z-index: 80;
      display: flex; align-items: center; justify-content: center;
      background: rgb(0 0 0 / 90%); padding: 1.5rem;
    }
    .lab-lightbox figure { margin: 0; max-width: min(96vw, 72rem); max-height: 90vh; text-align: center; }
    .lab-lightbox img { max-width: 100%; max-height: 82vh; object-fit: contain; border-radius: 0.35rem; }
    .lab-lightbox figcaption { margin-top: 0.75rem; color: #e5e5e5; font-size: 0.85rem; }
    .lb-close, .lb-nav {
      position: absolute; border: 0; border-radius: 999px;
      background: rgb(255 255 255 / 12%); color: #fff; cursor: pointer;
      width: 2.5rem; height: 2.5rem; font-size: 1.5rem; line-height: 1;
    }
    .lb-close { top: 1rem; right: 1rem; }
    .lb-prev { left: 1rem; }
    .lb-next { right: 1rem; }
    .lb-nav:hover, .lb-close:hover { background: rgb(255 255 255 / 22%); }
  </style>
</head>
<body>
  <div class="lab-bar">
    <a href="../index.html">← Brand Lab</a>
    <span>${fontNote} · <a href="${esc(pack.source?.url || pack.identity.siteUrl || "#")}" target="_blank" rel="noopener">source</a></span>
  </div>
  <div class="brand-masthead">
    <p class="brand-name">${esc(name)}</p>
  </div>
  ${techStrip}
  <div class="nav-wrap">
    <p class="nav-label">${esc(navLabelNote)}</p>
    <header class="${navClass}" aria-label="Example navbar">
      <a class="nav-brand" href="#">
        ${
          navLogo
            ? `<img src="${esc(navLogo)}" alt="${esc(name)} logo" />`
            : `<span>${esc(name)}</span>`
        }
      </a>
      <div class="nav-links" aria-hidden="true">
        <span>Product</span>
        <span>Pricing</span>
        <span>Docs</span>
      </div>
      <a class="nav-cta" href="${esc(copy.primaryCta.href)}">${esc(copy.primaryCta.label)}</a>
    </header>
  </div>
  <main>
    <h1>${esc(copy.headline)}</h1>
    <p class="sub">${esc(copy.subhead)}</p>
    <div class="actions">
      <a class="btn" href="${esc(copy.primaryCta.href)}">${esc(copy.primaryCta.label)}</a>
      <a class="link" href="${esc(copy.secondaryCta.href)}">${esc(copy.secondaryCta.label)} →</a>
    </div>
    ${capturePanel(pack, assetUrls)}
  </main>
  ${lightboxMarkup()}
  ${lightboxScript()}
</body>
</html>
`;
}

function cardHtml({ pack, slug, id, portfolio, portfolioRole }) {
  const c = pack.colors || {};
  const font = resolveFont(pack);
  const fontLabel = font.fallback && font.requested
    ? `${font.requested} → ${font.google}`
    : font.google;
  const badge = portfolio
    ? `<span class="badge">${esc(portfolioRole || "portfolio")}</span>`
    : `<span class="badge badge-exp">experiment</span>`;
  const techBits = [];
  if (pack.tech?.cmp?.vendor) techBits.push(pack.tech.cmp.vendor);
  if (pack.tech?.platform?.label) techBits.push(pack.tech.platform.label);
  const techLine = techBits.length
    ? `<p class="mode">${esc(techBits.join(" · "))}</p>`
    : `<p class="mode">style pack · examples/${esc(id)}</p>`;
  const thumb =
    pack.assets?.screenshots?.viewport ||
    pack.assets?.logo ||
    null;
  const thumbHtml = thumb
    ? `<div class="card-thumb"><img src="./${esc(slug)}/${esc(String(thumb).replace(/^\.\//, ""))}" alt="" loading="lazy" /></div>`
    : `<div class="card-swatches">
          <span style="background:${esc(c.background)}"></span>
          <span style="background:${esc(c.foreground)}"></span>
          <span style="background:${esc(c.primary)}"></span>
          <span style="background:${esc(c.accent || c.primary)}"></span>
        </div>`;
  return `
      <a class="card" href="./${esc(slug)}/index.html">
        ${thumbHtml}
        <h2>${esc(pack.identity.name)} ${badge}</h2>
        <p class="tag">${esc(fontLabel)}</p>
        ${techLine}
      </a>`;
}

function indexHtml(entries) {
  const portfolio = entries.filter((e) => e.portfolio);
  const experiments = entries.filter((e) => !e.portfolio);
  const section = (title, list) =>
    list.length
      ? `<section>
    <h2 class="section-title">${esc(title)}</h2>
    <div class="grid">${list.map(cardHtml).join("\n")}</div>
  </section>`
      : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Brand Lab — ContextRocket</title>
  <style>
    :root { --bg:#fafafa; --fg:#171717; --muted:#737373; --card:#fff; --line:#e5e5e5; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg); color: var(--fg);
    }
    header { max-width: 64rem; margin: 0 auto; padding: 3rem 1.5rem 1.5rem; }
    header h1 { margin: 0; font-size: 1.75rem; letter-spacing: -0.03em; }
    header p { margin: 0.75rem 0 0; color: var(--muted); max-width: 42rem; line-height: 1.55; }
    header code { font-size: 0.85em; background: #eee; padding: 0.1em 0.35em; border-radius: 0.25rem; }
    .section-title {
      max-width: 64rem; margin: 0 auto; padding: 1.5rem 1.5rem 0.5rem;
      font-size: 0.85rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted);
    }
    .grid {
      max-width: 64rem; margin: 0 auto; padding: 0.5rem 1.5rem 2rem;
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    }
    .card {
      display: block; background: var(--card); border: 1px solid var(--line);
      border-radius: 0.75rem; padding: 1.25rem; text-decoration: none; color: inherit;
    }
    .card:hover { border-color: #a3a3a3; box-shadow: 0 8px 24px rgb(0 0 0 / 6%); }
    .card-swatches { display: flex; gap: 0.35rem; margin-bottom: 1rem; }
    .card-swatches span {
      width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; border: 1px solid var(--line);
    }
    .card-thumb {
      margin: -1.25rem -1.25rem 1rem; height: 7.5rem; overflow: hidden;
      border-bottom: 1px solid var(--line); background: #111;
    }
    .card-thumb img {
      display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center;
    }
    .card h2 { margin: 0; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .badge {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
      color: #166534; background: #dcfce7; padding: 0.15rem 0.4rem; border-radius: 0.25rem;
    }
    .badge-exp { color: #57534e; background: #f5f5f4; }
    .tag { margin: 0.5rem 0 0; color: var(--muted); font-size: 0.9rem; }
    .mode { margin: 0.75rem 0 0; font-size: 0.75rem; color: var(--muted); }
    footer {
      max-width: 64rem; margin: 0 auto; padding: 0 1.5rem 3rem;
      color: var(--muted); font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Brand Lab</h1>
    <p>
      Style recognition gallery for the ContextRocket portfolio
      (<code>examples/portfolio-sites.json</code>). Hero copy is shared boilerplate —
      real content stays in ContextRocket. Sync with <code>pnpm brand:portfolio</code>.
    </p>
  </header>
  ${section(`Portfolio (${portfolio.length})`, portfolio)}
  ${section(`Experiments (${experiments.length})`, experiments)}
  ${!entries.length ? "<p>No brand packs found.</p>" : ""}
  <footer>Serve: <code>pnpm brand:lab:serve</code> → http://127.0.0.1:3199/</footer>
</body>
</html>
`;
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const packs = loadPacks();
const built = [];

for (const entry of packs) {
  const brandOut = path.join(outDir, entry.slug);
  const assetsOut = path.join(brandOut, "assets");
  mkdirSync(assetsOut, { recursive: true });

  // Copy all pack assets (logo, favicon, apple-touch, candidates)
  const packAssetsDir = path.join(entry.dir, "assets");
  if (existsSync(packAssetsDir)) {
    for (const name of readdirSync(packAssetsDir)) {
      const src = path.join(packAssetsDir, name);
      if (!statSync(src).isFile()) continue;
      copyFileSync(src, path.join(assetsOut, name));
    }
  }
  const logoName = entry.pack.assets?.logo
    ? path.basename(entry.pack.assets.logo)
    : null;
  const logoLightName = entry.pack.assets?.logoLight
    ? path.basename(entry.pack.assets.logoLight)
    : null;
  const logoWordmarkLightName = entry.pack.assets?.logoWordmarkLight
    ? path.basename(entry.pack.assets.logoWordmarkLight)
    : null;
  const logoSymbolName = entry.pack.assets?.logoSymbol
    ? path.basename(entry.pack.assets.logoSymbol)
    : null;
  const logoWordmarkName = entry.pack.assets?.logoWordmark
    ? path.basename(entry.pack.assets.logoWordmark)
    : null;
  const favName = entry.pack.assets?.favicon
    ? path.basename(entry.pack.assets.favicon)
    : null;
  const favFallbackName = entry.pack.assets?.faviconFallback
    ? path.basename(entry.pack.assets.faviconFallback)
    : null;
  const appleName = entry.pack.assets?.appleTouch ? "apple-touch.png" : null;
  const viewportName = existsSync(path.join(assetsOut, "viewport.png"))
    ? "viewport.png"
    : null;
  const fullpageName = existsSync(path.join(assetsOut, "fullpage.png"))
    ? "fullpage.png"
    : null;

  writeFileSync(
    path.join(brandOut, "index.html"),
    landingHtml(entry, {
      logo: logoName && existsSync(path.join(assetsOut, logoName))
        ? `./assets/${logoName}`
        : null,
      logoLight:
        logoLightName && existsSync(path.join(assetsOut, logoLightName))
          ? `./assets/${logoLightName}`
          : null,
      logoWordmarkLight:
        logoWordmarkLightName &&
        existsSync(path.join(assetsOut, logoWordmarkLightName))
          ? `./assets/${logoWordmarkLightName}`
          : null,
      logoWordmark:
        logoWordmarkName && existsSync(path.join(assetsOut, logoWordmarkName))
          ? `./assets/${logoWordmarkName}`
          : null,
      logoSymbol:
        logoSymbolName && existsSync(path.join(assetsOut, logoSymbolName))
          ? `./assets/${logoSymbolName}`
          : null,
      favicon: favName && existsSync(path.join(assetsOut, favName))
        ? `./assets/${favName}`
        : null,
      faviconFallback:
        favFallbackName && existsSync(path.join(assetsOut, favFallbackName))
          ? `./assets/${favFallbackName}`
          : null,
      apple: appleName && existsSync(path.join(assetsOut, appleName))
        ? `./assets/${appleName}`
        : null,
      viewport: viewportName ? `./assets/${viewportName}` : null,
      fullpage: fullpageName ? `./assets/${fullpageName}` : null,
    }),
  );
  writeFileSync(
    path.join(brandOut, "brand-pack.json"),
    JSON.stringify(entry.pack, null, 2) + "\n",
  );
  built.push(entry);
}

writeFileSync(path.join(outDir, "index.html"), indexHtml(built));
console.log(`Brand lab → ${path.relative(repoRoot, outDir)}`);
for (const e of built) console.log(`  /${e.slug}/  (${e.pack.identity.name})`);
