"use client";

/**
 * BlogImage — a resilient hero/card image for blog posts.
 *
 * WHY: a post's `image` frontmatter is optional and may point at an asset that
 * no longer exists (a moved/renamed file). Rendering a bare <img>/next Image
 * for a missing source yields a broken-image icon — never acceptable in the
 * "From the blog" cards or on a post page. This component guarantees a real
 * image always renders:
 *
 *   1. No `src` (frontmatter omitted `image`) → render DEFAULT_BLOG_IMAGE.
 *   2. `src` fails to load at runtime            → swap to DEFAULT_BLOG_IMAGE.
 *
 * DEFAULT_BLOG_IMAGE is a bundled Unsplash asset (credited on /attribution).
 * The onError swap needs a client boundary; the surrounding cards/pages remain
 * server components and just render this leaf.
 *
 * Layout is caller-controlled: pass either `fill` (the parent must be
 * positioned) or explicit `width`/`height`, mirroring next/image's API for the
 * two blog layouts (16:9 fill cards + fixed-size post hero).
 */

import { useState } from "react";
import Image from "next/image";

/** Fallback hero image used when a post has no image or its image 404s. */
export const DEFAULT_BLOG_IMAGE = "/images/blog/default-featured.jpg";

type BlogImageProps = {
  /** Post image path; when falsy, the default is rendered immediately. */
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

export function BlogImage({
  src,
  alt,
  className,
  sizes,
  fill,
  width,
  height,
}: BlogImageProps) {
  const [current, setCurrent] = useState<string>(src || DEFAULT_BLOG_IMAGE);

  const handleError = () => {
    if (current !== DEFAULT_BLOG_IMAGE) setCurrent(DEFAULT_BLOG_IMAGE);
  };

  if (fill) {
    return (
      <Image
        src={current}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  );
}
