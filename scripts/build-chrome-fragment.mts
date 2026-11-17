#!/usr/bin/env node
// Build the pinned chrome header fragment from the REAL chrome component.
//
// This is the one maintenance entry point for the Grounding Page chrome
// artifact (backend app/modules/composition/grounding_page/chrome_artifact/).
// It renders src/components/chrome/Navbar.astro through a throwaway Astro
// build (scripts/chrome-fragment/), extracts the rendered <header>, keeps the
// exact compiled Tailwind rules that header consumes, scopes them under
// .cr-chrome so the Grounding page's own stylesheet cannot touch them (and
// vice versa), and pins a receipt reusing the generated-page renderer pins.
//
// Usage: node --experimental-strip-types scripts/build-chrome-fragment.mts OUT_DIR
// The backend re-pins the three emitted files whenever the chrome changes.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rendererPins } from "./generated-page/build.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fragmentDir = join(root, "scripts/chrome-fragment");

const outDir = process.argv[2];
if (!outDir) {
  console.error("Usage: build-chrome-fragment.mts OUT_DIR");
  process.exitCode = 2;
  process.exit(process.exitCode);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function inventoryHash(dir) {
  const files = await readdir(dir, { recursive: true });
  const entries = [];
  for (const file of files.sort()) {
    const path = join(dir, file);
    if ((await stat(path)).isFile()) entries.push(`${file}:${sha256(await readFile(path))}`);
  }
  return sha256(entries.join("\n"));
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function splitTopLevel(value, separator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "(" || character === "[") depth += 1;
    else if (character === ")" || character === "]") depth -= 1;
    else if (character === separator && depth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}

type CssNode =
  | { type: "rule"; selectors: string[]; body: string }
  | { type: "at"; name: string; prelude: string; children: CssNode[]; rawBody: string };

function parseCss(css) {
  const nodes = [];
  let index = 0;
  while (index < css.length) {
    const preludeStart = index;
    while (index < css.length && css[index] !== "{" && css[index] !== ";") index += 1;
    const prelude = css.slice(preludeStart, index).trim();
    if (index >= css.length) break;
    if (css[index] === ";") {
      index += 1;
      continue; // at-statements without blocks carry no fragment rules
    }
    index += 1;
    let depth = 1;
    const bodyStart = index;
    while (index < css.length && depth > 0) {
      if (css[index] === "{") depth += 1;
      else if (css[index] === "}") depth -= 1;
      index += 1;
    }
    const body = css.slice(bodyStart, index - 1);
    const nameMatch = prelude.match(/^@([A-Za-z-]+)/);
    if (nameMatch) {
      nodes.push({ type: "at", name: nameMatch[1], prelude, children: parseCss(body), rawBody: body });
    } else if (prelude) {
      nodes.push({ type: "rule", selectors: splitTopLevel(prelude, ",").map((s) => s.trim()), body: body.trim() });
    }
  }
  return nodes;
}

function classTokensInSelector(selector) {
  const tokens = [];
  for (const match of selector.matchAll(/\.((?:[^.,\s>~+:[\\)]|\\.)+)/g)) {
    tokens.push(match[1].replace(/\\(.)/g, "$1"));
  }
  return tokens;
}

// The Grounding page stylesheet defines these on :root (compiler._style +
// grounding_page_nav_css); the chrome fragment may reference them.
const GROUNDING_ROOT_VARS = new Set([
  "--canvas", "--text", "--muted", "--primary", "--border",
  "--font-body", "--font-heading",
  "--nav-surface", "--nav-ink", "--nav-muted", "--nav-line",
]);

// The chrome token bridge: the starter's Tailwind semantics re-anchored onto
// the Grounding page tokens. Fallbacks are the cr-starter light defaults.
const BRIDGE = `.cr-chrome{--background:var(--canvas,#fff);--foreground:var(--text,#111);--muted-foreground:var(--muted,#5e616b);--muted:color-mix(in srgb,currentcolor 6%,transparent);--primary-foreground:#fff;--ring:var(--primary,#14151a);--card:var(--canvas,#fff);--color-background:var(--background);--color-foreground:var(--foreground);--color-muted:var(--muted);--color-muted-foreground:var(--muted-foreground);--color-primary:var(--primary,#14151a);--color-primary-foreground:var(--primary-foreground);--color-ring:var(--ring);--color-border:var(--border,#e4e1d9);--color-card:var(--card);--color-input:var(--border,#e4e1d9)}`;

function scopeAndCollect(nodes, fragmentClasses, rootClasses, kept) {
  for (const node of nodes) {
    if (node.type === "rule") {
      const matched = node.selectors.filter((selector) =>
        classTokensInSelector(selector).some((token) => fragmentClasses.has(token)),
      );
      if (!matched.length) {
        // Keep the theme/variable :root rules the kept utilities resolve
        // against — minus every name the Grounding page defines on :root
        // itself, where the page's own token wins and the chrome must not
        // override it globally.
        const rootOnly = node.selectors.every((selector) => /^:(root|host)$/.test(selector.trim()));
        if (rootOnly) {
          kept.push(
            `${node.selectors.join(",")}{${splitTopLevel(node.body, ";").filter((declaration) => {
              const name = declaration.match(/(--[A-Za-z0-9-]+)\s*:/)?.[1];
              return name && !GROUNDING_ROOT_VARS.has(name);
            }).join(";")}}`,
          );
        }
        continue;
      }
      const scoped = matched.map((selector) => {
        const tokens = classTokensInSelector(selector);
        const onRoot = tokens.length > 0 && tokens.every((token) => rootClasses.has(token));
        return (onRoot ? ".cr-chrome" : ".cr-chrome ") + selector;
      });
      kept.push(`${scoped.join(",")}{${node.body}}`);
    } else if (node.name === "property") {
      // @property bodies are declarations, not rules; keep them whole so the
      // tw-* runtime vars the kept utilities reference still register.
      kept.push({ at: node.prelude, inner: [node.rawBody.trim()] });
    } else if (node.name === "media" || node.name === "supports") {
      const inner = [];
      scopeAndCollect(node.children, fragmentClasses, rootClasses, inner);
      if (inner.length) kept.push({ at: `${node.prelude}`, inner });
    } else if (node.name === "layer") {
      scopeAndCollect(node.children, fragmentClasses, rootClasses, kept);
    }
    // Everything else (theme :root blocks, keyframes, unknown at-rules) is
    // intentionally dropped: the bridge above carries the chrome semantics.
  }
}

async function main() {
  // 1. Build the throwaway page that renders the real Navbar.
  await rm(join(fragmentDir, "dist"), { recursive: true, force: true });
  execFileSync(
    process.execPath,
    [join(root, "node_modules", "astro", "astro.js"), "build", "--config", "scripts/chrome-fragment/astro.config.mjs"],
    { cwd: root, stdio: "inherit" },
  );

  // 2. Extract the rendered header and the class set it carries.
  const page = await readFile(join(fragmentDir, "dist", "chrome-header", "index.html"), "utf8");
  const headerStart = page.indexOf("<header");
  const headerEnd = page.indexOf("</header>") + "</header>".length;
  if (headerStart < 0 || headerEnd <= headerStart) {
    throw new Error("chrome fragment build produced no <header> element");
  }
  const headerHtml = page.slice(headerStart, headerEnd);
  const openTag = headerHtml.slice(0, headerHtml.indexOf(">") + 1);
  const rootClasses = new Set(
    (openTag.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean),
  );
  if (!rootClasses.has("cr-chrome")) {
    throw new Error("the rendered header lost its cr-chrome scope class");
  }
  const fragmentClasses = new Set(
    headerHtml.match(/class="([^"]*)"/g).flatMap((attr) => attr.slice(7, -1).split(/\s+/)).filter(Boolean),
  );

  // 3. Keep exactly the compiled rules those classes consume.
  const stylesheetNames = [...page.matchAll(/href="([^"]*\.css)"/g)].map((m) => m[1]);
  const cssParts = [];
  for (const name of stylesheetNames) {
    cssParts.push(await readFile(join(fragmentDir, "dist", name.replace(/^\/?/, "").replace(/^\.\.\//g, "")), "utf8"));
  }
  const nodes = parseCss(stripComments(cssParts.join("\n")));
  const kept = [];
  scopeAndCollect(nodes, fragmentClasses, rootClasses, kept);
  // Keep only the @property registrations the kept utilities actually use.
  const usedTwVars = new Set();
  for (const entry of kept) {
    if (typeof entry !== "string") continue;
    for (const reference of entry.matchAll(/var\((--tw-[A-Za-z0-9-]+)/g)) {
      usedTwVars.add(reference[1]);
    }
  }
  const parts = [];
  for (const entry of kept) {
    if (typeof entry === "string") parts.push(entry);
    else if (entry.at.startsWith("@property")) {
      const name = entry.at.match(/@property\s+(--[\w-]+)/)?.[1];
      if (name && usedTwVars.has(name)) parts.push(`${entry.at}{${entry.inner.join("")}}`);
    } else parts.push(`${entry.at}{${entry.inner.join("")}}`);
  }
  const chromeCss = `${parts.join("")}\n${BRIDGE}\n`;

  // 4. Fail loudly if a var() reference would resolve to nothing in a
  // Grounding page (which defines GROUNDING_ROOT_VARS on :root and the bridge
  // on .cr-chrome).
  const defined = new Set(GROUNDING_ROOT_VARS);
  for (const declaration of chromeCss.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)) defined.add(declaration[1]);
  for (const property of chromeCss.matchAll(/@property\s+(--[A-Za-z0-9-]+)/g)) defined.add(property[1]);
  const undefinedVars = new Set();
  for (const reference of chromeCss.matchAll(/var\((--[A-Za-z0-9-]+)(,[^()]*(?:\([^()]*\)[^()]*)*)?\)/g)) {
    if (!defined.has(reference[1]) && reference[2] === undefined) undefinedVars.add(reference[1]);
  }
  if (undefinedVars.size) {
    throw new Error(`chrome fragment references undefined vars: ${[...undefinedVars].join(", ")}`);
  }

  // 5. Pin the artifact + a receipt reusing the generated-page renderer pins.
  const pins = await rendererPins();
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "header.html"), `${headerHtml}\n`);
  await writeFile(join(outDir, "chrome.css"), chromeCss);
  const receipt = {
    schema_version: "chrome_fragment.v1",
    starter_revision: pins.starterRevision,
    starter_source_sha256: pins.starterSourceSha256,
    chrome_sha256: pins.chromeSha256,
    starter_version: pins.starterVersion,
    header_sha256: sha256(headerHtml),
    css_sha256: sha256(chromeCss),
  };
  await writeFile(join(outDir, "receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(
    JSON.stringify({ header_sha256: receipt.header_sha256, css_sha256: receipt.css_sha256, chrome_sha256: receipt.chrome_sha256, starter_source_sha256: receipt.starter_source_sha256 }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
