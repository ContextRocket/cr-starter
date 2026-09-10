#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const featuresRoot = join(process.cwd(), "features");
const behaviorFiles = [];

function collect(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      collect(path);
    } else if (entry === "BEHAVIOR.md") {
      behaviorFiles.push(path);
    }
  }
}

if (statSync(featuresRoot, { throwIfNoEntry: false })?.isDirectory()) {
  collect(featuresRoot);
}

const seen = new Map();
const headingPattern = /^#{2,3}\s+([A-Z][A-Z0-9-]*-\d+)\b/gm;

for (const file of behaviorFiles) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(headingPattern)) {
    const id = match[1];
    const line = content.slice(0, match.index).split("\n").length;
    const locations = seen.get(id) ?? [];
    locations.push(`${relative(process.cwd(), file)}:${line}`);
    seen.set(id, locations);
  }
}

const duplicates = [...seen.entries()].filter(([, locations]) => locations.length > 1);

if (duplicates.length > 0) {
  console.error("Duplicate behavior IDs:");
  for (const [id, locations] of duplicates) {
    console.error(`  ${id}: ${locations.join(", ")}`);
  }
  process.exit(1);
}

console.log(
  `Behavior IDs unique: ${seen.size} across ${behaviorFiles.length} contracts.`,
);
