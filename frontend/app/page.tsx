/**
 * Home page.
 *
 * Semantic structure (single h1, landmark <main>, JSON-LD) so this is
 * the page an AEO audit scores positively. Identity values come from
 * site.config -- no hardcoded company name here.
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";
import { t } from "@/i18n/keys";
import { buildHomeJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { siteConfig } from "@/site.config";

export default function Home() {
  return (
    <>
      {/* Organization + WebSite JSON-LD: the primary signal ContextRocket's
          taxonomy reads to assess AI-readiness for this site. */}
      <StructuredDataScripts items={buildHomeJsonLd()} />

      <main className="flex min-h-screen flex-col items-center justify-center bg-muted p-8">
        <div className="text-center max-w-2xl">
          <div className="mb-8 flex flex-col items-center gap-6">
            <div className="rounded-full bg-primary p-6">
              <Bot className="h-16 w-16 text-primary-foreground" aria-hidden />
            </div>
            {/* Single h1 from config tagline -- the first heading a crawler
                sees should describe the brand, not the template. */}
            <h1 className="text-5xl font-bold text-foreground">
              {siteConfig.tagline}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            {t("HOME_SUBTITLE")}
          </p>

          {/* Footer strip: legal links required for EU/DE compliance */}
          <nav aria-label="Main navigation">
            <Link href="/dashboard">
              <Button className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg">
                {t("HOME_CTA")}
              </Button>
            </Link>
          </nav>

          <footer className="mt-16 text-sm text-muted-foreground flex gap-4 justify-center items-center">
            <Link href="/impressum" className="hover:underline">
              {t("FOOTER_IMPRESSUM")}
            </Link>
            <Link href="/privacy" className="hover:underline">
              {t("FOOTER_PRIVACY")}
            </Link>
            <LocaleSwitcher />
          </footer>
        </div>
      </main>
    </>
  );
}
