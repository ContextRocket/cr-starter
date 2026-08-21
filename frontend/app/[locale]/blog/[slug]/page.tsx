/**
 * Blog post page -- /blog/[slug]
 *
 * Renders a single post from the configured Markdown collection
 * ({contentDir}/{slug}[.{locale}].md).
 * The public slug is the filename without the .md extension or locale suffix.
 *
 * SEAM CONTRACT:
 *   One file -- {contentDir}/{slug}.md -- powers:
 *     1. This page (title + body in Markdown).
 *     2. BlogPosting JSON-LD (via buildBlogPostJsonLd in lib/structured-data.ts).
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale, ACTIVE_LOCALES } from "@/i18n/messages";
import { fileBlogAdapter } from "@/lib/blog";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { buildAlternates } from "@/lib/seo";
import {
  buildBreadcrumbListJsonLd,
  buildBlogPostingJsonLd,
} from "@/lib/structured-data";
import { StructuredDataScripts } from "@/components/shared/seo/structured-data-scripts";
import { BlogImage } from "@/components/shared/blog/blog-image";
import { blogBasePath, blogPostPath, blogTitle } from "@/lib/blog-path";
import { siteConfig } from "@/config/site.config";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ACTIVE_LOCALES) {
    for (const post of fileBlogAdapter.list(locale)) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

/**
 * Resolve a post for the requested locale without silently showing a different
 * language. If the exact locale is unavailable, prefer the default locale and
 * finally any available localized file; the caller redirects to that URL.
 */
function findAvailablePost(slug: string, locale: string) {
  const exact = fileBlogAdapter.get(slug, locale);
  if (exact) return { post: exact, locale };

  const defaultLocale = siteConfig.defaultLocale;
  const defaultPost = fileBlogAdapter.get(slug, defaultLocale);
  if (defaultPost) return { post: defaultPost, locale: defaultLocale };

  const anyPost = fileBlogAdapter
    .list()
    .find((candidate) => candidate.slug === slug);
  return anyPost
    ? { post: anyPost, locale: anyPost.locale ?? defaultLocale }
    : null;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);

  const { slug } = await params;
  const resolved = findAvailablePost(slug, locale);
  if (!resolved) return { title: t("blog.not.found") };
  const { post } = resolved;

  return {
    title: `${post.title} | ${siteConfig.companyName}`,
    description: post.excerpt ?? post.bodyMarkdown.slice(0, 200),
    openGraph: post.image ? { images: [{ url: post.image }] } : undefined,
    alternates: buildAlternates(locale, blogPostPath(slug)),
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);

  const resolved = findAvailablePost(slug, locale);
  if (!resolved) notFound();
  const { post, locale: contentLocale } = resolved;
  if (contentLocale !== locale) {
    redirect(`/${contentLocale}${blogPostPath(slug)}`);
  }

  // Optional series ordering enables prev/next between posts.
  const ordered = fileBlogAdapter
    .list(locale)
    .filter((p) => p.series != null)
    .sort((a, b) => (a.series ?? 0) - (b.series ?? 0));
  const idx = ordered.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const seriesPrefix = (n: number) => String(n).padStart(2, "0");

  const readingMinutes = Math.max(
    1,
    Math.round(post.bodyMarkdown.split(/\s+/).filter(Boolean).length / 200),
  );

  // Structured data: Home > Blog > <title> breadcrumb + BlogPosting anchored
  // to the site Organization. Absolute, locale-prefixed URLs.
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const postUrl = `${origin}/${locale}${blogPostPath(post.slug)}`;
  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: t("breadcrumb.home"), url: `${origin}/${locale}` },
    { name: blogTitle(), url: `${origin}/${locale}${blogBasePath()}` },
    { name: post.title, url: postUrl },
  ]);
  const blogPosting = buildBlogPostingJsonLd({
    title: post.title,
    description: post.excerpt ?? post.bodyMarkdown.slice(0, 200),
    url: postUrl,
    datePublished: post.date,
    author: post.author,
    imageUrl: post.image,
  });

  return (
    <>
      <StructuredDataScripts items={[breadcrumb, blogPosting]} />
      <main
        className="min-h-screen bg-warm text-foreground"
        data-testid={`blog-post-${post.slug}`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-3">
                {post.series != null ? (
                  <span className="font-normal text-muted-foreground">
                    {seriesPrefix(post.series)}{" "}
                  </span>
                ) : null}
                {post.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {post.author} &middot;{" "}
                {new Date(post.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  // Fixed UTC so the rendered day never shifts with the client's
                  // timezone (avoids a hydration mismatch).
                  timeZone: "UTC",
                })}{" "}
                &middot; {readingMinutes} {t("blog.min.read")}
              </p>
              {post.excerpt ? (
                <p className="mt-3 text-lg text-muted-foreground">
                  {post.excerpt}
                </p>
              ) : null}
            </header>

            {/* Post hero -- always renders a real image; BlogImage falls back to the
            bundled default when the post has no image or its image 404s. */}
            <BlogImage
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full rounded-xl mb-8 object-cover max-h-96"
            />

            <div className="prose prose-neutral max-w-none">
              {/* Render body as paragraphs split on blank lines. Simple render
              that avoids dangerouslySetInnerHTML. Supports code fences. */}
              {post.bodyMarkdown.split(/\n{2,}/).map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Heading: starts with ##
                if (/^##\s/.test(trimmed)) {
                  const text = trimmed.replace(/^##\s+/, "");
                  return (
                    <h2
                      key={i}
                      className="text-xl font-semibold mt-8 mb-3"
                      id={text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                    >
                      {text}
                    </h2>
                  );
                }

                // Heading: starts with ###
                if (/^###\s/.test(trimmed)) {
                  const text = trimmed.replace(/^###\s+/, "");
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-6 mb-2">
                      {text}
                    </h3>
                  );
                }

                // Code fence
                if (trimmed.startsWith("```")) {
                  const inner = trimmed
                    .replace(/^```[^\n]*\n?/, "")
                    .replace(/\n?```$/, "");
                  return (
                    <pre
                      key={i}
                      className="mt-3 overflow-x-auto rounded-lg bg-muted/80 px-4 py-3 text-xs leading-relaxed"
                    >
                      <code>{inner}</code>
                    </pre>
                  );
                }

                // Horizontal rule
                if (trimmed === "---") {
                  return <hr key={i} className="my-6 border-border" />;
                }

                // Standalone image: a block that is only a Markdown image.
                const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
                if (imageMatch) {
                  const [, alt, src] = imageMatch;
                  return (
                    <Image
                      key={i}
                      src={src}
                      alt={alt}
                      width={1200}
                      height={800}
                      className="my-8 h-auto w-full rounded-xl object-cover"
                    />
                  );
                }

                // Inline Markdown (links, bold, images, code) via the shared helper.
                return (
                  <p
                    key={i}
                    className="mt-3 leading-7"
                    dangerouslySetInnerHTML={{
                      __html: renderInlineMarkdown(trimmed),
                    }}
                  />
                );
              })}
            </div>
          </article>

          {prev || next ? (
            <nav className="mt-12 flex justify-between gap-4 border-y border-border py-4 text-sm">
              {prev ? (
                <Link
                  href={blogPostPath(prev.slug)}
                  className="text-muted-foreground hover:underline"
                >
                  &larr;{" "}
                  {prev.series != null ? seriesPrefix(prev.series) + " " : ""}
                  {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={blogPostPath(next.slug)}
                  className="ml-auto text-right text-muted-foreground hover:underline"
                >
                  {next.series != null ? seriesPrefix(next.series) + " " : ""}
                  {next.title} &rarr;
                </Link>
              ) : null}
            </nav>
          ) : null}

          <nav className="mt-8 text-sm flex justify-between">
            <Link
              href={blogBasePath()}
              className="text-muted-foreground hover:underline"
            >
              &larr; {t("blog.back.to.list")}
            </Link>
            <Link href="/" className="text-muted-foreground hover:underline">
              {t("blog.back.home")}
            </Link>
          </nav>
        </div>
      </main>
    </>
  );
}
