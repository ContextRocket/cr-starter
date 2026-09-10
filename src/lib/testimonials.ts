/**
 * Testimonials seam: file-backed adapter over testimonials.config.json.
 * Ported from Next; consumers only see resolved Testimonial objects.
 */

import rawConfig from "../../testimonials.config.json";
import { siteConfig } from "@/config/site.config";

export interface ItemReviewedConfig {
  type: "Product" | "Service" | "Organization";
  name: string;
}

export interface LocalizedText {
  en: string;
  es?: string;
  de?: string;
  [locale: string]: string | undefined;
}

export interface TestimonialSource {
  type: string;
  url?: string;
  capturedAt?: string;
}

export interface RawTestimonial {
  id: string;
  author: string;
  company?: string;
  avatar?: string;
  role?: LocalizedText;
  quote: LocalizedText;
  rating?: number;
  featured?: boolean;
  order: number;
  published?: boolean;
  source?: TestimonialSource;
}

export interface Testimonial {
  id: string;
  author: string;
  company?: string;
  avatar?: string;
  role: string;
  quote: string;
  rating?: number;
  featured: boolean;
  order: number;
  source?: TestimonialSource;
}

export interface TestimonialsPort {
  getTestimonials(locale: string): Testimonial[];
}

function resolveLocalized(
  text: LocalizedText | undefined,
  locale: string,
): string {
  if (!text) return "";
  const forLocale = text[locale];
  if (forLocale && forLocale.trim()) return forLocale;
  return text.en ?? "";
}

export function resolveTestimonials(
  raw: RawTestimonial[],
  locale: string,
): Testimonial[] {
  return raw
    .filter((t) => t.published !== false)
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((t) => ({
      id: t.id,
      author: t.author,
      company: t.company,
      avatar: t.avatar,
      role: resolveLocalized(t.role, locale),
      quote: resolveLocalized(t.quote, locale),
      rating: t.rating,
      featured: t.featured ?? false,
      order: t.order,
      source: t.source,
    }));
}

interface TestimonialsConfigFile {
  testimonials: RawTestimonial[];
  itemReviewed?: Partial<ItemReviewedConfig>;
}

export class FileTestimonialsAdapter implements TestimonialsPort {
  private readonly raw: RawTestimonial[];

  constructor(raw?: RawTestimonial[]) {
    this.raw = raw ?? (rawConfig as TestimonialsConfigFile).testimonials ?? [];
  }

  getTestimonials(locale: string): Testimonial[] {
    return resolveTestimonials(this.raw, locale);
  }
}

export const fileTestimonialsAdapter: TestimonialsPort =
  new FileTestimonialsAdapter();

export function getTestimonials(locale: string): Testimonial[] {
  return fileTestimonialsAdapter.getTestimonials(locale);
}

export function getItemReviewed(
  override?: Partial<ItemReviewedConfig>,
): ItemReviewedConfig {
  const configured =
    override ?? (rawConfig as TestimonialsConfigFile).itemReviewed ?? {};
  const name = configured.name?.trim()
    ? configured.name
    : siteConfig.companyName;
  return {
    type: configured.type ?? "Service",
    name,
  };
}
