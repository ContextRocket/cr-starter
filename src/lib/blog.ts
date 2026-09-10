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

function readPostFile(
  filePath: string,
  slug: string,
  locale: SupportedLocale | "shared",
): BlogPost {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date) {
    throw new Error(
      `Blog post ${filePath} requires frontmatter title and date`,
    );
  }
  return {
    slug,
    title: String(data.title),
    date: String(data.date),
    author: data.author ? String(data.author) : undefined,
    image: data.image ? String(data.image) : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    series:
      typeof data.series === "number"
        ? data.series
        : data.series
          ? Number(data.series)
          : undefined,
    featured: Boolean(data.featured),
    songTitle: data.songTitle ? String(data.songTitle) : undefined,
    songArtist: data.songArtist ? String(data.songArtist) : undefined,
    songYear: data.songYear ? String(data.songYear) : undefined,
    songUrl: data.songUrl ? String(data.songUrl) : undefined,
    locale,
    bodyMarkdown: content,
    bodyHtml: marked.parse(content, { async: false }) as string,
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
    (p) => p.locale === "shared" || p.locale === locale,
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
    return readPostFile(localeFile, slug, locale);
  }
  if (fs.existsSync(sharedFile)) {
    return readPostFile(sharedFile, slug, "shared");
  }
  return null;
}

export function blogPublicBasePath(): string {
  const raw = siteConfig.blog.basePath.trim();
  if (!raw || raw === "/") return "/blog";
  return raw.startsWith("/") ? raw.replace(/\/+$/, "") : `/${raw}`;
}
