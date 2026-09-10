export type LegalKind = "privacy" | "terms" | "cookies" | "impressum";

export function legalKinds(impressumEnabled: boolean): LegalKind[] {
  const kinds: LegalKind[] = ["privacy", "terms", "cookies"];
  if (impressumEnabled) kinds.push("impressum");
  return kinds;
}
