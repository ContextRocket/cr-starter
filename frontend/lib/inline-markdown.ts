/**
 * lib/inline-markdown.ts -- minimal inline Markdown → HTML for authored content.
 *
 * Handles the inline subset used by blog post bodies and the home intro:
 * images, links, bold, italic, and inline code. Block-level structure (headings, code
 * fences, standalone images, paragraphs) is handled by the rendering component;
 * this only converts the inline runs inside a text block.
 *
 * TRUST: input is author-controlled site content (Markdown files / profile
 * config), not user input. The output is injected via dangerouslySetInnerHTML,
 * so this must only ever run over trusted content.
 */

/** Convert inline Markdown in a single text block to an HTML string. */
export function renderInlineMarkdown(text: string): string {
  return (
    text
      // images ![alt](src)  (before links -- both use the "](" token)
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (_m, alt: string, src: string) =>
          `<img src="${src}" alt="${alt}" class="my-4 h-auto w-full rounded-lg" />`,
      )
      // links [text](href) -- external links open in a new tab
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (_m, label: string, href: string) =>
          `<a href="${href}"${
            href.startsWith("http")
              ? ' target="_blank" rel="noopener noreferrer"'
              : ""
          }>${label}</a>`,
      )
      // bold **text**
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // italic *text*
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // inline code `code`
      .replace(
        /`([^`]+)`/g,
        (_m, code: string) =>
          `<code class="bg-muted px-1 rounded text-xs font-mono">${code}</code>`,
      )
  );
}
