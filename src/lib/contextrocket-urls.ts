/** Build canonical typed API URLs for a configured ContextRocket identity. */
export type ContextRocketSubjectKind = "company" | "person";

export function contextRocketIdentityUrl(
  apiBaseUrl: string,
  subjectKind: ContextRocketSubjectKind,
  handle: string,
  resource: "mcp" | "a2a" | "agent-card.json",
): string {
  const base = apiBaseUrl.replace(/\/$/, "");
  const identity = `/${subjectKind}/${encodeURIComponent(handle)}`;
  return `${base}${identity}/${resource}`;
}
