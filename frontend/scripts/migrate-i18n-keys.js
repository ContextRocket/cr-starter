#!/usr/bin/env node
/**
 * i18n key migration: SCREAMING_SNAKE_CASE -> nested camelCase
 *
 * Mapping rule: first _-token is the namespace (lowercase); remaining
 * tokens become nested path segments (lowercase).
 *   HOME_CTA              -> home.cta
 *   AUTH_LOGIN_TITLE      -> auth.login.title
 *   DASHBOARD_CARD_CHAT_T -> dashboard.card.chat.title
 *
 * Special overrides for awkward keys:
 *   SITE_CONFIG_URL_WARNING -> dev.siteConfigUrlWarning
 *   ACCESSIBILITY_TYPING    -> chat.typing
 *
 * Regenerates i18n/messages/{en,es,de}.ts as nested objects and replaces
 * all t("OLD_KEY") call sites across app/, components/, hooks/, lib/, __tests__/.
 */

const fs = require("fs");
const path = require("path");

const FRONTEND = path.resolve(__dirname, "..");

const OVERRIDES = {
  SITE_CONFIG_URL_WARNING: "dev.siteConfigUrlWarning",
  ACCESSIBILITY_TYPING: "chat.typing",
  // Prefix collisions: parent key is itself a leaf value.
  CHAT_GROUNDED_CLAIMS_CHECKED: "chat.groundedClaimsChecked",
  CHAT_PLACEHOLDER_STREAMING: "chat.placeholderStreaming",
  CHAT_SOURCE_SHEET_OPEN_NEW_TAB: "chat.sourceSheet.openNewTab",
  FORM_PASSWORD_CONFIRM: "form.passwordConfirm",
  PRIVACY_CONSENT_BODY_AFTER_KEY: "privacy.consent.bodyAfterKey",
};

function parseKeys(file) {
  const src = fs.readFileSync(file, "utf8");
  const keys = new Map();
  const re = /^\s{2}([A-Z][A-Z_0-9]*):\s*(.*)$/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const key = m[1];
    let value = m[2].trim();
    // Multi-line string: collect continuation lines until the next key.
    if (value.startsWith('"') && !value.endsWith('",')) {
      let idx = m.index + m[0].length;
      const rest = src.slice(idx);
      const lines = rest.split("\n");
      for (const line of lines) {
        value += "\n" + line;
        if (line.trim().endsWith('",') || line.trim().endsWith('"')) break;
      }
    }
    // Strip trailing comma from single-line values.
    if (value.endsWith(",")) value = value.slice(0, -1);
    keys.set(key, value);
  }
  return keys;
}

/** Extract the pre-existing nested block (non-SCREAMING_SNAKE) from en.ts,
 *  e.g. the `locale: { labelEnglish: ... }` object, as raw text. */
function extractNestedBlock(file) {
  const src = fs.readFileSync(file, "utf8");
  const match = src.match(/export const \w+ = \{\n([\s\S]*?)\n\} as const;/);
  if (!match) return "";
  const body = match[1];
  // Collect top-level blocks that are NOT SCREAMING_SNAKE keys.
  const blocks = [];
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const nestedMatch = line.match(/^  ([a-z][a-zA-Z0-9]*): \{$/);
    if (nestedMatch) {
      // Find the matching closing brace at the same indent.
      let depth = 0;
      let j = i;
      let block = [];
      do {
        block.push(lines[j]);
        depth += (lines[j].match(/\{/g) || []).length;
        depth -= (lines[j].match(/\}/g) || []).length;
        j++;
      } while (depth > 0 && j < lines.length);
      blocks.push(block.join("\n"));
      i = j;
      continue;
    }
    i++;
  }
  return blocks.join("\n");
}

function toPath(key) {
  if (OVERRIDES[key]) return OVERRIDES[key];
  const parts = key.split("_").map((p) => p.toLowerCase());
  return parts.join(".");
}

function setPath(obj, pathStr, value) {
  const segs = pathStr.split(".");
  let cur = obj;
  for (let i = 0; i < segs.length - 1; i++) {
    const s = segs[i];
    if (!cur[s]) cur[s] = {};
    cur = cur[s];
  }
  cur[segs[segs.length - 1]] = value;
}

function buildNested(keys) {
  const obj = {};
  for (const [key, value] of keys) {
    setPath(obj, toPath(key), value);
  }
  return obj;
}

function toTS(obj, indent) {
  const pad = " ".repeat(indent);
  if (typeof obj !== "object" || obj === null) {
    // Values are already TS literals (quoted strings). Keep as-is.
    return obj;
  }
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    lines.push(pad + k + ": " + toTS(v, indent + 2));
  }
  return "{\n" + lines.join(",\n") + "\n" + " ".repeat(indent - 2) + "}";
}

function rewriteMessageFile(file, keys) {
  const nested = buildNested(keys);
  const body = toTS(nested, 2);
  const header = fs.readFileSync(file, "utf8").split("export const")[0];
  const varName = path.basename(file, ".ts");
  // Preserve pre-existing nested blocks (e.g. locale labels) by appending
  // them as top-level siblings inside the object.
  const legacy = extractNestedBlock(file);
  const combined = legacy ? body.slice(0, -1) + ",\n" + legacy + "\n}" : body;
  fs.writeFileSync(file, header + `export const ${varName} = ${combined} as const;\n`);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function main() {
  // Parse en.ts keys (source of truth).
  const enKeys = parseKeys(path.join(FRONTEND, "i18n/messages/en.ts"));
  const mapping = new Map();
  for (const key of enKeys.keys()) mapping.set(key, toPath(key));

  console.log(`Found ${mapping.size} keys in en.ts`);

  // Regenerate the three locale files.
  for (const locale of ["en", "es", "de"]) {
    const file = path.join(FRONTEND, `i18n/messages/${locale}.ts`);
    const keys = parseKeys(file);
    rewriteMessageFile(file, keys);
    console.log(`Rewrote i18n/messages/${locale}.ts (${keys.size} keys)`);
  }

  // Replace call sites in all source files.
  const files = [
    ...walk(path.join(FRONTEND, "app")),
    ...walk(path.join(FRONTEND, "components")),
    ...walk(path.join(FRONTEND, "hooks")),
    ...walk(path.join(FRONTEND, "lib")),
    ...walk(path.join(FRONTEND, "__tests__")),
  ];

  // Sort keys longest-first to avoid prefix collisions.
  const sorted = [...mapping.entries()].sort((a, b) => b[0].length - a[0].length);
  let totalReplacements = 0;
  for (const file of files) {
    let src = fs.readFileSync(file, "utf8");
    let changed = false;
    for (const [oldKey, newPath] of sorted) {
      const pattern = new RegExp(`t\\("${oldKey}"\\)`, "g");
      if (pattern.test(src)) {
        src = src.replace(pattern, `t("${newPath}")`);
        changed = true;
        totalReplacements++;
      }
    }
    // translateError keys stay SCREAMING_SNAKE (backend raw keys) — untouched.
    if (changed) fs.writeFileSync(file, src);
  }
  console.log(`Updated ${totalReplacements} call sites`);

  // Update MessageKey type in keys.ts.
  const keysTs = path.join(FRONTEND, "i18n/keys.ts");
  let keysSrc = fs.readFileSync(keysTs, "utf8");
  keysSrc = keysSrc.replace(
    /export type MessageKey = keyof typeof en;/,
    "// Nested message paths: t(\"auth.login.title\"). Typed by string literal union.\nexport type MessageKey = string;",
  );
  fs.writeFileSync(keysTs, keysSrc);
  console.log("Updated MessageKey type (now string — nested paths are untyped)");

  // Write the mapping for reference.
  const mapLines = [...mapping.entries()]
    .sort()
    .map(([k, v]) => `${k} -> ${v}`)
    .join("\n");
  fs.writeFileSync(path.join(FRONTEND, "i18n/key-mapping.md"), "# SCREAMING_SNAKE -> camelCase\n\n" + mapLines + "\n");
  console.log("Wrote i18n/key-mapping.md");
}

main();
