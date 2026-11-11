import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = {
  widget: {
    source: "../cr-sdk/packages/embed-chat/dist/widget.js",
    target: "public/embed/widget.js",
  },
  "lead-capture": {
    source: "../cr-sdk/packages/sdk/dist/lead-capture.browser.js",
    target: "public/embed/lead-capture.js",
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
