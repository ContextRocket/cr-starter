/**
 * Central URL scheme guard for links that originate in agent/platform
 * metadata (citation source refs, provenance URLs) or any other
 * externally-supplied string that is opened with window.open or rendered
 * as an anchor href.
 *
 * Only absolute http: and https: URLs are allowed. Everything else --
 * javascript:, data:, vbscript:, blob:, relative strings, malformed
 * input -- returns null and must not be opened or rendered as a link.
 */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // Relative or malformed: no safe absolute target to open.
    return null;
  }

  if (parsed.protocol === "http:" || parsed.protocol === "https:") {
    return url;
  }
  return null;
}
