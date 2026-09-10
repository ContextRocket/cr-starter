#!/usr/bin/env node
/**
 * Blind brand observation crawl (Playwright).
 *
 * Captures maximum useful signal for a later light nav+hero ranking step.
 * Does not invent brand colors or pick a final logo — that is pack/rank.
 *
 * Principles: examples/CAPTURE.md
 *
 *   node scripts/crawl-brand.mjs https://example.com
 */

import { chromium } from "playwright";
import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";
import {
  dismissConsentChrome,
  stripConsentTextBlocks,
} from "./lib/consent-chrome.mjs";
import { MARK_NOISE_INJECT } from "./lib/mark-noise.mjs";
import { platformProbeSource } from "./lib/detect-platform.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const urlArg = process.argv[2];
if (!urlArg) {
  console.error("Usage: node scripts/crawl-brand.mjs <url>");
  process.exit(1);
}

const target = new URL(urlArg);
const hostSlug = target.hostname.replace(/^www\./, "").replace(/\./g, "-");
const outDir = path.join(repoRoot, "scratchpad/brand-crawls", hostSlug);
const assetsDir = path.join(outDir, "assets");
mkdirSync(assetsDir, { recursive: true });
// Drop prior downloads so stale misnamed icons (e.g. SVG saved as .ico) cannot linger.
for (const name of readdirSync(assetsDir)) {
  unlinkSync(path.join(assetsDir, name));
}

async function download(url, dest) {
  // Prefer Playwright request (same UA/cookies as the crawl). Many brand CDNs
  // 403 bare Node https.get (Usercentrics favicon.png is a current example).
  if (typeof context !== "undefined" && context?.request) {
    try {
      const res = await context.request.get(url, {
        timeout: 20000,
        maxRedirects: 5,
      });
      if (res.ok()) {
        writeFileSync(dest, await res.body());
        return;
      }
      // Fall through to Node for non-OK so the error message stays useful.
      const status = res.status();
      if (status >= 400) {
        throw new Error(`HTTP ${status} for ${url}`);
      }
    } catch (err) {
      // Only fall back when Playwright itself failed to talk; keep HTTP errors.
      if (/^HTTP \d+/.test(String(err.message || ""))) throw err;
    }
  }
  const client = url.startsWith("https") ? https : http;
  await new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          Referer: target.origin + "/",
        },
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          download(new URL(res.headers.location, url).href, dest).then(
            resolve,
            reject,
          );
          return;
        }
        if ((res.statusCode ?? 500) >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        const file = createWriteStream(dest);
        pipeline(res, file).then(resolve, reject);
      },
    );
    req.on("error", reject);
  });
}

/** Locale from TLD so CMPs render the same labels users see. */
function localeForHost(hostname) {
  if (/\.de$/i.test(hostname) || /\.at$/i.test(hostname))
    return { locale: "de-DE", languages: "de-DE,de;q=0.9,en;q=0.8" };
  if (/\.fr$/i.test(hostname))
    return { locale: "fr-FR", languages: "fr-FR,fr;q=0.9,en;q=0.8" };
  if (/\.es$/i.test(hostname))
    return { locale: "es-ES", languages: "es-ES,es;q=0.9,en;q=0.8" };
  if (/\.ie$/i.test(hostname))
    return { locale: "en-IE", languages: "en-IE,en;q=0.9" };
  return { locale: "en-US", languages: "en-US,en;q=0.9" };
}

const browser = await chromium.launch({ headless: true });
const loc = localeForHost(target.hostname);
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: loc.locale,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  extraHTTPHeaders: { "Accept-Language": loc.languages },
});
const page = await context.newPage();

try {
  await page.goto(target.href, { waitUntil: "load", timeout: 60000 });
} catch (err) {
  console.warn(`load wait failed (${err.message}); retrying domcontentloaded`);
  await page.goto(target.href, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
}
await page.waitForTimeout(800);

const consent = await dismissConsentChrome(page, { waitMs: 1800, retries: 3 });
console.log(
  `  consent: detected=${consent.detected} closed=${consent.closed} hidden=${consent.hidden} framework=${consent.framework || "-"} action=${consent.action || "-"}`,
);
if (consent.clickedText) console.log(`    clicked: "${consent.clickedText}"`);
if (consent.notes.length) console.log(`    notes: ${consent.notes.join("; ")}`);

const snapshot = await page.evaluate((inject) => {
  const noisePatterns = inject.noise;
  const platformChecks = inject.platforms || [];
  const STORE_BADGE_RE = new RegExp(noisePatterns.store, "i");
  const CERT_BADGE_RE = new RegExp(noisePatterns.cert, "i");
  const SOCIAL_UI_RE = new RegExp(noisePatterns.social, "i");
  const FEATURE_NAV_ART_RE = new RegExp(noisePatterns.featureNav || "$a", "i");

  const classifyNoise = ({ alt = "", aria = "", className = "", src = "", zone = "" }) => {
    const bag = `${alt} ${aria} ${className} ${src}`;
    const base = String(src).split("?")[0].split("#")[0];
    const file = base.split("/").pop() || "";
    let pathForFeatures = `${src} ${className}`;
    try {
      pathForFeatures = `${decodeURIComponent(String(src))} ${className}`;
    } catch {
      /* keep raw */
    }
    const labeledBrand =
      /\b(logo|wordmark|brand|logotipo)\b/i.test(`${alt} ${aria}`) ||
      /\b(logo|wordmark|brand)\b/i.test(className);
    if (STORE_BADGE_RE.test(bag) || STORE_BADGE_RE.test(file)) {
      return { kind: "store-badge", reason: "store-badge-pattern" };
    }
    if (CERT_BADGE_RE.test(bag) || CERT_BADGE_RE.test(file)) {
      return { kind: "cert-badge", reason: "certification-badge-pattern" };
    }
    if (
      SOCIAL_UI_RE.test(bag) &&
      !/\b(logo|wordmark|brand)\b/i.test(`${alt} ${aria}`)
    ) {
      return { kind: "social-ui", reason: "social-or-ui-glyph" };
    }
    if (FEATURE_NAV_ART_RE.test(pathForFeatures) && !labeledBrand) {
      return { kind: "feature-nav-art", reason: "feature-nav-illustration" };
    }
    if (zone === "footer" && /^logo\s*\d+$/i.test(String(alt).trim())) {
      return { kind: "partner-noise", reason: "footer-partner-grid-alt" };
    }
    return { kind: "ok", reason: null };
  };

  const abs = (u) => {
    try {
      return new URL(u, location.href).href;
    } catch {
      return null;
    }
  };

  const rgb = (c) => {
    const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], raw: c };
  };
  const lum = ({ r, g, b }) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const sat = ({ r, g, b }) =>
    Math.max(r, g, b) - Math.min(r, g, b);
  const key = ({ r, g, b }) => `${r},${g},${b}`;

  const pickMeta = (sel) =>
    document.querySelector(sel)?.getAttribute("content")?.trim() || null;

  const host = location.hostname.replace(/^www\./, "");
  const hostToken = host.split(".")[0].toLowerCase();
  const titleToken = (document.title || "")
    .split(/[|–\-_]/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  const sharesBrandToken = (text) => {
    // Labels only — CDN host paths like assets.doctolib.fr must not count.
    const compact = String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    if (!compact) return false;
    if (hostToken.length >= 4 && compact.includes(hostToken.replace(/[^a-z0-9]/g, "")))
      return true;
    if (titleToken.length >= 4 && compact.includes(titleToken)) return true;
    return false;
  };

  const inConsentChrome = (el) => {
    let n = el;
    for (let i = 0; i < 8 && n; i++) {
      if (n.getAttribute?.("data-cr-consent-hidden") === "1") return true;
      if (n.getAttribute?.("data-cr-crawl-hidden") === "1") return true;
      const bag = `${n.id || ""} ${n.className || ""}`.toLowerCase();
      if (
        /\bcookie|\bconsent|\bgdpr|\bonetrust|\bcookiebot|\bcky-|\bosano|\bdidomi|\bcmplz|\busercentrics|\btruste/.test(
          bag,
        )
      ) {
        return true;
      }
      n = n.parentElement;
    }
    return false;
  };

  const zoneOf = (el) => {
    let n = el;
    for (let i = 0; i < 12 && n; i++) {
      const tag = (n.tagName || "").toLowerCase();
      const bag = `${n.id || ""} ${n.className || ""}`.toLowerCase();
      if (tag === "header" || tag === "nav" || /\bnavbar|\bsite-header|\bmasthead/.test(bag))
        return "header";
      if (/\bhero|\bmasthead|\bbanner/.test(bag)) return "hero";
      if (tag === "footer" || /\bfooter/.test(bag)) return "footer";
      if (tag === "main") return "main";
      n = n.parentElement;
    }
    return "page";
  };

  const body = getComputedStyle(document.body);
  const h1El = document.querySelector("h1");
  const h1 = h1El ? getComputedStyle(h1El) : null;

  // --- Filled controls (CTA pool) ---
  const ctaCandidates = [];
  for (const el of document.querySelectorAll(
    "a, button, [role='button'], input[type='submit']",
  )) {
    if (inConsentChrome(el)) continue;
    const text = (el.value || el.textContent || "").replace(/\s+/g, " ").trim();
    if (!text || text.length > 64) continue;
    // Generic consent copy — universal GDPR pattern, not a vendor list.
    if (/\b(cookie|consent|privacy settings|manage preferences)\b/i.test(text))
      continue;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0)
      continue;
    const bg = rgb(s.backgroundColor);
    if (!bg) continue;
    if (/rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0(?:\.0+)?\s*\)/i.test(s.backgroundColor))
      continue;
    if (lum(bg) > 0.95 || lum(bg) < 0.04) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 36 || rect.height < 18) continue;

    const zone = zoneOf(el);
    const aboveFold = rect.top < window.innerHeight * 1.15;
    const tag = (el.tagName || "").toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    // Prefer real controls over colored section chrome / partner grids.
    const actionVerb =
      /\b(get|start|sign|book|contact|try|buy|join|demo|quote|find|free|anmelden|kontakt|mietwagen|finden|accepte|empezar)\b/i.test(
        text,
      );
    const canonicalCta =
      /\b(get started|sign up|sign in|book (a )?(demo|call|meeting)|try (it )?free|start free|contact us|get a quote|request (a )?demo|mietwagen finden|alle akzeptieren)\b/i.test(
        text,
      );
    const sectionChrome =
      /\b(partner|beliebte|popular|explore .+ slack|fix bugs from|preis|pricing tiers|unsere leistungen)\b/i.test(
        text,
      );
    const components = {
      zoneHeader: zone === "header" ? 35 : 0,
      zoneHero: zone === "hero" ? 30 : 0,
      aboveFold: aboveFold ? 20 : 0,
      saturation: Math.min(30, Math.round(sat(bg) / 4)),
      shortLabel: words.length <= 4 ? 15 : words.length <= 6 ? 5 : -20,
      tagButton: tag === "button" || tag === "input" ? 25 : 0,
      actionVerb: actionVerb ? 25 : 0,
      canonicalCta: canonicalCta ? 30 : 0,
      sectionChrome: sectionChrome ? -40 : 0,
      size: Math.min(15, Math.round((rect.width * rect.height) / 4000)),
    };
    const score = Object.values(components).reduce((a, b) => a + b, 0);

    ctaCandidates.push({
      backgroundColor: s.backgroundColor,
      color: s.color,
      borderRadius: s.borderRadius,
      text: text.slice(0, 80),
      href: el.href || null,
      zone,
      aboveFold,
      score,
      scoreComponents: components,
    });
  }
  ctaCandidates.sort((a, b) => b.score - a.score);
  const bestCta = ctaCandidates[0] || null;

  // --- Link color histogram ---
  const linkColors = {};
  document.querySelectorAll("a").forEach((a, i) => {
    if (i > 100) return;
    if (inConsentChrome(a)) return;
    const c = rgb(getComputedStyle(a).color);
    if (!c) return;
    if (c.r === 0 && c.g === 0 && c.b === 238) return; // UA default
    const k = key(c);
    linkColors[k] = (linkColors[k] || 0) + 1;
  });
  const bodyInk = rgb(body.color);
  const rankedLinks = Object.entries(linkColors)
    .map(([k, count]) => {
      const [r, g, b] = k.split(",").map(Number);
      return { r, g, b, count, raw: `rgb(${r}, ${g}, ${b})` };
    })
    .filter((c) => !bodyInk || key(c) !== key(bodyInk))
    .sort((a, b) => b.count - a.count);

  // --- Text samples (downstream synthesis / review) ---
  const textSamples = [];
  for (const n of document.querySelectorAll("main h1, main h2, main p, h1, h2, h3, p")) {
    if (inConsentChrome(n)) continue;
    const t = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length < 8 || t.length > 280) continue;
    textSamples.push({ tag: n.tagName.toLowerCase(), text: t, zone: zoneOf(n) });
    if (textSamples.length >= 16) break;
  }

  // --- Image / SVG marks: observe broadly, score generally ---
  const seenSrc = new Set();
  const logoCandidates = [];

  const pushImg = (img, discovery) => {
    const src = img.currentSrc || img.src || img.getAttribute("src");
    if (!src || src.startsWith("data:")) return;
    if ((img.naturalWidth || img.width) === 1 && (img.naturalHeight || img.height) === 1)
      return;
    const full = abs(src);
    if (!full || seenSrc.has(full)) return;
    if (inConsentChrome(img)) return;

    const alt = img.alt || "";
    const cls = String(img.className || "");
    const bag = `${alt} ${cls} ${full}`;
    const zone = zoneOf(img);
    const noise = classifyNoise({ alt, className: cls, src: full, zone });
    if (
      noise.kind === "store-badge" ||
      noise.kind === "cert-badge" ||
      noise.kind === "social-ui" ||
      noise.kind === "feature-nav-art"
    ) {
      return;
    }
    // UI chrome / social / utility glyphs — never brand wordmarks.
    if (
      /\b(phone|call|email|mail|close|menu|hamburger|facebook|instagram|twitter|linkedin|youtube|whatsapp|cart|search|arrow|chevron|check\s*mark|icon)\b/i.test(
        bag,
      ) &&
      !/logo|wordmark|brand/i.test(alt)
    ) {
      return;
    }

    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    const aspect = w && h ? w / Math.max(h, 1) : 0;
    // discovery="header-logo" only when actually in header/nav — footers use footer-img.
    const named =
      /logo|brand|wordmark/i.test(`${alt} ${cls}`) ||
      (discovery === "header-logo" && zone === "header");
    const brandHit = sharesBrandToken(`${alt} ${cls}`);
    // "Fexco logo" / "energyhub logo" partner marks — require brand token outside header.
    if (
      discovery === "logo-keyword" &&
      !brandHit &&
      zone !== "header" &&
      /\blogo\b/i.test(alt)
    ) {
      return;
    }
    // Cert seals that mention the brand in passing still aren't nav marks.
    if (noise.kind === "partner-noise") return;
    if (
      CERT_BADGE_RE.test(`${alt} ${full}`) &&
      zone === "footer"
    ) {
      return;
    }
    const looksPhoto =
      /\.(jpe?g|webp)(\?|$)/i.test(full) &&
      !/logo|brand|wordmark/i.test(`${alt} ${cls}`) &&
      (h >= 180 || alt.length > 80) &&
      aspect < 2.8;
    // Long scenic alts that merely mention a logo shape are photos, not marks.
    const scenicAlt =
      alt.length > 90 &&
      /\b(vista|aerial|street|window|photo|imagen|intersección|boutique)\b/i.test(
        alt,
      );
    const genericGridAlt = /^logo\s*\d+$/i.test(alt.trim());
    const tinyUi =
      (w > 0 && h > 0 && w <= 48 && h <= 48 && aspect < 1.6) ||
      (/\.svg(\?|$)/i.test(full) && w > 0 && h > 0 && Math.max(w, h) <= 48);

    const components = {
      headerZone: zone === "header" ? 50 : 0,
      heroZone: zone === "hero" ? 10 : 0,
      footerBrand: zone === "footer" && (named || brandHit) ? 20 : 0,
      named: named ? 30 : 0,
      brandToken: brandHit ? 40 : 0,
      wordmarkAspect: aspect >= 2 ? 25 : aspect >= 1.4 ? 10 : 0,
      navScale: h > 0 && h <= 160 && w >= 60 && w <= 900 ? 25 : 0,
      vectorBonus:
        /\.svg(\?|$)/i.test(full) && !tinyUi ? 18 : /\.png(\?|$)/i.test(full) ? 10 : 0,
      photoPenalty: looksPhoto || scenicAlt ? -80 : 0,
      genericGridPenalty: genericGridAlt || noise.kind === "partner-noise" ? -70 : 0,
      footerNoise: zone === "footer" && !named && !brandHit ? -25 : 0,
      tinyPenalty: tinyUi ? -90 : 0,
      footerDiscovery: discovery === "footer-img" && !brandHit ? -35 : 0,
    };
    const score = Object.values(components).reduce((a, b) => a + b, 0);
    if (tinyUi && !brandHit) return;
    if (score < 30 && !brandHit) return;

    seenSrc.add(full);
    logoCandidates.push({
      why: discovery,
      kind: "img",
      src: full,
      alt,
      width: w || null,
      height: h || null,
      aspect: aspect || null,
      zone,
      brandHit,
      noiseKind: noise.kind,
      score,
      scoreComponents: components,
    });
  };

  document
    .querySelectorAll(
      "header img, nav img, [class*='navbar' i] img, a[class*='logo' i] img, [class*='brand' i] img, [aria-label*='logo' i] img, [aria-label*='home' i] img",
    )
    .forEach((img) => pushImg(img, "header-logo"));

  document
    .querySelectorAll("footer img")
    .forEach((img) => pushImg(img, "footer-img"));

  document.querySelectorAll("img").forEach((img) => {
    const bag = `${img.alt || ""} ${img.className || ""} ${img.currentSrc || img.src || ""}`;
    if (!/logo|brand|wordmark/i.test(bag)) return;
    pushImg(img, "logo-keyword");
  });
  logoCandidates.sort((a, b) => b.score - a.score);

  const svgCandidates = [];
  const svgSeen = new Set();
  const pushSvg = (svg, discovery) => {
    if (inConsentChrome(svg)) return;
    const cls = `${svg.getAttribute("class") || ""} ${svg.className?.baseVal || ""}`.toLowerCase();
    const aria = svg.getAttribute("aria-label") || "";
    const role = svg.getAttribute("role") || "";
    const bag = `${cls} ${aria} ${role}`;
    if (svgSeen.has(svg)) return;

    const zone = zoneOf(svg);
    const noise = classifyNoise({ aria, className: cls, zone });
    if (noise.kind === "store-badge" || noise.kind === "cert-badge" || noise.kind === "social-ui") {
      return;
    }

    // UI chrome / masks / hamburgers — never brand wordmarks.
    if (
      /\b(chevron|hamburger|menu|arrow|close|search|icon-hover|sign-in__mask|cutoutmask)\b/i.test(
        bag,
      )
    ) {
      return;
    }
    if (cls.includes("icon") && !/logo|brand|wordmark/.test(cls)) return;
    if (svg.querySelector("mask") && !svg.querySelector("path")) return;

    const vb = svg.getAttribute("viewBox") || "";
    const w = Number(svg.getAttribute("width")) || svg.clientWidth || 0;
    const h = Number(svg.getAttribute("height")) || svg.clientHeight || 0;
    if (/0 0 24 24/.test(vb) && w <= 32) return;
    if (w > 0 && h > 0 && w <= 28 && h <= 28) return;

    const aspect = w && h ? w / Math.max(h, 1) : 0;
    const brandHit = sharesBrandToken(aria) || sharesBrandToken(cls);
    const homeLink = !!svg.closest(
      "a[aria-label*='home' i], a[aria-label*='inicio' i], a[aria-label*='homepage' i], a.navigation-menu-home-link, a[class*='home-link' i], a[href='/'], a[href$='/en-us'], a[href$='/en']",
    );
    // "Browserbase logo" / "OpenAI" customer marks — only keep if brand token matches.
    const foreignNamedLogo =
      /\blogo\b/i.test(aria) && !brandHit && !homeLink;
    if (foreignNamedLogo) return;
    if (
      aria &&
      !brandHit &&
      !homeLink &&
      aria.length <= 48 &&
      !/^(logo|logotipo|wordmark)$/i.test(aria.trim()) &&
      !/logo|brand|wordmark/i.test(cls)
    ) {
      return;
    }

    const named =
      /logo|brand|wordmark/i.test(cls) ||
      (/\b(logo|logotipo|wordmark)\b/i.test(aria) && brandHit) ||
      /^(logo|logotipo|wordmark)$/i.test(aria.trim());
    if (!named && !brandHit && !homeLink && aspect < 1.5 && Math.max(w, h) < 72)
      return;
    // Footer SVGs without brand/home signals are seals, badges, or decorations.
    if (zone === "footer" && !brandHit && !homeLink && !named) return;
    const pathCount = svg.querySelectorAll("path").length;
    const textOnly =
      svg.querySelectorAll("text").length > 0 && pathCount === 0;
    if (textOnly && !named) return;

    const exactBrandLogo =
      /^(logo|logotipo|wordmark)$/i.test(aria.trim()) ||
      new RegExp(
        `^(logotipo de|logo of|logo)\\s+${hostToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ).test(aria.trim()) ||
      new RegExp(
        `^${hostToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+(logo|logotipo|wordmark)$`,
        "i",
      ).test(aria.trim());
    const productEventLogo =
      /\b(sessions|summit|event|conference|webinar)\s+logo\b/i.test(aria) ||
      /\blogo\s+(sessions|summit|event)\b/i.test(aria);

    // Geometry dominates raw scores on large decorative SVGs — keep it bounded
    // outside the header so a 500×500 footer seal cannot beat a nav wordmark.
    const geometry =
      (w || 120) *
      Math.max(h || 24, 1) *
      (aspect >= 2 ? 3 : aspect >= 1.4 ? 2 : 1);
    const geometryScore =
      zone === "header" || homeLink ? geometry : Math.min(geometry, 2500);

    const score =
      geometryScore +
      (zone === "header" ? 5000 : 0) +
      (named ? 8000 : 0) +
      (brandHit ? 6000 : 0) +
      (homeLink ? 25000 : 0) +
      (exactBrandLogo ? 20000 : 0) +
      (pathCount > 0 ? 1500 : 0) +
      (discovery === "aria-logo" ? 4000 : 0) -
      (textOnly ? 12000 : 0) -
      (/mask/i.test(cls) ? 15000 : 0) -
      (productEventLogo ? 30000 : 0) -
      (zone === "footer" && !homeLink && !exactBrandLogo ? 8000 : 0);

    const clone = svg.cloneNode(true);
    if (!clone.getAttribute("xmlns")) {
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }
    // Resolve CSS variables that vanish outside the site stylesheet.
    const origPainted = svg.querySelectorAll("path, [fill]");
    clone.querySelectorAll("path, [fill]").forEach((el, i) => {
      const fillAttr = el.getAttribute("fill") || "";
      if (!fillAttr.includes("var(") && fillAttr && fillAttr !== "currentColor")
        return;
      try {
        const srcEl = origPainted[i] || svg;
        const computed = getComputedStyle(srcEl).fill;
        if (computed && computed !== "none") el.setAttribute("fill", computed);
        else if (fillAttr.includes("var(")) el.setAttribute("fill", "#111111");
      } catch {
        if (fillAttr.includes("var(")) el.setAttribute("fill", "#111111");
      }
    });

    svgSeen.add(svg);
    svgCandidates.push({
      why: discovery,
      kind: "svg",
      markup: clone.outerHTML,
      width: w,
      height: h,
      viewBox: vb,
      zone,
      aria,
      brandHit,
      named,
      homeLink,
      noiseKind: noise.kind,
      score,
    });
  };

  document
    .querySelectorAll(
      "header svg, nav svg, [role='banner'] svg, a[class*='logo' i] svg, [class*='brand' i] svg, [aria-label*='logo' i] svg, [aria-label*='logotipo' i] svg, a[aria-label*='home' i] svg, a[aria-label*='inicio' i] svg, a.navigation-menu-home-link svg, [class*='home-link' i] svg",
    )
    .forEach((svg) => pushSvg(svg, "header-svg"));
  document
    .querySelectorAll("svg[aria-label*='logo' i], svg[aria-label*='logotipo' i], svg[aria-label*='wordmark' i]")
    .forEach((svg) => pushSvg(svg, "aria-logo"));
  svgCandidates.sort((a, b) => b.score - a.score);

  // --- CMS / platform fingerprints ---
  const generator =
    document.querySelector('meta[name="generator"]')?.content?.trim() ||
    document.querySelector('meta[name="Generator"]')?.content?.trim() ||
    null;
  const metaAssets = [
    ...document.querySelectorAll(
      'meta[property="og:image"], meta[name="twitter:image"], meta[property="og:image:url"]',
    ),
  ]
    .map((el) => el.content || "")
    .filter(Boolean);
  const assetBag = [
    ...metaAssets,
    ...[...document.querySelectorAll("link[href], script[src], img[src], source[src], video[poster]")]
      .map((el) => el.href || el.src || el.getAttribute("poster") || "")
      .filter(Boolean)
      .slice(0, 200),
    location.href,
  ].join("\n");
  const runtimeHints = [];
  try {
    if (window.Webflow || document.documentElement?.dataset?.wfSite) {
      runtimeHints.push("webflow");
    }
  } catch {
    /* ignore */
  }
  try {
    if (window.__NEXT_DATA__ || document.getElementById("__next")) {
      runtimeHints.push("nextjs");
    }
  } catch {
    /* ignore */
  }
  try {
    if (window.__NUXT__ || document.getElementById("__nuxt")) {
      runtimeHints.push("nuxt");
    }
  } catch {
    /* ignore */
  }
  const platformHits = [];
  for (const check of platformChecks) {
    const signals = [];
    if (check.generator && generator) {
      try {
        if (new RegExp(check.generator, "i").test(generator)) {
          signals.push("generator");
        }
      } catch {
        /* bad regex */
      }
    }
    if (check.dom) {
      try {
        if (document.querySelector(check.dom)) signals.push("dom");
      } catch {
        /* bad selector */
      }
    }
    if (check.path) {
      try {
        if (new RegExp(check.path, "i").test(assetBag)) {
          signals.push("asset-path");
        }
      } catch {
        /* bad regex */
      }
    }
    if (runtimeHints.includes(check.id)) signals.push("runtime");
    if (signals.length) {
      let confidence = 0.55;
      if (signals.includes("generator")) confidence = 0.92;
      else if (signals.includes("runtime")) confidence = 0.88;
      else if (signals.includes("dom") && signals.includes("asset-path"))
        confidence = 0.85;
      else if (signals.includes("dom")) confidence = 0.75;
      else if (signals.includes("asset-path")) confidence = 0.65;
      platformHits.push({
        id: check.id,
        label: check.label,
        confidence,
        signals: [...new Set(signals)],
      });
    }
  }
  platformHits.sort((a, b) => b.confidence - a.confidence);

  return {
    finalUrl: location.href,
    title: document.title || null,
    meta: {
      description: pickMeta('meta[name="description"]'),
      ogTitle: pickMeta('meta[property="og:title"]'),
      ogDescription: pickMeta('meta[property="og:description"]'),
      ogImage: pickMeta('meta[property="og:image"]'),
      ogSiteName: pickMeta('meta[property="og:site_name"]'),
      themeColor: pickMeta('meta[name="theme-color"]'),
      generator,
    },
    platform: {
      generator,
      primary: platformHits[0] || null,
      candidates: platformHits.slice(0, 5),
    },
    computed: {
      body: {
        backgroundColor: body.backgroundColor,
        color: body.color,
        fontFamily: body.fontFamily,
      },
      h1: h1
        ? {
            color: h1.color,
            fontFamily: h1.fontFamily,
            fontSize: h1.fontSize,
            fontWeight: h1.fontWeight,
            text: (h1El?.textContent || "").replace(/\s+/g, " ").trim(),
          }
        : null,
      button: bestCta
        ? {
            backgroundColor: bestCta.backgroundColor,
            color: bestCta.color,
            borderRadius: bestCta.borderRadius,
            text: bestCta.text,
            href: bestCta.href,
            zone: bestCta.zone,
            score: bestCta.score,
          }
        : null,
      ctaCandidates: ctaCandidates.slice(0, 12),
      linkAccent: rankedLinks[0]
        ? { color: rankedLinks[0].raw, count: rankedLinks[0].count }
        : null,
      linkColorSamples: rankedLinks.slice(0, 8).map((c) => c.raw),
    },
    fonts: {
      body: body.fontFamily,
      heading: h1?.fontFamily || null,
    },
    textSamples,
    logoCandidates: logoCandidates.slice(0, 12),
    svgLogoCandidates: svgCandidates.slice(0, 4),
    // All declared icons — pages often put SVG/PNG/ICO in CDN paths, not /favicon.ico.
    iconLinks: [...document.querySelectorAll("link[rel]")].flatMap((link) => {
      const rel = String(link.getAttribute("rel") || "").toLowerCase();
      if (!/\b(icon|shortcut icon|apple-touch-icon|mask-icon)\b/.test(rel))
        return [];
      const href = abs(link.href);
      if (!href) return [];
      const sizes = link.getAttribute("sizes") || link.sizes?.toString?.() || "";
      const type = link.type || "";
      let maxSize = 0;
      for (const part of sizes.split(/\s+/)) {
        const m = part.match(/(\d+)x(\d+)/i);
        if (m) maxSize = Math.max(maxSize, Number(m[1]), Number(m[2]));
      }
      return [
        {
          rel,
          href,
          type,
          sizes,
          maxSize,
        },
      ];
    }),
    favicon:
      document.querySelector("link[rel='icon']")?.href ||
      document.querySelector("link[rel='shortcut icon']")?.href ||
      abs("/favicon.ico"),
    appleTouchIcon:
      document.querySelector("link[rel='apple-touch-icon']")?.href ||
      document.querySelector("link[rel='apple-touch-icon precomposed']")?.href ||
      null,
  };
}, { noise: MARK_NOISE_INJECT, platforms: platformProbeSource() });

try {
  await page.screenshot({
    path: path.join(outDir, "viewport.png"),
    fullPage: false,
    timeout: 15000,
  });
} catch (err) {
  console.warn(`  viewport screenshot skipped: ${err.message}`);
}
try {
  await page.screenshot({
    path: path.join(outDir, "fullpage.png"),
    fullPage: true,
    timeout: 20000,
  });
} catch (err) {
  console.warn(`  fullpage screenshot skipped: ${err.message}`);
}

const downloaded = [];
async function tryDownload(url, name) {
  if (!url) return null;
  try {
    const dest = path.join(outDir, "assets", name);
    await download(url, dest);
    downloaded.push({ url, file: `assets/${name}` });
    return `assets/${name}`;
  } catch (err) {
    downloaded.push({ url, error: String(err.message || err) });
    return null;
  }
}

let i = 0;
for (const c of snapshot.logoCandidates.slice(0, 6)) {
  try {
    const ext = path.extname(new URL(c.src).pathname) || ".png";
    const clean = ext.split("?")[0] || ".png";
    const file = await tryDownload(c.src, `logo-${i++}${clean}`);
    c.local = file;
  } catch {
    /* bad URL */
  }
}

if (snapshot.svgLogoCandidates?.length) {
  snapshot.svgLogoCandidates.slice(0, 3).forEach((c, idx) => {
    if (!c?.markup) return;
    const name = idx === 0 ? "logo.svg" : `logo-svg-${idx}.svg`;
    const svgPath = path.join(outDir, "assets", name);
    writeFileSync(svgPath, c.markup);
    c.local = `assets/${name}`;
    downloaded.push({ url: "inline-svg", file: `assets/${name}`, score: c.score });
  });
}

function iconExtension(url, type = "") {
  const u = String(url || "");
  const t = String(type || "").toLowerCase();
  if (t.includes("svg") || /\.svg(\?|#|$)/i.test(u)) return ".svg";
  if (t.includes("png") || /\.png(\?|#|$)/i.test(u)) return ".png";
  if (t.includes("webp") || /\.webp(\?|#|$)/i.test(u)) return ".webp";
  if (t.includes("icon") || /\.ico(\?|#|$)/i.test(u)) return ".ico";
  if (t.includes("jpeg") || t.includes("jpg") || /\.jpe?g(\?|#|$)/i.test(u))
    return ".jpg";
  return ".ico";
}

function scoreFaviconCandidate(icon) {
  const rel = icon.rel || "";
  const ext = iconExtension(icon.href, icon.type);
  let s = 0;
  if (/\bapple-touch-icon\b/.test(rel)) s -= 40; // separate download
  if (/\bmask-icon\b/.test(rel)) s -= 20;
  if (ext === ".svg") s += 80;
  else if (ext === ".png") s += 50;
  else if (ext === ".ico") s += 35;
  else if (ext === ".webp") s += 40;
  // Prefer typical favicon sizes; huge marketing icons score lower.
  if (icon.maxSize >= 16 && icon.maxSize <= 128) s += 30;
  else if (icon.maxSize > 128 && icon.maxSize <= 256) s += 15;
  else if (icon.maxSize > 512) s -= 10;
  if (/\bshortcut icon\b/.test(rel)) s += 10;
  if (/\bicon\b/.test(rel)) s += 5;
  return s;
}

const iconLinks = (snapshot.iconLinks || []).filter((i) => i?.href);
const faviconPool = iconLinks
  .filter((i) => !/\bapple-touch-icon\b/.test(i.rel || ""))
  .map((i) => ({ ...i, score: scoreFaviconCandidate(i) }))
  .sort((a, b) => b.score - a.score);

// Primary favicon with correct extension (Stripe serves SVG first, not /favicon.ico).
let faviconLocal = null;
if (faviconPool[0]) {
  const best = faviconPool[0];
  const ext = iconExtension(best.href, best.type);
  faviconLocal = await tryDownload(best.href, `favicon${ext}`);
  snapshot.favicon = best.href;
  snapshot.faviconChosen = {
    href: best.href,
    type: best.type,
    sizes: best.sizes,
    score: best.score,
    local: faviconLocal,
  };
  // Also keep a raster/ico fallback when the primary is SVG (broader browser support).
  if (ext === ".svg") {
    const fallback =
      faviconPool.find((i) => iconExtension(i.href, i.type) === ".ico") ||
      faviconPool.find((i) => {
        const e = iconExtension(i.href, i.type);
        return e === ".png" || e === ".webp";
      });
    if (fallback) {
      const fext = iconExtension(fallback.href, fallback.type);
      await tryDownload(fallback.href, `favicon-fallback${fext}`);
    }
  }
} else {
  faviconLocal = await tryDownload(snapshot.favicon, "favicon.ico");
}

const apple =
  iconLinks.find((i) => /\bapple-touch-icon\b/.test(i.rel || "")) || null;
if (apple?.href) {
  snapshot.appleTouchIcon = apple.href;
  const aext = iconExtension(apple.href, apple.type);
  await tryDownload(
    apple.href,
    aext === ".png" ? "apple-touch.png" : `apple-touch${aext}`,
  );
} else {
  await tryDownload(snapshot.appleTouchIcon, "apple-touch.png");
}
await tryDownload(snapshot.meta.ogImage, "og-image.jpg");

const result = {
  crawledAt: new Date().toISOString(),
  requestedUrl: target.href,
  captureVersion: 3,
  consent,
  ...snapshot,
  downloads: downloaded,
};

// Hygiene: consent chrome should not pollute text samples / later vector use.
result.textSamples = (result.textSamples || [])
  .map((s) => ({
    ...s,
    text: stripConsentTextBlocks(s.text),
  }))
  .filter((s) => s.text && s.text.length >= 8);

writeFileSync(path.join(outDir, "crawl.json"), JSON.stringify(result, null, 2));
await browser.close();

console.log(`Crawl written → ${path.relative(repoRoot, outDir)}`);
console.log(`  title: ${result.title}`);
if (result.platform?.primary) {
  console.log(
    `  platform: ${result.platform.primary.label} (${result.platform.primary.id}) signals=${(result.platform.primary.signals || []).join(",")}`,
  );
} else if (result.meta?.generator) {
  console.log(`  platform: generator="${result.meta.generator}"`);
}
console.log(
  `  ink: ${result.computed.body.color}  bg: ${result.computed.body.backgroundColor}`,
);
console.log(`  h1 color: ${result.computed.h1?.color || "(none)"}`);
console.log(`  link accent: ${result.computed.linkAccent?.color || "(none)"}`);
console.log(
  `  button: ${result.computed.button?.backgroundColor || "(none)"} "${result.computed.button?.text || ""}" zone=${result.computed.button?.zone || "-"}`,
);
for (const c of (result.computed.ctaCandidates || []).slice(0, 4)) {
  console.log(
    `    cta: ${c.backgroundColor} "${c.text}" zone=${c.zone} score=${c.score}`,
  );
}
console.log(
  `  logos img=${result.logoCandidates.length} svg=${result.svgLogoCandidates?.length || 0}`,
);
if (result.faviconChosen) {
  console.log(
    `  favicon: ${result.faviconChosen.local || "(download failed)"} type=${result.faviconChosen.type || "-"} sizes=${result.faviconChosen.sizes || "-"} score=${result.faviconChosen.score}`,
  );
} else if (result.favicon) {
  console.log(`  favicon: ${result.favicon}`);
}
for (const icon of (result.iconLinks || []).slice(0, 6)) {
  console.log(
    `    icon: rel=${icon.rel} type=${icon.type || "-"} sizes=${icon.sizes || "-"} ${icon.href}`,
  );
}
for (const l of result.logoCandidates.slice(0, 5)) {
  console.log(
    `    logo: ${l.why} z=${l.zone} s=${l.score} ${l.alt || "(no alt)"}`,
  );
}
for (const s of (result.svgLogoCandidates || []).slice(0, 3)) {
  console.log(
    `    svg: ${s.why} z=${s.zone} s=${s.score} aria="${(s.aria || "").slice(0, 40)}" home=${!!s.homeLink}`,
  );
}
