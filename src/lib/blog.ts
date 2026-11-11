import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { siteConfig } from "@/config/site.config";
import type { SupportedLocale } from "@/i18n/locales";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  image?: string;
  excerpt?: string;
  series?: number;
  featured?: boolean;
  draft: boolean;
  songTitle?: string;
  songArtist?: string;
  songYear?: string;
  songUrl?: string;
  locale: SupportedLocale | "shared";
};

export type BlogPost = BlogPostMeta & {
  bodyHtml: string;
  bodyMarkdown: string;
};

function addDeferredImageHints(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    const hasExplicitPriority = /\bfetchpriority\s*=\s*["']?high\b/i.test(next);
    if (!/\bloading\s*=/i.test(next) && !hasExplicitPriority) {
      next = next.replace(/^<img\b/i, '<img loading="lazy"');
    }
    if (!/\bdecoding\s*=/i.test(next)) {
      next = next.replace(/^<img\b/i, '<img decoding="async"');
    }
    return next;
  });
}

function contentRoot(): string {
  return path.join(process.cwd(), siteConfig.blog.contentDir);
}

function parseFilename(file: string): {
  slug: string;
  locale: SupportedLocale | "shared";
} | null {
  if (!file.endsWith(".md")) return null;
  const base = file.slice(0, -3);
  const match = base.match(/^(.*)\.(en|es|de)$/);
  if (match) {
    return { slug: match[1], locale: match[2] as SupportedLocale };
  }
  return { slug: base, locale: "shared" };
}

function optionalBoolean(
  value: unknown,
  field: "draft" | "featured",
  filePath: string,
): boolean {
  if (value === undefined) return false;
  if (typeof value !== "boolean") {
    throw new Error(
      `Blog post ${filePath} has invalid ${field}; use true or false without quotes`,
    );
  }
  return value;
}

function postDate(value: unknown, filePath: string): string {
  const date =
    value instanceof Date
      ? Number.isNaN(value.getTime())
        ? ""
        : value.toISOString().slice(0, 10)
      : typeof value === "string"
        ? value.trim()
        : "";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00.000Z`)
    : null;
  if (
    !parsed ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Blog post ${filePath} requires a valid YYYY-MM-DD date`);
  }
  return date;
}

function readPostFile(
  filePath: string,
  slug: string,
  locale: SupportedLocale | "shared",
): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(
      `Blog post ${filePath} requires a non-empty string title`,
    );
  }
  const date = postDate(data.date, filePath);
  const draft = optionalBoolean(data.draft, "draft", filePath);
  const featured = optionalBoolean(data.featured, "featured", filePath);
  const series = data.series;
  if (
    series !== undefined &&
    (typeof series !== "number" || !Number.isSafeInteger(series) || series < 1)
  ) {
    throw new Error(
      `Blog post ${filePath} has invalid series; use a positive integer`,
    );
  }
  return {
    slug,
    title: data.title.trim(),
    date,
    author: data.author ? String(data.author) : undefined,
    image: data.image ? String(data.image) : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    series,
    featured,
    draft,
    songTitle: data.songTitle ? String(data.songTitle) : undefined,
    songArtist: data.songArtist ? String(data.songArtist) : undefined,
    songYear: data.songYear ? String(data.songYear) : undefined,
    songUrl: data.songUrl ? String(data.songUrl) : undefined,
    locale,
    bodyMarkdown: content,
    bodyHtml: addDeferredImageHints(
      marked.parse(content, { async: false }) as string,
    ),
  };
}

/** List posts for a locale (locale-specific file wins over shared). */
export function listPosts(locale: SupportedLocale): BlogPostMeta[] {
  const dir = contentRoot();
  if (!fs.existsSync(dir)) return [];
  const bySlug = new Map<string, BlogPostMeta>();

  for (const file of fs.readdirSync(dir)) {
    const parsed = parseFilename(file);
    if (!parsed) continue;
    const post = readPostFile(
      path.join(dir, file),
      parsed.slug,
      parsed.locale,
    );
    const existing = bySlug.get(parsed.slug);
    if (!existing) {
      bySlug.set(parsed.slug, post);
      continue;
    }
    // Prefer locale-specific over shared
    if (parsed.locale === locale) {
      bySlug.set(parsed.slug, post);
    } else if (existing.locale !== locale && parsed.locale === "shared") {
      // keep existing if it's already locale-specific
    }
  }

  // Filter: keep posts that are shared or match locale
  const list = [...bySlug.values()].filter(
    (p) =>
      (p.locale === "shared" || p.locale === locale) &&
      (!import.meta.env.PROD || !p.draft),
  );
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(
  slug: string,
  locale: SupportedLocale,
): BlogPost | null {
  const dir = contentRoot();
  const localeFile = path.join(dir, `${slug}.${locale}.md`);
  const sharedFile = path.join(dir, `${slug}.md`);
  if (fs.existsSync(localeFile)) {
    const post = readPostFile(localeFile, slug, locale);
    return import.meta.env.PROD && post.draft ? null : post;
  }
  if (fs.existsSync(sharedFile)) {
    const post = readPostFile(sharedFile, slug, "shared");
    return import.meta.env.PROD && post.draft ? null : post;
  }
  return null;
}

export function blogPublicBasePath(): string {
  const raw = siteConfig.blog.basePath.trim();
  if (!raw || raw === "/") return "/blog";
  return raw.startsWith("/") ? raw.replace(/\/+$/, "") : `/${raw}`;
}
