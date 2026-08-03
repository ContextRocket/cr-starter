/**
 * Global test double for @/i18n/navigation (see moduleNameMapper in
 * jest.config.ts).
 *
 * next-intl's createNavigation helpers (Link/usePathname/useRouter) need a
 * Next.js request or router context that jest does not provide, so every
 * test renders against this stub instead of the real module.
 *
 * Design:
 *   - Link renders the raw href it is given (no locale prefix). Locale
 *     prefixing in the real module is verified live (dev-server curl), not
 *     in unit tests.
 *   - usePathname reads a mutable mockPathname.value so tests can drive the
 *     current path (e.g. breadcrumb trails).
 *   - useRouter returns a shared mockRouter whose fns are jest.fn()s;
 *     jest.clearMocks() resets their call history between tests.
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";

/** Mutable current pathname returned by usePathname(). */
export const mockPathname: { value: string } = { value: "/" };

/** Shared router mock returned by useRouter(). */
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
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
