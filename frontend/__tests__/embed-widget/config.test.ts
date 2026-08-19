// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import {
  buildPoweredByHref,
  parseWidgetConfig,
} from "../../../clients/embed-widget/src/config";

describe("embed-widget config", () => {
  it("parses live API-key configuration", () => {
    const el = document.createElement("script");
    el.setAttribute("data-contextrocket-api-key", "crk_api_test");
    el.setAttribute("data-contextrocket-api-base", "https://api.example.com/");
    el.setAttribute("data-contextrocket-mode", "live");
    el.setAttribute("data-contextrocket-org", "org-123");
    el.setAttribute("data-contextrocket-handle", "example-brand");

    expect(parseWidgetConfig(el)).toEqual({
      apiKey: "crk_api_test",
      apiBaseUrl: "https://api.example.com",
      mode: "live",
      handle: "example-brand",
    });
  });

  it("accepts a canned demo without an API base", () => {
    const el = document.createElement("script");
    el.setAttribute("data-contextrocket-mode", "demo");

    expect(parseWidgetConfig(el)).toEqual({ mode: "demo" });
  });

  it("rejects live mode without an API base", () => {
    const el = document.createElement("script");
    el.setAttribute("data-contextrocket-mode", "live");

    expect(parseWidgetConfig(el)).toBeNull();
  });

  it("builds a powered-by href from an explicit ref or handle", () => {
    expect(
      buildPoweredByHref({
        apiKey: "crk_api_test",
        apiBaseUrl: "https://api.example.com",
        mode: "live",
        ref: "demo-acme",
      }),
    ).toBe("https://www.contextrocket.ai?ref=demo-acme");

    expect(
      buildPoweredByHref({
        apiBaseUrl: "https://api.example.com",
        handle: "example-brand",
        mode: "live",
      }),
    ).toBe("https://www.contextrocket.ai?ref=example-brand");
  });
});
