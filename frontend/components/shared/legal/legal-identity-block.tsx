/**
 * LegalIdentityBlock -- the config-driven controller / Impressum identity block.
 *
 * Not every brand is an incorporated company. This renderer supports the full
 * entity-type spectrum declared in siteConfig.legal.entityType:
 *
 *   - "company"        legal name + legal form + registered address +
 *                      represented-by + registry entry + VAT. A company that is
 *                      awaiting registration renders a PENDING_REGISTRATION
 *                      marker instead of a registry number, which is legitimate.
 *   - "individual"     the natural person's name + contact (+ address where
 *                      provided). NO registry entry, NO VAT.
 *   - "unincorporated" the trading name + the responsible natural person +
 *                      contact, plus an explicit "not a registered company"
 *                      line. NO registry entry, NO VAT.
 *
 * The block is a pure presentation component: it reads a typed `legal` shape and
 * a contact email, and renders `<dt>/<dd>` rows via the shared `legal.identity`
 * i18n namespace. Pages pass siteConfig.legal + siteConfig.contactEmail.
 *
 * Server Component: it calls the synchronous t() from @/i18n/keys, so the
 * hosting page must have called setLocale(locale) first (every legal page does).
 */

import { t } from "@/i18n/keys";
import type { LegalEntityType } from "@/config/site.config";

/**
 * The identity fields this block reads. Only `entity`, `entityType`, and a
 * contact are always meaningful; `register`/`vat`/`representedBy`/`address`
 * apply to some entity types and may be absent for others.
 */
export interface LegalIdentity {
  entityType: LegalEntityType;
  /** Legal name (company), person's name (individual), or trading name. */
  entity: string;
  address?: string;
  /** Company registry entry. Company-only; may be absent when pending. */
  register?: string;
  /** VAT identifier. Company-only. */
  vat?: string;
  /** Legal form (e.g. GmbH, Ltd). Company-only, optional. */
  legalForm?: string;
  /** Person authorized to represent the entity. Company-only, optional. */
  representedBy?: string;
}

/**
 * Sentinel a company that is incorporated-but-not-yet-registered can put in its
 * `register` field. It renders a "registration pending" marker instead of a
 * number and is treated as COMPLETE for the placeholder-warning helper -- a
 * pending registration is a real, legitimate state, not a missing field.
 */
export const PENDING_REGISTRATION = "PENDING_REGISTRATION";

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="text-muted-foreground whitespace-pre-line">{value}</dd>
    </div>
  );
}

export function LegalIdentityBlock({
  legal,
  contactEmail,
}: {
  legal: LegalIdentity;
  contactEmail: string;
}) {
  const contactRow = (
    <div>
      <dt className="font-semibold">{t("legal.identity.contact")}</dt>
      <dd className="text-muted-foreground">
        <a href={`mailto:${contactEmail}`} className="hover:underline">
          {contactEmail}
        </a>
      </dd>
    </div>
  );

  if (legal.entityType === "individual") {
    // A natural person: name + contact, and address where provided. No registry,
    // no VAT.
    return (
      <dl className="space-y-4" data-testid="legal-identity-individual">
        <IdentityRow
          label={t("legal.identity.responsiblePerson")}
          value={legal.entity}
        />
        {legal.address ? (
          <IdentityRow label={t("legal.identity.address")} value={legal.address} />
        ) : null}
        {contactRow}
      </dl>
    );
  }

  if (legal.entityType === "unincorporated") {
    // A trading name run by a responsible natural person. Explicit "not a
    // registered company" line; no registry, no VAT.
    return (
      <dl className="space-y-4" data-testid="legal-identity-unincorporated">
        <IdentityRow
          label={t("legal.identity.tradingName")}
          value={legal.entity}
        />
        {legal.representedBy ? (
          <IdentityRow
            label={t("legal.identity.responsiblePerson")}
            value={legal.representedBy}
          />
        ) : null}
        {legal.address ? (
          <IdentityRow label={t("legal.identity.address")} value={legal.address} />
        ) : null}
        {contactRow}
        <p className="text-sm text-muted-foreground" data-testid="legal-not-registered">
          {t("legal.identity.notRegisteredCompany")}
        </p>
      </dl>
    );
  }

  // Default: company. Full incorporated identity block.
  return (
    <dl className="space-y-4" data-testid="legal-identity-company">
      <IdentityRow label={t("legal.identity.entity")} value={legal.entity} />
      {legal.legalForm ? (
        <IdentityRow
          label={t("legal.identity.legalForm")}
          value={legal.legalForm}
        />
      ) : null}
      {legal.address ? (
        <IdentityRow label={t("legal.identity.address")} value={legal.address} />
      ) : null}
      {legal.representedBy ? (
        <IdentityRow
          label={t("legal.identity.representedBy")}
          value={legal.representedBy}
        />
      ) : null}
      <IdentityRow
        label={t("legal.identity.register")}
        value={
          legal.register === PENDING_REGISTRATION
            ? t("legal.identity.pendingRegistration")
            : (legal.register ?? t("legal.identity.pendingRegistration"))
        }
      />
      {legal.vat ? (
        <IdentityRow label={t("legal.identity.vat")} value={legal.vat} />
      ) : null}
      {contactRow}
    </dl>
  );
}
