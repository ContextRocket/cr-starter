"use client";

/**
 * BlogPostCard -- standard card for a post in the all-posts grid on the blog
 * index.
 *
 * Adapted from cr-frontend's card to cr-starter's simpler BlogPost shape
 * (author is a plain string; no tags/readTime/draft/style fields). Read time is
 * derived from the body word count. Colors come from theme tokens -- no
 * hardcoded palette. When `post.image` is absent, a gradient fallback fills the
 * 16:9 frame.
 */

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/keys";
import type { BlogPost } from "@/lib/blog";

interface BlogPostCardProps {
  post: BlogPost;
  locale: string;
}

function readMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const minutes = readMinutes(post.bodyMarkdown);

  return (
    <article
      data-testid={`blog-post-${post.slug}`}
      className="bg-warm-surface rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        {/* Image (16:9) with graceful fallback */}
        <div className="aspect-[16/9] relative overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/40" />
          )}
          {post.series != null ? (
            <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {String(post.series).padStart(2, "0")}
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{formattedDate}</span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {minutes} {t("blog.min.read")}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
