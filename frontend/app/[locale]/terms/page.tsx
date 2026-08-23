/**
 * Terms of Service page -- /terms
 *
 * LEGAL NOTICE: This page is a GENERIC, jurisdiction-general best-practice
 * starting point generated from site.config. It is NOT legal advice and does
 * not describe any specific commercial arrangement. Before going live, have a
 * qualified legal advisor review and adapt the generated content for your
 * jurisdiction, service, and pricing model.
 *
 * All identity values (entity name, contact) are read from
 * siteConfig.legal / siteConfig.contactEmail -- edit only that configuration to
 * update names and contact information. No identity is hardcoded here.
 *
 * The fees section is deliberately neutral: where the service is paid, fees and
 * billing terms are presented at the point of purchase or in a separate order.
 * The starter asserts no commercial stance of its own.
 */

import { setLocale, t } from "@/i18n/keys";
import { siteConfig } from "@/config/site.config";
import { resolveLocale } from "@/i18n/messages";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  return {
    title: t("terms.title"),
    alternates: buildAlternates(locale, "/terms"),
    robots: { index: true, follow: true },
  };
}

/**
 * One numbered Terms section: a heading plus one or more body paragraphs. Body
 * paragraphs are individually keyed so a fork can extend a clause without
 * touching this component.
 */
function TermsSection({
  heading,
  paragraphs,
  testId,
}: {
  heading: string;
  paragraphs: string[];
  testId?: string;
}) {
  return (
    <div data-testid={testId}>
      <h2 className="text-xl font-semibold mb-2">{heading}</h2>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-sm text-muted-foreground mb-2 last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  const legal = siteConfig.legal;
  const isPlaceholder =
    legal.entity.includes("PLACEHOLDER") ||
    legal.entity === "ContextRocket Starter GmbH";

  // Home > Terms breadcrumb (absolute, locale-prefixed URLs).
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: t("terms.title"), url: `${origin}/${locale}/terms` },
  ]);

  return (
    <>
      <StructuredDataScripts items={[breadcrumb]} />
      <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t("terms.title")}</h1>

        {/* Generated-from-config notice */}
        <p
          className="text-xs text-muted-foreground mb-6 italic"
          data-testid="terms-generated-notice"
        >
          {t("terms.generated.notice")}
        </p>

        {/* Placeholder warning -- visible when legal fields have not been filled */}
        {isPlaceholder ? (
          <div
            className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
            role="alert"
            data-testid="terms-placeholder-warning"
          >
            <strong>{t("terms.disclaimer")}</strong>
          </div>
        ) : null}

        <section className="space-y-8 text-foreground">
          {/* Intro */}
          <p className="text-sm text-muted-foreground">{t("terms.intro")}</p>

          {/* Who we are -- identity from siteConfig.legal */}
          <div data-testid="terms-provider-section">
            <h2 className="text-xl font-semibold mb-2">
              {t("terms.provider.heading")}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {t("terms.provider.intro")}
            </p>
            <address
              className="not-italic text-sm text-muted-foreground"
              data-testid="terms-provider-address"
            >
              <strong>{legal.entity}</strong>
              <br />
              <span className="whitespace-pre-line">{legal.address}</span>
              <br />
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:underline text-primary"
              >
                {siteConfig.contactEmail}
              </a>
            </address>
          </div>

          <TermsSection
            heading={t("terms.service.heading")}
            paragraphs={[t("terms.service.body")]}
          />

          <TermsSection
            heading={t("terms.acceptance.heading")}
            paragraphs={[
              t("terms.acceptance.body1"),
              t("terms.acceptance.body2"),
            ]}
          />

          <TermsSection
            heading={t("terms.accounts.heading")}
            paragraphs={[t("terms.accounts.body")]}
          />

          {/* Acceptable use -- a prohibited-conduct list */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("terms.acceptableUse.heading")}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {t("terms.acceptableUse.intro")}
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{t("terms.acceptableUse.item.unlawful")}</li>
              <li>{t("terms.acceptableUse.item.rights")}</li>
              <li>{t("terms.acceptableUse.item.security")}</li>
              <li>{t("terms.acceptableUse.item.reverse")}</li>
              <li>{t("terms.acceptableUse.item.resell")}</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              {t("terms.acceptableUse.outro")}
            </p>
          </div>

          <TermsSection
            heading={t("terms.ip.heading")}
            paragraphs={[t("terms.ip.body")]}
          />

          <TermsSection
            heading={t("terms.content.heading")}
            paragraphs={[t("terms.content.body1"), t("terms.content.body2")]}
          />

          <TermsSection
            heading={t("terms.thirdParty.heading")}
            paragraphs={[t("terms.thirdParty.body")]}
          />

          <TermsSection
            heading={t("terms.disclaimers.heading")}
            paragraphs={[t("terms.disclaimers.body")]}
          />

          <TermsSection
            heading={t("terms.liability.heading")}
            paragraphs={[t("terms.liability.body")]}
          />

          {/* Fees -- neutral, generic clause. No commercial stance. */}
          <TermsSection
            heading={t("terms.fees.heading")}
            paragraphs={[t("terms.fees.body")]}
            testId="terms-fees-section"
          />

          <TermsSection
            heading={t("terms.termination.heading")}
            paragraphs={[t("terms.termination.body")]}
          />

          <TermsSection
            heading={t("terms.changes.heading")}
            paragraphs={[t("terms.changes.body")]}
          />

          <TermsSection
            heading={t("terms.governingLaw.heading")}
            paragraphs={[t("terms.governingLaw.body")]}
          />

          <TermsSection
            heading={t("terms.miscellaneous.heading")}
            paragraphs={[t("terms.miscellaneous.body")]}
          />

          {/* Contact -- identity from siteConfig */}
          <div data-testid="terms-contact-section">
            <h2 className="text-xl font-semibold mb-2">
              {t("terms.contact.heading")}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {t("terms.contact.intro")}
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm hover:underline text-primary"
              data-testid="terms-contact-email"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </section>

        <nav className="mt-12 text-sm">
          <Link href="/" className="text-muted-foreground hover:underline">
            &larr; Back to home
          </Link>
        </nav>
      </main>
    </>
  );
}
