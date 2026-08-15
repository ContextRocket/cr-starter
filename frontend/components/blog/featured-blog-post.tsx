"use client";

/**
 * FeaturedBlogPost -- large hero card for a promoted post on the blog index.
 *
 * Adapted from cr-frontend's featured card to cr-starter's simpler BlogPost
 * shape (author is a plain string; no tags/readTime/draft/style fields). Read
 * time is derived from the body word count. Colors come from theme tokens
 * (primary, muted-foreground, bg-warm-surface) -- no hardcoded palette.
 *
 * When `post.image` is absent, a graceful gradient fallback fills the 16:9
 * frame so the grid stays visually consistent.
 */

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { t } from "@/i18n/keys";
import { cn } from "@/lib/utils";
import { blogPostPath } from "@/lib/blog-path";
import type { BlogPost } from "@/lib/blog";

interface FeaturedBlogPostProps {
  post: BlogPost;
  locale: string;
}

function readMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

export function FeaturedBlogPost({ post, locale }: FeaturedBlogPostProps) {
  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const minutes = readMinutes(post.bodyMarkdown);

  return (
    <article
      data-testid={`blog-post-${post.slug}`}
      className="bg-warm-surface rounded-xl border border-card-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <Link href={blogPostPath(post.slug)} className="group block">
        {/* Image (16:9) with graceful fallback */}
        <div className="aspect-[16/9] relative overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/40" />
          )}
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {t("blog.featured")}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}
          <div
            className={cn(
              "flex items-center gap-3 pt-4 border-t border-border text-xs text-muted-foreground",
            )}
          >
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
