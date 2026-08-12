/**
 * Blog post page -- /blog/[slug]
 *
 * Renders a single blog post from content/blog/{slug}.md.
 * The slug is the filename without the .md extension.
 *
 * SEAM CONTRACT:
 *   One file -- content/blog/{slug}.md -- powers:
 *     1. This page (title + body in Markdown).
 *     2. BlogPosting JSON-LD (via buildBlogPostJsonLd in lib/structured-data.ts).
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { fileBlogAdapter } from "@/lib/blog";
import { siteConfig } from "@/site.config";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);

  const { slug } = await params;
  const post = fileBlogAdapter.get(slug);
  if (!post) return { title: t("blog.not.found") };

  return {
    title: `${post.title} | ${siteConfig.companyName}`,
    description: post.excerpt ?? post.bodyMarkdown.slice(0, 200),
    openGraph: post.image
      ? { images: [{ url: post.image }] }
      : undefined,
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  setLocale(locale);

  const post = fileBlogAdapter.get(slug);
  if (!post) notFound();

  return (
    <main
      className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto"
      data-testid={`blog-post-${post.slug}`}
    >
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {post.author} &middot;{" "}
            {new Date(post.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={630}
            className="w-full rounded-xl mb-8 object-cover max-h-96"
          />
        ) : null}

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
                <h3
                  key={i}
                  className="text-lg font-semibold mt-6 mb-2"
                >
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

            // Inline code (backtick-wrapped)
            const withInlineCode = trimmed.replace(
              /`([^`]+)`/g,
              (_match: string, code: string) =>
                `<code class="bg-muted px-1 rounded text-xs font-mono">${code}</code>`,
            );

            // Horizontal rule
            if (trimmed === "---") {
              return <hr key={i} className="my-6 border-border" />;
            }

            return (
              <p
                key={i}
                className="mt-3 leading-7"
                dangerouslySetInnerHTML={{ __html: withInlineCode }}
              />
            );
          })}
        </div>
      </article>

      <nav className="mt-12 pt-6 border-t border-border text-sm flex justify-between">
        <Link href="/blog" className="text-muted-foreground hover:underline">
          &larr; {t("blog.back.to.list")}
        </Link>
        <Link href="/" className="text-muted-foreground hover:underline">
          {t("blog.back.home")}
        </Link>
      </nav>
    </main>
  );
}
