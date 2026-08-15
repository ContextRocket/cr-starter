/**
 * Home page — the config-driven marketing home.
 *
 * The page leads with the standard config-driven hero (headline / subhead /
 * CTAs from `company.config.ts`) rendered by <MarketingSections />, which owns
 * the single page <h1> and is followed by the LogoCloud → FeatureGrid →
 * StatsBar → TestimonialGrid → FAQ → CTA sections. Lower down — after the
 * features / trusted-by row, before testimonials — the animated
 * <HeroInsights layout="overlay"> composition renders as a mid-page showcase: a
 * hero image with a score badge and a cascade of floating InsightCards that
 * fade in once the image loads (reduced-motion shows them immediately). The
 * overlay emits no heading, so the config hero keeps the single <h1>. A blog
 * teaser (only when posts exist) and a newsletter CTA close the page.
 * Identity/JSON-LD come from site.config and the structured-data builder — no
 * hardcoded brand copy here. The navbar + footer are provided by the [locale]
 * layout's <SiteChrome>, so this page renders only its <main> content.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  ChartBarIcon,
  CheckCircleIcon,
  LanguageIcon,
} from "@heroicons/react/24/solid";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { buildHomeJsonLd } from "@/lib/structured-data";
import { buildAlternates } from "@/lib/seo";
import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
import { MarketingSections } from "@/components/sections/marketing-sections";
import { HeroInsights, type HeroInsightCard } from "@/components/sections/hero-insights";
import { SectionWrapper } from "@/components/sections/section-wrapper";
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

  // The three floating insight cards for the overlay hero. Copy comes from the
  // `home.hero.insights.*` i18n keys (generic placeholder copy a fork edits);
  // icons/colors/position/stagger live in the page. positionClassName places
  // each card over the art; delay staggers the fade-in cascade.
  const heroCardPosition =
    "left-[10px] sm:left-[20px] w-[calc(100%-80px)] sm:w-[280px] max-w-[280px]";
  const heroInsightCards: HeroInsightCard[] = [
    {
      color: "blue",
      icon: <ChartBarIcon className="h-6 w-6 text-white" />,
      title: t("home.hero.insights.thinTitle"),
      description: t("home.hero.insights.thinDesc"),
      positionClassName: `top-[220px] sm:top-[270px] ${heroCardPosition}`,
      delay: "1000ms",
    },
    {
      color: "yellow",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      title: t("home.hero.insights.bioTitle"),
      description: t("home.hero.insights.bioDesc"),
      positionClassName: `top-[340px] sm:top-[420px] ${heroCardPosition}`,
      delay: "1300ms",
    },
    {
      color: "green",
      icon: <LanguageIcon className="h-6 w-6 text-white" />,
      title: t("home.hero.insights.multiTitle"),
      description: t("home.hero.insights.multiDesc"),
      positionClassName: `top-[410px] sm:top-[505px] ${heroCardPosition}`,
      delay: "1600ms",
    },
  ];

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
        {/* ── Config-driven marketing stack ─────────────────────────────────
            The standard config hero leads the page (headline / subhead / CTAs
            from company.config) and owns the single page <h1>, followed by the
            LogoCloud → FeatureGrid → StatsBar → TestimonialGrid → FAQ → CTA
            sections. The animated HeroInsights overlay is NOT the top hero — it
            renders lower as a mid-page showcase (below). */}
        <MarketingSections />

        {/* ── HeroInsights showcase (mid-page) ──────────────────────────────
            The animated <HeroInsights layout="overlay"> composition — the
            generic /preview art (a fork's hero image) with a score badge and a
            cascade of floating InsightCards that fade in once the image loads
            (reduced-motion shows them immediately). Positioned after the
            features / trusted-by row as a "here's what it looks like" moment,
            before testimonials. The overlay emits no heading, so the config
            hero above keeps the single <h1>. */}
        <SectionWrapper className="bg-[#f8f7f1] dark:bg-background">
          <div className="flex justify-center">
            <HeroInsights
              layout="overlay"
              // Neutral, unbranded placeholder — the generic HeroInsights art
              // from the retired /preview composition. A fork supplies its own
              // hero image; no ContextRocket-specific photo ships in the starter.
              imageSrc="/placeholder.svg"
              className="relative w-full max-w-md"
              imageClassName="relative mx-auto aspect-[3/4] w-full min-h-[480px] max-w-[360px] sm:min-h-[580px] sm:max-h-[580px]"
              scoreBadge={{
                title: t("home.hero.insights.scoreTitle"),
                value: t("home.hero.insights.scoreValue"),
                positionClassName:
                  "top-[280px] sm:top-[340px] right-[10px] sm:right-[20px] w-[80px] sm:w-[100px] text-xs",
                delay: "800ms",
              }}
              cards={heroInsightCards}
            />
          </div>
        </SectionWrapper>

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
