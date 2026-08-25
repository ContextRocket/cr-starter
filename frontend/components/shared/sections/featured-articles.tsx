import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { blogBasePath, blogPostPath } from "@/lib/blog-path";
import { BlogImage } from "@/components/shared/blog/blog-image";
import type { BlogPost } from "@/lib/blog";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";
import { FadeIn } from "@/components/shared/ui/motion";

/**
 * FeaturedArticles -- a "latest / featured posts" strip for the home page.
 *
 * Content-agnostic and props-driven (cr-starter convention): the caller passes
 * the posts (e.g. `fileBlogAdapter.list().slice(0, 2)`) and the labels, so copy
 * stays in i18n/config at the call site. Cards animate in via AOS (FadeIn).
 * Renders nothing when there are no posts.
 */
export interface FeaturedArticlesProps {
  posts: BlogPost[];
  /** Section heading. */
  title: string;
  /** Optional supporting line under the heading. */
  subtitle?: string;
  /** "View all" link label; when set, a link to `viewAllHref` is shown. */
  viewAllLabel?: string;
  /**
   * Destination for the "view all" link. Defaults to the configured blog base
   * path (siteConfig.blog.basePath, "/blog" by default) so a fork's custom
   * segment is honored without the caller passing it.
   */
  viewAllHref?: string;
  /** Max cards to show (default 2). */
  max?: number;
  /** BCP-47 locale for date formatting (default "en"). */
  locale?: string;
  className?: string;
  /** Section background -- uses siteConfig.theme tokens. */
  backgroundClass?: string;
}

export function FeaturedArticles({
  posts,
  title,
  subtitle,
  viewAllLabel,
  viewAllHref = blogBasePath(),
  max = 2,
  locale = "en",
  className,
  backgroundClass = "bg-muted",
}: FeaturedArticlesProps) {
  const shown = posts.slice(0, max);
  if (shown.length === 0) return null;

  return (
    <SectionWrapper
      padding="tight"
      backgroundClass={backgroundClass}
      className={className}
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          {title}
        </h2>
        {viewAllLabel ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary-hover"
          >
            {viewAllLabel}
            <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </div>

      {subtitle ? (
        <p className="mb-8 text-sm md:text-base text-muted-foreground">
          {subtitle}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {shown.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.1}>
            <Link
              href={blogPostPath(post.slug)}
              className="group block h-full overflow-hidden rounded-xl border border-card-border bg-card shadow-sm transition-shadow hover:shadow-md"
              data-testid={`featured-post-${post.slug}`}
            >
              {/* Always render a real image; BlogImage falls back to the
                  bundled default when the post has no image or its image 404s. */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <BlogImage
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {post.series != null ? (
                    <span className="font-normal text-muted-foreground">
                      {String(post.series).padStart(2, "0")}{" "}
                    </span>
                  ) : null}
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {post.author} &middot;{" "}
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    // Fixed UTC so the rendered day never shifts with the
                    // client's timezone (avoids a hydration mismatch).
                    timeZone: "UTC",
                  })}
                </p>
                {post.excerpt ? (
                  <p className={cn("text-sm leading-6 text-muted-foreground")}>
                    {post.excerpt}
                  </p>
                ) : null}
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
