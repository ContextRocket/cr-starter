/**
 * Pure completeness check for the legal identity block.
 *
 * The placeholder warning on the legal pages must fire ONLY when a field that is
 * REQUIRED for the DECLARED entity type is missing (or is still the shipped
 * starter placeholder). Requirements differ by entity type:
 *
 *   - company:        entity + address + represented-by + registry entry + VAT.
 *                     A registry entry of PENDING_REGISTRATION counts as present
 *                     (a company awaiting registration is a legitimate state,
 *                     not a placeholder).
 *   - individual:     a name (entity) + a contact. Registry and VAT are NOT
 *                     required, so an individual is complete without them --
 *                     absence of VAT is NOT a placeholder.
 *   - unincorporated: a trading name (entity) + a responsible person + a
 *                     contact. Registry and VAT are NOT required.
 *
 * This module has no React or config imports so it stays trivially unit
 * testable and shared by every legal page.
 */

import { PENDING_REGISTRATION } from "./legal-identity-block";
import type { LegalEntityType } from "@/config/site.config";

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

/** The shipped starter placeholders that must be replaced before launch. */
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
 * True when the legal identity still needs real values for the declared entity
 * type (so the page should show the placeholder warning).
 */
export function isLegalIdentityPlaceholder(
  input: LegalCompletenessInput,
): boolean {
  const entityMissing = !isPresent(input.entity) || input.entity === PLACEHOLDER_ENTITY;
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
