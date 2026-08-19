import { streamEmbedA2aSubscribe } from "./a2a-transport";
import {
  applyTransportEvent,
  beginSend,
  canSend,
  createInitialChatState,
  type WidgetChatState,
} from "./chat-state";
import { buildPoweredByHref, parseWidgetConfig } from "./config";
import { widgetStyles } from "./styles";
import type { WidgetConfig } from "./types";

const ELEMENT_TAG = "contextrocket-chat";

export class ContextRocketChatElement extends HTMLElement {
  #config: WidgetConfig | null = null;
  #state: WidgetChatState = createInitialChatState();
  #shadow: ShadowRoot;
  #runId = 0;
  #assistantMessageId: string | null = null;

  #launcher!: HTMLButtonElement;
  #panel!: HTMLDivElement;
  #messages!: HTMLDivElement;
  #input!: HTMLInputElement;
  #send!: HTMLButtonElement;
  #error!: HTMLParagraphElement;
  #footerLink!: HTMLAnchorElement;

  static get observedAttributes(): string[] {
    return [
      "data-contextrocket-api-key",
      "data-contextrocket-handle",
      "data-contextrocket-mode",
      "data-contextrocket-api-base",
      "data-contextrocket-accent",
      "data-contextrocket-greeting",
      "data-contextrocket-ref",
    ];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.#config = parseWidgetConfig(this);
    if (!this.#config) {
      return;
    }

    this.#state = createInitialChatState(this.#config.greeting);
    this.#render();
    this.#bindEvents();
    this.#syncUi();
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }
    const next = parseWidgetConfig(this);
    if (!next) {
      return;
    }
    this.#config = next;
    if (this.#footerLink) {
      this.#footerLink.href = buildPoweredByHref(next);
    }
    this.#shadow.host.style.setProperty(
      "--cr-accent",
      next.accentColor ?? "#ff2b67",
    );
  }

  #render(): void {
    const config = this.#config!;
    const style = document.createElement("style");
    style.textContent = widgetStyles(config.accentColor);

    const root = document.createElement("div");
    root.className = "cr-root";
    root.innerHTML = `
      <div class="cr-panel" data-open="false" part="panel">
        <header class="cr-header">
        <h2 class="cr-title">${config.title ?? "Ask ContextRocket"}</h2>
          <button type="button" class="cr-close" aria-label="Close chat">×</button>
        </header>
        <div class="cr-messages" part="messages"></div>
        <p class="cr-error" hidden part="error"></p>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="Ask a question…" />
          <button class="cr-send" type="submit">Send</button>
        </form>
        <footer class="cr-footer" part="footer">
          Powered by <a href="${buildPoweredByHref(config)}" target="_blank" rel="noopener noreferrer">ContextRocket</a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="Open chat" part="launcher">⌁</button>
    `;

    this.#shadow.replaceChildren(style, root);

    this.#panel = this.#shadow.querySelector(".cr-panel") as HTMLDivElement;
    this.#launcher = this.#shadow.querySelector(
      ".cr-launcher",
    ) as HTMLButtonElement;
    this.#messages = this.#shadow.querySelector(
      ".cr-messages",
    ) as HTMLDivElement;
    this.#input = this.#shadow.querySelector(".cr-input") as HTMLInputElement;
    this.#send = this.#shadow.querySelector(".cr-send") as HTMLButtonElement;
    this.#error = this.#shadow.querySelector(
      ".cr-error",
    ) as HTMLParagraphElement;
    this.#footerLink = this.#shadow.querySelector(
      ".cr-footer a",
    ) as HTMLAnchorElement;
  }

  #bindEvents(): void {
    this.#launcher.addEventListener("click", () => this.#setOpen(true));
    this.#shadow
      .querySelector(".cr-close")
      ?.addEventListener("click", () => this.#setOpen(false));

    this.#shadow
      .querySelector(".cr-composer")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        void this.#handleSend();
      });
  }

  #setOpen(open: boolean): void {
    this.#panel.dataset.open = open ? "true" : "false";
    if (open) {
      this.#input.focus();
    }
  }

  async #handleSend(): Promise<void> {
    const config = this.#config;
    if (!config || !canSend(this.#state)) {
      return;
    }

    const text = this.#input.value.trim();
    if (!text) {
      return;
    }

    this.#input.value = "";

    const started = beginSend(this.#state, text);
    this.#state = started.state;
    this.#assistantMessageId = started.assistantMessageId;
    const runId = ++this.#runId;
    this.#syncUi();

    try {
      for await (const event of streamEmbedA2aSubscribe(config, {
        message: text,
        threadId: this.#state.threadId ?? undefined,
      })) {
        if (runId !== this.#runId) {
          return;
        }
        this.#state = applyTransportEvent(
          this.#state,
          event,
          started.assistantMessageId,
        );
        this.#syncUi();
        if (event.type === "error" || event.type === "done") {
          break;
        }
      }

      if (runId === this.#runId && this.#state.status === "streaming") {
        this.#state = { ...this.#state, status: "complete" };
        this.#syncUi();
      }
    } catch {
      if (runId !== this.#runId) {
        return;
      }
      this.#state = {
        ...this.#state,
        status: "error",
        errorMessage: "Something went wrong. Please try again.",
      };
      this.#syncUi();
    }
  }

  #syncUi(): void {
    this.#messages.replaceChildren();

    for (const message of this.#state.messages) {
      const bubble = document.createElement("div");
      bubble.className = "cr-message";
      bubble.dataset.role = message.role;
      bubble.textContent = message.content;

      if (
        message.role === "assistant" &&
        this.#state.status === "streaming" &&
        message.id === this.#assistantMessageId
      ) {
        bubble.dataset.streaming = "true";
      }

      this.#messages.appendChild(bubble);
    }

    this.#messages.scrollTop = this.#messages.scrollHeight;

    const hasError = Boolean(this.#state.errorMessage);
    this.#error.hidden = !hasError;
    this.#error.textContent = this.#state.errorMessage ?? "";

    const sending = this.#state.status === "streaming";
    this.#input.disabled = sending;
    this.#send.disabled = sending || !canSend(this.#state);
  }
}

export function registerContextRocketChatElement(
  registry: CustomElementRegistry = customElements,
): void {
  if (!registry.get(ELEMENT_TAG)) {
    registry.define(ELEMENT_TAG, ContextRocketChatElement);
  }
}

export function findEmbedScriptTag(
  current: HTMLScriptElement | null = document.currentScript as HTMLScriptElement | null,
): HTMLScriptElement | null {
  if (current) {
    return current;
  }

  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]',
  );

  for (let index = scripts.length - 1; index >= 0; index -= 1) {
    const candidate = scripts.item(index);
    if (candidate && parseWidgetConfig(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function mountFromScriptTag(
  script: HTMLScriptElement | null = findEmbedScriptTag(),
): ContextRocketChatElement | null {
  if (!script) {
    return null;
  }

  const config = parseWidgetConfig(script);
  if (!config) {
    console.warn(
      "[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo",
    );
    return null;
  }

  registerContextRocketChatElement();

  const host = document.createElement(ELEMENT_TAG) as ContextRocketChatElement;
  for (const attr of script.attributes) {
    if (attr.name.startsWith("data-")) {
      host.setAttribute(attr.name, attr.value);
    }
  }

  document.body.appendChild(host);
  return host;
}
