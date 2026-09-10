#!/usr/bin/env node
/**
 * Turn a Playwright crawl.json into a brand-pack.json via Gemini.
 *
 * Loads GEMINI_API_KEY from ../context-rocket/backend/.env (or process env).
 *
 * Usage:
 *   node scripts/synthesize-brand-pack.mjs scratchpad/brand-crawls/kleosglobal-io
 *   node scripts/synthesize-brand-pack.mjs scratchpad/brand-crawls/markmacmahon-com --id markmacmahon
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(path.resolve(repoRoot, "../context-rocket/backend/.env"));

const crawlDir = path.resolve(process.argv[2] || "");
const idFlagIdx = process.argv.indexOf("--id");
const packId =
  idFlagIdx >= 0
    ? process.argv[idFlagIdx + 1]
    : path.basename(crawlDir).replace(/-io$|-com$/, "");

if (!crawlDir || !existsSync(path.join(crawlDir, "crawl.json"))) {
  console.error(
    "Usage: node scripts/synthesize-brand-pack.mjs <crawl-dir> [--id name]",
  );
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY missing (expected in context-rocket/backend/.env)");
  process.exit(1);
}

const crawl = JSON.parse(readFileSync(path.join(crawlDir, "crawl.json"), "utf8"));

const schemaHint = {
  version: 1,
  source: { url: "https://...", capturedAt: "ISO date", method: "crawl", notes: "string" },
  identity: { name: "string", siteUrl: "https://..." },
  colors: {
    background: "#rrggbb",
    foreground: "#rrggbb",
    primary: "#rrggbb",
    accent: "#rrggbb",
  },
  typography: { fontFamily: "primary family name only, e.g. Lato" },
  assets: { logo: "./assets/logo.png", favicon: "./assets/favicon.ico" },
  landing: { variant: "light-hero" },
};

const prompt = `Extract STYLE branding only for a simple light landing page (nav + hero).
Return ONLY valid JSON matching the schema. Do NOT invent marketing headlines, CTAs, taglines, or descriptions — copy is shared boilerplate elsewhere.

Extract:
- identity.name (site/brand name)
- identity.siteUrl
- colors: background, foreground, primary, accent as #rrggbb
- typography.fontFamily (best single family from crawl)
- notes only in source.notes

Color rules:
- If body background is DARK (low luminance): light landing background=#ffffff, primary+foreground=that dark brand ink, accent=bright button/highlight if present.
- If body is already light: use it as background; primary from dark link/button ink.
- Never put yellow highlight in primary when a navy brand ink exists.

Schema shape:
${JSON.stringify(schemaHint, null, 2)}

Crawl JSON:
${JSON.stringify(crawl, null, 2)}
`;

const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`Gemini HTTP ${res.status}: ${body.slice(0, 500)}`);
  process.exit(1);
}

const data = await res.json();
const text =
  data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
let pack;
try {
  pack = JSON.parse(text);
} catch {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) {
    console.error("Could not parse Gemini JSON:\n", text.slice(0, 800));
    process.exit(1);
  }
  pack = JSON.parse(m[0]);
}

pack.version = 1;
pack.source = {
  ...(pack.source || {}),
  url: crawl.finalUrl || crawl.requestedUrl,
  capturedAt: new Date().toISOString().slice(0, 10),
  method: "crawl",
  notes:
    pack.source?.notes ||
    `Synthesized via ${model} from Playwright crawl ${path.basename(crawlDir)}.`,
};

/** Heuristic: if crawl body bg is dark, force navy→primary and button→accent. */
function parseRgb(str) {
  if (!str) return null;
  const hex = str.trim();
  if (hex.startsWith("#") && (hex.length === 7 || hex.length === 4)) {
    if (hex.length === 4) {
      return {
        r: parseInt(hex[1] + hex[1], 16),
        g: parseInt(hex[2] + hex[2], 16),
        b: parseInt(hex[3] + hex[3], 16),
      };
    }
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }
  const m = String(str).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}
function toHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0"))
      .join("")
  );
}
function luminance({ r, g, b }) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

const bodyBg = parseRgb(crawl.computed?.body?.backgroundColor);
const btnBg = parseRgb(crawl.computed?.button?.backgroundColor);
if (bodyBg && luminance(bodyBg) < 0.35) {
  const brandInk = toHex(bodyBg);
  const accent = btnBg && luminance(btnBg) > 0.4 ? toHex(btnBg) : pack.colors?.accent;
  pack.colors = {
    background: "#ffffff",
    foreground: brandInk,
    primary: brandInk,
    accent: accent || brandInk,
  };
  pack.source.notes =
    (pack.source.notes || "") +
    " Color heuristic: dark body bg mapped to primary/foreground; button to accent.";
}
if (!pack.colors?.accent && pack.colors?.primary) {
  pack.colors.accent = pack.colors.primary;
}

const examplesDir = path.join(repoRoot, "examples", packId);
const assetsOut = path.join(examplesDir, "assets");
mkdirSync(assetsOut, { recursive: true });

function pickLocal(candidates, pred) {
  for (const c of candidates || []) {
    if (c.local && existsSync(path.join(crawlDir, c.local)) && (!pred || pred(c))) {
      return path.join(crawlDir, c.local);
    }
  }
  return null;
}

const logoSrc =
  pickLocal(crawl.logoCandidates, (c) => (c.width || 0) >= 64) ||
  pickLocal(crawl.logoCandidates) ||
  (existsSync(path.join(crawlDir, "assets/apple-touch.png"))
    ? path.join(crawlDir, "assets/apple-touch.png")
    : null);

if (logoSrc) {
  const ext = path.extname(logoSrc) || ".png";
  const dest = path.join(assetsOut, `logo${ext === ".svg" ? ".svg" : ".png"}`);
  copyFileSync(logoSrc, dest);
  pack.assets = pack.assets || {};
  pack.assets.logo = `./assets/${path.basename(dest)}`;
} else if (existsSync(path.join(crawlDir, "assets/favicon.ico"))) {
  // Brands without a logo mark: favicon is enough for nav chrome experiments.
  copyFileSync(
    path.join(crawlDir, "assets/favicon.ico"),
    path.join(assetsOut, "logo.png"),
  );
  pack.assets = pack.assets || {};
  pack.assets.logo = "./assets/logo.png";
}

const favSrc = existsSync(path.join(crawlDir, "assets/favicon.ico"))
  ? path.join(crawlDir, "assets/favicon.ico")
  : null;
if (favSrc) {
  copyFileSync(favSrc, path.join(assetsOut, "favicon.ico"));
  pack.assets = pack.assets || {};
  pack.assets.favicon = "./assets/favicon.ico";
}

writeFileSync(
  path.join(examplesDir, "brand-pack.json"),
  JSON.stringify(pack, null, 2) + "\n",
);
writeFileSync(
  path.join(crawlDir, "brand-pack.generated.json"),
  JSON.stringify(pack, null, 2) + "\n",
);
writeFileSync(
  path.join(examplesDir, "SOURCE.md"),
  `# ${pack.identity?.name || packId} brand pack

- Crawl: \`scratchpad/brand-crawls/${path.basename(crawlDir)}/\`
- Model: \`${model}\`
- Method: Playwright blind crawl → Gemini synthesis
- Generated: ${new Date().toISOString()}

Brands-first: nav + hero. Review colors and CTA before product use.
`,
);

console.log(`Wrote examples/${packId}/brand-pack.json`);
console.log(`  name: ${pack.identity?.name}`);
console.log(`  colors: ${JSON.stringify(pack.colors)}`);
console.log(`  headline: ${pack.landing?.headline?.slice(0, 90)}`);
