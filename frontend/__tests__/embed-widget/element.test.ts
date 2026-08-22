// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import {
  ContextRocketChatElement,
  registerContextRocketChatElement,
} from "../../../clients/embed-widget/src/element";

registerContextRocketChatElement();

describe("standalone ChatFab element", () => {
  it("keeps the closed panel inert and restores focus after Escape", () => {
    const host = document.createElement(
      "contextrocket-chat",
    ) as ContextRocketChatElement;
    document.body.appendChild(host);

    const shadow = host.shadowRoot!;
    const launcher = shadow.querySelector<HTMLButtonElement>(".cr-launcher")!;
    const panel = shadow.querySelector<HTMLDivElement>(".cr-panel")!;
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("inert");

    launcher.click();
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).not.toHaveAttribute("inert");

    panel.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(shadow.activeElement).toBe(launcher);

    host.remove();
  });

  it("treats configured title text as text, never as HTML", () => {
    const host = document.createElement("contextrocket-chat");
    host.setAttribute("data-contextrocket-title", "<img src=x>Ask");
    document.body.appendChild(host);

    const shadow = host.shadowRoot!;
    expect(shadow.querySelector("img")).not.toBeInTheDocument();
    expect(shadow.querySelector(".cr-title")).toHaveTextContent("<img src=x>Ask");

    host.remove();
  });
});
