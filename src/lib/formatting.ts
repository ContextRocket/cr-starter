import type { SupportedLocale } from "@/i18n/locales";

/** Format a validated date-only value without timezone-dependent day shifts. */
export function formatBlogDate(date: string, locale: SupportedLocale): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
