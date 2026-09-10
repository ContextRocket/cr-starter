/**
 * LEGAL-001 / LEGAL-002 / LEGAL-003 — identity completeness decisions.
 */
import { describe, expect, it } from "vitest";
import {
  PENDING_REGISTRATION,
  isLegalIdentityPlaceholder,
} from "@/lib/legal-completeness";
import { given, scenario, thenStep, when } from "../../support/bdd";

scenario("LEGAL-001 company identity completeness", () => {
  it("treats a full Spanish-style company as complete", async () => {
    const input = given("a complete company identity", () => ({
      entityType: "company" as const,
      entity: "ContextRocket SL",
      address: "Calle de Serrano 41, 28001 Madrid, Spain",
      register: "Registro Mercantil de Madrid, Tomo 00000, Folio 00, Hoja M-000000",
      vat: "ESB00000000",
      representedBy: "Jane Doe",
      contactEmail: "hello@example.com",
    }));

    let incomplete = true;
    await when("completeness is evaluated", () => {
      incomplete = isLegalIdentityPlaceholder(input);
    });

    await thenStep("the identity is complete", () => {
      expect(incomplete).toBe(false);
    });
  });

  it("treats PENDING_REGISTRATION as a present registry", async () => {
    const incomplete = isLegalIdentityPlaceholder({
      entityType: "company",
      entity: "ContextRocket SL",
      address: "Calle de Serrano 41, 28001 Madrid, Spain",
      register: PENDING_REGISTRATION,
      vat: "ESB00000000",
      representedBy: "Jane Doe",
    });
    expect(incomplete).toBe(false);
  });

  it("flags a missing VAT as incomplete for companies", () => {
    expect(
      isLegalIdentityPlaceholder({
        entityType: "company",
        entity: "ContextRocket SL",
        address: "Calle de Serrano 41, 28001 Madrid, Spain",
        register: "Registro Mercantil de Madrid",
        vat: "",
        representedBy: "Jane Doe",
      }),
    ).toBe(true);
  });

  it("flags the legacy GmbH placeholder entity as incomplete", () => {
    expect(
      isLegalIdentityPlaceholder({
        entityType: "company",
        entity: "ContextRocket Starter GmbH",
        address: "Calle de Serrano 41, 28001 Madrid, Spain",
        register: "Registro Mercantil de Madrid",
        vat: "ESB00000000",
        representedBy: "Jane Doe",
      }),
    ).toBe(true);
  });
});

scenario("LEGAL-002 individual needs name and contact only", () => {
  it("does not require registry or VAT", () => {
    expect(
      isLegalIdentityPlaceholder({
        entityType: "individual",
        entity: "Alex Example",
        contactEmail: "alex@example.com",
      }),
    ).toBe(false);
  });
});

scenario("LEGAL-003 unincorporated needs trading name, person, contact", () => {
  it("is complete without registry or VAT", () => {
    expect(
      isLegalIdentityPlaceholder({
        entityType: "unincorporated",
        entity: "Example Trading",
        representedBy: "Alex Example",
        contactEmail: "alex@example.com",
      }),
    ).toBe(false);
  });

  it("is incomplete without a responsible person", () => {
    expect(
      isLegalIdentityPlaceholder({
        entityType: "unincorporated",
        entity: "Example Trading",
        contactEmail: "alex@example.com",
      }),
    ).toBe(true);
  });
});
