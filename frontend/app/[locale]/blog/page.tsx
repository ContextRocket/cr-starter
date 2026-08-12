/**
 * Blog listing page -- /blog
 *
 * Renders all blog posts from content/blog/, sorted by date descending.
 * Each post card shows title, author, date, and excerpt.
 *
 * The blog seam (frontend/lib/blog.ts) reads markdown files at build time.
 * Parse errors fail the build loudly.
 */

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { fileBlogAdapter } from "@/lib/blog";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  return {
    title: t("blog.title"),
    description: t("blog.description"),
    robots: { index: true, follow: true },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  const posts = fileBlogAdapter.list();

  return (
    <main
      className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto"
      data-testid="blog-page"
    >
      <h1 className="text-3xl font-bold mb-2">{t("blog.title")}</h1>
      <p className="text-sm text-muted-foreground mb-10">
        {t("blog.description")}
      </p>

      {posts.length === 0 ? (
        <p
          className="text-sm text-muted-foreground"
          data-testid="blog-empty"
        >
          {t("blog.empty")}
        </p>
      ) : (
        <section aria-label={t("blog.title")} className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              data-testid={`blog-post-${post.slug}`}
              className="border-b border-border pb-6 last:border-0"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block space-y-2"
              >
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {post.author} &middot;{" "}
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {post.excerpt ? (
                  <p className="text-sm text-muted-foreground leading-6">
                    {post.excerpt}
                  </p>
                ) : null}
              </Link>
            </article>
          ))}
        </section>
      )}

      <nav className="mt-12 text-sm">
        <Link href="/" className="text-muted-foreground hover:underline">
          &larr; {t("blog.back.home")}
        </Link>
      </nav>
    </main>
  );
}
