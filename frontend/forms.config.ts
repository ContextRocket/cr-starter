/**
 * forms.config.ts — where the site's forms submit (configurable OUTSIDE
 * component code).
 *
 * Each named form (subscribe, waitlist, contact, lead capture) can be pointed
 * at an endpoint here without touching any component. With no endpoint set, the
 * form is UI-only: it validates and shows a local success state, with no network
 * call — perfect for a static preview or a site that isn't wired to a backend
 * yet.
 *
 * INTEGRATION: point these at a ContextRocket **structured app** (lead capture,
 * waitlist, …) — or any HTTP endpoint — to wire the forms to a backend. The
 * submitted body is `{ ...fields, ...meta }` (see `lib/forms.ts`); map it on the
 * receiving end. This is the seam a fork uses to integrate its forms.
 *
 * SECURITY: this file is bundled to the client. Do NOT put secrets here. Point
 * forms at a public write endpoint / signed ingress / structured-app entry that
 * expects unauthenticated public submissions and has its own abuse protection.
 */

export type FormKey = "subscribe" | "waitlist" | "contact" | "leadCapture";

export interface FormEndpoint {
  /** Absolute URL or same-origin path to submit to. Empty/undefined = UI-only. */
  endpoint?: string;
  /** HTTP method (default "POST"). */
  method?: "POST" | "PUT";
  /** Static headers merged into the request (e.g. a public site key). No secrets. */
  headers?: Record<string, string>;
  /** Extra fields merged into every payload for this form (e.g. a source tag). */
  meta?: Record<string, string>;
}

export type FormsConfig = Partial<Record<FormKey, FormEndpoint>>;

/**
 * Fork owners: set an `endpoint` (and optional headers/meta) per form to wire
 * it up. Leave `endpoint` empty for UI-only.
 */
export const forms: FormsConfig = {
  subscribe: { endpoint: "", meta: { source: "subscribe" } }, // PLACEHOLDER
  waitlist: { endpoint: "", meta: { source: "waitlist" } }, // PLACEHOLDER
};
