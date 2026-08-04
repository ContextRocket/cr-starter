import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { ACTIVE_LOCALES, type SupportedLocale } from "@/i18n/messages";
import { siteConfig } from "@/site.config";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ACTIVE_LOCALES_LIST = ACTIVE_LOCALES as readonly string[];

// next-intl middleware: resolves locale from the URL prefix (with
// Accept-Language + NEXT_LOCALE cookie fallback), syncs the cookie, and
// handles the localePrefix: 'always' redirects (bare / -> /{locale},
// /dashboard -> /{locale}/dashboard). Adopted from
// context-rocket/frontend/proxy.ts (the exact pattern the starter follows).
const intlMiddleware = createMiddleware({
  locales: ACTIVE_LOCALES,
  defaultLocale: siteConfig.defaultLocale as SupportedLocale,
  // "as-needed" with a single locale removes the URL prefix entirely
  // (/blog, not /en/blog). Multi-locale sites keep "always" for SEO.
  localePrefix: ACTIVE_LOCALES.length === 1 ? "as-needed" : "always",
});

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(base64 + padding);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function hasExpiredJwtToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  const exp = payload && typeof payload.exp === "number" ? payload.exp : null;

  if (exp === null) {
    return true;
  }

  return exp <= Math.floor(Date.now() / 1000);
}

function isSupportedLocale(locale: string | undefined): locale is string {
  return !!locale && ACTIVE_LOCALES_LIST.includes(locale);
}

/**
 * Detect the preferred locale from:
 * 1. URL first segment (if already locale-prefixed)
 * 2. `NEXT_LOCALE` cookie (explicit user preference)
 * 3. `Accept-Language` header (browser preference)
 * 4. Site default locale
 */
function detectLocale(request: NextRequest): string {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  if (isSupportedLocale(firstSegment)) {
    return firstSegment;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const sorted = acceptLanguage
      .split(",")
      .map((tag) => {
        const [locale, qParam] = tag.trim().split(";");
        const quality = qParam ? parseFloat(qParam.replace("q=", "")) : 1.0;
        return { base: locale.trim().split("-")[0].toLowerCase(), quality };
      })
      .sort((a, b) => b.quality - a.quality);
    for (const { base } of sorted) {
      if (isSupportedLocale(base)) {
        return base;
      }
    }
  }

  return siteConfig.defaultLocale;
}

function handleDashboardRedirect(
  request: NextRequest,
  hasUsableToken: boolean,
): NextResponse | null {
  const { pathname } = request.nextUrl;

  // Match both bare /dashboard (before the intl prefix) and /{locale}/dashboard
  const localeSegment = isSupportedLocale(pathname.split("/")[1])
    ? pathname.split("/")[1]
    : null;

  const isDashboardPath = localeSegment
    ? pathname.startsWith(`/${localeSegment}/dashboard`)
    : pathname.startsWith("/dashboard");

  if (!isDashboardPath) {
    return null;
  }

  if (!hasUsableToken) {
    const locale = localeSegment ?? detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url, { status: 302 });
  }

  return null;
}

/**
 * Proxy (Next.js 16 replacement for middleware):
 * - `/dashboard` or `/{locale}/dashboard` (no usable token) -> /{locale}/auth/login
 * - All other routes -> next-intl locale detection, prefixing, cookie sync
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasUsableToken = !!accessToken && !hasExpiredJwtToken(accessToken);

  const dashboardRedirect = handleDashboardRedirect(request, hasUsableToken);
  if (dashboardRedirect) {
    return dashboardRedirect;
  }

  return intlMiddleware(request);
}

// Broad matcher (canonical next-intl shape), excluding:
//   - api routes and Next.js internals (_next)
//   - Static/SEO asset routes (sitemap, robots, manifest, llms)
//   - Any path with a dot (file extension: fonts, favicons, images)
export const config = {
  matcher: [
    "/((?!api|_next|healthz|sitemap\\.xml|robots\\.txt|feed\\.xml|rss\\.xml|manifest\\.webmanifest|llms\\.txt|llms-full\\.txt|opengraph-image|twitter-image|favicon\\.ico|.*\\..*).*)",
    "/",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
