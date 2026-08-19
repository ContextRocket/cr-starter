"use client";

/**
 * <WebVitals /> -- field (RUM) performance reporter.
 *
 * Uses Next's `useReportWebVitals` to receive each Core Web Vital (LCP, INP,
 * CLS, FCP, TTFB) as the browser measures it, then ships it to the endpoint
 * configured in `analytics.config.ts`.
 *
 * Provider-agnostic and config-driven:
 *   - endpoint SET   → POST the metric via `navigator.sendBeacon` (or a
 *                      `fetch(keepalive)` fallback) so delivery survives unload.
 *   - endpoint UNSET → no-op. In development the metric is logged via
 *                      `console.debug` for local inspection; in production
 *                      nothing happens.
 *
 * The reporter is pure and guarded: it never throws, so a misconfigured
 * endpoint or a browser without `sendBeacon`/`fetch` can never break a page.
 * Renders nothing.
 */

import { useReportWebVitals } from "next/web-vitals";

import { analytics } from "@/config/site.config";

/** Shape of the metric object Next hands to the reporter callback. */
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  rating?: string;
  navigationType?: string;
  delta?: number;
}

function sendMetric(metric: WebVitalsMetric): void {
  const endpoint = analytics.webVitalsEndpoint;

  if (!endpoint) {
    // Unconfigured: surface the metric in dev, stay silent in prod.
    if (process.env.NODE_ENV !== "production") {
      console.debug("[web-vitals]", metric.name, metric.value, metric);
    }
    return;
  }

  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    navigationType: metric.navigationType,
    delta: metric.delta,
  });

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    if (typeof fetch === "function") {
      // keepalive lets the request outlive the page (unload beacon).
      void fetch(endpoint, {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        // Never let a failed beacon surface to the user.
      });
    }
  } catch {
    // Guarded: a transport error must never break the page.
  }
}

export function WebVitals() {
  useReportWebVitals(sendMetric);
  return null;
}
