import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";
import { ErrorPage } from "@/components/shared/ui/error-widgets";

/**
 * 404 - Page Not Found
 *
 * Branded error page with clear navigation options.
 */
export default async function NotFound() {
  // Global fallback outside the [locale] tree: render in the site default.
  const locale = resolveLocale(siteConfig.defaultLocale);
  setLocale(locale);
  return (
    <ErrorPage
      code="404"
      title={t("error.notFound.title")}
      description={t("error.notFound.description")}
      action={{
        label: t("error.notFound.action"),
        href: "/",
      }}
    />
  );
}
