/**
 * /landing/1 — an example landing page (noindex reference).
 *
 * A fork starting from cr-starter gets a full landing-page reference here: it
 * showcases the shared <HeroInsights> metric panel rendered from
 * `company.config.ts` (the SAME content the home uses), wrapped by the standard
 * site chrome (nav + footer come from the [locale] layout). Adopt this layout,
 * or promote it to `/` — it is deliberately generic.
 *
 * noindex (robots.index=false, follow=true) so this reference page never
 * competes with the real home for the same content in search.
 */

import type { Metadata } from "next";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { company } from "@/company.config";
import { HeroInsights } from "@/components/sections";

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  return {
    title: t("landing.meta.title"),
    description: t("landing.meta.description"),
    robots: { index: false, follow: true },
  };
}

export default async function LandingOne({ params }: LandingPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);

  const heroInsights = company.heroInsights;

  return (
    <main>
      <section className="mx-auto max-w-screen-xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          {t("landing.intro")}
        </p>
      </section>

      {/* The shared HeroInsights panel, driven by company.config.heroInsights.
          Renders only when the config block is present. */}
      {heroInsights && (
        <HeroInsights
          layout="grid"
          headline={heroInsights.headline}
          subhead={heroInsights.subhead}
          items={heroInsights.items}
        />
      )}
    </main>
  );
}
