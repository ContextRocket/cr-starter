/** Build canonical typed API URLs for a configured ContextRocket identity. */
export type CRSubjectKind = "company" | "person";

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
