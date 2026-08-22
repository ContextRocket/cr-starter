/**
 * Generic features page -- /{locale}/features.
 *
 * This deliberately reuses the starter's home feature copy and keeps the
 * route lightweight. Forks can change the content in their site message slice
 * or replace the route with a custom composition without changing shared
 * infrastructure.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";
import { siteConfig } from "@/config/site.config";

interface FeaturesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FeaturesPageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  return {
    title: t("home.features.title"),
    description: t("home.features.subtitle"),
    alternates: buildAlternates(locale, siteConfig.paths.features),
    robots: { index: true, follow: true },
  };
}

export default async function FeaturesPage({ params }: FeaturesPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    {
      name: t("home.features.title"),
      url: `${origin}/${locale}${siteConfig.paths.features}`,
    },
  ]);
  const features = [
    {
      title: t("home.features.item1.title"),
      description: t("home.features.item1.description"),
    },
    {
      title: t("home.features.item2.title"),
      description: t("home.features.item2.description"),
    },
    {
      title: t("home.features.item3.title"),
      description: t("home.features.item3.description"),
    },
  ];

  return (
    <>
      <StructuredDataScripts items={[breadcrumb]} />
      <main
        className="min-h-screen bg-background text-foreground"
        data-testid="features-page"
      >
        <SectionWrapper className="pb-12 pt-24 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-primary">
              {t("home.features.label")}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("home.features.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("home.features.subtitle")}
            </p>
          </div>
        </SectionWrapper>

        <SectionWrapper className="bg-muted/50 pt-12">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          <nav className="mx-auto mt-12 max-w-6xl text-sm">
            <Link href="/" className="text-muted-foreground hover:underline">
              &larr; {t("breadcrumb.home")}
            </Link>
          </nav>
        </SectionWrapper>
      </main>
    </>
  );
}
