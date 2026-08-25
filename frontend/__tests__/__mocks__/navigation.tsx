/**
 * Global test double for @/i18n/navigation (registered by the vi.mock in
 * vitest.setup.ts).
 *
 * The locale-aware navigation helpers (Link/usePathname/useRouter) need a
 * Next.js request or router context that the jsdom test environment does
 * not provide, so every test renders against this stub instead of the real
 * module.
 *
 * Design:
 *   - Link renders the raw href it is given (no locale prefix). Locale
 *     prefixing in the real module is verified live (dev-server curl), not
 *     in unit tests.
 *   - usePathname reads a mutable mockPathname.value so tests can drive the
 *     current path (e.g. breadcrumb trails).
 *   - useRouter returns a shared mockRouter whose fns are vi.fn()s;
 *     vi.clearMocks() resets their call history between tests.
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";

/** Mutable current pathname returned by usePathname(). */
export const mockPathname: { value: string } = { value: "/" };

/** Shared router mock returned by useRouter(). */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export function usePathname(): string {
  return mockPathname.value;
}

export function useRouter() {
  return mockRouter;
}

export function Link({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function redirect(href: string): never {
  throw new Error(`[test stub] redirect to ${href}`);
}

export function permanentRedirect(href: string): never {
  throw new Error(`[test stub] permanentRedirect to ${href}`);
}

/** Locale-stripped mock: just returns the href as-is for test isolation. */
export function prefixLocale(href: string, locale: string): string {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
    return href;
  const first = href.split("/")[1] ?? "";
  if (["en", "es", "de"].includes(first)) return href;
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
