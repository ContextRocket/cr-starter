export function widgetStyles(accentColor = "#ff2b67"): string {
  return `
:host {
  all: initial;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #111827;
  --cr-accent: ${accentColor};
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 12%, white);
  --cr-border: #e5e7eb;
  --cr-muted: #6b7280;
  --cr-bg: #ffffff;
  --cr-card: #f9fafb;
  --cr-text: #111827;
  --cr-panel-shadow: 0 12px 40px rgba(17, 24, 39, 0.18);
}

:host([data-theme="dark"]) {
  color: #f9fafb;
  --cr-border: #374151;
  --cr-muted: #9ca3af;
  --cr-bg: #111827;
  --cr-card: #1f2937;
  --cr-text: #f9fafb;
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="system"]) {
    color: #f9fafb;
    --cr-border: #374151;
    --cr-muted: #9ca3af;
    --cr-bg: #111827;
    --cr-card: #1f2937;
    --cr-text: #f9fafb;
    --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

.cr-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.cr-root[data-position="bottom-left"] {
  right: auto;
  left: 20px;
  align-items: flex-start;
}

.cr-launcher {
  width: 56px;
  height: 56px;
  border: 1px solid var(--cr-border);
  border-radius: 0;
  background: var(--cr-accent);
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: var(--cr-panel-shadow);
  font-size: 20px;
  line-height: 1;
}

.cr-launcher:focus-visible {
  outline: 2px solid #111827;
  outline-offset: 2px;
}

.cr-panel {
  width: min(360px, calc(100vw - 32px));
  height: min(520px, calc(100vh - 120px));
  display: none;
  flex-direction: column;
  border: 1px solid var(--cr-border);
  background: var(--cr-bg);
  color: var(--cr-text);
  box-shadow: var(--cr-panel-shadow);
}

.cr-panel[data-open="true"] {
  display: flex;
}

.cr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--cr-border);
  background: var(--cr-card);
}

.cr-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cr-close {
  border: none;
  background: transparent;
  color: var(--cr-muted);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  min-width: 44px;
  min-height: 44px;
  padding: 2px 6px;
}

.cr-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cr-message {
  max-width: 88%;
  padding: 10px 12px;
  border: 1px solid var(--cr-border);
  white-space: pre-wrap;
  word-break: break-word;
}

.cr-message[data-role="user"] {
  align-self: flex-end;
  background: var(--cr-accent-soft);
  border-color: color-mix(in srgb, var(--cr-accent) 35%, white);
}

.cr-message[data-role="assistant"] {
  align-self: flex-start;
  background: var(--cr-card);
}

.cr-message p,
.cr-message ul,
.cr-message ol,
.cr-message pre {
  margin: 0 0 8px;
}

.cr-message p:last-child,
.cr-message ul:last-child,
.cr-message ol:last-child,
.cr-message pre:last-child {
  margin-bottom: 0;
}

.cr-message ul,
.cr-message ol {
  padding-left: 20px;
}

.cr-message a,
.cr-source {
  color: var(--cr-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cr-message pre {
  overflow-x: auto;
  padding: 8px;
  background: color-mix(in srgb, var(--cr-card) 72%, #000 28%);
  font-size: 12px;
}

.cr-markdown-heading {
  font-weight: 700;
}

.cr-message[data-streaming="true"]::after {
  content: "▋";
  display: inline-block;
  margin-left: 2px;
  animation: cr-blink 1s step-end infinite;
  color: var(--cr-accent);
}

@keyframes cr-blink {
  50% { opacity: 0; }
}

.cr-error {
  margin: 0 14px;
  padding: 8px 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 12px;
}

.cr-status {
  margin: 0 14px 8px;
  color: var(--cr-muted);
  font-size: 12px;
}

.cr-retry {
  align-self: flex-start;
  margin: 0 14px 8px;
  min-height: 44px;
  border: 1px solid var(--cr-border);
  background: var(--cr-card);
  color: var(--cr-accent);
  padding: 8px 12px;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.cr-sources,
.cr-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.cr-source,
.cr-suggestion {
  min-height: 32px;
  border: 1px solid var(--cr-border);
  background: var(--cr-bg);
  padding: 5px 8px;
  font-size: 11px;
}

.cr-suggestion {
  color: var(--cr-accent);
  cursor: pointer;
  font: inherit;
}

.cr-composer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--cr-border);
}

.cr-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--cr-border);
  border-radius: 0;
  padding: 8px 10px;
  font: inherit;
}

.cr-input:focus {
  outline: 2px solid color-mix(in srgb, var(--cr-accent) 45%, white);
  outline-offset: 0;
}

.cr-send {
  border: 1px solid var(--cr-accent);
  background: var(--cr-accent);
  color: #fff;
  padding: 8px 12px;
  min-height: 44px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cr-send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cr-footer {
  padding: 8px 14px 10px;
  border-top: 1px solid var(--cr-border);
  text-align: center;
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-footer a {
  color: var(--cr-muted);
  text-decoration: none;
}

.cr-footer a:hover {
  color: var(--cr-accent);
  text-decoration: underline;
}
`.trim();
}
