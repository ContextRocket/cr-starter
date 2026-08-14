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
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
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

  return (
    <main>
      <MarketingSections />
      <FeaturedArticles
        posts={samplePosts}
        locale={locale}
        title={t("home.featured.title")}
        subtitle={t("home.featured.subtitle")}
        viewAllLabel={t("home.featured.viewAll")}
      />
    </main>
  );
}
