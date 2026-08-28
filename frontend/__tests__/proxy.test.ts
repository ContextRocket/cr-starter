/**
 * Unit tests for frontend/proxy.ts
 *
 * Strategy: mock next/server so we can construct lightweight NextRequest-like
 * objects and capture redirect/next/rewrite responses without a running Next.js
 * server. `@/i18n/messages` and `@/config/site.config` are mocked so the test
 * controls the active-/supported-locale sets that drive proxy behavior.
 *
 * ACTIVE_LOCALES is read once at proxy.ts import time, so single-locale vs
 * multi-locale mode is switched by resetting modules and re-mocking before a
 * dynamic import of the proxy. (cr-starter is static-first: no auth/dashboard,
 * so the proxy is locale prefixing + cookie sync only.)
 *
 * Regression focus (the reported 404):
 *   - Single-locale mode + a stale/foreign locale-prefixed URL (e.g. `/de/pricing`
 *     with a leftover NEXT_LOCALE=de cookie) must NOT be rewritten to
 *     `/en/de/pricing` (a route that does not exist -> 404). It must be
 *     normalized to `/en/pricing`.
 *   - The catch-all matcher must not be anchored with a trailing `$`, and an
 *     explicit locale-prefixed entry must exist so dotted locale-prefixed paths
 *     still run the proxy.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// --- Shared next/server mock ------------------------------------------------

const mockRedirect = vi.fn();
const mockNext = vi.fn();
const mockRewrite = vi.fn();

vi.mock("next/server", () => {
  class MockNextResponse {
    cookies = {
      _jar: {} as Record<string, unknown>,
      set(name: string, value: string, options?: Record<string, unknown>) {
        this._jar[name] = { value, ...options };
      },
      get(name: string) {
        return this._jar[name];
      },
    };
    static redirect(url: URL, options?: { status?: number }) {
      const resp = new MockNextResponse();
      mockRedirect(url, options, resp);
      return resp;
    }
    static next(_init?: unknown) {
      const resp = new MockNextResponse();
      mockNext(resp);
      return resp;
    }
    static rewrite(url: URL, _init?: unknown) {
      const resp = new MockNextResponse();
      mockRewrite(url, resp);
      return resp;
    }
  }
  return { NextResponse: MockNextResponse, NextRequest: class {} };
});

vi.mock("@/config/site.config", () => ({
  siteConfig: { defaultLocale: "en" },
}));

// ---------------------------------------------------------------------------

function makeRequest({
  pathname = "/",
  search = "",
  cookieLocale,
  acceptLanguage,
}: {
  pathname?: string;
  search?: string;
  cookieLocale?: string;
  acceptLanguage?: string;
}) {
  const url = new URL(`http://localhost${pathname}${search}`);

  return {
    nextUrl: {
      pathname,
      search: url.search,
      searchParams: url.searchParams,
      clone() {
        const cloned = new URL(url.toString());
        return {
          get pathname() {
            return cloned.pathname;
          },
          set pathname(v: string) {
            cloned.pathname = v;
          },
          get search() {
            return cloned.search;
          },
          set search(v: string) {
            cloned.search = v;
          },
          get searchParams() {
            return cloned.searchParams;
          },
          toString() {
            return cloned.toString();
          },
        };
      },
    },
    cookies: {
      get(name: string) {
        if (name === "NEXT_LOCALE" && cookieLocale !== undefined) {
          return { value: cookieLocale };
        }
        return undefined;
      },
    },
    headers: {
      get(name: string) {
        if (name === "accept-language" && acceptLanguage !== undefined) {
          return acceptLanguage;
        }
        return null;
      },
      // Headers copy used by NextResponse.next({ request: { headers } })
      forEach() {},
      entries() {
        return [][Symbol.iterator]();
      },
      [Symbol.iterator]() {
        return [][Symbol.iterator]();
      },
    },
  } as unknown as import("next/server").NextRequest;
}

async function loadProxy(
  active: readonly string[],
  supported: readonly string[],
) {
  vi.resetModules();
  vi.doMock("@/i18n/messages", () => ({
    ACTIVE_LOCALES: active,
    SUPPORTED_LOCALES: supported,
  }));
  return import("@/proxy");
}

beforeEach(() => {
  vi.clearAllMocks();
  mockRedirect.mockImplementation((_u, _o, resp) => resp);
  mockNext.mockImplementation((resp) => resp);
  mockRewrite.mockImplementation((_u, resp) => resp);
});

afterEach(() => {
  vi.doUnmock("@/i18n/messages");
});

// ---------------------------------------------------------------------------

describe("proxy - multi-locale mode (ACTIVE = en,es,de)", () => {
  it("redirects bare / to /{locale} using the NEXT_LOCALE cookie", async () => {
    const { proxy } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/", cookieLocale: "de" }));

    expect(mockRedirect).toHaveBeenCalledOnce();
    expect(mockRedirect.mock.calls[0][0].pathname).toBe("/de");
  });

  it("redirects an unprefixed multi-segment path preserving the query", async () => {
    const { proxy } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    await proxy(
      makeRequest({ pathname: "/blog/post", search: "?ref=twitter" }),
    );

    expect(mockRedirect).toHaveBeenCalledOnce();
    const [url] = mockRedirect.mock.calls[0];
    expect(url.pathname).toBe("/en/blog/post");
    expect(url.searchParams.get("ref")).toBe("twitter");
  });

  it("passes an already /es-prefixed path through", async () => {
    const { proxy } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/es/pricing" }));

    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("ignores a foreign NEXT_LOCALE cookie not in the active set", async () => {
    // `fr` has no message tree; detectLocale must fall back to the default.
    const { proxy } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/pricing", cookieLocale: "fr" }));

    expect(mockRedirect).toHaveBeenCalledOnce();
    expect(mockRedirect.mock.calls[0][0].pathname).toBe("/en/pricing");
  });
});

describe("proxy - single-locale mode (ACTIVE = en)", () => {
  it("rewrites a clean unprefixed path into /en/...", async () => {
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/pricing" }));

    expect(mockRewrite).toHaveBeenCalledOnce();
    expect(mockRewrite.mock.calls[0][0].pathname).toBe("/en/pricing");
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("passes an already /en-prefixed path through", async () => {
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/en/pricing" }));

    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockRewrite).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("REGRESSION: a stale/foreign locale prefix is normalized, not double-prefixed (404)", async () => {
    // Reported 404: NEXT_LOCALE=de leftover from a multi-locale deployment, the
    // site is now single-locale (en). Visiting /de/pricing must NOT become
    // /en/de/pricing (no route -> 404); it must redirect to /en/pricing.
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/de/pricing", cookieLocale: "de" }));

    expect(mockRewrite).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledOnce();
    const [url, opts] = mockRedirect.mock.calls[0];
    expect(url.pathname).toBe("/en/pricing");
    expect(url.pathname).not.toBe("/en/de/pricing");
    expect(opts).toEqual({ status: 308 });
  });

  it("REGRESSION: a bare foreign locale root /de normalizes to /en", async () => {
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/de" }));

    expect(mockRedirect).toHaveBeenCalledOnce();
    expect(mockRedirect.mock.calls[0][0].pathname).toBe("/en");
  });

  it("REGRESSION: a foreign multi-segment prefix /de/blog/post normalizes to /en/blog/post", async () => {
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/de/blog/post", cookieLocale: "de" }));

    expect(mockRedirect).toHaveBeenCalledOnce();
    const [url, opts] = mockRedirect.mock.calls[0];
    expect(url.pathname).toBe("/en/blog/post");
    expect(url.pathname).not.toBe("/en/de/blog/post");
    expect(opts).toEqual({ status: 308 });
  });

  it("keeps /embed unprefixed and unwrapped", async () => {
    const { proxy } = await loadProxy(["en"], ["en", "es", "de"]);
    await proxy(makeRequest({ pathname: "/embed" }));

    expect(mockNext).toHaveBeenCalledOnce();
    expect(mockRewrite).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

describe("proxy matcher shape (regression: unprefixed / dotted routing)", () => {
  it("catch-all matcher is not anchored with a trailing $", async () => {
    const { config } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    const catchAll = config.matcher[0];
    expect(catchAll.startsWith("/(")).toBe(true);
    expect(catchAll.endsWith("$")).toBe(false);
  });

  it("catch-all excludes /healthz but matches real app routes", async () => {
    const { config } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    const re = new RegExp(`^${config.matcher[0]}$`);
    expect(re.test("/healthz")).toBe(false);
    expect(re.test("/pricing")).toBe(true);
    expect(re.test("/blog/post")).toBe(true);
  });

  it("has an explicit locale-prefixed entry so dotted locale paths still run", async () => {
    const { config } = await loadProxy(["en", "es", "de"], ["en", "es", "de"]);
    // The catch-all's `.*\..*` excludes dotted paths like /de/blog/some.post;
    // the locale-prefixed entry must exist to rescue them.
    const localeEntry = config.matcher.find((m: string) =>
      /\(en\|es\|de\)/.test(m),
    );
    expect(localeEntry).toBeTruthy();
    const catchAll = new RegExp(`^${config.matcher[0]}$`);
    expect(catchAll.test("/de/blog/some.post")).toBe(false);
  });
});
