#!/usr/bin/env node
/**
 * Rank a crawl into a style-only brand-pack.json for light nav+hero.
 *
 * Observe stays in crawl.json; this step assigns roles and keeps evidence.
 * Principles: examples/CAPTURE.md
 *
 *   node scripts/pack-from-crawl.mjs scratchpad/brand-crawls/<host> --id mybrand
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { deriveColors } from "../examples/derive-colors.mjs";
import {
  matchGoogleFont,
  primaryFamilyFromStack,
} from "../examples/font-match.mjs";
import { inspectSvg, inspectSvgWithLlm } from "./lib/inspect-svg.mjs";
import {
  classifyMarkNoise,
  exactBrandLabelBonus,
  isHardRejectMark,
  markNoisePackPenalty,
} from "./lib/mark-noise.mjs";
import {
  applyMarkDisambiguation,
  disambiguateMarkCandidates,
  loadGeminiEnv,
  markChoiceLooksAmbiguous,
} from "./lib/disambiguate-marks.mjs";
import { inferPlatformFromCrawl } from "./lib/detect-platform.mjs";

const useSvgLlm = process.argv.includes("--svg-llm");
const useMarkLlm =
  process.argv.includes("--mark-llm") || useSvgLlm;
const forceMarkLlm = process.argv.includes("--mark-llm");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const crawlDir = path.resolve(process.argv[2] || "");
const idFlag = process.argv.indexOf("--id");
const nameFlag = process.argv.indexOf("--name");
const packId =
  idFlag >= 0
    ? process.argv[idFlag + 1]
    : path.basename(crawlDir).replace(/-io$|-com$|-de$|-app$/, "");
const nameOverride = nameFlag >= 0 ? process.argv[nameFlag + 1] : null;

if (!crawlDir || !existsSync(path.join(crawlDir, "crawl.json"))) {
  console.error(
    "Usage: node scripts/pack-from-crawl.mjs <crawl-dir> [--id name] [--name Display Name]",
  );
  process.exit(1);
}

const crawl = JSON.parse(
  readFileSync(path.join(crawlDir, "crawl.json"), "utf8"),
);
const colors = deriveColors(crawl);

const headingStack =
  crawl.fonts?.heading || crawl.computed?.h1?.fontFamily || "";
const bodyStack =
  crawl.fonts?.body || crawl.computed?.body?.fontFamily || headingStack;
const headingFamily = primaryFamilyFromStack(headingStack);
const preferHeading =
  headingFamily &&
  !["Arial", "Helvetica", "sans-serif", "system-ui"].includes(headingFamily);
const chosenFont = matchGoogleFont(preferHeading ? headingStack : bodyStack);

function pickDisplayName(crawlDoc, id) {
  const og = crawlDoc.meta?.ogSiteName?.trim();
  if (og && og.length <= 48) return og;
  const fromTitle =
    crawlDoc.title?.split("|")[0]?.split("–")[0]?.split("-")[0]?.trim() || "";
  // Prefer short titles for nav; long SEO titles fall back to id.
  if (fromTitle && fromTitle.length <= 36) return fromTitle;
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const name = nameOverride?.trim() || pickDisplayName(crawl, packId);

const examplesDir = path.join(repoRoot, "examples", packId);
const assetsOut = path.join(examplesDir, "assets");
mkdirSync(assetsOut, { recursive: true });
// Fresh asset dir so stale candidate-*.svg from prior packs do not linger.
for (const name of readdirSync(assetsOut)) {
  try {
    unlinkSync(path.join(assetsOut, name));
  } catch {
    /* ignore */
  }
}

function analyzeLogo(absPath) {
  if (path.extname(absPath).toLowerCase() === ".svg") {
    // Prefer structured SVG inspection over Pillow's coarse svg-wordmark guess.
    const det = inspectSvg(absPath);
    return {
      path: absPath,
      format: "svg",
      fitsLightBackground: !!det.fitsLightBackground,
      fitsDarkBackground: !!det.fitsDarkBackground,
      solidPlate: false,
      plateHex: null,
      reason: det.roleGuess || "svg",
      uiIcon: det.roleGuess === "ui-icon" || !!det.tiny,
      palette: (det.chromaticPalette || []).map((c) => ({
        hex: c.hex,
        share: null,
        luminance: c.luminance,
        saturation: c.saturation,
      })),
      svg: det,
    };
  }
  const res = spawnSync(
    "python3",
    [path.join(__dirname, "analyze-logo.py"), absPath],
    { encoding: "utf8" },
  );
  if (res.status !== 0) {
    return {
      path: absPath,
      fitsLightBackground: true,
      fitsDarkBackground: false,
      solidPlate: false,
      reason: `analyze-failed:${res.stderr || res.status}`,
    };
  }
  try {
    return JSON.parse(res.stdout);
  } catch {
    return {
      path: absPath,
      fitsLightBackground: true,
      reason: "analyze-parse-failed",
    };
  }
}

async function enrichSvgWithLlm(candidates) {
  if (!useSvgLlm) return candidates;
  loadGeminiEnv(repoRoot);
  const out = [];
  for (const c of candidates) {
    if (path.extname(c.src).toLowerCase() !== ".svg" || !c.analysis?.svg) {
      out.push(c);
      continue;
    }
    const markup = readFileSync(c.src, "utf8");
    const enriched = await inspectSvgWithLlm(markup, c.analysis.svg);
    out.push({
      ...c,
      analysis: {
        ...c.analysis,
        fitsLightBackground: !!enriched.fitsLightBackground,
        fitsDarkBackground: !!enriched.fitsDarkBackground,
        reason: enriched.roleGuess || c.analysis.reason,
        uiIcon: enriched.roleGuess === "ui-icon" || !!enriched.tiny,
        palette: (enriched.chromaticPalette || []).map((x) => ({
          hex: x.hex,
          share: null,
          luminance: x.luminance,
          saturation: x.saturation,
        })),
        svg: enriched,
      },
    });
  }
  return out;
}

function collectCandidates() {
  const out = [];
  for (const svg of crawl.svgLogoCandidates || []) {
    if (!svg?.local || !existsSync(path.join(crawlDir, svg.local))) continue;
    out.push({
      role: "svg-wordmark",
      src: path.join(crawlDir, svg.local),
      suggestedName: path.basename(svg.local),
      width: svg.width || 0,
      height: svg.height || 0,
      crawlScore: svg.score || 0,
      zone: svg.zone || "header",
      alt: svg.aria || "",
      brandHit: !!svg.brandHit,
      homeLink: !!svg.homeLink,
      noiseKind: svg.noiseKind || "ok",
    });
  }
  for (const c of crawl.logoCandidates || []) {
    if (!c.local || !existsSync(path.join(crawlDir, c.local))) continue;
    const ext = path.extname(c.local) || ".png";
    const noise =
      c.noiseKind && c.noiseKind !== "ok"
        ? { kind: c.noiseKind, reason: c.noiseKind }
        : classifyMarkNoise({
            alt: c.alt || "",
            src: c.src || c.local,
            zone: c.zone || "page",
          });
    if (isHardRejectMark(noise)) continue;
    out.push({
      role: c.why || "img-logo",
      src: path.join(crawlDir, c.local),
      suggestedName: `logo${ext}`,
      width: c.width || 0,
      height: c.height || 0,
      crawlScore: c.score || 0,
      zone: c.zone || "page",
      alt: c.alt || "",
      brandHit: !!c.brandHit,
      noiseKind: noise.kind,
    });
  }
  if (existsSync(path.join(crawlDir, "assets/apple-touch.png"))) {
    out.push({
      role: "apple-touch",
      src: path.join(crawlDir, "assets/apple-touch.png"),
      suggestedName: "apple-touch.png",
      width: 180,
      height: 180,
      crawlScore: 5,
      zone: "meta",
    });
  }
  for (const name of [
    "favicon.svg",
    "favicon.png",
    "favicon.webp",
    "favicon.ico",
  ]) {
    const src = path.join(crawlDir, "assets", name);
    if (!existsSync(src)) continue;
    out.push({
      role: "favicon",
      src,
      suggestedName: name,
      width: 32,
      height: 32,
      crawlScore: name.endsWith(".svg") ? 8 : name.endsWith(".png") ? 5 : 2,
      zone: "meta",
    });
    break;
  }
  if (existsSync(path.join(crawlDir, "assets/og-image.jpg"))) {
    out.push({
      role: "og-image",
      src: path.join(crawlDir, "assets/og-image.jpg"),
      suggestedName: "og-image.jpg",
      width: 1200,
      height: 630,
      crawlScore: 0,
      zone: "meta",
    });
  }
  return out;
}

let candidates = collectCandidates()
  .map((c) => {
    const analysis = analyzeLogo(c.src);
    return { ...c, analysis };
  })
  .filter((c) => !c.analysis.uiIcon);

candidates = await enrichSvgWithLlm(candidates);
candidates = candidates.filter((c) => !c.analysis.uiIcon);

/**
 * General ranking for light nav mark — crawl score + light-fit analysis.
 * Prefer marks that actually work on a light canvas; keep dark-only wordmarks
 * as alternates (common: white text on transparent).
 */
function scoreCandidate(c) {
  let crawlScore = Number(c.crawlScore) || 0;
  // Older crawls inflated footer/decorative SVG geometry — cap before weighting.
  if (c.zone === "footer" && !c.homeLink) {
    crawlScore = Math.min(crawlScore, 3500);
  }
  if (
    c.role === "svg-wordmark" &&
    !c.brandHit &&
    !c.homeLink &&
    !/\b(logo|wordmark|brand)\b/i.test(c.alt || "")
  ) {
    crawlScore = Math.min(crawlScore, 4000);
  }
  let s = crawlScore;
  if (c.homeLink) s += 50;
  if (c.analysis.fitsLightBackground) s += 80;
  else if (c.analysis.fitsDarkBackground) s += 15; // still brand-true, weaker for light lab
  if (!c.analysis.solidPlate) s += 35;
  if (c.role === "svg-wordmark") s += 25;
  if (c.role === "header-logo") s += 20;
  if (c.role === "footer-img") s -= 40;
  if (c.brandHit) s += 15;
  if (c.zone === "header") s += 15;
  if (c.zone === "footer") s -= 25;
  s += exactBrandLabelBonus(c.alt, name);
  const noise =
    c.noiseKind && c.noiseKind !== "ok"
      ? { kind: c.noiseKind }
      : classifyMarkNoise({
          alt: c.alt || "",
          src: c.src || "",
          zone: c.zone || "",
        });
  s += markNoisePackPenalty(noise);
  s += c.llmPenalty || 0;
  if (c.analysis.reason === "svg-ui-icon" || c.analysis.uiIcon) s -= 200;
  // Mega-menu feature cards: tall-ish, not wordmark aspect, unlabeled.
  if (
    !c.brandHit &&
    !/\b(logo|wordmark|brand|logotipo)\b/i.test(c.alt || "") &&
    (c.zone === "header" || c.role === "header-logo") &&
    Number(c.height) > 140 &&
    Number(c.width) > 0 &&
    Number(c.width) / Math.max(Number(c.height), 1) < 1.85
  ) {
    s -= 180;
  }
  // Explicit wordmark class / path is a strong positive (Notion wordmark-module, …).
  if (/\bwordmark\b/i.test(`${c.alt || ""} ${c.suggestedName || ""} ${c.src || ""}`)) {
    s += 40;
  }
  if (c.role === "apple-touch") s -= 20;
  if (c.role === "favicon") s -= 40;
  if (c.role === "og-image") s -= 100;
  if (/mask|sign-in|cutout/i.test(`${c.alt || ""} ${c.suggestedName || ""}`))
    s -= 250;
  if (
    c.role === "svg-wordmark" &&
    c.alt &&
    !/logo|logotipo|wordmark|brand/i.test(c.alt) &&
    !c.brandHit &&
    !c.homeLink
  ) {
    s -= 120;
  }
  return s;
}

candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a));

let markLlmMeta = { used: false, reason: "skipped" };
{
  loadGeminiEnv(repoRoot);
  const navForLlm = candidates.filter((c) => c.role !== "og-image");
  const shouldAsk =
    useMarkLlm &&
    (forceMarkLlm ||
      markChoiceLooksAmbiguous(navForLlm, scoreCandidate) ||
      process.env.BRAND_MARK_LLM === "1");
  if (shouldAsk && process.env.GEMINI_API_KEY) {
    const withScores = navForLlm.map((c) => ({
      ...c,
      packScore: scoreCandidate(c),
    }));
    markLlmMeta = await disambiguateMarkCandidates({
      siteName: name,
      host: (() => {
        try {
          return new URL(crawl.finalUrl || crawl.requestedUrl || "").hostname;
        } catch {
          return packId;
        }
      })(),
      candidates: withScores,
    });
    if (markLlmMeta.used) {
      const applied = applyMarkDisambiguation(
        navForLlm,
        markLlmMeta,
        scoreCandidate,
      );
      const og = candidates.filter((c) => c.role === "og-image");
      candidates = [...applied.candidates, ...og];
      markLlmMeta = applied.llm;
      console.log(
        `  mark-llm: primaryIndex=${markLlmMeta.primaryIndex} model=${markLlmMeta.model || "-"}`,
      );
      for (const cls of (markLlmMeta.classifications || []).slice(0, 5)) {
        console.log(
          `    [${cls.index}] ${cls.kind} (${cls.confidence ?? "-"}) ${cls.notes || ""}`,
        );
      }
    } else {
      console.log(`  mark-llm: skipped (${markLlmMeta.reason || "unknown"})`);
    }
  } else if (useMarkLlm && !process.env.GEMINI_API_KEY) {
    console.log("  mark-llm: skipped (no GEMINI_API_KEY)");
  }
}

candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
const navPool = candidates.filter((c) => c.role !== "og-image");
const best = navPool[0] || null;
const chosen =
  best ||
  candidates.find((c) => c.role === "favicon" || c.role === "apple-touch") ||
  null;

const textOnly = !chosen;
if (textOnly) {
  console.warn(
    "Sparse / coming-soon surface: no logo asset — packing text-only identity",
  );
} else if (!best || chosen.role === "favicon" || chosen.role === "apple-touch") {
  console.warn(
    `Sparse mark surface; using ${chosen.role} as primary logo`,
  );
}

// Tight portfolio: primary + meta icons + top alternate nav marks + og image
const portfolio = [];
const seen = new Set();
function take(c) {
  if (!c || seen.has(c.src)) return;
  seen.add(c.src);
  portfolio.push(c);
}
take(chosen);
for (const c of navPool) {
  if (portfolio.length >= 5) break;
  if (c.role === "favicon" || c.role === "apple-touch") take(c);
  // Alternates must be strong nav marks that still fit a light canvas.
  if (
    (c.role === "svg-wordmark" ||
      c.role === "header-logo" ||
      c.role === "logo-keyword") &&
    scoreCandidate(c) >= 180 &&
    c.analysis.fitsLightBackground &&
    !/\.jpe?g$/i.test(c.src) &&
    (!c.noiseKind || c.noiseKind === "ok") &&
    (!c.llmKind ||
      c.llmKind === "primaryNavMark" ||
      c.llmKind === "other")
  ) {
    take(c);
  }
}
for (const c of candidates) {
  if (c.role === "favicon" || c.role === "apple-touch") take(c);
}
const og = candidates.find((c) => c.role === "og-image");
if (og) take(og);

const analyzedAssets = [];
for (const c of portfolio) {
  let nameOnDisk;
  if (c.role === "favicon") nameOnDisk = path.basename(c.src);
  else if (c.role === "apple-touch") nameOnDisk = "apple-touch.png";
  else if (c.role === "og-image") nameOnDisk = "og-image.jpg";
  else if (c === chosen) {
    const ext = path.extname(c.src).toLowerCase();
    if (ext === ".svg" || c.suggestedName?.endsWith(".svg")) nameOnDisk = "logo.svg";
    else if (ext === ".webp") nameOnDisk = "logo.webp";
    else if (ext === ".jpg" || ext === ".jpeg") nameOnDisk = "logo.jpg";
    else nameOnDisk = "logo.png";
  } else {
    nameOnDisk = `candidate-${c.role}${path.extname(c.src) || ".png"}`;
  }
  copyFileSync(c.src, path.join(assetsOut, nameOnDisk));
  analyzedAssets.push({
    file: `./assets/${nameOnDisk}`,
    role: c === chosen ? "logo" : c.role,
    crawlScore: c.crawlScore,
    packScore: scoreCandidate(c),
    zone: c.zone,
    alt: c.alt || undefined,
    noiseKind: c.noiseKind && c.noiseKind !== "ok" ? c.noiseKind : undefined,
    llmKind: c.llmKind || undefined,
    fitsLightBackground: !!c.analysis.fitsLightBackground,
    fitsDarkBackground: !!c.analysis.fitsDarkBackground,
    solidPlate: !!c.analysis.solidPlate,
    plateHex: c.analysis.plateHex || null,
    reason: c.analysis.reason || null,
    palette: c.analysis.palette || [],
    svg: c.analysis.svg
      ? {
          roleGuess: c.analysis.svg.roleGuess,
          roleConfidence: c.analysis.svg.roleConfidence,
          summary: c.analysis.svg.summary,
          texts: c.analysis.svg.texts,
          hasGradient: c.analysis.svg.hasGradient,
          chromaticPalette: c.analysis.svg.chromaticPalette,
          llm: c.analysis.svg.llm || undefined,
        }
      : undefined,
  });
}

for (const shot of ["viewport.png", "fullpage.png"]) {
  const src = path.join(crawlDir, shot);
  if (existsSync(src)) {
    copyFileSync(src, path.join(assetsOut, shot));
  }
}

// Raster/ICO fallback when primary favicon is SVG (or other non-ico).
for (const name of ["favicon-fallback.ico", "favicon-fallback.png"]) {
  const src = path.join(crawlDir, "assets", name);
  if (existsSync(src)) {
    copyFileSync(src, path.join(assetsOut, name));
  }
}

if (textOnly) {
  analyzedAssets.push({
    file: null,
    role: "logo",
    crawlScore: 0,
    packScore: 0,
    zone: "meta",
    fitsLightBackground: true,
    fitsDarkBackground: true,
    solidPlate: false,
    plateHex: null,
    reason: "text-only",
    palette: [],
  });
}

const logoFile = analyzedAssets.find((a) => a.role === "logo")?.file;
const logoAnalysis = analyzedAssets.find((a) => a.role === "logo");

function adaptLogoForLightCanvas(logoRel, inkHex) {
  if (!logoRel) return null;
  const src = path.join(examplesDir, logoRel.replace(/^\.\//, ""));
  if (!existsSync(src)) return null;
  const ext = path.extname(src).toLowerCase();
  const outName = ext === ".svg" ? "logo-light.svg" : "logo-light.png";
  const dest = path.join(assetsOut, outName);

  // Raster lockups: try spatial symbol/wordmark split + light adapt in one pass.
  let layers = null;
  if (ext !== ".svg") {
    const layerDir = path.join(assetsOut, "_layers");
    mkdirSync(layerDir, { recursive: true });
    const dec = spawnSync(
      "python3",
      [
        path.join(__dirname, "decompose-logo.py"),
        "decompose",
        src,
        "--out-dir",
        layerDir,
        "--ink",
        inkHex,
      ],
      { encoding: "utf8" },
    );
    try {
      layers = JSON.parse(dec.stdout || "{}");
    } catch {
      layers = null;
    }
    if (layers?.fullLight && existsSync(layers.fullLight)) {
      copyFileSync(layers.fullLight, dest);
    }
    // Promote separated layers next to other pack assets.
    for (const [key, name] of [
      ["symbol", "logo-symbol.png"],
      ["wordmark", "logo-wordmark.png"],
      ["wordmarkLight", "logo-wordmark-light.png"],
    ]) {
      if (layers?.[key] && existsSync(layers[key])) {
        copyFileSync(layers[key], path.join(assetsOut, name));
      }
    }
    // Don't ship the scratch layer dir inside the pack.
    try {
      rmSync(layerDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }

  if (!existsSync(dest)) {
    const res = spawnSync(
      "python3",
      [
        path.join(__dirname, "adapt-logo-for-light.py"),
        src,
        dest,
        "--ink",
        inkHex,
        "--json",
      ],
      { encoding: "utf8" },
    );
    if (res.status !== 0 || !existsSync(dest)) {
      console.warn(
        `  logo-light adapt failed: ${(res.stderr || res.stdout || "").slice(0, 200)}`,
      );
      return null;
    }
    try {
      layers = { ...(layers || {}), adapt: JSON.parse(res.stdout || "{}") };
    } catch {
      /* ignore */
    }
  }

  const analysis = analyzeLogo(dest);
  const wordmarkLight = existsSync(path.join(assetsOut, "logo-wordmark-light.png"))
    ? "./assets/logo-wordmark-light.png"
    : null;
  const symbol = existsSync(path.join(assetsOut, "logo-symbol.png"))
    ? "./assets/logo-symbol.png"
    : null;
  return {
    file: `./assets/${outName}`,
    adapt: layers?.adaptStats || layers?.adapt || layers,
    analysis,
    layers: layers?.separated
      ? {
          separated: true,
          axis: layers.axis,
          overlap: layers.overlap,
          symbol,
          wordmark: existsSync(path.join(assetsOut, "logo-wordmark.png"))
            ? "./assets/logo-wordmark.png"
            : null,
          wordmarkLight,
        }
      : null,
    // Prefer wordmark-light for nav/PDF when the lockup split cleanly.
    navFile: wordmarkLight || `./assets/${outName}`,
  };
}

const shouldAdaptLogo =
  !!logoFile &&
  logoAnalysis &&
  logoAnalysis.fitsLightBackground === false &&
  !logoAnalysis.solidPlate &&
  (logoAnalysis.fitsDarkBackground === true ||
    /light-ink|svg-light|transparent/i.test(
      String(logoAnalysis.reason || ""),
    ));

const inkForLogo =
  colors.foreground && /^#([0-9a-f]{6})$/i.test(colors.foreground)
    ? colors.foreground
    : "#111111";

const logoLight = shouldAdaptLogo
  ? adaptLogoForLightCanvas(logoFile, inkForLogo)
  : null;

if (logoLight?.file) {
  console.log(
    `  logo-light: ${logoLight.file} lightFit=${logoLight.analysis?.fitsLightBackground} (ink ${inkForLogo})`,
  );
  if (logoLight.layers?.separated) {
    console.log(
      `  logo-layers: axis=${logoLight.layers.axis} overlap=${logoLight.layers.overlap} symbol=${logoLight.layers.symbol || "-"} wordmark=${logoLight.layers.wordmarkLight || logoLight.layers.wordmark || "-"}`,
    );
  }
}

// Fold chromatic hues from the primary mark into observed palette evidence.
const logoPalette = (logoAnalysis?.palette || chosen?.analysis?.palette || []).slice(
  0,
  5,
);
for (const swatch of logoPalette) {
  colors.observed.push({
    role: "logo-palette",
    hex: swatch.hex,
    source: `logo (${logoAnalysis?.reason || "mark"})`,
  });
}
// If accent still mirrors ink-only primary and logo has a strong chromatic hue,
// promote the most saturated logo color as accent (still evidence-backed).
if (
  logoPalette.length &&
  colors.accent &&
  colors.primary &&
  colors.accent === colors.primary &&
  /ink|body\.color/i.test(String(colors.provenance?.primary || ""))
) {
  const best = [...logoPalette].sort(
    (a, b) => (b.saturation || 0) - (a.saturation || 0),
  )[0];
  if (best && (best.saturation || 0) >= 0.25) {
    colors.accent = best.hex;
    colors.provenance.accent = `logo.palette (${best.hex})`;
    colors.notes.push(`logo chromatic hue → accent (${best.hex})`);
  }
}
// Or when primary is CTA but accent equals primary, keep CTA; still expose logo hues.

const pack = {
  version: 1,
  source: {
    url: crawl.finalUrl || crawl.requestedUrl,
    capturedAt: new Date().toISOString().slice(0, 10),
    method: "crawl",
    notes: [
      `Colors: ${colors.notes.join("; ")}`,
      `Font: ${chosenFont.requested || "?"} → Google ${chosenFont.google}${chosenFont.fallback ? " (nearest)" : ""}`,
      `Logo: ${logoAnalysis?.reason || "?"} lightFit=${logoAnalysis?.fitsLightBackground}${chosen?.alt ? ` alt="${chosen.alt}"` : ""}`,
      markLlmMeta.used
        ? `Mark LLM: primaryIndex=${markLlmMeta.primaryIndex}`
        : null,
    ]
      .filter(Boolean)
      .join(". "),
    markDisambiguation: markLlmMeta.used
      ? {
          used: true,
          model: markLlmMeta.model || null,
          primaryIndex: markLlmMeta.primaryIndex,
          classifications: markLlmMeta.classifications || [],
        }
      : { used: false, reason: markLlmMeta.reason || "skipped" },
  },
  identity: {
    name,
    siteUrl: crawl.finalUrl || crawl.requestedUrl,
  },
  tech: (() => {
    const platform = inferPlatformFromCrawl(crawl);
    const consent = crawl.consent || {};
    return {
      cmp: consent.framework
        ? {
            vendor: consent.framework,
            detected: !!consent.detected,
            closed: !!consent.closed,
            action: consent.action || null,
            strategy: consent.strategy || null,
          }
        : consent.detected
          ? {
              vendor: "unknown",
              detected: true,
              closed: !!consent.closed,
              action: consent.action || null,
              strategy: consent.strategy || null,
            }
          : null,
      platform: platform.primary
        ? {
            id: platform.primary.id,
            label: platform.primary.label,
            confidence: platform.primary.confidence,
            signals: platform.primary.signals,
          }
        : null,
      platforms: platform.candidates || [],
      generator: platform.generator || crawl.meta?.generator || null,
    };
  })(),
  colors: {
    background: colors.background,
    foreground: colors.foreground,
    primary: colors.primary,
    accent: colors.accent,
    provenance: colors.provenance,
    observed: colors.observed,
  },
  typography: {
    fontFamily: chosenFont.google,
    requestedFontFamily: chosenFont.requested,
    notes: chosenFont.fallback
      ? `Nearest Google Font to "${chosenFont.requested}"`
      : "Exact Google Font match",
  },
  assets: {
    logo: logoFile,
    favicon: (() => {
      for (const name of [
        "favicon.svg",
        "favicon.png",
        "favicon.webp",
        "favicon.ico",
      ]) {
        if (existsSync(path.join(assetsOut, name))) return `./assets/${name}`;
      }
      return undefined;
    })(),
    faviconFallback: (() => {
      for (const name of ["favicon-fallback.ico", "favicon-fallback.png"]) {
        if (existsSync(path.join(assetsOut, name))) return `./assets/${name}`;
      }
      return undefined;
    })(),
    appleTouch: existsSync(path.join(assetsOut, "apple-touch.png"))
      ? "./assets/apple-touch.png"
      : undefined,
    ogImage: existsSync(path.join(assetsOut, "og-image.jpg"))
      ? "./assets/og-image.jpg"
      : undefined,
    screenshots: {
      viewport: existsSync(path.join(assetsOut, "viewport.png"))
        ? "./assets/viewport.png"
        : undefined,
      fullpage: existsSync(path.join(assetsOut, "fullpage.png"))
        ? "./assets/fullpage.png"
        : undefined,
    },
    logoAnalysis: {
      fitsLightBackground: !!logoAnalysis?.fitsLightBackground,
      fitsDarkBackground: !!logoAnalysis?.fitsDarkBackground,
      solidPlate: !!logoAnalysis?.solidPlate,
      plateHex: logoAnalysis?.plateHex || null,
      reason: logoAnalysis?.reason || null,
      palette: logoPalette,
    },
    logoLight: logoLight?.file || undefined,
    logoLightAnalysis: logoLight
      ? {
          fitsLightBackground: !!logoLight.analysis?.fitsLightBackground,
          fitsDarkBackground: !!logoLight.analysis?.fitsDarkBackground,
          reason: logoLight.analysis?.reason || "adapted-for-light",
          ink: inkForLogo,
          adapt: {
            kind: logoLight.adapt?.kind || null,
            remappedPixels: logoLight.adapt?.remappedPixels ?? null,
            replacements: logoLight.adapt?.replacements ?? null,
            keptChromatic: logoLight.adapt?.keptChromatic ?? null,
          },
          palette: (logoLight.analysis?.palette || []).slice(0, 5),
        }
      : undefined,
    logoSymbol: logoLight?.layers?.symbol || undefined,
    logoWordmark: logoLight?.layers?.wordmark || undefined,
    logoWordmarkLight: logoLight?.layers?.wordmarkLight || undefined,
    logoNav: logoLight?.navFile || logoLight?.file || logoFile || undefined,
    candidates: analyzedAssets.map((a) => ({
      ...a,
      palette: undefined,
    })),
  },
  landing: { variant: "light-hero" },
};

writeFileSync(
  path.join(examplesDir, "brand-pack.json"),
  JSON.stringify(pack, null, 2) + "\n",
);
writeFileSync(
  path.join(examplesDir, "SOURCE.md"),
  `# ${name}

- Crawl: \`scratchpad/brand-crawls/${path.basename(crawlDir)}/\`
- Method: observe → rank → assign (see \`examples/CAPTURE.md\`)
- ${pack.source.notes}
`,
);

console.log(`Wrote examples/${packId}/brand-pack.json`);
console.log(`  name: ${name}`);
console.log(`  colors: ${JSON.stringify({
  background: pack.colors.background,
  foreground: pack.colors.foreground,
  primary: pack.colors.primary,
  accent: pack.colors.accent,
})}`);
console.log(
  `  provenance: primary=${pack.colors.provenance.primary}; accent=${pack.colors.provenance.accent}`,
);
console.log(
  `  font: ${chosenFont.requested} → ${chosenFont.google}${chosenFont.fallback ? " (match)" : ""}`,
);
console.log(
  `  logo: ${pack.assets.logo} lightFit=${pack.assets.logoAnalysis.fitsLightBackground} (${pack.assets.logoAnalysis.reason})`,
);
if (pack.tech?.cmp?.vendor) {
  console.log(
    `  cmp: ${pack.tech.cmp.vendor} closed=${pack.tech.cmp.closed} action=${pack.tech.cmp.action || "-"}`,
  );
}
if (pack.tech?.platform?.label) {
  console.log(
    `  platform: ${pack.tech.platform.label} (${pack.tech.platform.id})`,
  );
} else if (pack.tech?.generator) {
  console.log(`  generator: ${pack.tech.generator}`);
}
for (const c of pack.assets.candidates) {
  console.log(
    `    - ${c.role}: ${c.file} packScore=${c.packScore} light=${c.fitsLightBackground}`,
  );
}
