/**
 * lib/inline-markdown.ts -- minimal inline Markdown → HTML for authored content.
 *
 * Handles the inline subset used by blog post bodies and the home intro:
 * images, links, bold, italic, and inline code. Block-level structure is
 * handled by MarkdownPostBody; this only converts inline runs inside a text
 * block. Input must be author-controlled trusted content.
 */

export function renderInlineMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return (
    escaped
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (_m, alt: string, src: string) =>
          `<img src="${src}" alt="${alt}" class="my-4 h-auto w-full rounded-lg" />`,
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (_m, label: string, href: string) =>
          `<a href="${href}"${
            href.startsWith("http")
              ? ' target="_blank" rel="noopener noreferrer"'
              : ""
          }>${label}</a>`,
      )
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(
        /`([^`]+)`/g,
        (_m, code: string) =>
          `<code class="bg-muted px-1 rounded text-xs font-mono">${code}</code>`,
      )
  );
}
