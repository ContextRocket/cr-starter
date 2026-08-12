/**
 * Impressum page -- /impressum
 *
 * LEGAL NOTICE: An Impressum is LEGALLY REQUIRED for commercial websites
 * targeting Germany or any EU country under § 5 Digitale-Dienste-Gesetz
 * (DDG, successor of the repealed Telemediengesetz) and similar national
 * laws. The placeholder values in site.config.legal MUST be replaced with
 * real legal information before launch.
 *
 * A page with placeholder text does not satisfy the legal requirement.
 * Consult your legal advisor for country-specific compliance.
 *
 * All field values are read from site.config.legal -- edit only that file.
 */

import { setLocale, t } from "@/i18n/keys";
import { siteConfig } from "@/site.config";
import { resolveLocale } from "@/i18n/messages";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

interface ImpressumPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ImpressumPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  setLocale(resolveLocale(rawLocale));
  return {
    title: t("impressum.title"),
    robots: { index: true, follow: true },
  };
}

export default async function ImpressumPage({ params }: ImpressumPageProps) {
  const { locale: rawLocale } = await params;
  setLocale(resolveLocale(rawLocale));
  const legal = siteConfig.legal;

  return (
    <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("impressum.title")}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {t("impressum.legal.notice")}
      </p>

      {/* PLACEHOLDER WARNING -- visible in development to prompt replacement */}
      {legal.entity.includes("PLACEHOLDER") ||
      legal.entity === "ContextRocket Starter GmbH" ? (
        <div
          className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
          role="alert"
        >
          <strong>{t("dev.notice.label")}</strong> {t("impressum.disclaimer")}
        </div>
      ) : null}

      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">{t("impressum.entity.label")}</dt>
          <dd className="text-muted-foreground">{legal.entity}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("impressum.address.label")}</dt>
          <dd className="text-muted-foreground whitespace-pre-line">
            {legal.address}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("impressum.register.label")}</dt>
          <dd className="text-muted-foreground">{legal.register}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("impressum.vat.label")}</dt>
          <dd className="text-muted-foreground">{legal.vat}</dd>
        </div>
        <div>
          <dt className="font-semibold">
            {t("impressum.represented.by.label")}
          </dt>
          <dd className="text-muted-foreground">{legal.representedBy}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("impressum.contact.label")}</dt>
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
