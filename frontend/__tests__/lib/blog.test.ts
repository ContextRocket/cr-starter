import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { FileBlogAdapter, parseBlogPost } from "@/lib/blog";

const contentDir = mkdtempSync(path.join(tmpdir(), "cr-starter-blog-"));

writeFileSync(
  path.join(contentDir, "getting-started.en.md"),
  `---\ntitle: "Getting Started"\nauthor: "The Team"\ndate: "2026-08-01"\n---\n\n## English\n\nThis is the English post.\n`,
);
writeFileSync(
  path.join(contentDir, "getting-started.es.md"),
  `---\ntitle: "Primeros pasos"\nauthor: "El equipo"\ndate: "2026-08-01"\n---\n\n## Español\n\nEsta es la publicación en español.\n`,
);

const adapter = new FileBlogAdapter(contentDir);

afterAll(() => rmSync(contentDir, { recursive: true, force: true }));

describe("FileBlogAdapter locale Markdown files", () => {
  it("uses locale-suffixed Markdown files without changing their public slug", () => {
    expect(adapter.list("en")).toHaveLength(1);
    expect(adapter.list("en")[0]).toMatchObject({
      slug: "getting-started",
      locale: "en",
      title: "Getting Started",
    });
    expect(adapter.list("es")[0]).toMatchObject({
      slug: "getting-started",
      locale: "es",
      title: "Primeros pasos",
    });
  });

  it("selects the requested language for a localized post", () => {
    expect(adapter.get("getting-started", "es")).toMatchObject({
      locale: "es",
      title: "Primeros pasos",
      bodyMarkdown: expect.stringContaining("publicación"),
    });
    expect(adapter.get("getting-started", "de")).toBeNull();
  });

  it("preserves optional media metadata from Markdown frontmatter", () => {
    const post = parseBlogPost(
      `---\ntitle: "A post"\nauthor: "The Team"\ndate: "2026-08-01"\nsongTitle: "The Song"\nsongArtist: "The Artist"\nsongYear: "1984"\nsongUrl: "https://open.spotify.com/track/example"\n---\n\nBody.`,
      "a-post",
      "test.md",
    );

    expect(post).toMatchObject({
      songTitle: "The Song",
      songArtist: "The Artist",
      songYear: "1984",
      songUrl: "https://open.spotify.com/track/example",
    });
  });
});
