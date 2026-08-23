/**
 * Home page -- the i18n-driven marketing home.
 *
 * All human-readable copy resolves through t("home.*") keys in the site i18n
 * slice; structural data (stat values, nav, identity) comes from site.json via
 * siteConfig. The page owns the single <h1> (hero headline) and is followed by
 * the Features → Carousel → ValueProps → Bento → Stats → Testimonials →
 * FeaturedArticles → Subscribe sections. Optional showcase components remain
 * available in shared/ for forks, while the starter home stays compact and
 * neutral. A blog teaser (only when posts exist) and a newsletter CTA close
 * the page. Identity/JSON-LD come from site.config and the structured-data
 * builder -- no hardcoded brand copy here. The navbar + footer are provided by
 * the [locale] layout's <SiteChrome>, so this page renders only its <main>.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  ChartBarIcon,
  EyeIcon,
  LightBulbIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { buildHomeJsonLd } from "@/lib/structured-data";
import { buildAlternates } from "@/lib/seo";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";
import { HeroBackgroundSection } from "@/components/shared/sections/hero-background";
import { FeaturedArticles } from "@/components/shared/sections/featured-articles";
import { CtaSubscribeSection } from "@/components/shared/sections/cta-subscribe-section";
import { TestimonialsSection } from "@/components/shared/sections/testimonials-section";
import { ImageCarousel } from "@/components/shared/ui/image-carousel";
import { ValuePropGrid } from "@/components/shared/ui/value-prop";
import { BentoGrid, BentoCard } from "@/components/shared/ui/bento-grid";
import { StatsSection } from "@/components/shared/ui/stats-section";
import { fileBlogAdapter } from "@/lib/blog";
import { getItemReviewed, getTestimonials } from "@/lib/testimonials";
import { buildTestimonialsJsonLd } from "@/lib/testimonials-jsonld";
import { siteConfig } from "@/config/site.config";

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
  const featuredPosts = fileBlogAdapter.list(locale).slice(0, 3);

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
        {/* ── Hero section ────────────────────────────────────────────────────── */}
        <HeroBackgroundSection
          imageSrc="/images/blog/default-post.jpg"
          imageClassName="object-cover object-center grayscale brightness-75"
          overlayClassName="bg-gradient-to-b from-black/60 via-black/35 to-black/80"
          className="bg-slate-950 pt-32 pb-24 text-white sm:pb-32"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("home.hero.headline")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
              {t("home.hero.subhead")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={siteConfig.paths.chat}
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {t("home.hero.primaryCta")}
              </a>
              <a
                href={siteConfig.paths.features}
                className="text-sm font-semibold leading-6 text-white transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {t("home.hero.secondaryCta")} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </HeroBackgroundSection>

        {/* ── Features section ─────────────────────────────────────────────────── */}
        <SectionWrapper className="bg-muted/50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">
                {t("home.features.label")}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("home.features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("home.features.subtitle")}
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
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
              ].map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* ── Image carousel with value propositions ──────────────────────────
            Showcases key value propositions with beautiful imagery and smooth
            transitions. Images are from Unsplash (attributed in content/attributions.json). */}
        <SectionWrapper className="bg-background">
          <div className="mx-auto max-w-6xl">
            <ImageCarousel
              slides={[
                {
                  image: "/images/blog/ai-brain-future.jpg",
                  alt: t("home.carousel.alt1"),
                  title: t("home.carousel.title"),
                  description: t("home.carousel.description"),
                },
                {
                  image: "/images/blog/ai-robot-hands.jpg",
                  alt: t("home.carousel.alt2"),
                  title: t("home.carousel.title2"),
                  description: t("home.carousel.description2"),
                },
                {
                  image: "/images/blog/programming-setup.jpg",
                  alt: t("home.carousel.alt3"),
                  title: t("home.carousel.title3"),
                  description: t("home.carousel.description3"),
                },
              ]}
              className="mx-auto max-w-4xl"
            />
          </div>
        </SectionWrapper>

        {/* ── Value propositions ───────────────────────────────────────────────
            Three key benefits with animated cards and icons. */}
        <SectionWrapper className="bg-muted/50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("home.valueProps.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("home.valueProps.subtitle")}
              </p>
            </div>
            <ValuePropGrid
              items={[
                {
                  icon: <EyeIcon className="h-6 w-6" />,
                  title: t("home.valueProps.see.title"),
                  description: t("home.valueProps.see.description"),
                },
                {
                  icon: <LightBulbIcon className="h-6 w-6" />,
                  title: t("home.valueProps.fix.title"),
                  description: t("home.valueProps.fix.description"),
                },
                {
                  icon: <CogIcon className="h-6 w-6" />,
                  title: t("home.valueProps.stay.title"),
                  description: t("home.valueProps.stay.description"),
                },
              ]}
              className="mt-12"
            />
          </div>
        </SectionWrapper>

        {/* ── Bento grid showcase ──────────────────────────────────────────────
            Modern bento-box layout showcasing key capabilities. */}
        <SectionWrapper className="bg-background">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("home.bento.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("home.bento.subtitle")}
              </p>
            </div>
            <BentoGrid>
              <BentoCard
                title={t("home.bento.context.title")}
                description={t("home.bento.context.description")}
                icon={<ShieldCheckIcon className="h-5 w-5" />}
                span="col-2"
              />
              <BentoCard
                title={t("home.bento.realtime.title")}
                description={t("home.bento.realtime.description")}
                icon={<BoltIcon className="h-5 w-5" />}
              />
              <BentoCard
                title={t("home.bento.multi.title")}
                description={t("home.bento.multi.description")}
                icon={<GlobeAltIcon className="h-5 w-5" />}
              />
              <BentoCard
                title={t("home.bento.provenance.title")}
                description={t("home.bento.provenance.description")}
                icon={<ChartBarIcon className="h-5 w-5" />}
                span="col-2"
              />
            </BentoGrid>
          </div>
        </SectionWrapper>

        {/* ── Stats section ────────────────────────────────────────────────────
            Key metrics with animated counters. */}
        <StatsSection
          stats={siteConfig.stats.map((s) => ({
            value: s.value,
            label: t(s.labelKey),
          }))}
          className="bg-muted/50"
        />

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
