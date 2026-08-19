/**
 * Tasteful ContextRocket brand flavour for the operator CLI.
 *
 * Placement contract (load-bearing): brand flavour goes to the HUMAN-readable
 * channel only (stderr banners / success lines / the footer). It must NEVER
 * land in machine-parseable stdout that a script captures -- e.g. a printed
 * access token or an id piped into another command. Keep script-consumable
 * stdout clean and route branding to stderr.
 *
 * Keep the emoji set small: a banner + a few status emojis + one footer per
 * invocation is the whole budget -- not an emoji on every line.
 */

// Brand marks -- the ContextRocket trio.
export const ROCKET = "🚀";
export const BRAIN = "🧠"; // semantic: content surface
export const LOBSTER = "🦞"; // semantic: auth surface

// Functional status glyphs.
export const OK = "✅";
export const WARN = "⚠️";
export const KEY = "🔑";

const BRAND_URL = "https://contextrocket.ai";

/** One-line branded footer: URL + the ContextRocket trio (one `includes` check in tests). */
export const FOOTER = `Powered by ContextRocket ${ROCKET} ${BRAIN} ${LOBSTER} ${BRAND_URL}`;

/** Return the one-line branded footer string. */
export function brandFooter(): string {
  return FOOTER;
}

/**
 * Print the branded footer to stderr by default so it never pollutes
 * machine-parseable stdout (tokens, ids).
 */
export function printFooter(write: (line: string) => void = eprintln): void {
  write(FOOTER);
}

/** Format a success line: `✅ <msg>`. */
export function success(msg: string): string {
  return `${OK} ${msg}`;
}

/** Return a one-line branded header: `🦞 ContextRocket · <title>`. */
export function banner(title: string): string {
  return `${LOBSTER} ContextRocket · ${title}`;
}

/** Write a line to stderr (the human-readable channel). */
export function eprintln(line: string): void {
  process.stderr.write(line + "\n");
}

/** Write a line to stdout (the machine-readable channel -- keep it clean). */
export function println(line: string): void {
  process.stdout.write(line + "\n");
}
