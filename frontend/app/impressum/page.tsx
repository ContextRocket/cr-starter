/**
 * Impressum page -- /impressum
 *
 * LEGAL NOTICE: An Impressum is LEGALLY REQUIRED for commercial websites
 * targeting Germany or any EU country under the Telemediengesetz (TMG)
 * and similar national laws. The placeholder values in site.config.legal
 * MUST be replaced with real legal information before launch.
 *
 * A page with placeholder text does not satisfy the legal requirement.
 * Consult your legal advisor for country-specific compliance.
 *
 * All field values are read from site.config.legal -- edit only that file.
 */

import { t } from "@/i18n/keys";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: t("IMPRESSUM_TITLE"),
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  const legal = siteConfig.legal;

  return (
    <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("IMPRESSUM_TITLE")}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {t("IMPRESSUM_LEGAL_NOTICE")}
      </p>

      {/* PLACEHOLDER WARNING -- visible in development to prompt replacement */}
      {legal.entity.includes("PLACEHOLDER") ||
      legal.entity === "ContextRocket Starter GmbH" ? (
        <div
          className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
          role="alert"
        >
          <strong>Developer notice:</strong> {t("IMPRESSUM_DISCLAIMER")}
        </div>
      ) : null}

      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">{t("IMPRESSUM_ENTITY_LABEL")}</dt>
          <dd className="text-muted-foreground">{legal.entity}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("IMPRESSUM_ADDRESS_LABEL")}</dt>
          <dd className="text-muted-foreground whitespace-pre-line">
            {legal.address}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("IMPRESSUM_REGISTER_LABEL")}</dt>
          <dd className="text-muted-foreground">{legal.register}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("IMPRESSUM_VAT_LABEL")}</dt>
          <dd className="text-muted-foreground">{legal.vat}</dd>
        </div>
        <div>
          <dt className="font-semibold">
            {t("IMPRESSUM_REPRESENTED_BY_LABEL")}
          </dt>
          <dd className="text-muted-foreground">{legal.representedBy}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("IMPRESSUM_CONTACT_LABEL")}</dt>
          <dd className="text-muted-foreground">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </dd>
        </div>
      </dl>

      <nav className="mt-12 text-sm">
        <Link href="/" className="text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </nav>
    </main>
  );
}
