import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = {
  widget: {
    source: "../cr-sdk/packages/embed-chat/dist/widget.js",
    target: "public/embed/widget.js",
  },
  "contact-form": {
    source: "../cr-sdk/packages/sdk/dist/contact-form.browser.js",
    target: "public/embed/contact-form.js",
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
