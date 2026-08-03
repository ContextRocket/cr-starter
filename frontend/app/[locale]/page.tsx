/**
 * Home page.
 *
 * Semantic structure (single h1, landmark <main>, JSON-LD) so this is
 * the page an AEO audit scores positively. Identity values come from
 * site.config -- no hardcoded company name here.
 */

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
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

          {/* ── Embeddable widget section ─────────────────────────────────────
              Explains the one-script-tag embed pattern and provides a
              copy-paste snippet. The FAB already on this page (injected by
              the root layout when NEXT_PUBLIC_CHAT_FAB_ENABLED=true) is the
              same component, so we do NOT self-embed a second widget here. */}
          <section
            aria-labelledby="widget-section-heading"
            className="mt-16 rounded-2xl border border-border/60 bg-card/80 px-6 py-8 text-left shadow-sm backdrop-blur-sm"
            data-testid="widget-demo-section"
          >
            <h2
              id="widget-section-heading"
              className="text-xl font-semibold text-foreground"
            >
              {t("HOME_WIDGET_SECTION_TITLE")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("HOME_WIDGET_SECTION_BODY")}
            </p>
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              {t("HOME_WIDGET_SNIPPET_NOTE")}
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted/80 px-4 py-3 text-xs leading-relaxed text-foreground">
              <code>{`<script
  src="https://your-site.example/widget.js"
  data-cr-agent-url="https://your-cr-instance.com"
  data-cr-site-key="pk_live_..."
  defer
></script>`}</code>
            </pre>
          </section>

          <footer className="mt-16 text-sm text-muted-foreground flex gap-4 justify-center items-center">
            <Link href="/impressum" className="hover:underline">
              {t("FOOTER_IMPRESSUM")}
            </Link>
            <Link href="/privacy" className="hover:underline">
              {t("FOOTER_PRIVACY")}
            </Link>
            <Link href="/faq" className="hover:underline">
              {t("FOOTER_FAQ")}
            </Link>
            <Link href="/blog" className="hover:underline">
              {t("BLOG_TITLE")}
            </Link>
            <LocaleSwitcher />
          </footer>
        </div>
      </main>
    </>
  );
}
