// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { renderMarkdown } from "../../../clients/embed-widget/src/markdown";

describe("embed-widget Markdown renderer", () => {
  it("renders basic Markdown without interpreting raw HTML", () => {
    const container = document.createElement("div");
    renderMarkdown(
      container,
      "# Heading\n\n**bold** and [docs](https://example.com/docs)\n\n<img src=x onerror=alert(1)>",
    );

    expect(container.querySelector("strong")).toHaveTextContent("Heading");
    expect(container.querySelector("a")).toHaveAttribute(
      "href",
      "https://example.com/docs",
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.textContent).toContain("<img src=x");
  });

  it("does not turn unsafe schemes into links", () => {
    const container = document.createElement("div");
    renderMarkdown(container, "[do not open](javascript:alert(1))");

    expect(container.querySelector("a")).not.toBeInTheDocument();
    expect(container.textContent).toContain("do not open");
  });
});
