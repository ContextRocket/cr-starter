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
 * Analytics sections are conditionally rendered based on whether
 * NEXT_PUBLIC_GA_MEASUREMENT_ID or NEXT_PUBLIC_POSTHOG_KEY are set,
 * mirroring the gating logic in lib/analytics.ts.
 */

import { t } from "@/i18n/keys";
import { siteConfig } from "@/site.config";
import { CONSENT_STORAGE_KEY } from "@/lib/analytics";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: t("PRIVACY_TITLE"),
  robots: { index: true, follow: true },
};

/** True when Google Analytics 4 is configured (mirrors analytics.ts gaKey()). */
const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

/** True when PostHog is configured (mirrors analytics.ts posthogKey()). */
const posthogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

/** True when at least one analytics provider is configured. */
const analyticsEnabled = gaEnabled || posthogEnabled;

export default function PrivacyPage() {
  const legal = siteConfig.legal;
  const isPlaceholder =
    legal.entity.includes("PLACEHOLDER") ||
    legal.entity === "ContextRocket Starter GmbH";

  return (
    <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t("PRIVACY_TITLE")}</h1>

      {/* Generated-from-config notice */}
      <p
        className="text-xs text-muted-foreground mb-6 italic"
        data-testid="privacy-generated-notice"
      >
        {t("PRIVACY_GENERATED_NOTICE")}
      </p>

      {/* Placeholder warning -- visible when legal fields have not been filled */}
      {isPlaceholder ? (
        <div
          className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
          role="alert"
          data-testid="privacy-placeholder-warning"
        >
          <strong>{t("IMPRESSUM_DISCLAIMER")}</strong>
        </div>
      ) : null}

      <section className="space-y-8 text-foreground">
        {/* Intro */}
        <p className="text-sm text-muted-foreground">{t("PRIVACY_INTRO")}</p>

        {/* Data Controller */}
        <div data-testid="privacy-controller-section">
          <h2 className="text-xl font-semibold mb-2">
            {t("PRIVACY_CONTROLLER_HEADING")}
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            {t("PRIVACY_CONTROLLER_INTRO")}
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
            {t("PRIVACY_CONTACT_LABEL")}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {t("PRIVACY_CONTACT_INTRO")}
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
            {t("PRIVACY_DATA_HEADING")}
          </h2>

          {/* Auth data */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-1">
              {t("PRIVACY_DATA_AUTH_HEADING")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("PRIVACY_DATA_AUTH_BODY")}
            </p>
          </div>

          {/* Strictly-necessary cookies */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-1">
              {t("PRIVACY_DATA_COOKIES_HEADING")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("PRIVACY_DATA_COOKIES_BODY")}
            </p>
          </div>

          {/* Analytics -- rendered only when at least one provider key is set */}
          {analyticsEnabled ? (
            <div data-testid="privacy-analytics-section">
              <h3 className="text-base font-semibold mb-1">
                {t("PRIVACY_ANALYTICS_HEADING")}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("PRIVACY_ANALYTICS_BODY")}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                {t("PRIVACY_ANALYTICS_PROVIDERS_INTRO")}
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {gaEnabled ? <li>{t("PRIVACY_ANALYTICS_GA_LABEL")}</li> : null}
                {posthogEnabled ? (
                  <li>{t("PRIVACY_ANALYTICS_POSTHOG_LABEL")}</li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Cookie Consent and Withdrawal */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {t("PRIVACY_CONSENT_HEADING")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("PRIVACY_CONSENT_BODY")}{" "}
            <code className="font-mono bg-muted px-1 rounded text-xs">
              {CONSENT_STORAGE_KEY}
            </code>{" "}
            {t("PRIVACY_CONSENT_BODY_AFTER_KEY")}
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {t("PRIVACY_RIGHTS_HEADING")}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {t("PRIVACY_RIGHTS_INTRO")}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>{t("PRIVACY_RIGHTS_ACCESS")}</li>
            <li>{t("PRIVACY_RIGHTS_RECTIFICATION")}</li>
            <li>{t("PRIVACY_RIGHTS_ERASURE")}</li>
            <li>{t("PRIVACY_RIGHTS_PORTABILITY")}</li>
            <li>{t("PRIVACY_RIGHTS_COMPLAINT")}</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            {t("PRIVACY_RIGHTS_OUTRO")}
          </p>
        </div>
      </section>

      <nav className="mt-12 text-sm">
        <Link href="/" className="text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </nav>
    </main>
  );
}
