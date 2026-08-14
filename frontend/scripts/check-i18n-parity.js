#!/usr/bin/env node
/**
 * check-i18n-parity.js
 *
 * AST-based parity check between en.ts and every other locale (es.ts, de.ts).
 *
 * Adapted from context-rocket/frontend/scripts/check-i18n-parity.js.
 *
 * For every non-English locale the check:
 *   1. Walks the locale's `export const <locale> = { ... }` object literal
 *      via the TypeScript Compiler API and collects every leaf path.
 *   2. Compares against en's leaf set:
 *        - `missing`:  keys in en but absent from the locale.
 *        - `orphan`:   keys in the locale but absent from en.
 *   3. Exits nonzero if either side has any drift.
 *
 * Usage:
 *   node frontend/scripts/check-i18n-parity.js            (all/merged -- default)
 *   node frontend/scripts/check-i18n-parity.js --domain app
 *   node frontend/scripts/check-i18n-parity.js --domain shared
 *   node frontend/scripts/check-i18n-parity.js --domain site
 *   (or from inside frontend/): node scripts/check-i18n-parity.js [...]
 *
 * OWNERSHIP DOMAINS (cr-x3j8): the tree is partitioned into shared/app/site
 * slices behind a merge barrel. --domain scopes the check to one slice:
 *   - app + shared (@eng)            STRICT tri-locale parity (fail on drift).
 *   - site (@content-owners)         MAY ship a locale subset: a non-en site
 *                                    locale that is missing keys WARNS, does
 *                                    not fail. Orphan keys still fail (a key in
 *                                    a locale but not en is always a bug).
 * The no-arg default checks the whole merged tree with strict parity, exactly
 * as before -- the pre-commit hook contract is unchanged.
 *
 * Exit codes:
 *   0  -- all checked locales are in parity (site missing-keys are warn-only)
 *   1  -- at least one locale has strict-scope missing or orphan keys, or
 *         failed to parse
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

// ---------------------------------------------------------------------------
// Ownership-domain partition (must stay in sync with i18n/messages/<domain>/).
// Maps a --domain flag to the top-level namespaces it owns.
// ---------------------------------------------------------------------------
const DOMAIN_NAMESPACES = {
  shared: ["form", "nav", "error", "locale", "breadcrumb", "pagination", "cookie"],
  app: ["auth", "dashboard", "dev", "chat", "embed"],
  site: ["home", "blog", "faq", "footer", "impressum", "privacy", "preview"],
};
// Domains whose non-en locales MAY be an incomplete subset (missing -> warn).
const SUBSET_DOMAINS = new Set(["site"]);

function parseArgs(argv) {
  let domain = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--domain") {
      domain = argv[i + 1];
      i++;
    } else if (argv[i].startsWith("--domain=")) {
      domain = argv[i].slice("--domain=".length);
    }
  }
  if (domain !== null && !DOMAIN_NAMESPACES[domain]) {
    console.error(
      `ERROR: unknown --domain "${domain}". Expected one of: ${Object.keys(DOMAIN_NAMESPACES).join(", ")}`,
    );
    process.exit(1);
  }
  return { domain };
}

const { domain: DOMAIN } = parseArgs(process.argv.slice(2));
// When a domain is scoped, only leaves under these top-level namespaces count.
const DOMAIN_PREFIXES = DOMAIN ? DOMAIN_NAMESPACES[DOMAIN] : null;
const SUBSET_MODE = DOMAIN ? SUBSET_DOMAINS.has(DOMAIN) : false;

/** Keep only leaf paths whose top-level namespace belongs to the active domain. */
function inDomain(leafPath) {
  if (!DOMAIN_PREFIXES) return true;
  const top = leafPath.split(".")[0];
  return DOMAIN_PREFIXES.includes(top);
}

// Resolve messages dir relative to this script, supporting both
// `node frontend/scripts/...` (from repo root) and
// `node scripts/...` (from inside frontend/).
const MESSAGES_DIR = (() => {
  const candidate1 = path.resolve(__dirname, "../i18n/messages");
  const candidate2 = path.resolve(__dirname, "../../frontend/i18n/messages");
  if (fs.existsSync(candidate1)) return candidate1;
  if (fs.existsSync(candidate2)) return candidate2;
  return candidate1; // will fail gracefully below
})();

const REFERENCE_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "es", "de"];
const CHECK_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== REFERENCE_LOCALE);

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

/**
 * Recursively walk an ObjectLiteralExpression and yield every leaf dot-path.
 * A "leaf" is a PropertyAssignment whose initializer is a StringLiteral,
 * NoSubstitutionTemplateLiteral, or ArrayLiteralExpression of string literals.
 *
 * @param {import("typescript").ObjectLiteralExpression} root
 * @returns {{ path: string, kind: "string"|"array" }[]}
 */
function collectLeaves(root) {
  const out = [];
  const walk = (node, parts) => {
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = propertyName(prop.name);
      if (name === null) continue;
      const value = prop.initializer;
      if (ts.isObjectLiteralExpression(value)) {
        walk(value, [...parts, name]);
      } else if (
        ts.isStringLiteral(value) ||
        ts.isNoSubstitutionTemplateLiteral(value)
      ) {
        out.push({ path: [...parts, name].join("."), kind: "string" });
      } else if (ts.isArrayLiteralExpression(value)) {
        const allString = value.elements.every(
          (el) =>
            ts.isStringLiteral(el) || ts.isNoSubstitutionTemplateLiteral(el),
        );
        if (allString) {
          out.push({ path: [...parts, name].join("."), kind: "array" });
        }
      }
    }
  };
  walk(root, []);
  return out;
}

/**
 * Read a message file and return the first exported object-literal declaration
 * (regardless of the const's name). Used to load a domain slice file such as
 * `shared/en.ts` (`export const sharedEn = { ... }`).
 *
 * @param {string} filePath
 * @returns {import("typescript").ObjectLiteralExpression}
 */
function loadObjectFromFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const stmt of sf.statements) {
    if (
      ts.isVariableStatement(stmt) &&
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          let init = decl.initializer;
          if (ts.isAsExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init)) return init;
        }
      }
    }
  }
  throw new Error(
    `Could not find an \`export const ... = { ... }\` object literal in ${filePath}`,
  );
}

// The domain slice files are the SOURCE OF TRUTH post-split: the per-locale
// barrel (<locale>.ts) is just a spread-merge of these three. We collect leaves
// from the slices directly so parity sees the real object literals.
const DOMAIN_ORDER = ["shared", "app", "site"];

/**
 * Collect every leaf dot-path for a locale by merging the three domain slices.
 *
 * @param {string} locale
 * @returns {{ path: string, kind: "string"|"array" }[]}
 */
function collectLocaleLeaves(locale) {
  const out = [];
  for (const domain of DOMAIN_ORDER) {
    const slicePath = path.join(MESSAGES_DIR, domain, `${locale}.ts`);
    out.push(...collectLeaves(loadObjectFromFile(slicePath)));
  }
  return out;
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isPrivateIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name))
    return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const referenceSharedSlice = path.join(
  MESSAGES_DIR,
  "shared",
  `${REFERENCE_LOCALE}.ts`,
);
if (!fs.existsSync(referenceSharedSlice)) {
  console.error(
    `ERROR: reference locale slices not found (expected ${referenceSharedSlice})`,
  );
  process.exit(1);
}

let referenceLeaves;
try {
  referenceLeaves = collectLocaleLeaves(REFERENCE_LOCALE);
} catch (err) {
  console.error(
    `ERROR: failed to parse ${REFERENCE_LOCALE}.ts: ${err.message}`,
  );
  process.exit(1);
}

const referencePaths = new Set(
  referenceLeaves.map((l) => l.path).filter(inDomain),
);
const SCOPE_LABEL = DOMAIN ? `domain=${DOMAIN}` : "all (merged tree)";
console.log(
  `Scope: ${SCOPE_LABEL}${SUBSET_MODE ? " (subset-tolerant: missing non-en keys WARN)" : ""}`,
);
console.log(
  `Reference locale: ${REFERENCE_LOCALE} (${referencePaths.size} leaf dot-paths)\n`,
);

let hasMismatch = false;

for (const locale of CHECK_LOCALES) {
  const sharedSlice = path.join(MESSAGES_DIR, "shared", `${locale}.ts`);
  if (!fs.existsSync(sharedSlice)) {
    console.error(`ERROR: missing locale slices for: ${locale}`);
    hasMismatch = true;
    continue;
  }

  let leaves;
  try {
    leaves = collectLocaleLeaves(locale);
  } catch (err) {
    console.error(`ERROR: failed to parse ${locale} slices: ${err.message}`);
    hasMismatch = true;
    continue;
  }

  const localePaths = new Set(leaves.map((l) => l.path).filter(inDomain));
  const missing = [...referencePaths].filter((p) => !localePaths.has(p)).sort();
  const orphan = [...localePaths].filter((p) => !referencePaths.has(p)).sort();

  if (missing.length === 0 && orphan.length === 0) {
    console.log(
      `ok ${locale}: in parity with ${REFERENCE_LOCALE} (${localePaths.size} leaf paths)`,
    );
    continue;
  }

  // Orphan keys (in a locale but not en) are ALWAYS a hard failure -- even for
  // subset-tolerant domains, an unknown key is a bug. Missing keys are a hard
  // failure for strict domains, but only a WARNING for subset domains (site),
  // which may ship an incomplete locale ahead of full translation.
  const missingIsFatal = !SUBSET_MODE;
  const localeFailed = orphan.length > 0 || (missingIsFatal && missing.length > 0);
  if (localeFailed) hasMismatch = true;

  const verb = localeFailed ? "FAIL" : "WARN";
  console.log(
    `${verb} ${locale}: ${localePaths.size} keys (en=${referencePaths.size}); ` +
      `missing=${missing.length}${missingIsFatal ? "" : " (warn-only)"}, orphan=${orphan.length}`,
  );
  const shown = missing.slice(0, 50);
  for (const k of shown) {
    console.log(`    ${missingIsFatal ? "MISSING" : "MISSING(warn)"}: ${k}`);
  }
  if (missing.length > shown.length) {
    console.log(`    ... (${missing.length - shown.length} more missing)`);
  }
  const shownOrphan = orphan.slice(0, 50);
  for (const k of shownOrphan) console.log(`    ORPHAN:  ${k}`);
  if (orphan.length > shownOrphan.length) {
    console.log(`    ... (${orphan.length - shownOrphan.length} more orphan)`);
  }
}

if (hasMismatch) {
  console.log(
    `\nFAIL: One or more locales are out of parity with en (scope: ${SCOPE_LABEL}). ` +
      `Add or remove keys to align them.`,
  );
  process.exit(1);
}

console.log(
  `\nPASS: All non-en locales are in parity with en (scope: ${SCOPE_LABEL}).`,
);
