/**
 * /preview — a static preview of the full marketing composition.
 *
 * This page renders <MarketingSections /> from `company.config.ts` so the
 * static build exercises the entire section library from the single content
 * SoT. It is not part of the public site (noindex) — it exists to prove the
 * company-config → section bridge renders and statically exports.
 */

import { MarketingSections } from "@/components/sections/marketing-sections";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { IntegrationsSection } from "@/components/sections/integrations-section";
import { CtaSubscribeSection } from "@/components/sections/cta-subscribe-section";
import {
  PricingSection,
  type PricingTier,
  TeamSection,
  HeroInsights,
  type HeroInsightCard,
} from "@/components/sections";
import {
  BoltIcon,
  GlobeAltIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { en } from "@/i18n/messages/en";
import type { BlogPost } from "@/lib/blog";

export const metadata = {
  robots: { index: false, follow: false },
};

// Inline sample posts so the preview does not depend on blog content existing.
const samplePosts: BlogPost[] = [
  {
    slug: "sample-one",
    title: "A sample article",
    author: "Author Name",
    date: "2026-01-15",
    excerpt: "A short teaser describing what this article covers.",
    bodyMarkdown: "",
  },
  {
    slug: "sample-two",
    title: "Another sample article",
    author: "Author Name",
    date: "2026-01-10",
    excerpt: "A second teaser for the featured-articles preview.",
    bodyMarkdown: "",
  },
];

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);

  // Feature lists are modeled as indexed string keys (features.0, features.1,
  // …); t() returns strings only, so we read the count from the `en` reference
  // tree and resolve each line via t() in the active locale.
  const featureLines = (tierId: "standard" | "enterprise"): string[] =>
    Object.keys(en.preview.pricing[tierId].features).map((i) =>
      t(`preview.pricing.${tierId}.features.${i}`),
    );

  const pricingTiers: PricingTier[] = [
    {
      id: "standard",
      name: t("preview.pricing.standard.name"),
      priceMonthly: t("preview.pricing.standard.price"),
      description: t("preview.pricing.standard.description"),
      features: featureLines("standard"),
      ctaText: t("preview.pricing.standard.cta"),
      ctaHref: "/waitlist",
    },
    {
      id: "enterprise",
      name: t("preview.pricing.enterprise.name"),
      priceMonthly: t("preview.pricing.enterprise.price"),
      description: t("preview.pricing.enterprise.description"),
      features: featureLines("enterprise"),
      ctaText: t("preview.pricing.enterprise.cta"),
      ctaHref: "/waitlist",
      featured: true,
    },
  ];

  const heroInsightIcons = [
    <BoltIcon key="bolt" className="size-5" />,
    <GlobeAltIcon key="globe" className="size-5" />,
    <ArrowPathIcon key="refresh" className="size-5" />,
  ];
  const heroInsightMeta: Array<{
    color: HeroInsightCard["color"];
    positionClassName: string;
    delay: string;
  }> = [
    { color: "blue", positionClassName: "top-[40px] left-[10px] w-[280px]", delay: "1000ms" },
    { color: "yellow", positionClassName: "top-[220px] left-[10px] w-[280px]", delay: "1300ms" },
    { color: "green", positionClassName: "bottom-[40px] left-[10px] w-[280px]", delay: "1600ms" },
  ];
  const heroInsightCards: HeroInsightCard[] = Object.keys(
    en.preview.heroInsights.cards,
  ).map((i, idx) => ({
    color: heroInsightMeta[idx].color,
    icon: heroInsightIcons[idx],
    title: t(`preview.heroInsights.cards.${i}.title`),
    description: t(`preview.heroInsights.cards.${i}.desc`),
    positionClassName: heroInsightMeta[idx].positionClassName,
    delay: heroInsightMeta[idx].delay,
  }));

  const teamBio = Object.keys(en.preview.team.mark.bio).map((i) =>
    t(`preview.team.mark.bio.${i}`),
  );

  return (
    <main>
      <MarketingSections />
      <IntegrationsSection
        logos={[
          { src: "/icon-192.png", alt: "Integration one" },
          { src: "/icon-192.png", alt: "Integration two" },
          { src: "/icon-192.png", alt: "Integration three" },
        ]}
        label={t("home.integrations.label")}
        title={t("home.integrations.title")}
        paragraphs={[
          t("home.integrations.body1"),
          t("home.integrations.body2"),
        ]}
        cta={{ label: t("home.integrations.cta"), href: "/features" }}
      />
      <FeaturedArticles
        posts={samplePosts}
        locale={locale}
        title={t("home.featured.title")}
        subtitle={t("home.featured.subtitle")}
        viewAllLabel={t("home.featured.viewAll")}
      />
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

      <PricingSection
        title={t("preview.pricing.title")}
        subtitle={t("preview.pricing.subtitle")}
        perMonthLabel={t("preview.pricing.perMonth")}
        tiers={pricingTiers}
      />

      <TeamSection
        title={t("preview.team.title")}
        subtitle={t("preview.team.subtitle")}
        members={[
          {
            name: "Mark MacMahon",
            role: t("preview.team.mark.role"),
            bioParagraphs: teamBio,
            // Preview placeholder — a fork supplies its own team photo; the starter ships no brand image.
            imageUrl: "/icon-512.png",
          },
        ]}
      />

      <div className="px-6 py-24 sm:py-32">
        <div className="relative mx-auto aspect-[3/4] max-w-[360px]">
          <HeroInsights
            // Preview placeholder — a fork supplies its own team photo; the starter ships no brand image.
            imageSrc="/icon-512.png"
            imageClassName="relative h-full w-full"
            scoreBadge={{
              title: t("preview.heroInsights.scoreTitle"),
              value: t("preview.heroInsights.scoreValue"),
              positionClassName: "top-[10px] right-[10px]",
              delay: "800ms",
            }}
            cards={heroInsightCards}
          />
        </div>
      </div>
    </main>
  );
}
