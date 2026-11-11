import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = {
  widget: {
    source: "../cr-sdk/packages/embed-chat/dist/widget.js",
    packageJson: "../cr-sdk/packages/embed-chat/package.json",
    target: "public/embed/widget.js",
    key: "chat",
    packageName: "@contextrocket/embed-chat",
  },
  "contact-form": {
    source: "../cr-sdk/packages/sdk/dist/contact-form.browser.js",
    packageJson: "../cr-sdk/packages/sdk/package.json",
    target: "public/embed/contact-form.js",
    key: "contactForm",
    packageName: "@contextrocket/sdk",
    declaration: "../cr-sdk/packages/sdk/dist/contact-form.d.ts",
    declarationTarget: "src/types/contextrocket-contact-form.d.ts",
  },
};

const name = process.argv[2];
const artifact = artifacts[name];
if (!artifact) {
  throw new Error(
    `Unknown embed artifact "${name}". Expected: ${Object.keys(artifacts).join(", ")}`,
  );
}

const source = resolve(root, artifact.source);
const target = resolve(root, artifact.target);
if (!existsSync(source)) {
  throw new Error(
    `Missing ${source}. Build the matching package in a sibling ../cr-sdk checkout first.`,
  );
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`Copied ${source} -> ${target}`);

const packageJsonPath = resolve(root, artifact.packageJson);
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
if (
  packageJson.name !== artifact.packageName ||
  typeof packageJson.version !== "string"
) {
  throw new Error(`Unexpected package identity in ${packageJsonPath}`);
}

const manifestPath = resolve(root, "public/embed/artifact-manifest.json");
let manifest = {
  schemaVersion: 1,
  sourceRepository: "ContextRocket/cr-sdk",
  artifacts: {},
};
if (existsSync(manifestPath)) manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (
  manifest.schemaVersion !== 1 ||
  !manifest.artifacts ||
  typeof manifest.artifacts !== "object"
) {
  throw new Error(`Invalid embed artifact manifest: ${manifestPath}`);
}
const bytes = readFileSync(target);
manifest.artifacts[artifact.key] = {
  package: packageJson.name,
  version: packageJson.version,
  file: artifact.target.replace("public/", ""),
  bytes: bytes.length,
  sha256: createHash("sha256").update(bytes).digest("hex"),
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Updated ${manifestPath}`);

if (artifact.declaration) {
  const declarationSource = resolve(root, artifact.declaration);
  const declarationTarget = resolve(root, artifact.declarationTarget);
  if (!existsSync(declarationSource)) {
    throw new Error(`Missing ${declarationSource}. Build the SDK package first.`);
  }
  mkdirSync(dirname(declarationTarget), { recursive: true });
  const declaration = readFileSync(declarationSource, "utf8")
    .replace(/\n?\/\/# sourceMappingURL=.*\n?$/, "\n");
  writeFileSync(declarationTarget, declaration);
  console.log(`Copied ${declarationSource} -> ${declarationTarget}`);
}
