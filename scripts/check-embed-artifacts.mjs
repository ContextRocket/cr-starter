#!/usr/bin/env node
/** Check that checked-in browser bundles match their recorded SDK provenance. */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = resolve(root, "public/embed/artifact-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const expected = {
  chat: "@contextrocket/embed-chat",
  contactForm: "@contextrocket/sdk",
  siteBehaviors: "@contextrocket/sdk",
};

if (
  manifest.schemaVersion !== 1 ||
  manifest.sourceRepository !== "ContextRocket/cr-sdk"
) {
  throw new Error("Unsupported or missing SDK artifact manifest metadata");
}

for (const [key, packageName] of Object.entries(expected)) {
  const artifact = manifest.artifacts?.[key];
  if (
    !artifact ||
    artifact.package !== packageName ||
    typeof artifact.version !== "string"
  ) {
    throw new Error(`Missing or invalid ${key} SDK artifact entry`);
  }
  const bytes = readFileSync(resolve(root, "public", artifact.file));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== artifact.bytes || sha256 !== artifact.sha256) {
    throw new Error(
      `${artifact.file} does not match its ${packageName}@${artifact.version} manifest entry`,
    );
  }
  console.log(
    `verified ${artifact.file} (${packageName}@${artifact.version}, ${bytes.length} bytes)`,
  );
}
