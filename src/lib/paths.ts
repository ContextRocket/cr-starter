import { siteConfig, isSingleLocale } from "@/config/site.config";
import { getDefaultLocale, type SupportedLocale } from "@/i18n/locales";
import { blogPublicBasePath } from "@/lib/blog";

/**
 * Build a site-relative href for a path, respecting single vs multi locale.
 * `path` should start with "/" and not include a locale prefix
 * (e.g. "/", "/faq", "/privacy").
 */
export function localizedHref(
  locale: SupportedLocale,
  path: string = "/",
): string {
  const normalized =
    path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (isSingleLocale()) {
    return normalized === "/" ? "/" : `${normalized.replace(/\/?$/, "/")}`;
  }
  if (normalized === "/") return `/${locale}/`;
  return `/${locale}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export function homeHref(locale: SupportedLocale): string {
  return localizedHref(locale, "/");
}

export function blogIndexHref(locale: SupportedLocale): string {
  return localizedHref(locale, blogPublicBasePath());
}

export function blogPostHref(locale: SupportedLocale, slug: string): string {
  return localizedHref(locale, `${blogPublicBasePath()}/${slug}`);
}

/** Physical Astro route segment for blog (always "blog" on disk). */
export const BLOG_ROUTE_SEGMENT = "blog";

export function withTrailingSlash(url: string): string {
  if (url.endsWith("/")) return url;
  if (url.includes("?") || url.includes("#")) return url;
  return `${url}/`;
}

/** Paths that are files, not directory pages -- do not force a trailing slash. */
const FILE_PATH_RE =
  /\.(xml|txt|json|webmanifest|ico|png|jpg|jpeg|gif|svg|webp|css|js|map)$/i;

export function absoluteUrl(pathname: string): string {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (FILE_PATH_RE.test(path)) {
    return `${base}${path}`;
  }
  return `${base}${withTrailingSlash(path)}`;
}

export function defaultLocaleRedirectTarget(): string {
  return `/${getDefaultLocale()}/`;
}
