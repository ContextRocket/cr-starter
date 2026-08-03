/**
 * FAQ page -- /{locale}/faq
 *
 * Renders the curated FAQ for the URL locale (content/faq/{locale}.md)
 * via the FAQ seam (frontend/lib/faq.ts). The language code lives in the
 * URL ([locale] URL-segment routing), so each locale serves its own
 * content file. es/en/de files are all present.
 *
 * SEAM CONTRACT:
 *   One file -- content/faq/{locale}.md -- powers:
 *     1. This page (entries + anchor ids).
 *     2. FAQPage JSON-LD (via buildFaqJsonLd in lib/structured-data.ts).
 *     3. Agent corpus seed (future ContextRocket platform ingestion).
 *
 * Parse errors fail the build loudly (see lib/faq.ts).
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { fileFaqAdapter } from "@/lib/faq";
import { buildFaqJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  return {
    title: t("FAQ_PAGE_TITLE"),
    description: t("FAQ_PAGE_DESCRIPTION"),
    robots: { index: true, follow: true },
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  // Server-side: load the FAQ file for the URL locale. The file adapter
  // reads from content/faq/ and parse errors fail the build.
  const entries = fileFaqAdapter.list(locale);

  return (
    <>
      {/* FAQPage JSON-LD -- the primary structured-data signal for AEO readiness. */}
      <StructuredDataScripts items={[buildFaqJsonLd(entries)]} />

      <main
        className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto"
        data-testid="faq-page"
      >
        <h1 className="text-3xl font-bold mb-2">{t("FAQ_PAGE_TITLE")}</h1>
        <p className="text-sm text-muted-foreground mb-10">
          {t("FAQ_PAGE_DESCRIPTION")}
        </p>

        <section aria-label={t("FAQ_PAGE_TITLE")}>
          <dl className="space-y-10" data-testid="faq-list">
            {entries.map((entry) => (
              <div
                key={entry.slug}
                id={entry.slug}
                data-testid={`faq-entry-${entry.slug}`}
              >
                <dt className="text-lg font-semibold text-foreground mb-2">
                  <a
                    href={`#${entry.slug}`}
                    className="hover:underline focus:outline-none focus:underline"
                  >
                    {entry.question}
                  </a>
                </dt>
                <dd className="text-sm text-muted-foreground leading-6 prose prose-sm max-w-none">
                  {/* Render answer as a set of paragraphs split on blank lines.
                      This keeps JSX rendering simple and avoids dangerouslySetInnerHTML
                      for untrusted content. FAQ files are operator-authored so the
                      content is trusted, but static paragraph splitting is sufficient
                      for the starter's answer format. */}
                  {entry.answerMarkdown.split(/\n{2,}/).map((para, i) => {
                    // Code fences: render as <pre><code>
                    if (para.trim().startsWith("```")) {
                      const inner = para
                        .trim()
                        .replace(/^```[^\n]*\n?/, "")
                        .replace(/\n?```$/, "");
                      return (
                        <pre
                          key={i}
                          className="mt-2 overflow-x-auto rounded-lg bg-muted/80 px-4 py-3 text-xs leading-relaxed text-foreground"
                        >
                          <code>{inner}</code>
                        </pre>
                      );
                    }
                    return (
                      <p key={i} className="mt-2 first:mt-0">
                        {para.trim()}
                      </p>
                    );
                  })}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="mt-12 text-sm">
          <Link href="/" className="text-muted-foreground hover:underline">
            &larr; {t("FAQ_BACK_HOME")}
          </Link>
        </nav>
      </main>
    </>
  );
}
