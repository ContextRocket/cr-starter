import { siteConfig, isSingleLocale } from "@/config/site.config";
import { getDefaultLocale, type SupportedLocale } from "@/i18n/locales";
import { blogPublicBasePath } from "@/lib/blog";

function formatRoutePath(path: string): string {
  const suffixIndex = [path.indexOf("?"), path.indexOf("#")]
    .filter((index) => index >= 0)
    .reduce((smallest, index) => Math.min(smallest, index), path.length);
  const pathname = path.slice(0, suffixIndex);
  const suffix = path.slice(suffixIndex);
  if (pathname === "/") return `/${suffix}`;
  const withoutTrailing = pathname.replace(/\/+$/, "");
  // An explicit trailing slash in a route path overrides the site default.
  // Clones can preserve exceptional source URLs without changing every route.
  const explicitTrailingSlash = pathname.endsWith("/");
  const formatted = siteConfig.trailingSlash === "always" || explicitTrailingSlash
    ? `${withoutTrailing}/`
    : withoutTrailing;
  return `${formatted}${suffix}`;
}

/**
 * Build a site-relative href for a path, respecting single vs multi locale.
 * `path` should start with "/" and not include a locale prefix
 * (e.g. "/", "/contact", "/blog"). An explicit trailing slash is preserved
 * as a per-route canonical override.
 */
export function localizedHref(
  locale: SupportedLocale,
  path: string = "/",
): string {
  const normalized = formatRoutePath(path.startsWith("/") ? path : `/${path}`);
  if (isSingleLocale()) {
    return normalized;
  }
  if (normalized === "/") return formatRoutePath(`/${locale}`);
  return formatRoutePath(`/${locale}${normalized}`);
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

/** Paths that are files, not directory pages -- do not force a trailing slash. */
const FILE_PATH_RE =
  /\.(xml|txt|json|webmanifest|ico|png|jpg|jpeg|gif|svg|webp|css|js|map)$/i;

export function absoluteUrl(pathname: string): string {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathnameOnly = path.split(/[?#]/, 1)[0];
  if (FILE_PATH_RE.test(pathnameOnly)) {
    return `${base}${path}`;
  }
  return `${base}${formatRoutePath(path)}`;
}

export function defaultLocaleRedirectTarget(): string {
  return formatRoutePath(`/${getDefaultLocale()}`);
}
