"use client";

import { createTranslator } from "@/i18n/translator";
import { ErrorPage } from "@/components/shared/ui/error-widgets";

/**
 * Error Page
 *
 * Branded error page for unexpected errors.
 * Displays error message and provides navigation options.
 */
export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Root boundary outside the [locale] tree: render English via the bundled
  // fallback (no locale is available here).
  const t = createTranslator("en", {});
  return (
    <ErrorPage
      title={t("error.generic.title")}
      description={t("error.generic.description")}
      action={{
        label: t("error.generic.action"),
        onClick: reset,
      }}
      secondaryAction={{
        label: t("error.notFound.action"),
        href: "/",
      }}
    />
  );
}
