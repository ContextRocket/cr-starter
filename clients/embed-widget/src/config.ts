import type { WidgetConfig } from "./types";

const DATA_PREFIX = "contextrocket";

function readAttr(element: Element, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = element.getAttribute(name)?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

/**
 * Parse widget configuration from a script tag or host element.
 *
 * Attribute names are deliberately namespaced so snippets are unambiguous:
 * `data-contextrocket-api-key`, `data-contextrocket-handle`, and so on.
 */
export function parseWidgetConfig(source: Element): WidgetConfig | null {
  const apiKey = readAttr(
    source,
    `data-${DATA_PREFIX}-api-key`,
  );
  const handle = readAttr(
    source,
    `data-${DATA_PREFIX}-handle`,
  );
  const apiBaseUrl = readAttr(source, `data-${DATA_PREFIX}-api-base`);
  const rawMode = readAttr(source, `data-${DATA_PREFIX}-mode`);
  const mode = rawMode === "live" ? "live" : "demo";

  // Demo mode is self-contained. Live mode requires an API base; ContextRocket
  // decides whether the handle/key is authorized for the requested origin.
  if (mode === "live" && !apiBaseUrl) {
    return null;
  }

  const accentColor = readAttr(source, `data-${DATA_PREFIX}-accent`);
  const greeting = readAttr(source, `data-${DATA_PREFIX}-greeting`);
  const title = readAttr(source, `data-${DATA_PREFIX}-title`);
  const ref = readAttr(source, `data-${DATA_PREFIX}-ref`);

  return {
    ...(apiBaseUrl ? { apiBaseUrl: apiBaseUrl.replace(/\/$/, "") } : {}),
    mode,
    ...(apiKey ? { apiKey } : {}),
    ...(handle ? { handle } : {}),
    ...(accentColor ? { accentColor } : {}),
    ...(greeting ? { greeting } : {}),
    ...(title ? { title } : {}),
    ...(ref ? { ref } : {}),
  };
}

export function buildPoweredByHref(config: WidgetConfig): string {
  // The "powered by ContextRocket" backlink points at the website
  // (contextrocket.ai), never the API domain.
  const base = "https://www.contextrocket.ai";
  const refToken = config.ref ?? config.handle ?? "widget";
  return `${base}?ref=${encodeURIComponent(refToken)}`;
}
