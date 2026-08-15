/**
 * Privacy Policy page -- /privacy
 *
 * LEGAL NOTICE: This page is auto-generated from site.config and reflects the
 * actual data processing performed by this starter (auth data, strictly-necessary
 * cookies, and optional analytics gated on cookie consent). It is a starting
 * point only. Before going live, have a qualified legal advisor review the
 * generated content for your jurisdiction and specific processing activities.
 *
 * All controller and contact values are read from site.config.legal -- edit
 * only that file to update names, addresses, and contact information.
 *
 * Analytics sections are conditionally rendered via analyticsConfigured()
 * from lib/analytics.ts (the single source of the "is analytics configured?"
 * check, also read by the cookie-consent banner's "auto" mode). The
 * per-provider booleans below only pick which provider row to list.
 */

import { setLocale, t } from "@/i18n/keys";
import { siteConfig } from "@/site.config";
import { resolveLocale } from "@/i18n/messages";
import { CONSENT_STORAGE_KEY, analyticsConfigured } from "@/lib/analytics";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  return {
    title: t("privacy.title"),
    alternates: buildAlternates(locale, "/privacy"),
    robots: { index: true, follow: true },
  };
}

// Per-provider booleans drive the granular "which provider" list below. Whether
// analytics exists AT ALL is NOT recomputed here — it comes from the single
// source, analyticsConfigured() in lib/analytics.ts, the same gate the
// cookie-consent banner's "auto" mode reads. Keep these two in lockstep by
// never mirroring the combined check.
/** True when Google Analytics 4 is configured (drives the GA list item). */
const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

/** True when PostHog is configured (drives the PostHog list item). */
const posthogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  const legal = siteConfig.legal;
  const isPlaceholder =
    legal.entity.includes("PLACEHOLDER") ||
    legal.entity === "ContextRocket Starter GmbH";

  // Home > Privacy breadcrumb (absolute, locale-prefixed URLs).
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: t("privacy.title"), url: `${origin}/${locale}/privacy` },
  ]);

  return (
    <>
    <StructuredDataScripts items={[breadcrumb]} />
    <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("privacy.title")}</h1>

      {/* Generated-from-config notice */}
      <p
        className="text-xs text-muted-foreground mb-6 italic"
        data-testid="privacy-generated-notice"
      >
        {t("privacy.generated.notice")}
      </p>

      {/* Placeholder warning -- visible when legal fields have not been filled */}
      {isPlaceholder ? (
        <div
          className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
          role="alert"
          data-testid="privacy-placeholder-warning"
        >
          <strong>{t("impressum.disclaimer")}</strong>
        </div>
      ) : null}

      <section className="space-y-8 text-foreground">
        {/* Intro */}
        <p className="text-sm text-muted-foreground">{t("privacy.intro")}</p>

        {/* Data Controller */}
        <div data-testid="privacy-controller-section">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.controller.heading")}
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            {t("privacy.controller.intro")}
          </p>
          <address
            className="not-italic text-sm text-muted-foreground"
            data-testid="privacy-controller-address"
          >
            <strong>{legal.entity}</strong>
            <br />
            {legal.address}
          </address>
        </div>

        {/* Privacy Contact */}
        <div data-testid="privacy-contact-section">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.contact.label")}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {t("privacy.contact.intro")}
          </p>
          <a
            href={`mailto:${legal.privacyContact}`}
            className="text-sm hover:underline text-primary"
            data-testid="privacy-contact-email"
          >
            {legal.privacyContact}
          </a>
        </div>

        {/* Data Processing */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("privacy.data.heading")}
          </h2>

          {/* Auth data */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-1">
              {t("privacy.data.auth.heading")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("privacy.data.auth.body")}
            </p>
          </div>

          {/* Strictly-necessary cookies */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-1">
              {t("privacy.data.cookies.heading")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("privacy.data.cookies.body")}
            </p>
          </div>

          {/* Analytics -- rendered only when at least one provider key is set.
              Same gate as the cookie-consent banner's "auto" mode:
              analyticsConfigured() from lib/analytics.ts (single source). */}
          {analyticsConfigured() ? (
            <div data-testid="privacy-analytics-section">
              <h3 className="text-base font-semibold mb-1">
                {t("privacy.analytics.heading")}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("privacy.analytics.body")}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                {t("privacy.analytics.providers.intro")}
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {gaEnabled ? <li>{t("privacy.analytics.ga.label")}</li> : null}
                {posthogEnabled ? (
                  <li>{t("privacy.analytics.posthog.label")}</li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Cookie Consent and Withdrawal */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.consent.heading")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("privacy.consent.body")}{" "}
            <code className="font-mono bg-muted px-1 rounded text-xs">
              {CONSENT_STORAGE_KEY}
            </code>{" "}
            {t("privacy.consent.bodyAfterKey")}
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.rights.heading")}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {t("privacy.rights.intro")}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>{t("privacy.rights.access")}</li>
            <li>{t("privacy.rights.rectification")}</li>
            <li>{t("privacy.rights.erasure")}</li>
            <li>{t("privacy.rights.portability")}</li>
            <li>{t("privacy.rights.complaint")}</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            {t("privacy.rights.outro")}
          </p>
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
