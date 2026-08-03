/**
 * next-intl locale-aware navigation helpers.
 *
 * ONE path only - do not import useRouter / usePathname / redirect /
 * permanentRedirect from `next/navigation` in app code.
 *
 * Client:
 *   import { Link, useRouter, usePathname } from "@/i18n/navigation";
 *
 * Server components / server actions (string hrefs):
 *   import { redirect, permanentRedirect } from "@/i18n/redirect";
 *   return await redirect("/dashboard");  // -> /{locale}/dashboard
 *
 * Still from `next/navigation` (not provided by createNavigation):
 *   useSearchParams, notFound
 * Root locale detector `app/page.tsx` keeps next/navigation redirect because
 * it sits outside the `[locale]` tree and builds `/${locale}` itself.
 */

import { createNavigation } from "next-intl/navigation";
import { SUPPORTED_LOCALES } from "./messages";

export const { Link, redirect, permanentRedirect, usePathname, useRouter } =
  createNavigation({
    locales: SUPPORTED_LOCALES,
    localePrefix: "always",
  });
