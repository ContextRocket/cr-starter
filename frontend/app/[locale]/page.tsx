/**
 * Home page — the config-driven marketing home with the classic HeroInsights
 * image-overlay hero.
 *
 * The hero is the animated <HeroInsights layout="overlay"> composition: a hero
 * image with a score badge and a cascade of floating InsightCards that fade in
 * once the image loads (reduced-motion shows them immediately). Below it the
 * full section library renders from the single content SoT (`company.config.ts`)
 * via <MarketingSections renderHero={false} /> — the config hero is suppressed
 * so this page owns the single <h1> (the company hero headline). A blog teaser
 * (only when posts exist) and a newsletter CTA close the page. Identity/JSON-LD
 * come from site.config and the structured-data builder — no hardcoded brand
 * copy here. The navbar + footer are provided by the [locale] layout's
 * <SiteChrome>, so this page renders only its <main> content.
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
import { company } from "@/company.config";
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

  // Hero CTAs from company.config (each rendered only when present).
  const heroCtas: { label: string; href: string; variant: "primary" | "outline" }[] =
    [];
  if (company.hero?.primaryCta) {
    heroCtas.push({ ...company.hero.primaryCta, variant: "primary" });
  }
  if (company.hero?.secondaryCta) {
    heroCtas.push({ ...company.hero.secondaryCta, variant: "outline" });
  }

  const ctaClass: Record<"primary" | "outline", string> = {
    primary:
      "inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-base font-semibold text-brand-accent-foreground shadow-sm transition-all hover:bg-brand-accent-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    outline:
      "inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  };

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
        {/* ── Overlay hero (the classic HeroInsights look) ──────────────────
            Two columns: headline/subhead/CTAs on the left, the animated
            image-overlay panel on the right. The panel is
            <HeroInsights layout="overlay"> — a hero image with a score badge
            and floating InsightCards that cascade in once the image loads
            (reduced-motion shows them immediately). This page owns the single
            <h1>, so MarketingSections renders with renderHero={false}. */}
        <SectionWrapper className="bg-[#f8f7f1] dark:bg-background" padding="tight">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="w-full md:w-7/12">
              <div className="mx-auto max-w-2xl">
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                  {company.hero?.headline}
                </h1>
                {company.hero?.subhead && (
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    {company.hero.subhead}
                  </p>
                )}
                {heroCtas.length > 0 && (
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {heroCtas.map((cta) => (
                      <Link
                        key={cta.label}
                        href={cta.href}
                        className={ctaClass[cta.variant]}
                      >
                        {cta.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image-overlay engine: fixed aspect + min-height so the fill
                image reserves space (no layout shift) before it loads. */}
            <HeroInsights
              layout="overlay"
              imageSrc="/hero-girl.png"
              className="relative order-first w-full md:order-last md:w-5/12"
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

        <MarketingSections renderHero={false} />

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
