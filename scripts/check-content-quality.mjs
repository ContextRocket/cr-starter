import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const roots = [
  "content/posts",
  "src/i18n/messages",
];
const extensions = new Set([".astro", ".html", ".md", ".mdx", ".ts", ".tsx"]);
const violations = [];

async function visit(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    const fullPath = join(path, entry.name);
    if (entry.isDirectory()) await visit(fullPath);
    else if (extensions.has(extname(entry.name))) {
      const source = await readFile(fullPath, "utf8");
      source.split(/\r?\n/).forEach((line, index) => {
        if (line.includes("—")) {
          violations.push(`${relative(process.cwd(), fullPath)}:${index + 1}`);
        }
      });
    }
  }
}

for (const root of roots) await visit(root);

if (violations.length) {
  console.error("Editorial copy contains an em dash (—):");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error("Rewrite the sentence with ordinary punctuation, then review it against the source content.");
  process.exitCode = 1;
} else {
  console.log("Content quality check passed (no em dashes in editorial surfaces).");
}
