#!/usr/bin/env node

/**
 * Restore parent-owned files in a fork without merging the repository trees.
 *
 * Each fork declares its parent and ownership boundary in .fork-sync.json.
 * Project-owned content, theme, assets, and route composition are preserved.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, ".fork-sync.json");
const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const check = args.has("--check") || !apply;

if (args.has("--help") || args.has("-h")) {
  console.log("Usage: node scripts/sync-parent.mjs [--check|--apply]");
  console.log("  --check  report parent-owned drift (default)");
  console.log("  --apply  restore parent-owned files and stage the result");
  process.exit(0);
}

function fail(message) {
  console.error(`sync-parent: ${message}`);
  process.exit(1);
}

function git(...gitArgs) {
  try {
    return execFileSync("git", gitArgs, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trimEnd();
  } catch (error) {
    fail(error.stderr?.toString().trim() || `git ${gitArgs.join(" ")} failed`);
  }
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch (error) {
  fail(`cannot read ${configPath}: ${error.message}`);
}

if (!config.parent?.remote || !config.parent?.url || !config.parent?.branch) {
  fail(".fork-sync.json must define parent.remote, parent.url, and parent.branch");
}

const syncPatterns = config.policy?.sync;
if (!Array.isArray(syncPatterns) || syncPatterns.length === 0) {
  fail(".fork-sync.json must define a non-empty policy.sync array");
}

function globRegExp(pattern) {
  let expression = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    const next = pattern[index + 1];
    if (character === "*" && next === "*") {
      if (pattern[index + 2] === "/") {
        expression += "(?:.*/)?";
        index += 2;
      } else {
        expression += ".*";
        index += 1;
      }
    } else if (character === "*") {
      expression += "[^/]*";
    } else if (character === "?") {
      expression += "[^/]";
    } else {
      expression += character.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(`${expression}$`);
}

const matchers = syncPatterns.map(globRegExp);
const preserveMatchers = (config.policy.preserve ?? []).map(globRegExp);
const matchesPolicy = (path) =>
  matchers.some((matcher) => matcher.test(path)) &&
  !preserveMatchers.some((matcher) => matcher.test(path));

/**
 * Content is intentionally fork-owned, so Git synchronization cannot restore
 * it from the parent. Validate the configured Markdown collection before a
 * sync starts; otherwise a parent path migration can leave a fork with a
 * healthy-looking config and a build that cannot discover its posts.
 */
function validateBlogContentDirectory() {
  const siteConfigPath = resolve(root, "frontend/config/site.json");
  let siteData;
  try {
    siteData = JSON.parse(readFileSync(siteConfigPath, "utf8"));
  } catch {
    return;
  }

  if (siteData.features?.blog === false) return;

  const blogConfigPath = resolve(root, "frontend/blog.config.mjs");
  if (!existsSync(blogConfigPath)) return;

  const source = readFileSync(blogConfigPath, "utf8");
  const configured =
    /^\s*contentDir\s*:\s*["']([^"']+)["']\s*,?\s*$/m.exec(source)?.[1] ??
    "content/posts";
  const relativeDir = configured
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "") || "content/posts";
  const candidates = [
    resolve(root, "frontend", relativeDir),
    resolve(root, relativeDir),
    resolve(root, "..", relativeDir),
  ];

  if (!candidates.some((candidate) => existsSync(candidate))) {
    const legacyDir = resolve(root, "content/blog");
    const hint = existsSync(legacyDir)
      ? ` Legacy content exists at ${legacyDir}; move it to the configured directory.`
      : " Add at least one Markdown post or disable the blog feature.";
    fail(
      `blog is enabled but its configured Markdown directory ${relativeDir} is missing.${hint}`,
    );
  }
}

validateBlogContentDirectory();

if (git("status", "--porcelain")) {
  fail("the worktree must be clean before synchronization; commit or stash local changes first");
}

const remote = config.parent.remote;
const branch = config.parent.branch;
let remoteUrl;
try {
  remoteUrl = execFileSync("git", ["remote", "get-url", remote], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
} catch {
  git("remote", "add", remote, config.parent.url);
  remoteUrl = config.parent.url;
  console.log(`sync-parent: added fetch remote ${remote} (${remoteUrl})`);
}

console.log(`sync-parent: using parent remote ${remote} (${remoteUrl})`);
git("fetch", "--prune", remote, branch);
const parentRef = `${remote}/${branch}`;
git("rev-parse", "--verify", parentRef);

function treeMap(ref) {
  const output = git("ls-tree", "-r", "--format=%(objectname)\t%(path)", ref);
  const entries = new Map();
  for (const line of output.split("\n")) {
    if (!line) continue;
    const separator = line.indexOf("\t");
    if (separator !== -1) {
      entries.set(line.slice(separator + 1), line.slice(0, separator));
    }
  }
  return entries;
}

const parentTree = treeMap(parentRef);
const targetTree = treeMap("HEAD");
const parentFiles = [...parentTree.keys()].filter(matchesPolicy).sort();
const targetFiles = [...targetTree.keys()].filter(matchesPolicy).sort();
const changes = parentFiles.filter(
  (path) => targetTree.get(path) !== parentTree.get(path),
);
const localOnly = targetFiles.filter((path) => !parentTree.has(path));

console.log(`project type: ${config.projectType || "unspecified"}`);
console.log(`parent: ${parentRef}`);
console.log(`parent-owned files considered: ${parentFiles.length}`);

if (changes.length === 0 && localOnly.length === 0) {
  console.log("sync-parent: no parent-owned drift detected");
  process.exit(0);
}

if (changes.length > 0) {
  console.log(`${apply ? "restoring" : "drift"}:`);
  for (const path of changes) console.log(`  ${path}`);
}

if (localOnly.length > 0) {
  console.log("fork-only files under a parent pattern (preserved):");
  for (const path of localOnly) console.log(`  ${path}`);
}

if (check) process.exit(changes.length > 0 ? 1 : 0);

if (changes.length > 0) {
  git("restore", "--source", parentRef, "--staged", "--worktree", "--", ...changes);
  console.log(`sync-parent: restored and staged ${changes.length} parent-owned file(s)`);
}
