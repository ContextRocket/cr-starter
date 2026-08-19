/**
 * Blog listing page -- /blog
 *
 * A conventional, statically-generated blog index: a hero (title + subtitle),
 * a Featured section, and an All-posts grid. Posts come from content/blog/ via
 * the blog seam (frontend/lib/blog.ts), which reads markdown at build time;
 * parse errors fail the build loudly.
 *
 * FEATURED DETERMINATION:
 *   - Posts with `featured: true` in frontmatter fill the Featured section.
 *   - If NO post is marked featured, the newest post is promoted to Featured so
 *     the section always has content on a fresh install.
 *   - Everything not featured renders in the All-posts grid.
 *
 * FEATURE FLAG:
 *   - Gated on siteConfig.features.blog. When false, the page renders an empty
 *     state instead of content (the nav link is hidden separately in the site
 *     chrome). cr-starter defaults the flag ON.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { fileBlogAdapter, type BlogPost } from "@/lib/blog";
import { buildAlternates } from "@/lib/seo";
import { buildBreadcrumbListJsonLd } from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import { BlogPostCard } from "@/components/shared/blog/blog-post-card";
import { FeaturedBlogPost } from "@/components/shared/blog/featured-blog-post";
import { blogBasePath, blogTitle } from "@/lib/blog-path";
import { siteConfig } from "@/config/site.config";

export const dynamic = "force-static";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  return {
    // Title comes from siteConfig.blog.title so a fork can rename the blog
    // (e.g. "The Creator Economy for B2B") without touching i18n copy.
    title: blogTitle(),
    description: t("blog.description"),
    alternates: buildAlternates(locale, blogBasePath()),
    robots: { index: true, follow: true },
  };
}

/**
 * Split posts into [featured, rest]. Explicit `featured: true` wins; if no post
 * is flagged, the newest post (index 0 of the date-sorted list) is promoted so
 * the Featured section is never empty on a fresh install.
 */
function splitFeatured(posts: BlogPost[]): [BlogPost[], BlogPost[]] {
  const flagged = posts.filter((p) => p.featured);
  if (flagged.length > 0) {
    return [flagged, posts.filter((p) => !p.featured)];
  }
  if (posts.length === 0) return [[], []];
  return [[posts[0]], posts.slice(1)];
}

export default async function BlogPage({ params }: BlogPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);

  const blogEnabled = siteConfig.features.blog;

  // Order by series (ascending) when posts declare one; otherwise newest first.
  const posts = blogEnabled
    ? fileBlogAdapter.list(locale).sort((a, b) => {
        if (a.series != null && b.series != null) return a.series - b.series;
        if (a.series != null) return -1;
        if (b.series != null) return 1;
        return a.date < b.date ? 1 : -1;
      })
    : [];

  const [featured, rest] = splitFeatured(posts);

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: blogTitle(), url: `${origin}/${locale}${blogBasePath()}` },
  ]);

  return (
    <>
      <StructuredDataScripts items={[breadcrumb]} />
      <main
        className="bg-warm min-h-screen text-foreground"
        data-testid="blog-page"
      >
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {blogTitle()}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </section>

        {!blogEnabled || posts.length === 0 ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p
              className="text-sm text-muted-foreground"
              data-testid="blog-empty"
            >
              {t("blog.empty")}
            </p>
          </section>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t("blog.featured")}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featured.slice(0, 2).map((post) => (
                    <FeaturedBlogPost
                      key={post.slug}
                      post={post}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All posts */}
            {rest.length > 0 && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t("blog.all_posts")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <BlogPostCard key={post.slug} post={post} locale={locale} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-sm">
          <Link href="/" className="text-muted-foreground hover:underline">
            &larr; {t("blog.back.home")}
          </Link>
        </nav>
      </main>
    </>
  );
}
