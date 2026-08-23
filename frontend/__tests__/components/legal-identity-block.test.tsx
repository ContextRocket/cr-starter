/**
 * Tests for components/shared/legal/legal-identity-block.tsx
 *
 * The identity block renders on the entity-type spectrum. Assert behavior +
 * that i18n resolves (never literal translated copy):
 *   - company:        registry + VAT rows present; PENDING_REGISTRATION marker.
 *   - individual:     name + contact; NO registry, NO VAT.
 *   - unincorporated: trading name + responsible person + "not registered" line;
 *                     NO registry, NO VAT.
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

import {
  LegalIdentityBlock,
  PENDING_REGISTRATION,
} from "@/components/shared/legal/legal-identity-block";

describe("LegalIdentityBlock", () => {
  it("renders the full company identity (registry + VAT + represented-by)", () => {
    render(
      <LegalIdentityBlock
        legal={{
          entityType: "company",
          entity: "Acme GmbH",
          address: "Main St 1",
          register: "HRB 12345",
          vat: "DE123456789",
          representedBy: "Jane Doe",
        }}
        contactEmail="hi@acme.example"
      />,
    );

    expect(screen.getByTestId("legal-identity-company")).toBeInTheDocument();
    const dl = screen.getByTestId("legal-identity-company");
    expect(dl).toHaveTextContent("Acme GmbH");
    expect(dl).toHaveTextContent("HRB 12345");
    expect(dl).toHaveTextContent("DE123456789");
    expect(dl).toHaveTextContent("Jane Doe");
    expect(dl).toHaveTextContent("hi@acme.example");
  });

  it("shows a pending-registration marker instead of a registry number", () => {
    render(
      <LegalIdentityBlock
        legal={{
          entityType: "company",
          entity: "Acme GmbH",
          address: "Main St 1",
          register: PENDING_REGISTRATION,
          vat: "DE123456789",
          representedBy: "Jane Doe",
        }}
        contactEmail="hi@acme.example"
      />,
    );

    const dl = screen.getByTestId("legal-identity-company");
    // The raw sentinel must never leak to the UI; it renders as the localized
    // "registration pending" marker (i18n resolves to a non-empty string).
    expect(dl).not.toHaveTextContent(PENDING_REGISTRATION);
  });

  it("shows a pending marker for a not-yet-issued VAT, never the raw sentinel", () => {
    render(
      <LegalIdentityBlock
        legal={{
          entityType: "company",
          entity: "Acme GmbH",
          address: "Main St 1",
          register: PENDING_REGISTRATION,
          vat: PENDING_REGISTRATION,
          representedBy: "Jane Doe",
        }}
        contactEmail="hi@acme.example"
      />,
    );

    const dl = screen.getByTestId("legal-identity-company");
    // Neither the register nor the VAT row may leak the raw sentinel; both
    // resolve to the localized "registration pending" marker.
    expect(dl).not.toHaveTextContent(PENDING_REGISTRATION);
    expect(dl).toHaveTextContent("hi@acme.example");
  });

  it("renders the legal form row when provided", () => {
    render(
      <LegalIdentityBlock
        legal={{
          entityType: "company",
          entity: "Acme S.L.",
          legalForm: "Sociedad Limitada (S.L.)",
          address: "Calle Mayor 1",
          register: "TOMO 1",
          vat: "ESB123",
          representedBy: "Jane Doe",
        }}
        contactEmail="hi@acme.example"
      />,
    );

    const dl = screen.getByTestId("legal-identity-company");
    expect(dl).toHaveTextContent("Sociedad Limitada (S.L.)");
  });

  it("renders an individual with name + contact and NO registry/VAT", () => {
    render(
      <LegalIdentityBlock
        legal={{ entityType: "individual", entity: "Jane Doe" }}
        contactEmail="jane@example.com"
      />,
    );

    const dl = screen.getByTestId("legal-identity-individual");
    expect(dl).toHaveTextContent("Jane Doe");
    expect(dl).toHaveTextContent("jane@example.com");
    // No company-only rows.
    expect(screen.queryByTestId("legal-identity-company")).not.toBeInTheDocument();
  });

  it("renders an unincorporated venture with a not-registered line", () => {
    render(
      <LegalIdentityBlock
        legal={{
          entityType: "unincorporated",
          entity: "Corner Studio",
          representedBy: "Sam Smith",
        }}
        contactEmail="hello@corner.example"
      />,
    );

    const dl = screen.getByTestId("legal-identity-unincorporated");
    expect(dl).toHaveTextContent("Corner Studio");
    expect(dl).toHaveTextContent("Sam Smith");
    expect(dl).toHaveTextContent("hello@corner.example");
    // The explicit "not a registered company" line is present.
    expect(screen.getByTestId("legal-not-registered")).toBeInTheDocument();
    expect(screen.getByTestId("legal-not-registered").textContent).toBeTruthy();
  });
});
