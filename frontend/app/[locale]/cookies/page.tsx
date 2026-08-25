/**
 * Cookie Notice page -- /cookies
 *
 * This is an INFORMATIONAL notice, not a second consent surface. Consent is
 * captured and changed through the existing cookie banner + "Manage settings"
 * preferences dialog (components/shared/cookie-consent*). This page explains the
 * categories, the prior-consent rule, and how to change or withdraw a choice,
 * and links back to those controls.
 *
 * GENERIC, jurisdiction-general best-practice template:
 *   - Strictly-necessary storage runs without consent (site function + your
 *     consent choice + language preference).
 *   - Analytics and marketing are OFF by default and only set AFTER prior,
 *     affirmative consent (no pre-ticked boxes; rejecting is as easy as
 *     accepting).
 *   - The categories described here match the starter's consent store exactly
 *     (necessary / functional / analytics / marketing -- lib/consent.ts). Do
 *     not describe a category the banner cannot toggle.
 *   - Whether analytics is actually active on a given fork is driven by that
 *     fork's own configuration via analyticsConfigured() (lib/analytics.ts), the
 *     same single gate the banner and privacy page read -- NOT a hardcoded
 *     claim.
 *
 * Identity (entity, contact) comes from siteConfig.legal / siteConfig; nothing
 * is hardcoded. Review with legal counsel before launch.
 */

import { setLocale, t } from "@/i18n/keys";
import { siteConfig } from "@/config/site.config";
import { resolveLocale } from "@/i18n/messages";
import {
  CONSENT_RECORD_STORAGE_KEY,
  analyticsConfigured,
} from "@/lib/analytics";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import { LegalIdentityBlock } from "@/components/shared/legal/legal-identity-block";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CookiesPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  return {
    title: t("cookies.title"),
    alternates: buildAlternates(locale, "/cookies"),
    robots: { index: true, follow: true },
  };
}

/**
 * A single consent-category row: name + purpose + consent basis. Kept as a
 * component so the three starter categories render identically.
 */
function CategoryRow({
  name,
  purpose,
  consent,
  testId,
}: {
  name: string;
  purpose: string;
  consent: string;
  testId: string;
}) {
  return (
    <div
      className="border border-border rounded-md px-3 py-2.5"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{purpose}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {consent}
      </p>
    </div>
  );
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  const legal = siteConfig.legal;

  // Home > Cookies breadcrumb (absolute, locale-prefixed URLs).
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: t("cookies.title"), url: `${origin}/${locale}/cookies` },
  ]);

  return (
    <>
      <StructuredDataScripts items={[breadcrumb]} />
      <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t("cookies.title")}</h1>

        <section className="space-y-8 text-foreground">
          {/* Intro */}
          <p className="text-sm text-muted-foreground">{t("cookies.intro")}</p>

          {/* What cookies are */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.what.heading")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("cookies.what.body")}
            </p>
          </div>

          {/* Consent controls -- the prior-consent + reject-as-easy contract */}
          <div data-testid="cookies-controls-section">
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.controls.heading")}
            </h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{t("cookies.controls.necessary")}</li>
              <li>{t("cookies.controls.optionalOff")}</li>
              <li>{t("cookies.controls.noPreTicked")}</li>
              <li>{t("cookies.controls.noWall")}</li>
              <li>{t("cookies.controls.rejectEasy")}</li>
              <li>{t("cookies.controls.withdraw")}</li>
              <li>{t("cookies.controls.reprompt")}</li>
              <li>{t("cookies.controls.proof")}</li>
            </ul>
          </div>

          {/* Categories -- match the starter's consent store exactly. */}
          <div data-testid="cookies-categories-section">
            <h2 className="text-xl font-semibold mb-4">
              {t("cookies.categories.heading")}
            </h2>
            <div className="space-y-3">
              <CategoryRow
                name={t("cookies.categories.necessary.name")}
                purpose={t("cookies.categories.necessary.purpose")}
                consent={t("cookies.categories.necessary.consent")}
                testId="cookies-category-necessary"
              />
              <CategoryRow
                name={t("cookies.categories.functional.name")}
                purpose={t("cookies.categories.functional.purpose")}
                consent={t("cookies.categories.functional.consent")}
                testId="cookies-category-functional"
              />
              <CategoryRow
                name={t("cookies.categories.analytics.name")}
                purpose={t("cookies.categories.analytics.purpose")}
                consent={t("cookies.categories.analytics.consent")}
                testId="cookies-category-analytics"
              />
              <CategoryRow
                name={t("cookies.categories.marketing.name")}
                purpose={t("cookies.categories.marketing.purpose")}
                consent={t("cookies.categories.marketing.consent")}
                testId="cookies-category-marketing"
              />
            </div>

            {/* Whether analytics is actually configured on THIS fork is driven
                by analyticsConfigured() -- the single gate the banner and
                privacy page also read. Not a hardcoded claim. */}
            <p className="mt-4 text-sm text-muted-foreground">
              {analyticsConfigured()
                ? t("cookies.categories.analyticsActive")
                : t("cookies.categories.analyticsInactive")}
            </p>
          </div>

          {/* Managing your choice -- links back to the existing controls */}
          <div data-testid="cookies-manage-section">
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.manage.heading")}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {t("cookies.manage.body")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("cookies.manage.storageIntro")}{" "}
              <code className="font-mono bg-muted px-1 rounded text-xs">
                {CONSENT_RECORD_STORAGE_KEY}
              </code>{" "}
              {t("cookies.manage.storageAfterKey")}
            </p>
          </div>

          {/* Browser controls */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.browser.heading")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("cookies.browser.body")}
            </p>
          </div>

          {/* Relation to the privacy policy */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.privacy.heading")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("cookies.privacy.body")}{" "}
              <Link
                href="/privacy"
                className="hover:underline text-primary"
                data-testid="cookies-privacy-link"
              >
                {t("cookies.privacy.link")}
              </Link>
              .
            </p>
          </div>

          {/* Contact -- identity from siteConfig */}
          <div data-testid="cookies-contact-section">
            <h2 className="text-xl font-semibold mb-2">
              {t("cookies.contact.heading")}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {t("cookies.contact.intro")}
            </p>
            {/* Contact identity renders on the entity-type spectrum
                (company / individual / unincorporated) from siteConfig.legal. */}
            <div
              className="text-sm"
              data-testid="cookies-contact-section-identity"
            >
              <LegalIdentityBlock
                legal={legal}
                contactEmail={siteConfig.contactEmail}
              />
            </div>
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
