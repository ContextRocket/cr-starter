/**
 * Server-only locale registration.
 *
 * Imports all three locale trees (en, es, de) and registers them into
 * the runtime registry in `keys.ts`. This module must NEVER appear in
 * the client bundle, the `import "server-only"` guard enforces that.
 *
 * Usage: import as a side-effect at the TOP of `app/[locale]/layout.tsx`
 * (and any other root layout that renders before server `t()` calls):
 *
 *   import "@/i18n/messages/register-server";
 *
 * The `getServerLocaleTree` export lets the root layout pass the active
 * locale's tree to `LocaleProvider` so the client receives non-en
 * messages without a separate network request (RSC payload injection).
 */
import "server-only";
import { en } from "./en";
import { es } from "./es";
import { de } from "./de";
import { registerLocaleMessages } from "../keys";
import type { SupportedLocale } from "./index";

// Register all locale trees once at module init (server-side only).
registerLocaleMessages("en", en as unknown as Record<string, unknown>);
registerLocaleMessages("es", es as unknown as Record<string, unknown>);
registerLocaleMessages("de", de as unknown as Record<string, unknown>);

const _serverTrees: Record<SupportedLocale, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  es: es as unknown as Record<string, unknown>,
  de: de as unknown as Record<string, unknown>,
};

/**
 * Return the message tree for the given locale (server-side only).
 *
 * The root layout calls this to pass the active non-en locale's tree to
 * `LocaleProvider` as an RSC payload prop. For `en`, returns `null` since
 * the English tree is always bundled client-side as the fallback.
 */
export function getServerLocaleTree(
  locale: SupportedLocale,
): Record<string, unknown> | null {
  if (locale === "en") return null;
  return _serverTrees[locale];
}
