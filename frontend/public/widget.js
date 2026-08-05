/**
 * ContextRocket embeddable chat widget loader.
 *
 * Drop this script on any website to add a floating chat button backed by
 * your ContextRocket agent:
 *
 *   <script
 *     src="https://your-site.example/widget.js"
 *     data-cr-agent-url="https://your-cr-instance.com"
 *     data-cr-site-key="pk_live_..."
 *     data-cr-title="Ask us anything"
 *     defer
 *   ></script>
 *
 * ATTRIBUTES (read from this <script> tag's dataset):
 *   data-cr-agent-url  -- required. Your ContextRocket A2A base URL.
 *   data-cr-site-key   -- optional. Public rate-limited org credential.
 *   data-cr-title      -- optional. Panel title shown in the iframe.
 *
 * HOW IT WORKS:
 *   1. Reads config from this <script> tag's data-* attributes.
 *   2. Injects a floating action button (FAB) into the host page.
 *   3. On FAB click, opens an <iframe> pointing at /embed on the same
 *      origin where widget.js is served. The iframe renders the full
 *      ContextRocket chat panel.
 *   4. Config is passed to the embed page via URL query params -- no
 *      postMessage, no cookies, no localStorage on the host page.
 *
 * ISOLATION MODEL:
 *   The iframe boundary provides style isolation for free: host-page CSS
 *   cannot leak into the chat panel, and panel styles cannot affect the
 *   host page. This is simpler and more robust than a Shadow DOM approach
 *   (which would still require a full shadow CSS reset and blocks older
 *   browser targets). The trade-off is that the embed page must be served
 *   from the same origin as widget.js (same-origin iframe = full-featured
 *   rendering without COEP/CORP complications).
 *
 * SECURITY NOTE:
 *   data-cr-site-key is a PUBLIC credential class -- analogous to a
 *   publishable Stripe key. Rate-limiting and origin binding are enforced
 *   server-side at ContextRocket. Never put server-side secrets in this
 *   script or in the iframe URL. The loader itself carries no secrets.
 *
 * SHARED CONTRACT:
 *   The parseConfig logic below is duplicated from lib/widget-config.ts
 *   (the typed TypeScript version the embed page imports). Both copies
 *   use the same field names (agent-url, site-key, title). The duplication
 *   is intentional: this loader must stay dependency-free -- no bundler,
 *   no React, no imports -- so the 5-line parse is inlined here rather
 *   than imported.
 */

(function () {
  "use strict";

  // ── Config: read from this <script> tag's data attributes ─────────────────

  /**
   * Locate the <script> tag that loaded this file.
   *
   * document.currentScript is reliable for non-module scripts. If it is
   * unavailable (e.g. the script was evaluated after load), fall back to
   * querying by src suffix.
   */
  var scriptEl =
    document.currentScript ||
    (function () {
      var scripts = document.querySelectorAll('script[src*="widget.js"]');
      return scripts[scripts.length - 1] || null;
    })();

  /**
   * Parse widget config from a script element's dataset.
   * Field names match the TypeScript contract in lib/widget-config.ts.
   *
   * Returns: { agentUrl, siteKey, title } -- all strings or null.
   */
  function parseConfig(el) {
    if (!el || !el.dataset)
      return { agentUrl: null, siteKey: null, title: null };
    return {
      agentUrl: el.dataset.crAgentUrl || null,
      siteKey: el.dataset.crSiteKey || null,
      title: el.dataset.crTitle || null,
    };
  }

  var config = parseConfig(scriptEl);

  // ── Embed URL: build the iframe src ───────────────────────────────────────

  /**
   * Derive the embed origin from the widget.js <script src>.
   *
   * The embed page (/embed) must be served from the same origin as widget.js
   * so the same-origin iframe can render without CORS restrictions.
   *
   * Falls back to the current page origin if the script src is not an
   * absolute URL (e.g. during local development or unusual deployments).
   */
  function getEmbedOrigin() {
    if (scriptEl && scriptEl.src) {
      try {
        var url = new URL(scriptEl.src);
        return url.origin;
      } catch (e) {
        void e; // URL parse failed -- fall through to page origin.
      }
    }
    return window.location.origin;
  }

  function buildEmbedUrl() {
    var origin = getEmbedOrigin();
    var params = new URLSearchParams();
    if (config.agentUrl) params.set("agent-url", config.agentUrl);
    if (config.siteKey) params.set("site-key", config.siteKey);
    if (config.title) params.set("title", config.title);
    var query = params.toString();
    return origin + "/embed" + (query ? "?" + query : "");
  }

  // ── DOM: inject FAB and iframe container ──────────────────────────────────

  var WIDGET_ID = "cr-widget";
  var FAB_ID = "cr-widget-fab";
  var IFRAME_ID = "cr-widget-iframe";

  var isOpen = false;

  /** Build and inject the widget DOM nodes if not already present. */
  function mount() {
    if (document.getElementById(WIDGET_ID)) return; // idempotent

    var container = document.createElement("div");
    container.id = WIDGET_ID;
    container.setAttribute(
      "style",
      [
        "position: fixed",
        "bottom: 24px",
        "right: 24px",
        "z-index: 2147483647", // max z-index; sit above host-page content
        "display: flex",
        "flex-direction: column",
        "align-items: flex-end",
        "gap: 12px",
        "font-family: system-ui, sans-serif",
      ].join(";"),
    );

    // ── Iframe panel ──────────────────────────────────────────────────────
    var iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.src = buildEmbedUrl();
    iframe.title = config.title || "Chat";
    // sandbox: allow-scripts is required for React; allow-forms for the chat
    // composer; allow-same-origin so cookies/session work within the iframe.
    // Omitting allow-top-navigation prevents clickjacking the host frame.
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-forms allow-same-origin",
    );
    iframe.setAttribute(
      "style",
      [
        "display: none",
        "width: 380px",
        "height: 600px",
        "max-height: calc(100vh - 100px)",
        "border: none",
        "border-radius: 16px",
        "box-shadow: 0 8px 40px rgba(0,0,0,0.18)",
        "background: white",
        "transition: opacity 0.2s ease",
      ].join(";"),
    );

    // ── FAB button ────────────────────────────────────────────────────────
    var fab = document.createElement("button");
    fab.id = FAB_ID;
    fab.type = "button";
    fab.setAttribute("aria-label", "Open chat");
    fab.setAttribute(
      "style",
      [
        "width: 56px",
        "height: 56px",
        "border-radius: 50%",
        "border: none",
        "cursor: pointer",
        "background: #4264fc",
        "color: white",
        "display: flex",
        "align-items: center",
        "justify-content: center",
        "box-shadow: 0 4px 16px rgba(66,100,252,0.4)",
        "flex-shrink: 0",
        "transition: transform 0.15s ease, box-shadow 0.15s ease",
      ].join(";"),
    );

    // Chat bubble SVG icon (no external dependency).
    fab.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" ' +
      'fill="currentColor"/></svg>';

    fab.addEventListener("mouseover", function () {
      fab.style.transform = "scale(1.08)";
      fab.style.boxShadow = "0 6px 24px rgba(66,100,252,0.5)";
    });
    fab.addEventListener("mouseout", function () {
      fab.style.transform = "";
      fab.style.boxShadow = "0 4px 16px rgba(66,100,252,0.4)";
    });
    fab.addEventListener("click", toggle);

    container.appendChild(iframe);
    container.appendChild(fab);

    // Attribution — small, subtle, non-intrusive.
    var attr = document.createElement("a");
    attr.href = "https://contextrocket.ai";
    attr.target = "_blank";
    attr.rel = "noopener noreferrer";
    attr.setAttribute(
      "style",
      [
        "display: block",
        "margin-top: 6px",
        "font-size: 10px",
        "color: rgba(0,0,0,0.3)",
        "text-align: center",
        "text-decoration: none",
        "transition: color 0.2s ease",
      ].join(";"),
    );
    attr.textContent = "Powered by ContextRocket";
    attr.addEventListener("mouseover", function () {
      attr.style.color = "rgba(0,0,0,0.5)";
    });
    attr.addEventListener("mouseout", function () {
      attr.style.color = "rgba(0,0,0,0.3)";
    });
    container.appendChild(attr);

    document.body.appendChild(container);
  }

  /** Toggle the chat panel open/closed. */
  function toggle() {
    var iframe = document.getElementById(IFRAME_ID);
    var fab = document.getElementById(FAB_ID);
    if (!iframe || !fab) return;

    isOpen = !isOpen;

    if (isOpen) {
      iframe.style.display = "block";
      fab.setAttribute("aria-label", "Close chat");
      fab.setAttribute("aria-expanded", "true");
    } else {
      iframe.style.display = "none";
      fab.setAttribute("aria-label", "Open chat");
      fab.setAttribute("aria-expanded", "false");
    }
  }

  // ── Initialise ────────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
