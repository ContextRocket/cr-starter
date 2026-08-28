import { describe, it, vi } from "vitest";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { siteConfig } from "@/config/site.config";

/**
 * Render smoke test for the core public "outer loop" legal pages that every
 * fork inherits. Rendering exercises every t() call the page makes -- including
 * dynamic `t(`prefix.${x}`)` keys that the static message-references checker
 * cannot see -- so a missing key throws here. Blog data is mocked so the tests
 * are hermetic. Fork-specific marketing pages (about/pricing/features) are
 * covered by each fork's own render test.
 */
vi.mock("../../lib/blog", () => ({
  fileBlogAdapter: { list: () => [], get: () => null },
  FileBlogAdapter: vi.fn(),
  parseBlogPost: vi.fn(),
}));

import Cookies from "@/app/[locale]/cookies/page";
import Terms from "@/app/[locale]/terms/page";
import Impressum from "@/app/[locale]/impressum/page";
import Attribution from "@/app/[locale]/attribution/page";
import Faq from "@/app/[locale]/faq/page";

type PageFn = (props: {
  params: Promise<{ locale: string }>;
}) => Promise<ReactElement>;

const PAGES: [string, PageFn][] = [
  ["cookies", Cookies as PageFn],
  ["terms", Terms as PageFn],
  ["impressum", Impressum as PageFn],
  ["attribution", Attribution as PageFn],
  ["faq", Faq as PageFn],
];

/** notFound()/redirect() are Next control-flow signals (a fork may disable a
 * page via feature flag), not missing-key crashes. Allow them; fail on the
 * rest (e.g. a missing i18n key). */
function isNextControlFlow(err: unknown): boolean {
  const digest = (err as { digest?: unknown } | null)?.digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_HTTP_ERROR_FALLBACK") ||
      digest.startsWith("NEXT_REDIRECT"))
  );
}

describe("core outer-loop pages render without missing keys", () => {
  for (const [name, Page] of PAGES) {
    for (const locale of siteConfig.locales) {
      it(`${name} (${locale})`, async () => {
        try {
          render(await Page({ params: Promise.resolve({ locale }) }));
        } catch (err) {
          if (isNextControlFlow(err)) return;
          throw err;
        }
      });
    }
  }
});
