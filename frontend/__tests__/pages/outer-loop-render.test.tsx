import { describe, it, expect, vi } from "vitest";
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
}) => Promise<React.ReactElement>;

const PAGES: [string, PageFn][] = [
  ["cookies", Cookies as PageFn],
  ["terms", Terms as PageFn],
  ["impressum", Impressum as PageFn],
  ["attribution", Attribution as PageFn],
  ["faq", Faq as PageFn],
];

describe("core outer-loop pages render without missing keys", () => {
  for (const [name, Page] of PAGES) {
    for (const locale of siteConfig.locales) {
      it(`${name} (${locale})`, async () => {
        const ui = await Page({ params: Promise.resolve({ locale }) });
        expect(() => render(ui)).not.toThrow();
      });
    }
  }
});
