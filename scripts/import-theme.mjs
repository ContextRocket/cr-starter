#!/usr/bin/env node
/**
 * Import a published ContextRocket theme (`cr.theme.v1`) into this site.
 *
 *   node scripts/import-theme.mjs --org <handle>        # https://<handle>.cdn.contextrocket.com/theme/
 *   node scripts/import-theme.mjs --from <dir|theme.json>  # a local theme bundle
 *   ... [--dry-run] [--config <site.json>] [--public <dir>]
 *
 * The import applies the variant for the site itself (`site_mode`, else
 * `default`), merges its tokens and radius into `theme` in config/site.json,
 * and points the brand marks and icon set in `assets` at copies under
 * `public/theme/`. The import owns `public/theme/`; every other field stays
 * fork-owned. The candidate config passes scripts/validate-theme.mjs before
 * anything is written. Running it again with the same theme changes nothing.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptsDir, "..");

const SCHEMA_VERSION = "cr.theme.v1";
const MODES = ["light", "dark"];
const REQUIRED_TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--primary",
  "--muted",
  "--muted-foreground",
  "--border",
  "--ring",
];
/** `public/` subdirectory the import owns, and its URL prefix. */
const THEME_DIR = "theme";
/**
 * The bundle's icon set, keyed by the `assets` field that renders it. A raster
 * source yields every file; an SVG source yields only `favicon.svg`.
 */
const ICON_ASSETS = {
  faviconIco: ["favicon.ico", "favicon.svg"],
  icon16: ["favicon-16x16.png"],
  icon32: ["favicon-32x32.png"],
  appleTouchIcon: ["apple-touch-icon.png"],
  icon192: ["icon-192.png"],
  icon512: ["icon-512.png"],
  icon192Maskable: ["icon-192-maskable.png"],
  icon512Maskable: ["icon-512-maskable.png"],
};
/** The mark file the site shows: the observed colours, trimmed when available. */
const SITE_MARK_FILES = ["trimmed", "saved"];

class ImportError extends Error {}

function usage() {
  return (
    "Usage: node scripts/import-theme.mjs (--org <handle> | --from <dir|theme.json>) " +
    "[--dry-run] [--config <site.json>] [--public <dir>]"
  );
}

function parseArgs(argv) {
  const options = { dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    const key = { "--org": "org", "--from": "from", "--config": "config", "--public": "public" }[flag];
    const value = argv[index + 1];
    if (!key || !value || value.startsWith("--")) throw new ImportError(usage());
    options[key] = value;
    index += 1;
  }
  if (Boolean(options.org) === Boolean(options.from)) throw new ImportError(usage());
  return options;
}

/** Where theme files come from: the org's CDN namespace or a local bundle. */
function themeSource(options) {
  if (options.org) {
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(options.org)) {
      throw new ImportError(`invalid org handle: ${options.org}`);
    }
    const base = `https://${options.org}.cdn.contextrocket.com/theme/`;
    return {
      label: base,
      async read(path) {
        const response = await fetch(new URL(path, base));
        if (!response.ok) throw new ImportError(`${base}${path}: HTTP ${response.status}`);
        return Buffer.from(await response.arrayBuffer());
      },
    };
  }
  const from = resolve(process.cwd(), options.from);
  if (!existsSync(from)) throw new ImportError(`no theme bundle at ${from}`);
  const isFile = statSync(from).isFile();
  const root = isFile ? dirname(from) : from;
  const documentName = isFile ? relative(root, from) : "theme.json";
  return {
    label: root,
    async read(path) {
      const file = join(root, path === "theme.json" ? documentName : path);
      if (!existsSync(file)) throw new ImportError(`theme bundle is missing ${path}`);
      return readFileSync(file);
    },
  };
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A bundle-relative file name the document may reference: no traversal. */
function safeName(value, where) {
  if (typeof value !== "string" || !/^[\w.-]+$/.test(value) || value.startsWith(".")) {
    throw new ImportError(`${where}: unsafe file name ${JSON.stringify(value)}`);
  }
  return value;
}

/** The `cr.theme.v1` fields this import reads, refused unless well-formed. */
function parseThemeDocument(raw) {
  let document;
  try {
    document = JSON.parse(raw.toString("utf8"));
  } catch {
    throw new ImportError("theme.json is not valid JSON");
  }
  if (!isRecord(document)) throw new ImportError("theme.json must be a JSON object");
  if (document.schema_version !== SCHEMA_VERSION) {
    throw new ImportError(
      `unsupported theme schema ${JSON.stringify(document.schema_version)}; expected ${SCHEMA_VERSION}`,
    );
  }
  for (const field of ["default", "site_mode"]) {
    if (!MODES.includes(document[field])) {
      throw new ImportError(`theme.json ${field} must be "light" or "dark"`);
    }
  }
  if (!isRecord(document.variants) || !isRecord(document.variants[document.default])) {
    throw new ImportError(`theme.json has no default variant ${JSON.stringify(document.default)}`);
  }
  for (const [mode, variant] of Object.entries(document.variants)) {
    if (!MODES.includes(mode) || !isRecord(variant) || variant.mode !== mode) {
      throw new ImportError(`theme.json variant ${JSON.stringify(mode)} is malformed`);
    }
    if (!isRecord(variant.tokens) || Object.values(variant.tokens).some((value) => typeof value !== "string")) {
      throw new ImportError(`theme.json variant ${mode} tokens must be strings`);
    }
    const missing = REQUIRED_TOKENS.filter((name) => !variant.tokens[name]);
    if (missing.length) {
      throw new ImportError(`theme.json variant ${mode} is missing tokens: ${missing.join(", ")}`);
    }
    if (typeof variant.radius !== "string" || !variant.radius) {
      throw new ImportError(`theme.json variant ${mode} has no radius`);
    }
    if (!Array.isArray(variant.warnings)) {
      throw new ImportError(`theme.json variant ${mode} warnings must be a list`);
    }
  }
  if (!Array.isArray(document.marks)) throw new ImportError("theme.json marks must be a list");
  for (const [index, mark] of document.marks.entries()) {
    if (!isRecord(mark) || typeof mark.role !== "string" || !isRecord(mark.files)) {
      throw new ImportError(`theme.json marks[${index}] is malformed`);
    }
    for (const name of Object.values(mark.files)) safeName(name, `marks[${index}]`);
  }
  if (document.fallback_wordmark !== null) safeName(document.fallback_wordmark, "fallback_wordmark");
  if (![undefined, null, "icons/manifest.json"].includes(document.icons)) {
    throw new ImportError(`theme.json icons must be "icons/manifest.json" or null`);
  }
  return document;
}

/** Same rule as ContextRocket's `variant_mode_for(purpose="site")`. */
function siteVariantMode(document) {
  return document.variants[document.site_mode] ? document.site_mode : document.default;
}

function siteMarkFile(mark) {
  const key = SITE_MARK_FILES.find((name) => mark.files[name]);
  return key ? mark.files[key] : undefined;
}

/** The files to place under public/theme/ and the `assets` fields that point at them. */
async function plannedAssets(source, document) {
  const files = new Map();
  const assets = {};
  const warnings = [];
  const place = async (bundlePath) => {
    files.set(bundlePath, await source.read(bundlePath));
    return `/${THEME_DIR}/${bundlePath}`;
  };

  const markPath = (role) => {
    const mark = document.marks.find((entry) => entry.role === role && siteMarkFile(entry));
    return mark ? `marks/${siteMarkFile(mark)}` : undefined;
  };
  const logo = markPath("logo");
  const wordmark = markPath("wordmark");
  const fallback = document.fallback_wordmark ?? undefined;
  const logoSource = logo ?? wordmark;
  const wordmarkSource = wordmark ?? fallback ?? logo;
  if (logoSource) assets.logo = await place(logoSource);
  if (wordmarkSource) assets.wordmark = await place(wordmarkSource);
  if (!logoSource && !wordmarkSource) {
    warnings.push("the theme has no usable logo or wordmark; assets.logo and assets.wordmark are unchanged");
  }

  if (document.icons) {
    let manifest;
    try {
      manifest = JSON.parse((await source.read(document.icons)).toString("utf8"));
    } catch (error) {
      if (error instanceof ImportError) throw error;
      throw new ImportError(`${document.icons} is not valid JSON`);
    }
    const listed = new Set((manifest.files ?? []).map((entry) => entry?.path));
    // The theme owns the whole icon set: a size it does not provide is cleared
    // (the layout skips an empty icon) rather than left as the fork's old icon.
    for (const [field, names] of Object.entries(ICON_ASSETS)) {
      const bundlePath = names.map((name) => `icons/${name}`).find((path) => listed.has(path));
      assets[field] = bundlePath ? await place(bundlePath) : "";
    }
    if (!assets.faviconIco) throw new ImportError(`${document.icons} lists no favicon`);
  } else {
    warnings.push("the theme has no icon set; the icon assets are unchanged");
  }
  return { files, assets, warnings };
}

function jsonLine(value) {
  return value === undefined ? "(unset)" : JSON.stringify(value);
}

function diffFields(label, before = {}, after = {}) {
  const lines = [];
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (before[key] === after[key]) continue;
    lines.push(`  ${label}.${key}: ${jsonLine(before[key])} -> ${jsonLine(after[key])}`);
  }
  return lines;
}

function listFiles(directory, prefix = "") {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(join(directory, entry.name), `${prefix}${entry.name}/`)
      : [`${prefix}${entry.name}`],
  );
}

function validateTheme(site) {
  const scratch = mkdtempSync(join(tmpdir(), "import-theme-"));
  try {
    const candidate = join(scratch, "site.json");
    writeFileSync(candidate, `${JSON.stringify(site, null, 2)}\n`);
    return spawnSync(process.execPath, [join(scriptsDir, "validate-theme.mjs"), "--config", candidate], {
      encoding: "utf8",
    });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const configPath = resolve(process.cwd(), options.config ?? join(repoRoot, "config/site.json"));
  const publicDir = resolve(process.cwd(), options.public ?? join(repoRoot, "public"));
  const themeDir = join(publicDir, THEME_DIR);
  const source = themeSource(options);

  const document = parseThemeDocument(await source.read("theme.json"));
  const mode = siteVariantMode(document);
  const variant = document.variants[mode];
  const planned = await plannedAssets(source, document);

  const siteText = readFileSync(configPath, "utf8");
  const site = JSON.parse(siteText);
  const next = structuredClone(site);
  next.theme = {
    ...next.theme,
    radius: variant.radius,
    tokens: { ...next.theme?.tokens, ...variant.tokens },
  };
  next.assets = { ...next.assets, ...planned.assets };
  const nextText = `${JSON.stringify(next, null, 2)}\n`;

  const configLines = [
    ...diffFields("theme", { radius: site.theme?.radius }, { radius: next.theme.radius }),
    ...diffFields("theme.tokens", site.theme?.tokens, next.theme.tokens),
    ...diffFields("assets", site.assets, next.assets),
  ];
  const existing = new Set(listFiles(themeDir));
  const fileLines = [];
  for (const [path, bytes] of planned.files) {
    const target = join(themeDir, path);
    if (!existing.has(path)) fileLines.push(`  + ${path}`);
    else if (!readFileSync(target).equals(bytes)) fileLines.push(`  ~ ${path}`);
  }
  const stale = [...existing].filter((path) => !planned.files.has(path));
  for (const path of stale) fileLines.push(`  - ${path}`);

  console.log(`import-theme: ${source.label} (${SCHEMA_VERSION}, site variant: ${mode})`);
  for (const warning of [...planned.warnings, ...variant.warnings.map((w) => `theme: ${w}`)]) {
    console.log(`import-theme: warning: ${warning}`);
  }
  const changed = nextText !== siteText || fileLines.length > 0;
  if (!changed) {
    console.log("import-theme: no changes");
    return;
  }
  if (configLines.length) console.log([relative(process.cwd(), configPath), ...configLines].join("\n"));
  if (fileLines.length) console.log([relative(process.cwd(), themeDir), ...fileLines].join("\n"));

  const validation = validateTheme(next);
  process.stdout.write(validation.stdout);
  if (validation.status !== 0) {
    process.stderr.write(validation.stderr);
    throw new ImportError("the imported theme fails theme validation; nothing was written");
  }
  if (options.dryRun) {
    console.log("import-theme: dry run; nothing was written");
    return;
  }

  for (const [path, bytes] of planned.files) {
    const target = join(themeDir, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  }
  for (const path of stale) rmSync(join(themeDir, path));
  if (nextText !== siteText) writeFileSync(configPath, nextText);
  console.log("import-theme: theme imported");
}

main().catch((error) => {
  if (!(error instanceof ImportError)) throw error;
  console.error(`import-theme: ${error.message}`);
  process.exit(1);
});
