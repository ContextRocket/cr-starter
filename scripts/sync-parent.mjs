#!/usr/bin/env node

/**
 * Restore parent-owned files in a fork without merging the repository trees.
 *
 * Each fork declares its parent and ownership boundary in .fork-sync.json.
 * Project-owned content, theme, assets, and route composition are preserved.
 *
 * Two sources for the parent tree:
 *   - default: fetch from the configured GitHub remote (parent.remote/url).
 *   - --from-local[=<path>]: fetch from a LOCAL sibling parent checkout, so a
 *     change made locally in the parent propagates without pushing to GitHub
 *     first. Git accepts a filesystem path as a fetch source and fetches the
 *     objects with no network.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, ".fork-sync.json");

const argv = process.argv.slice(2);
const args = new Set(argv);
const apply = args.has("--apply");
const check = args.has("--check") || !apply;
const stash = args.has("--stash");

// --from-local may appear bare (--from-local) or valued (--from-local=<path>).
const fromLocalArg = argv.find(
  (arg) => arg === "--from-local" || arg.startsWith("--from-local="),
);
const fromLocal = fromLocalArg !== undefined;
const fromLocalValue =
  fromLocalArg && fromLocalArg.includes("=")
    ? fromLocalArg.slice(fromLocalArg.indexOf("=") + 1)
    : "";

if (args.has("--help") || args.has("-h")) {
  console.log("Usage: node scripts/sync-parent.mjs [--check|--apply] [--from-local[=<path>]] [--stash]");
  console.log("");
  console.log("  --check              report parent-owned drift (default; read-only,");
  console.log("                       runs even on a dirty worktree)");
  console.log("  --apply              restore parent-owned files and stage the result");
  console.log("                       (requires a clean worktree unless --stash is used)");
  console.log("  --from-local[=<path>]  fetch the parent tree from a LOCAL sibling checkout");
  console.log("                       instead of the GitHub remote (no push needed).");
  console.log("                       Path resolves in order: the --from-local value,");
  console.log("                       parent.localPath in .fork-sync.json, else a sibling");
  console.log("                       directory derived from parent.url.");
  console.log("  --stash              (with --apply) git stash local changes before the");
  console.log("                       restore and pop them afterwards, so --apply works on");
  console.log("                       a dirty worktree");
  process.exit(0);
}

// Track a stash we created so every exit path restores it.
let stashCreated = false;

function popStashIfNeeded() {
  if (!stashCreated) return;
  stashCreated = false;
  try {
    execFileSync("git", ["stash", "pop"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    console.log("sync-parent: restored stashed local changes (git stash pop)");
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    console.error(
      "sync-parent: could not automatically pop the stash; resolve manually: git stash pop",
    );
    if (detail) console.error(`sync-parent: git reported: ${detail}`);
  }
}

function fail(message) {
  console.error(`sync-parent: ${message}`);
  popStashIfNeeded();
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
const forceSyncMatchers = (config.policy.forceSync ?? []).map(globRegExp);
const matchesPolicy = (path) =>
  matchers.some((matcher) => matcher.test(path)) &&
  (!preserveMatchers.some((matcher) => matcher.test(path)) ||
    forceSyncMatchers.some((matcher) => matcher.test(path)));

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

// A dirty worktree only blocks --apply (which restores files over the tree).
// --check is read-only, so it runs regardless. --apply may proceed on a dirty
// tree when --stash is passed (we stash, restore, then always pop).
const dirty = Boolean(git("status", "--porcelain"));
if (dirty && apply && !stash) {
  fail(
    "the worktree must be clean before --apply; commit your changes, or re-run " +
      "with --stash to stash and restore them automatically",
  );
}

const branch = config.parent.branch;
let parentRef;
let parentDescription;

/**
 * Resolve the local sibling parent checkout path, in priority order:
 *   1. an explicit --from-local=<path> value
 *   2. parent.localPath from .fork-sync.json
 *   3. a sibling directory derived from parent.url basename
 */
function resolveLocalParentPath() {
  if (fromLocalValue) return resolve(root, fromLocalValue);
  if (config.parent.localPath) return resolve(root, config.parent.localPath);
  const urlBase = basename(config.parent.url).replace(/\.git$/, "");
  return resolve(root, "..", urlBase);
}

if (fromLocal) {
  const localParentPath = resolveLocalParentPath();
  if (!existsSync(localParentPath)) {
    fail(
      `local parent checkout not found at ${localParentPath}; pass ` +
        "--from-local=<path> or set parent.localPath in .fork-sync.json",
    );
  }
  console.log(`sync-parent: using LOCAL parent checkout ${localParentPath}`);
  // Git accepts a filesystem path as a fetch source; this fetches objects with
  // no network, so a change made locally in the parent needs no push first.
  git("fetch", localParentPath, branch);
  parentRef = "FETCH_HEAD";
  parentDescription = `${localParentPath} (${branch}, local)`;
} else {
  const remote = config.parent.remote;
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
  parentRef = `${remote}/${branch}`;
  git("rev-parse", "--verify", parentRef);
  parentDescription = parentRef;
}

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
console.log(`parent: ${parentDescription}`);
console.log(`parent-owned files considered: ${parentFiles.length}`);

if (changes.length === 0 && localOnly.length === 0) {
  console.log("sync-parent: no parent-owned drift detected");
  process.exit(0);
}

if (changes.length > 0) {
  console.log(`${apply ? "restoring" : "drifted parent-owned files"}:`);
  for (const path of changes) console.log(`  ${path}`);
}

if (localOnly.length > 0) {
  console.log("fork-only files under a parent pattern (preserved):");
  for (const path of localOnly) console.log(`  ${path}`);
  fail(
    "fork-only files match policy.sync but are not listed in policy.preserve. " +
      "Add each path above to policy.preserve (or policy.forceSync if it should " +
      "be parent-owned) in .fork-sync.json before synchronizing, so a future " +
      "parent path migration cannot overwrite fork-owned code.",
  );
}

console.log(
  `SUMMARY: ${changes.length} parent-owned file(s) drifted, ${localOnly.length} fork-only`,
);

if (check) {
  if (changes.length > 0) {
    const localHint = fromLocal ? " --from-local" : "";
    console.log(
      `NEXT: run  node scripts/sync-parent.mjs --apply${localHint}  (then review & commit)`,
    );
  }
  process.exit(changes.length > 0 ? 1 : 0);
}

if (changes.length > 0) {
  if (stash && dirty) {
    git("stash", "push", "--include-untracked", "-m", "sync-parent auto-stash");
    stashCreated = true;
    console.log("sync-parent: stashed local changes (restored after sync)");
  }
  git("restore", "--source", parentRef, "--staged", "--worktree", "--", ...changes);
  console.log(`sync-parent: restored and staged ${changes.length} parent-owned file(s)`);
  popStashIfNeeded();
  console.log("NEXT: review the staged changes, then commit");
}
