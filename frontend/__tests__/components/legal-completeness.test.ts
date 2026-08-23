/**
 * Tests for components/shared/legal/legal-completeness.ts
 *
 * The placeholder warning must fire ONLY when a field REQUIRED for the declared
 * entity type is missing. Absence of a company-only field (VAT / registry) on an
 * individual or unincorporated brand is NOT a placeholder. A company with a
 * PENDING_REGISTRATION registry entry is complete.
 */

import { isLegalIdentityPlaceholder } from "@/components/shared/legal/legal-completeness";
import { PENDING_REGISTRATION } from "@/components/shared/legal/legal-identity-block";

describe("isLegalIdentityPlaceholder", () => {
  describe("company", () => {
    const complete = {
      entityType: "company" as const,
      entity: "Acme GmbH",
      address: "Main St 1, Berlin",
      register: "HRB 12345, Amtsgericht Berlin",
      vat: "DE123456789",
      representedBy: "Jane Doe",
      contactEmail: "hi@acme.example",
    };

    it("is complete when every company field is present", () => {
      expect(isLegalIdentityPlaceholder(complete)).toBe(false);
    });

    it("is complete when the registry is PENDING_REGISTRATION", () => {
      expect(
        isLegalIdentityPlaceholder({
          ...complete,
          register: PENDING_REGISTRATION,
        }),
      ).toBe(false);
    });

    it("is a placeholder when the registry is missing (and not pending)", () => {
      expect(
        isLegalIdentityPlaceholder({ ...complete, register: undefined }),
      ).toBe(true);
    });

    it("is a placeholder when VAT is missing", () => {
      expect(isLegalIdentityPlaceholder({ ...complete, vat: undefined })).toBe(
        true,
      );
    });

    it("is a placeholder when the shipped starter entity is unchanged", () => {
      expect(
        isLegalIdentityPlaceholder({
          ...complete,
          entity: "ContextRocket Starter GmbH",
        }),
      ).toBe(true);
    });
  });

  describe("individual", () => {
    const person = {
      entityType: "individual" as const,
      entity: "Jane Doe",
      contactEmail: "jane@example.com",
    };

    it("is complete with just a name + contact (no VAT/registry needed)", () => {
      expect(isLegalIdentityPlaceholder(person)).toBe(false);
    });

    it("is NOT a placeholder merely because VAT/registry are absent", () => {
      expect(
        isLegalIdentityPlaceholder({
          ...person,
          vat: undefined,
          register: undefined,
        }),
      ).toBe(false);
    });

    it("is a placeholder when the contact is missing", () => {
      expect(
        isLegalIdentityPlaceholder({ ...person, contactEmail: undefined }),
      ).toBe(true);
    });

    it("is a placeholder when the name is missing", () => {
      expect(isLegalIdentityPlaceholder({ ...person, entity: "" })).toBe(true);
    });
  });

  describe("unincorporated", () => {
    const venture = {
      entityType: "unincorporated" as const,
      entity: "Corner Studio",
      representedBy: "Sam Smith",
      contactEmail: "hello@corner.example",
    };

    it("is complete with a trading name + responsible person + contact", () => {
      expect(isLegalIdentityPlaceholder(venture)).toBe(false);
    });

    it("is NOT a placeholder merely because VAT/registry are absent", () => {
      expect(
        isLegalIdentityPlaceholder({
          ...venture,
          vat: undefined,
          register: undefined,
        }),
      ).toBe(false);
    });

    it("is a placeholder without a responsible person", () => {
      expect(
        isLegalIdentityPlaceholder({ ...venture, representedBy: undefined }),
      ).toBe(true);
    });

    it("is a placeholder without a contact", () => {
      expect(
        isLegalIdentityPlaceholder({ ...venture, contactEmail: undefined }),
      ).toBe(true);
    });
  });
});
