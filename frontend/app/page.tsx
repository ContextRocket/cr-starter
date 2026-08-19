import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";
import { LOCALE_NO_FLASH_SCRIPT } from "@/components/shared/ui/locale-init-script";

const LOCALE_COOKIE = "NEXT_LOCALE";
const SUPPORTED_LOCALES_LIST = SUPPORTED_LOCALES as readonly string[];

/**
 * Root locale detector.
 *
 * Sits OUTSIDE the `[locale]` tree. Resolves the visitor's locale and
 * redirects to the locale-prefixed route (/es, /en, /de).
 *
 * Resolution order: persisted NEXT_LOCALE cookie (kept for continuity with
 * the previous cookie-based approach) -> Accept-Language -> site default
 * (siteConfig.defaultLocale, e.g. "en" for the starter).
 *
 * STATIC EXPORT: when STATIC_EXPORT=true, cookies/headers are not available.
 * This page renders a blocking script that reads the NEXT_LOCALE cookie and
 * redirects before React hydrates, plus a meta refresh fallback for first-
 * time visitors (no cookie). The script lives in <head> via the root layout.
 */
function detectLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string;
  acceptLanguage?: string | null;
}): string {
  if (cookieLocale && SUPPORTED_LOCALES_LIST.includes(cookieLocale)) {
    return cookieLocale;
  }

  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(",")
      .map((part) => {
        const [tag, q = "1"] = part.trim().split(";q=");
        const lang = tag.split("-")[0].toLowerCase();
        return { lang, q: parseFloat(q) };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of candidates) {
      if (SUPPORTED_LOCALES_LIST.includes(lang)) {
        return lang;
      }
    }
  }

  return siteConfig.defaultLocale;
}

export default async function RootRedirectPage() {
  // Static export mode: cookies/headers not available. Render a blocking
  // script + meta refresh to redirect before React hydrates. The script
  // reads the NEXT_LOCALE cookie for returning visitors; the meta refresh
  // handles first-time visitors (no cookie).
  if (process.env.STATIC_EXPORT === "true") {
    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_NO_FLASH_SCRIPT }} />
        <meta httpEquiv="refresh" content={`0;url=/${siteConfig.defaultLocale}/`} />
        <p>Redirecting...</p>
      </>
    );
  }

  // Dynamic mode: read cookies/headers to detect locale.
  const cookieStore = await cookies();
  const headerStore = await headers();

  const locale = detectLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
  redirect(`/${locale}`);
}
