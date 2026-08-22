#!/usr/bin/env node

/**
 * Run only tests owned by a fork.
 *
 * A fork's sync policy and its parent Git tree are the ownership source of
 * truth. Tests that already exist in the parent are starter tests and are
 * intentionally excluded unless CR_RUN_PARENT_TESTS=1 is set. New tests in a
 * fork, and explicitly preserved test paths, remain in the fork test set.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scope = process.argv.includes("--backend") ? "backend" : "frontend";
const configPath = resolve(root, ".fork-sync.json");

function runAllTests() {
  if (scope === "frontend") {
    execFileSync("pnpm", ["exec", "vitest", "run"], {
      cwd: resolve(root, "frontend"),
      stdio: "inherit",
    });
  } else {
    execFileSync("uv", ["run", "python", "-m", "pytest"], {
      cwd: resolve(root, "backend"),
      stdio: "inherit",
    });
  }
}

function fail(message) {
  console.error(`fork-tests: ${message}`);
  process.exit(1);
}

function git(...args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    fail(error.stderr?.toString().trim() || `git ${args.join(" ")} failed`);
  }
}

if (!existsSync(configPath)) {
  console.log("fork-tests: parent repository; running the full parent suite");
  runAllTests();
  process.exit(0);
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch (error) {
  fail(`cannot read ${configPath}: ${error.message}`);
}

const remote = config.parent?.remote;
const branch = config.parent?.branch;
if (!remote || !branch) fail(".fork-sync.json has no parent remote and branch");

const parentRef = `${remote}/${branch}`;
try {
  git("rev-parse", "--verify", parentRef);
} catch {
  fail(`parent ref ${parentRef} is unavailable; run make sync-parent-check first`);
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

const preserveMatchers = (config.policy?.preserve ?? []).map(globRegExp);
const prefix = `${scope}/`;
const testMatcher =
  scope === "frontend"
    ? /__tests__\/.*\.test\.(?:ts|tsx)$/
    : /(?:^|\/)test_[^/]+\.py$|(?:^|\/)test[^/]*\.py$/;
const currentFiles = git("ls-files", prefix)
  .split("\n")
  .filter((path) => path && testMatcher.test(path));
const parentFiles = new Set(
  git("ls-tree", "-r", "--name-only", parentRef, "--", prefix)
    .split("\n")
    .filter(Boolean),
);

const isStarterProject = config.projectType?.endsWith("-starter");
const allForkTests = currentFiles.filter(
  (path) => !parentFiles.has(path) || preserveMatchers.some((matcher) => matcher.test(path)),
);
const testFiles =
  process.env.CR_RUN_PARENT_TESTS === "1" || isStarterProject
    ? currentFiles
    : allForkTests;

console.log(`fork-tests: ${scope} parent=${parentRef}`);
console.log(
  process.env.CR_RUN_PARENT_TESTS === "1" || isStarterProject
    ? `fork-tests: running all ${testFiles.length} tracked test file(s)`
    : `fork-tests: running ${testFiles.length} fork-owned test file(s); ` +
        `excluded ${currentFiles.length - testFiles.length} parent test file(s)`,
);

if (testFiles.length === 0) {
  console.log("fork-tests: no fork-owned tests; typecheck and build remain required");
  process.exit(0);
}

const relativeFiles = testFiles.map((path) => path.slice(prefix.length));
if (scope === "frontend") {
  execFileSync(
    "pnpm",
    ["exec", "vitest", "run", "--passWithNoTests", "--maxWorkers=2", ...relativeFiles],
    { cwd: resolve(root, "frontend"), stdio: "inherit" },
  );
} else {
  execFileSync("uv", ["run", "python", "-m", "pytest", ...relativeFiles], {
    cwd: resolve(root, "backend"),
    stdio: "inherit",
  });
}
