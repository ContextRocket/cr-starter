import { siteConfig } from "@/config/site.config";
import type { SupportedLocale } from "@/i18n/locales";
import { blogIndexHref, localizedHref } from "@/lib/paths";

export type PublicRoute = (typeof siteConfig.publicRoutes)[number];

export function enabledPublicRoutes(): PublicRoute[] {
  return siteConfig.publicRoutes.filter((route) => {
    if (!route.feature) return true;
    const flag = siteConfig.features[route.feature as keyof typeof siteConfig.features];
    return flag !== false;
  });
}

export function routeHref(
  locale: SupportedLocale,
  route: PublicRoute,
): string {
  // blog.config.mjs owns the blog URL. publicRoutes remains its publication
  // allowlist and metadata, but should not become a second path source.
  if (route.key === "blog") return blogIndexHref(locale);
  if ("canonicalPath" in route && typeof route.canonicalPath === "string") {
    return localizedHref(locale, route.canonicalPath);
  }
  if (!route.path) return localizedHref(locale, "/");
  return localizedHref(locale, `/${route.path}`);
}
