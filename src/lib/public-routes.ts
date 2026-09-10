import { siteConfig } from "@/config/site.config";
import type { SupportedLocale } from "@/i18n/locales";
import { localizedHref } from "@/lib/paths";

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
  if (!route.path) return localizedHref(locale, "/");
  return localizedHref(locale, `/${route.path}`);
}
