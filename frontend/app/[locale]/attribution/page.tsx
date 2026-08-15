/**
 * Attribution page -- /{locale}/attribution
 *
 * Lists every credit for the assets this site self-hosts: image credits
 * (photographer -> Unsplash) and open-source libraries. All copy resolves
 * through i18n (attribution.*); the credit DATA (names, URLs, licenses) is
 * verbatim proper-noun data loaded at build time from
 * content/attributions.json via the fail-loud loader (lib/attributions.ts).
 *
 * CONFIGURABLE (opt-out): the whole surface is gated on
 * siteConfig.features.attribution. When false, this route calls notFound() (no
 * dead page) and the footer "Attribution" link is omitted (company.config nav,
 * featureFlag: "attribution") so there is never a dead link. Default true,
 * because the base self-hosts bundled Unsplash images that require visible
 * attribution.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { loadAttributions } from "@/lib/attributions";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import { siteConfig } from "@/site.config";

interface AttributionPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AttributionPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);
  // A disabled surface must not advertise itself in metadata/canonicals.
  if (!siteConfig.features.attribution) {
    return { robots: { index: false, follow: false } };
  }
  return {
    title: t("attribution.title"),
    description: t("attribution.subtitle"),
    alternates: buildAlternates(locale, "/attribution"),
    robots: { index: true, follow: true },
  };
}

export default async function AttributionPage({ params }: AttributionPageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);

  // Opt-out gate: when the feature is off the page does not exist.
  if (!siteConfig.features.attribution) notFound();

  const { images, libraries } = loadAttributions();

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: t("attribution.title"), url: `${origin}/${locale}/attribution` },
  ]);

  return (
    <>
      <StructuredDataScripts items={[breadcrumb]} />

      <main
        className="min-h-screen bg-background text-foreground"
        data-testid="attribution-page"
      >
        {/* Hero */}
        <SectionWrapper padding="loose" backgroundClass="bg-muted">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("attribution.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {t("attribution.description")}
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper padding="loose">
          <div className="mx-auto max-w-4xl">
            {/* Images */}
            <section className="mb-16" data-testid="attribution-images">
              <h2 className="text-2xl font-bold mb-8 text-foreground">
                {t("attribution.images")}
              </h2>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={`${image.filename}-${index}`}
                      className="rounded-xl border border-card-border bg-card p-5"
                    >
                      <div className="flex items-start gap-4">
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block flex-shrink-0 transition-opacity hover:opacity-80"
                        >
                          <Image
                            src={image.thumbnail}
                            alt={image.filename}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </a>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 text-sm font-medium text-foreground">
                            {image.filename}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {t("attribution.photo_by")}{" "}
                            <a
                              href={image.author.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary transition-colors hover:text-primary-hover"
                            >
                              {image.author.name}
                            </a>{" "}
                            {t("attribution.on")}{" "}
                            <a
                              href={image.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary transition-colors hover:text-primary-hover"
                            >
                              {image.source.name}
                            </a>
                          </p>
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-xs text-primary transition-colors hover:text-primary-hover"
                          >
                            {t("attribution.view_original")}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-muted-foreground">
                  {t("attribution.no_images")}
                </p>
              )}
            </section>

            {/* Libraries */}
            <section data-testid="attribution-libraries">
              <h2 className="text-2xl font-bold mb-8 text-foreground">
                {t("attribution.libraries")}
              </h2>

              {libraries.length > 0 ? (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {libraries.map((library, index) => (
                    <li
                      key={`${library.name}-${index}`}
                      className="h-full rounded-xl border border-card-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-foreground">
                          {library.url ? (
                            <a
                              href={library.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-primary"
                            >
                              {library.name}
                            </a>
                          ) : (
                            library.name
                          )}
                        </h3>
                        {library.license ? (
                          <span className="inline-flex flex-shrink-0 items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {library.license}
                          </span>
                        ) : null}
                      </div>
                      {library.note ? (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {library.note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-muted-foreground">
                  {t("attribution.no_libraries")}
                </p>
              )}
            </section>

            {/* General note */}
            <div className="mt-16 border-t border-border pt-8 text-center">
              <p className="text-muted-foreground">
                {t("attribution.general_note")}{" "}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline transition-colors hover:text-primary-hover"
                >
                  Unsplash
                </a>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("attribution.license_note")}
              </p>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/"
                className="text-sm text-primary underline transition-colors hover:text-primary-hover"
              >
                {t("breadcrumb.home")}
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </main>
    </>
  );
}
