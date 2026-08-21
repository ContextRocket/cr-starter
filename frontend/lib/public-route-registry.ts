/**
 * Public-site route contract.
 *
 * The route list is fork-owned configuration, while the filtering and URL
 * builders are starter-owned. This keeps sitemap, robots, llms.txt, and
 * metadata consumers on one contract without making a fork copy any page
 * content or composition.
 */

import siteData from "@/config/site.json";
import { siteConfig } from "@/config/site.config";

export type PublicChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface PublicRouteConfig {
  key: string;
  path: string;
  enabled?: boolean;
  feature?: string;
  indexable?: boolean;
  includeInLlms?: boolean;
  locales?: readonly string[];
  priority?: number;
  changeFrequency?: PublicChangeFrequency;
}

export interface PublicRoute extends Required<
  Omit<PublicRouteConfig, "feature" | "locales">
> {
  feature?: string;
  locales?: readonly string[];
}

const DEFAULT_PUBLIC_ROUTES: readonly PublicRouteConfig[] = [
  {
    key: "home",
    path: "",
    indexable: true,
    includeInLlms: false,
    priority: 1,
    changeFrequency: "daily",
  },
  {
    key: "blog",
    path: "blog",
    feature: "blog",
    indexable: true,
    includeInLlms: true,
    priority: 0.8,
    changeFrequency: "daily",
  },
  {
    key: "faq",
    path: "faq",
    indexable: true,
    includeInLlms: true,
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    key: "privacy",
    path: "privacy",
    indexable: true,
    includeInLlms: true,
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    key: "impressum",
    path: "impressum",
    feature: "impressum",
    indexable: true,
    includeInLlms: true,
    priority: 0.3,
    changeFrequency: "monthly",
  },
  {
    key: "attribution",
    path: "attribution",
    feature: "attribution",
    indexable: true,
    includeInLlms: true,
    priority: 0.3,
    changeFrequency: "monthly",
  },
];

type SiteDataWithPublicRoutes = typeof siteData & {
  publicRoutes?: readonly PublicRouteConfig[];
};

const configuredRoutes = (siteData as unknown as SiteDataWithPublicRoutes)
  .publicRoutes;
const routeConfigs: readonly PublicRouteConfig[] =
  configuredRoutes ?? DEFAULT_PUBLIC_ROUTES;

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

function resolveRoutePath(route: PublicRouteConfig): string {
  if (route.key === "blog") {
    return normalizePath(siteConfig.blog.basePath);
  }
  return normalizePath(route.path);
}

export const PUBLIC_ROUTE_REGISTRY: readonly PublicRoute[] = routeConfigs.map(
  (route): PublicRoute => ({
    key: route.key,
    path: resolveRoutePath(route),
    enabled: route.enabled ?? true,
    feature: route.feature,
    indexable: route.indexable ?? true,
    includeInLlms: route.includeInLlms ?? false,
    locales: route.locales,
    priority: route.priority ?? 0.5,
    changeFrequency: route.changeFrequency ?? "monthly",
  }),
);

function isFeatureEnabled(feature: string | undefined): boolean {
  if (!feature) return true;
  const features = siteConfig.features as Record<string, unknown>;
  return features[feature] === true;
}

export function getPublicRoutes(options?: {
  indexableOnly?: boolean;
  llmsOnly?: boolean;
}): readonly PublicRoute[] {
  return PUBLIC_ROUTE_REGISTRY.filter(
    (route) =>
      route.enabled &&
      isFeatureEnabled(route.feature) &&
      (!options?.indexableOnly || route.indexable) &&
      (!options?.llmsOnly || (route.indexable && route.includeInLlms)),
  );
}

export function getPublicRoute(key: string): PublicRoute | undefined {
  return getPublicRoutes().find((route) => route.key === key);
}

export function getPublicRouteLocales(route: PublicRoute): readonly string[] {
  const servedLocales = siteConfig.locales.length
    ? siteConfig.locales
    : [siteConfig.defaultLocale];
  const supported = route.locales?.filter((locale) =>
    servedLocales.includes(locale),
  );
  return supported?.length ? supported : servedLocales;
}

export function getDefaultPublicLocale(locales: readonly string[]): string {
  return locales.includes(siteConfig.defaultLocale)
    ? siteConfig.defaultLocale
    : (locales[0] ?? siteConfig.defaultLocale);
}

export function buildLocalizedPublicPath(locale: string, path: string): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function buildPublicRouteAlternates(
  route: PublicRoute,
): Record<string, string> {
  const locales = getPublicRouteLocales(route);
  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      buildLocalizedPublicPath(locale, route.path),
    ]),
  );
  languages["x-default"] = buildLocalizedPublicPath(
    getDefaultPublicLocale(locales),
    route.path,
  );
  return languages;
}
