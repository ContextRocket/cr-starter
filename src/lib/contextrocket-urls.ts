/** Build canonical typed API URLs for a configured ContextRocket identity. */
export type CRSubjectKind = "company" | "person";

/** Build the public, typed Grounding Page URL for a configured identity. */
export function crGroundingPageUrl(
  subjectKind: CRSubjectKind,
  handle: string,
  publicOrigin = "https://contextrocket.com",
): string {
  if (!handle.trim()) throw new TypeError("A ContextRocket handle is required.");
  const base = publicOrigin.replace(/\/+$/, "");
  return `${base}/${subjectKind}/${encodeURIComponent(handle)}/facts`;
}

export function crIdentityUrl(
  apiBaseUrl: string,
  subjectKind: CRSubjectKind,
  handle: string,
  resource: "mcp" | "a2a" | "agent-card.json",
): string {
  if (!handle.trim()) throw new TypeError("A ContextRocket handle is required.");
  const base = apiBaseUrl.replace(/\/+$/, "");
  const identity = `/${subjectKind}/${encodeURIComponent(handle)}`;
  return `${base}${identity}/${resource}`;
}
