/**
 * analytics.config.ts — where Web Vitals field (RUM) data is sent
 * (configurable OUTSIDE component code).
 *
 * Real-user Web Vitals (LCP, INP, CLS, FCP, TTFB) can be POSTed to an
 * endpoint here without touching any component. With no endpoint set, the
 * reporter is a no-op: in development it logs each metric to the console for
 * inspection, and in production it does nothing — perfect for a static preview
 * or a fork that isn't wired to a RUM backend yet.
 *
 * INTEGRATION: point `webVitalsEndpoint` at any HTTP ingress that accepts
 * `{ name, value, id, rating, navigationType, delta }` JSON bodies — a
 * ContextRocket RUM collector, a serverless function, or a vendor-agnostic
 * analytics gateway. The reporter prefers `navigator.sendBeacon` and falls
 * back to `fetch(..., { keepalive: true })`, so delivery survives page unload.
 *
 * SECURITY: this file is bundled to the client. Do NOT put secrets here. Point
 * `webVitalsEndpoint` at a PUBLIC same-origin path or absolute URL whose
 * ingress expects unauthenticated public beacons and has its own abuse
 * protection (rate limiting, origin checks). This is the seam a fork uses to
 * integrate field performance measurement.
 */

export interface AnalyticsConfig {
  /**
   * Absolute URL or same-origin path that receives Web Vitals beacons.
   * Empty/undefined = disabled (no network call; console.debug in dev only).
   */
  webVitalsEndpoint?: string;
}

/**
 * Fork owners: set `webVitalsEndpoint` to a public RUM ingress to enable
 * field performance measurement. Leave it empty to keep the reporter a no-op.
 */
export const analytics: AnalyticsConfig = {
  webVitalsEndpoint: "", // PLACEHOLDER — empty = disabled
};
