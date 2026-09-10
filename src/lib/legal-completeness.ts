/**
 * Pure completeness check for the legal identity block.
 *
 * Returns true when a field required for the declared entity type is missing
 * (or still matches a legacy shipped placeholder). Requirements differ by
 * entity type:
 *
 *   - company:        entity + address + represented-by + registry entry + VAT.
 *                     A registry entry of PENDING_REGISTRATION counts as present
 *                     (a company awaiting registration is a legitimate state).
 *   - individual:     a name (entity) + a contact. Registry and VAT are NOT
 *                     required.
 *   - unincorporated: a trading name (entity) + a responsible person + a
 *                     contact. Registry and VAT are NOT required.
 *
 * This module has no framework or config imports so it stays trivially unit
 * testable. Legal pages render boilerplate identity without yellow notices;
 * forks can still use this helper for tooling or checks.
 */

import type { LegalEntityType } from "@/config/site.config";

/**
 * Sentinel a company that is incorporated-but-not-yet-registered can put in its
 * `register` field. It renders a "registration pending" marker instead of a
 * number and is treated as COMPLETE for the placeholder-warning helper -- a
 * pending registration is a real, legitimate state, not a missing field.
 */
export const PENDING_REGISTRATION = "PENDING_REGISTRATION";

/** The identity fields relevant to the completeness decision. */
export interface LegalCompletenessInput {
  entityType: LegalEntityType;
  entity?: string;
  address?: string;
  register?: string;
  vat?: string;
  representedBy?: string;
  /** The site's contact email (individual/unincorporated require a contact). */
  contactEmail?: string;
}

/** Legacy shipped entity string; kept so older forks still detect incompleteness. */
const PLACEHOLDER_ENTITY = "ContextRocket Starter GmbH";

function isPresent(value: string | undefined): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.includes("PLACEHOLDER")) return false;
  return true;
}

/** A registry entry is present when it is a real value OR explicitly pending. */
function hasRegistry(register: string | undefined): boolean {
  if (register === PENDING_REGISTRATION) return true;
  return isPresent(register);
}

/**
 * True when the legal identity is missing values required for the declared
 * entity type.
 */
export function isLegalIdentityPlaceholder(
  input: LegalCompletenessInput,
): boolean {
  const entityMissing =
    !isPresent(input.entity) || input.entity === PLACEHOLDER_ENTITY;
  if (entityMissing) return true;

  if (input.entityType === "individual") {
    // A natural person needs a name + a contact. No registry, no VAT.
    return !isPresent(input.contactEmail);
  }

  if (input.entityType === "unincorporated") {
    // A trading name needs a responsible person + a contact. No registry/VAT.
    return !isPresent(input.representedBy) || !isPresent(input.contactEmail);
  }

  // Company: full incorporated identity is required (registry may be pending).
  return (
    !isPresent(input.address) ||
    !isPresent(input.representedBy) ||
    !hasRegistry(input.register) ||
    !isPresent(input.vat)
  );
}
