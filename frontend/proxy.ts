import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACTIVE_LOCALES, SUPPORTED_LOCALES } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ACTIVE_LOCALES_LIST = ACTIVE_LOCALES as readonly string[];
// Every locale with a message file (superset of ACTIVE_LOCALES). Used to spot a
// stale/foreign locale prefix (bookmark or NEXT_LOCALE cookie from a wider
// deployment) so it is normalized rather than 404'd.
const SUPPORTED_LOCALES_LIST = SUPPORTED_LOCALES as readonly string[];

function isSupportedLocale(locale: string | undefined): locale is string {
  return !!locale && ACTIVE_LOCALES_LIST.includes(locale);
}

/** Resolve locale from URL, cookie, browser preference, then site default. */
function detectLocale(request: NextRequest): string {
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  if (isSupportedLocale(firstSegment)) return firstSegment;

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const sorted = acceptLanguage
      .split(",")
      .map((tag) => {
        const [locale, qParam] = tag.trim().split(";");
        const quality = qParam ? parseFloat(qParam.replace("q=", "")) : 1;
        return { base: locale.trim().split("-")[0].toLowerCase(), quality };
      })
      .sort((a, b) => b.quality - a.quality);
    for (const { base } of sorted) {
      if (isSupportedLocale(base)) return base;
    }
  }
  return siteConfig.defaultLocale;
}

/** Add the locale URL segment used by the custom i18n module. */
function applyLocale(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // SINGLE active locale: clean/unprefixed URLs. Rewrite EVERY path into the
  // physical `/<locale>` tree (the visible URL stays clean) so the real page
  // renders instead of `[locale]/page.tsx` treating the first segment as a
  // locale and falling through to the homepage. (Previously only "/" was
  // rewritten, which left deep clean paths -- e.g. /podcast -- rendering the
  // homepage.)
  if (ACTIVE_LOCALES_LIST.length === 1) {
    const locale = ACTIVE_LOCALES_LIST[0];
    const headers = new Headers(request.headers);
    headers.set("x-locale", locale);

    // The standalone embed stays unprefixed AND unwrapped (one stable URL).
    if (pathname === "/embed" || pathname.startsWith("/embed/")) {
      return NextResponse.next({ request: { headers } });
    }
    // Already inside the `/<locale>` tree -> pass through untouched.
    if (firstSegment === locale) {
      const response = NextResponse.next({ request: { headers } });
      response.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
      return response;
    }
    // Stale/foreign locale-prefixed URL (e.g. `/de/pricing` while only `en` is
    // active, from a bookmark or a leftover NEXT_LOCALE cookie): 308-redirect to
    // the same path with the foreign prefix STRIPPED. Blindly prepending
    // `/<locale>` below would yield `/en/de/pricing`, which has no route -> 404.
    if (
      firstSegment &&
      firstSegment !== locale &&
      SUPPORTED_LOCALES_LIST.includes(firstSegment)
    ) {
      const stripped = pathname.slice(firstSegment.length + 1) || "/";
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}${stripped === "/" ? "" : stripped}`;
      const redirect = NextResponse.redirect(redirectUrl, { status: 308 });
      redirect.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
      return redirect;
    }
    // Clean URL -> rewrite into `/<locale>/...` (address bar stays clean).
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
    return response;
  }

  if (isSupportedLocale(firstSegment)) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", firstSegment);
    const response = NextResponse.next({ request: { headers } });
    response.cookies.set(LOCALE_COOKIE, firstSegment, { path: "/" });
    return response;
  }

  // The standalone embed remains unprefixed so a script can use one stable
  // URL regardless of the host site's active locale.
  if (pathname === "/embed" || pathname.startsWith("/embed/")) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/" });
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return applyLocale(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|healthz|sitemap\\.xml|robots\\.txt|feed\\.xml|rss\\.xml|manifest\\.webmanifest|llms\\.txt|opengraph-image|twitter-image|favicon\\.ico|.*\\..*).*)",
    "/",
    // Explicit locale-prefixed entry: the catch-all's `.*\..*` exclusion skips
    // locale-prefixed slugs containing a dot, so without this the proxy never
    // runs for them and they fall through to `[locale]` (404 / wrong page).
    "/(en|es|de)/:path*",
  ],
};
