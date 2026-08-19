#!/usr/bin/env node
/**
 * Bundle the standalone embed widget to clients/embed-widget/dist/widget.js
 * (IIFE). The artifact is BUILT, never committed (dist/ is gitignored).
 *
 * Usage:  node build.mjs   (from clients/embed-widget/)
 * Or:     make build-clients   (builds both clients + copies the artifact into
 *         frontend/public/embed/ for local serving)
 *
 * The starter is the source home and the first customer workflow serves the
 * local/public copy. When CDN distribution is enabled, its release job runs
 * from this repository and publishes an immutable artifact to the existing
 * CDN widget/ prefix; the core dashboard only consumes verified release
 * metadata.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "dist/widget.js");
const publicFile = resolve(__dirname, "../../frontend/public/embed/widget.js");

mkdirSync(dirname(outFile), { recursive: true });
mkdirSync(dirname(publicFile), { recursive: true });

const result = await esbuild.build({
  entryPoints: [resolve(__dirname, "src/index.ts")],
  outfile: outFile,
  bundle: true,
  format: "iife",
  globalName: "ContextRocketWidget",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
});

if (result.errors.length > 0) {
  process.exit(1);
}

console.log(`Wrote ${outFile}`);
copyFileSync(outFile, publicFile);
console.log(`Copied ${publicFile}`);
