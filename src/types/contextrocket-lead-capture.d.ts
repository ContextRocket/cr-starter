/** Public, browser-safe client for an organization's website lead form. */
export type LeadIntent = "contact" | "appointment" | "demo" | "support" | "other";
export interface PublicLeadInput {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    intent?: LeadIntent;
    source_channel?: string;
    consent: true;
    source_url?: string;
    referrer_origin?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}
export interface PublicLeadReceipt {
    lead_id: string;
    status: "captured";
    delivery_state: "queued" | "duplicate";
    follow_up_state: "human_follow_up";
}
export interface PublicLeadAttribution {
    source_url?: string;
    referrer_origin?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}
/**
 * Runtime surface exposed by the dependency-free `lead-capture.browser.js`
 * artifact on `window.ContextRocketSDK`.
 */
export interface ContextRocketBrowserSDK {
    readonly LeadCaptureError: typeof LeadCaptureError;
    readonly createPublicLeadSubmissionController: typeof createPublicLeadSubmissionController;
    readonly extractLeadAttribution: typeof extractLeadAttribution;
    readonly submitPublicLead: typeof submitPublicLead;
    readonly submitPublicLeadWithAttribution: typeof submitPublicLeadWithAttribution;
}
declare global {
    interface Window {
        /** Present after the static lead-capture browser artifact has loaded. */
        ContextRocketSDK?: ContextRocketBrowserSDK;
    }
}
/**
 * Extract bounded attribution for a public lead without forwarding arbitrary
 * query parameters or fragments (which can contain tokens or personal data).
 */
export declare function extractLeadAttribution(pageUrl: string | URL, referrerUrl?: string): PublicLeadAttribution;
export declare class LeadCaptureError extends Error {
    readonly status: number;
    readonly code: string;
    constructor(message: string, status: number, code: string);
}
export interface SubmitPublicLeadOptions {
    apiBaseUrl: string;
    orgHandle: string;
    lead: PublicLeadInput;
    idempotencyKey?: string;
    signal?: AbortSignal;
    fetcher?: typeof fetch;
}
export interface SubmitPublicLeadWithAttributionOptions extends SubmitPublicLeadOptions {
    /** Current page URL; the SDK strips fragments and all but bounded UTMs. */
    pageUrl: string | URL;
    referrerUrl?: string;
}
export interface PublicLeadSubmissionController {
    /** Submit a form payload, reusing its idempotency key for unchanged retries. */
    submit(options: SubmitPublicLeadWithAttributionOptions): Promise<PublicLeadReceipt>;
    /** Mark the next submission as a new attempt, such as after editing fields. */
    reset(): void;
}
/**
 * Submit one consented lead to the org-scoped public capture endpoint.
 * This endpoint does not use a browser API key; the server binds the handle to
 * that organization's canonical Lead Capture App and checks the request origin.
 */
export declare function submitPublicLead({ apiBaseUrl, orgHandle, lead, idempotencyKey, signal, fetcher, }: SubmitPublicLeadOptions): Promise<PublicLeadReceipt>;
/**
 * Submit a lead with first-party page/referrer attribution assembled in one
 * shared path for static forms and framework-specific form components.
 */
export declare function submitPublicLeadWithAttribution({ pageUrl, referrerUrl, lead, ...options }: SubmitPublicLeadWithAttributionOptions): Promise<PublicLeadReceipt>;
/**
 * Keep form retry behavior consistent across static and framework-specific
 * sites. Failed submissions retain their key; successful or edited attempts
 * receive a fresh key. The controller owns request identity, while each site
 * remains responsible for its form fields and presentation.
 */
export declare function createPublicLeadSubmissionController(submitter?: typeof submitPublicLeadWithAttribution, createKey?: () => string): PublicLeadSubmissionController;
