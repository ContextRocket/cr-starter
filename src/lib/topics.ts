import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { siteConfig } from "@/config/site.config";

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  updated: string;
  image?: string;
  draft: boolean;
}

export interface Topic extends TopicMeta {
  bodyMarkdown: string;
  bodyHtml: string;
}

function topicsRoot(): string {
  return path.join(process.cwd(), siteConfig.blog.topicsDir);
}

function validDate(value: unknown, filePath: string): string {
  const date = value instanceof Date
    ? Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10)
    : typeof value === "string" ? value.trim() : "";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00.000Z`)
    : null;
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Topic ${filePath} requires a valid YYYY-MM-DD updated date`);
  }
  return date;
}

function readTopic(filePath: string, slug: string): Topic {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`Topic ${filePath} requires a non-empty string title`);
  }
  if (typeof data.description !== "string" || !data.description.trim()) {
    throw new Error(`Topic ${filePath} requires a non-empty string description`);
  }
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    throw new Error(`Topic ${filePath} has invalid draft; use true or false without quotes`);
  }
  const html = marked.parse(content, { async: false }) as string;
  const bodyHtml = html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    if (!/\bloading\s*=|\bfetchpriority\s*=\s*["']?high\b/i.test(next)) {
      next = next.replace(/^<img\b/i, '<img loading="lazy"');
    }
    if (!/\bdecoding\s*=/.test(next)) {
      next = next.replace(/^<img\b/i, '<img decoding="async"');
    }
    return next;
  });
  return {
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    updated: validDate(data.updated, filePath),
    image: typeof data.image === "string" ? data.image : undefined,
    draft: data.draft === true,
    bodyMarkdown: content,
    bodyHtml,
  };
}

/** List curated evergreen topics; production output never includes drafts. */
export function listTopics(options: { includeDrafts?: boolean } = {}): TopicMeta[] {
  const directory = topicsRoot();
  if (!siteConfig.features.topics || !fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((file) => /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(file))
    .map((file) => readTopic(path.join(directory, file), file.slice(0, -3)))
    .filter((topic) => !import.meta.env.PROD || options.includeDrafts === true || !topic.draft)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getTopic(slug: string): Topic | null {
  if (!siteConfig.features.topics || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }
  const filePath = path.join(topicsRoot(), `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const topic = readTopic(filePath, slug);
  return import.meta.env.PROD && topic.draft ? null : topic;
}
