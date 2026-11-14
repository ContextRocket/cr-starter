/**
 * Importing a published `cr.theme.v1` bundle into a fork (scripts/import-theme.mjs).
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, it } from "vitest";
import { given, scenario, thenStep, when } from "../support/bdd";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function variant(mode: "light" | "dark", canvas: string, ink: string) {
  const tokens: Record<string, string> = {};
  for (const surface of ["--background", "--card", "--popover", "--muted", "--primary", "--primary-hover",
    "--brand-accent", "--brand-accent-hover", "--secondary", "--tertiary", "--border"]) {
    tokens[surface] = canvas;
  }
  for (const text of ["--foreground", "--card-foreground", "--popover-foreground", "--muted-foreground",
    "--primary-foreground", "--brand-accent-foreground", "--secondary-foreground", "--tertiary-foreground",
    "--text-secondary", "--text-tertiary", "--ring", "--nav-ink"]) {
    tokens[text] = ink;
  }
  return {
    mode,
    tokens,
    radius: mode === "dark" ? "0.25rem" : "1rem",
    typography: [],
    nav: null,
    coverage: { score: 1, band: "full" },
    warnings: [],
    missing_tokens: [],
  };
}

function themeBundle(dir: string, schemaVersion = "cr.theme.v1") {
  const light = variant("light", "#ffffff", "#000000");
  const dark = variant("dark", "#000000", "#ffffff");
  mkdirSync(path.join(dir, "marks"), { recursive: true });
  mkdirSync(path.join(dir, "icons"), { recursive: true });
  writeFileSync(path.join(dir, "marks/01-logo.trimmed.png"), "logo-bytes");
  writeFileSync(path.join(dir, "icons/favicon.svg"), "<svg/>");
  writeFileSync(
    path.join(dir, "icons/manifest.json"),
    JSON.stringify({ files: [{ path: "icons/favicon.svg", bytes: 6 }] }),
  );
  writeFileSync(
    path.join(dir, "theme.json"),
    JSON.stringify({
      schema_version: schemaVersion,
      default: "light",
      site_mode: "dark",
      variants: { light, dark },
      ...light,
      marks: [{ role: "logo", url: "https://example.com/logo.png", files: { trimmed: "01-logo.trimmed.png" } }],
      fallback_wordmark: null,
      icons: "icons/manifest.json",
    }),
  );
}

let scratch: string;
let sitePath: string;
let publicDir: string;

function runImport(bundle: string) {
  return spawnSync(
    process.execPath,
    ["scripts/import-theme.mjs", "--from", bundle, "--config", sitePath, "--public", publicDir],
    { cwd: root, encoding: "utf8" },
  );
}

beforeEach(() => {
  mkdirSync(path.join(root, "scratchpad"), { recursive: true });
  scratch = mkdtempSync(path.join(root, "scratchpad/import-theme-"));
  sitePath = path.join(scratch, "site.json");
  publicDir = path.join(scratch, "public");
  const site = JSON.parse(readFileSync(path.join(root, "config/site.json"), "utf8"));
  site.theme.tokens["--fork-only"] = "#123456";
  writeFileSync(sitePath, `${JSON.stringify(site, null, 2)}\n`);
});

afterEach(() => rmSync(scratch, { recursive: true, force: true }));

scenario("a fork imports a published theme for its own site", () => {
  it("applies the site variant and brand files without touching fork-owned fields, idempotently", async () => {
    const bundle = given("a bundle whose site is dark while its default is light", () => {
      const dir = path.join(scratch, "bundle");
      themeBundle(dir);
      return dir;
    });

    await when("the fork imports it", () => {
      assert.equal(runImport(bundle).status, 0);
    });

    await thenStep("the site variant, the marks and the icons are applied", () => {
      const site = JSON.parse(readFileSync(sitePath, "utf8"));
      assert.equal(site.theme.tokens["--background"], "#000000");
      assert.equal(site.theme.radius, "0.25rem");
      assert.equal(site.theme.tokens["--fork-only"], "#123456");
      assert.equal(site.company.name, "ContextRocket");
      assert.equal(site.assets.logo, "/theme/marks/01-logo.trimmed.png");
      assert.equal(site.assets.faviconIco, "/theme/icons/favicon.svg");
      assert.equal(site.assets.icon192, "");
      assert.ok(existsSync(path.join(publicDir, "theme/marks/01-logo.trimmed.png")));
      assert.ok(existsSync(path.join(publicDir, "theme/icons/favicon.svg")));
    });

    await thenStep("importing the same theme again changes nothing", () => {
      const before = readFileSync(sitePath, "utf8");
      assert.equal(runImport(bundle).status, 0);
      assert.equal(readFileSync(sitePath, "utf8"), before);
    });
  });

  it("refuses a document that is not cr.theme.v1 and writes nothing", async () => {
    const bundle = given("a bundle with another schema version", () => {
      const dir = path.join(scratch, "other");
      themeBundle(dir, "cr.theme.v0");
      return dir;
    });
    const before = readFileSync(sitePath, "utf8");

    await thenStep("the import fails and the fork is unchanged", () => {
      assert.notEqual(runImport(bundle).status, 0);
      assert.equal(readFileSync(sitePath, "utf8"), before);
      assert.ok(!existsSync(path.join(publicDir, "theme")));
    });
  });
});
