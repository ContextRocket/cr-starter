import testimonialsData from "../../config/testimonials.json";

type LocalizedText = Record<string, string | undefined> & { en: string };

type RawTestimonial = {
  id: string;
  author: LocalizedText;
  role?: LocalizedText;
  company?: LocalizedText;
  quote: LocalizedText;
  avatar?: string;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
};

type TestimonialsConfig = {
  title: LocalizedText;
  items: RawTestimonial[];
};

function localized(value: LocalizedText | undefined, locale: string): string {
  if (!value) return "";
  return value[locale]?.trim() || value.en;
}

export function getTestimonials(locale: string): {
  title: string;
  items: Testimonial[];
} {
  const config = testimonialsData as TestimonialsConfig;
  return {
    title: localized(config.title, locale),
    items: config.items.map((item) => ({
      id: item.id,
      author: localized(item.author, locale),
      role: localized(item.role, locale),
      company: localized(item.company, locale),
      quote: localized(item.quote, locale),
      avatar: item.avatar,
    })),
  };
}
