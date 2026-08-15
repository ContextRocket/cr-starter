/**
 * MarketingSections — renders a company/marketing home from the single typed
 * content SoT in `company.config.ts`. It bridges that content object onto the
 * existing prop-based section library, rendering ONLY the sections present in
 * the config, in a fixed marketing order:
 *
 *   Hero → LogoCloud → FeatureGrid → StatsBar → TestimonialGrid → FaqSection → CtaSection
 *
 * A company fork points a page at <MarketingSections /> and edits copy in
 * `company.config.ts` alone. Field-name mismatches between the content SoT and
 * the section props are resolved here (the only bridge), so the section
 * components keep their generic prop APIs.
 *
 * The starter home renders its own image-overlay hero (the animated
 * <HeroInsights layout="overlay"> hero, see app/[locale]/page.tsx) ABOVE these
 * sections, so it passes `renderHero={false}` to suppress the generic config
 * hero here and avoid a duplicate <h1>. Other pages that want the plain
 * config-driven hero keep the default (`renderHero` true).
 */

import Image from "next/image";
import { company, type CompanyConfig } from "@/company.config";
import { HeroSection, type HeroAction } from "./hero";
import { LogoCloud } from "./logo-cloud";
import { FeatureGrid } from "./feature-grid";
import { StatsBar } from "./stats-bar";
import { TestimonialGrid } from "./testimonial-grid";
import { FaqSection } from "./faq-section";
import { CtaSection } from "./cta-section";

export function MarketingSections({
  config = company,
  renderHero = true,
}: {
  config?: CompanyConfig;
  /**
   * When false, the config-driven <HeroSection> (headline/subhead/CTAs) is not
   * rendered — used by the starter home, which renders its own overlay hero and
   * owns the single page <h1>. Sections below the hero render as usual.
   */
  renderHero?: boolean;
}) {
  const { hero, logos, features, stats, testimonials, faq, cta } = config;

  // Hero actions: primary + secondary CTAs, each only when present.
  const heroActions: HeroAction[] = [];
  if (hero?.primaryCta) {
    heroActions.push({ ...hero.primaryCta, variant: "primary" });
  }
  if (hero?.secondaryCta) {
    heroActions.push({ ...hero.secondaryCta, variant: "outline" });
  }

  return (
    <>
      {renderHero && hero && (
        <HeroSection
          title={hero.headline}
          description={hero.subhead ?? ""}
          actions={heroActions.length > 0 ? heroActions : undefined}
        >
          {hero.image && (
            <div className="mt-16 flex justify-center">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={960}
                height={540}
                className="h-auto w-full max-w-4xl rounded-2xl border border-border"
              />
            </div>
          )}
        </HeroSection>
      )}

      {logos && <LogoCloud heading={logos.heading} items={logos.items} />}

      {features && (
        <FeatureGrid
          label={features.label}
          title={features.title}
          subtitle={features.subtitle}
          items={features.items.map((item) => ({
            title: item.title,
            description: item.description,
          }))}
        />
      )}

      {stats && stats.length > 0 && <StatsBar items={stats} />}

      {testimonials && (
        <TestimonialGrid
          label={testimonials.label}
          title={testimonials.title}
          items={testimonials.items.map((t) => ({
            quote: t.quote,
            name: t.author,
            role: [t.role, t.company].filter(Boolean).join(", ") || undefined,
            avatar: t.avatar,
          }))}
        />
      )}

      {faq && <FaqSection title={faq.title} items={faq.items} />}

      {cta && (
        <CtaSection
          title={cta.headline}
          description={cta.subhead ?? ""}
          action={cta.cta}
        />
      )}
    </>
  );
}
