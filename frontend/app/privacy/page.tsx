/**
 * Privacy Policy page -- /privacy
 *
 * LEGAL NOTICE: This is a placeholder privacy policy page. Before launch
 * you MUST replace this content with a complete, legally compliant privacy
 * statement specific to your jurisdiction and data processing activities.
 *
 * Consult your legal advisor. Common requirements include (but are not
 * limited to): GDPR (EU), CCPA (California), LGPD (Brazil).
 *
 * All identity fields are read from site.config -- only that file needs
 * to be edited to update names and contact information here.
 */

import { t } from "@/i18n/keys";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: t("PRIVACY_TITLE"),
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t("PRIVACY_TITLE")}</h1>

      {/* Placeholder notice */}
      <div
        className="mb-8 border border-yellow-500 bg-yellow-50 text-yellow-900 p-4 rounded text-sm"
        role="alert"
      >
        <strong>Developer notice:</strong> {t("PRIVACY_PLACEHOLDER")}
      </div>

      <section className="prose max-w-none text-foreground space-y-4">
        <p>
          This website is operated by <strong>{siteConfig.legalName}</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          {t("PRIVACY_CONTACT_LABEL")}
        </h2>
        <p>
          For privacy enquiries please contact:{" "}
          <a
            href={`mailto:${siteConfig.legal.privacyContact}`}
            className="hover:underline text-primary"
          >
            {siteConfig.legal.privacyContact}
          </a>
        </p>

        <p className="text-muted-foreground text-sm mt-8">
          Replace this page with your complete privacy policy before launch.
        </p>
      </section>

      <nav className="mt-12 text-sm">
        <Link href="/" className="text-muted-foreground hover:underline">
          &larr; Back to home
        </Link>
      </nav>
    </main>
  );
}
