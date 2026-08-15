/**
 * Home page — the config-driven marketing home.
 *
 * Renders the full section library from the single content SoT
 * (`company.config.ts`) via <MarketingSections />, followed by a blog teaser
 * (only when posts exist) and a newsletter CTA. Identity/JSON-LD come from
 * site.config and the structured-data builder — no hardcoded brand copy here.
 *
 * The single <h1> is the company hero headline (from MarketingSections' Hero),
 * which is the correct primary heading a crawler/AEO audit should see. The
 * navbar + footer are provided by the [locale] layout's <SiteChrome>, so this
 * page renders only its <main> content.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { buildHomeJsonLd } from "@/lib/structured-data";
import { buildAlternates } from "@/lib/seo";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
import { MarketingSections } from "@/components/sections/marketing-sections";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { CtaSubscribeSection } from "@/components/sections/cta-subscribe-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { fileBlogAdapter } from "@/lib/blog";
import { getItemReviewed, getTestimonials } from "@/lib/testimonials";
import { buildTestimonialsJsonLd } from "@/lib/testimonials-jsonld";
import { siteConfig } from "@/site.config";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  return {
    alternates: buildAlternates(locale, ""),
    robots: { index: true, follow: true },
  };
}

export default async function Home({ params }: HomePageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);

  // Blog teaser: the newest few posts, only rendered when the blog has content.
  const featuredPosts = fileBlogAdapter.list().slice(0, 3);

  // Testimonials: only when the feature flag is on AND there are published
  // items. Flag off (the shipped default) or no items -> render nothing.
  const testimonials = siteConfig.features.testimonials
    ? getTestimonials(locale)
    : [];

  // Review / AggregateRating JSON-LD, built from the SAME resolved testimonials
  // the section renders (same locale) so reviewBody/author byte-match the visible
  // text and every emitted rating is shown as stars. null -> emit no script.
  const testimonialsJsonLd =
    testimonials.length > 0
      ? buildTestimonialsJsonLd(testimonials, getItemReviewed())
      : null;

  return (
    <>
      {/* Organization + WebSite JSON-LD: the primary signal ContextRocket's
          taxonomy reads to assess AI-readiness for this site. */}
      <StructuredDataScripts items={buildHomeJsonLd()} />

      {/* Review + AggregateRating JSON-LD: verbatim from the rendered
          testimonials (text-match invariant, see lib/testimonials-jsonld.ts). */}
      {testimonialsJsonLd && (
        <StructuredDataScripts items={[testimonialsJsonLd]} />
      )}

      <main>
        <MarketingSections />

        {testimonials.length > 0 && (
          <TestimonialsSection
            eyebrow={t("home.testimonials.eyebrow")}
            title={t("home.testimonials.title")}
            subtitle={t("home.testimonials.subtitle")}
            items={testimonials}
            regionLabel={t("home.testimonials.regionLabel")}
            ratingLabel={(rating) =>
              t("home.testimonials.ratingLabel").replace(
                "{rating}",
                String(rating),
              )
            }
          />
        )}

        {featuredPosts.length > 0 && (
          <FeaturedArticles
            posts={featuredPosts}
            locale={locale}
            title={t("home.featured.title")}
            subtitle={t("home.featured.subtitle")}
            viewAllLabel={t("home.featured.viewAll")}
          />
        )}

        <CtaSubscribeSection
          formKey="subscribe"
          title={t("home.subscribe.title")}
          subtitle={t("home.subscribe.subtitle")}
          emailPlaceholder={t("home.subscribe.placeholder")}
          submitLabel={t("home.subscribe.submit")}
          successMessage={t("home.subscribe.success")}
          consentLabel={
            <>
              {t("home.subscribe.consent")}{" "}
              <Link href="/privacy" className="underline hover:no-underline">
                {t("home.subscribe.privacyLink")}
              </Link>
            </>
          }
          errors={{
            emailRequired: t("home.subscribe.errors.emailRequired"),
            emailInvalid: t("home.subscribe.errors.emailInvalid"),
            consentRequired: t("home.subscribe.errors.consentRequired"),
            submitFailed: t("home.subscribe.errors.submitFailed"),
          }}
        />
      </main>
    </>
  );
}
