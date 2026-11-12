/** Public, browser-safe client for an organization's website contact form. */
export type ContactIntent = "contact" | "appointment" | "demo" | "support" | "other";
export type ContactFormJsonValue = string | number | boolean | null | ContactFormJsonValue[] | {
    [key: string]: ContactFormJsonValue;
};
export interface ContactFormData {
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    intent?: ContactIntent;
    source_channel?: string;
    consent: true;
    /** Answers keyed by configured, non-system fields in the org's Leads table. */
    custom_answers?: Record<string, ContactFormJsonValue>;
    source_url?: string;
    referrer_origin?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}
export interface ContactFormFieldNames {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    intent: string;
    consent: string;
}
export type ContactFormCustomAnswerType = "text" | "number" | "boolean" | "multi_select";
export interface ContactFormCustomAnswerField {
    /** Native form control name. Repeated checkbox/select values share a name. */
    name: string;
    /** Defaults to text; multi-select and boolean answers should be explicit. */
    type?: ContactFormCustomAnswerType;
}
export interface MapContactFormDataOptions {
    /** HTML field names; empty strings disable optional fields. */
    fields?: Partial<ContactFormFieldNames>;
    /** Used when the form has no intent field, such as a general inquiry. */
    defaultIntent?: ContactIntent;
    /** Site-specific attribution channel, for example "website" or "form". */
    sourceChannel?: string;
    /** Explicitly mapped values keyed by the org's configured Leads field keys. */
    customAnswers?: Record<string, ContactFormJsonValue>;
}
export interface ContactFormReceipt {
    lead_id: string;
    status: "captured";
    delivery_state: "queued" | "duplicate";
    follow_up_state: "human_follow_up";
}
export interface ContactAttribution {
    source_url?: string;
    referrer_origin?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}
/**
 * Runtime surface exposed by the dependency-free `contact-form.browser.js`
 * artifact on `window.ContextRocketSDK`.
 */
export interface ContextRocketBrowserSDK {
    readonly ContactFormError: typeof ContactFormError;
    readonly createContactFormController: typeof createContactFormController;
    readonly mapContactFormData: typeof mapContactFormData;
    readonly mapCustomContactAnswers: typeof mapCustomContactAnswers;
    readonly extractContactAttribution: typeof extractContactAttribution;
    readonly submitContactForm: typeof submitContactForm;
    readonly submitContactFormWithAttribution: typeof submitContactFormWithAttribution;
}
declare global {
    interface Window {
        /** Present after the static contact-form browser artifact has loaded. */
        ContextRocketSDK?: ContextRocketBrowserSDK;
    }
}
/** Map explicitly configured HTML fields to organization Leads field keys. */
export declare function mapCustomContactAnswers(values: FormData, fields: Record<string, ContactFormCustomAnswerField>): Record<string, ContactFormJsonValue>;
/**
 * Map native form values to the shared contact API shape. Site markup and
 * validation remain site-owned; this helper only normalizes common fields and
 * refuses to invent the explicit consent required by the API.
 */
export declare function mapContactFormData(values: FormData, options?: MapContactFormDataOptions): ContactFormData;
/**
 * Extract bounded attribution for a contact form without forwarding arbitrary
 * query parameters or fragments (which can contain tokens or personal data).
 */
export declare function extractContactAttribution(pageUrl: string | URL, referrerUrl?: string): ContactAttribution;
export declare class ContactFormError extends Error {
    readonly status: number;
    readonly code: string;
    constructor(message: string, status: number, code: string);
}
export interface SubmitContactFormOptions {
    apiBaseUrl: string;
    orgHandle: string;
    form: ContactFormData;
    idempotencyKey?: string;
    signal?: AbortSignal;
    fetcher?: typeof fetch;
}
export interface SubmitContactFormWithAttributionOptions extends SubmitContactFormOptions {
    /** Current page URL; the SDK strips fragments and all but bounded UTMs. */
    pageUrl: string | URL;
    referrerUrl?: string;
}
export interface ContactFormController {
    /** Submit a form payload, reusing its idempotency key for unchanged retries. */
    submit(options: SubmitContactFormWithAttributionOptions): Promise<ContactFormReceipt>;
    /** Mark the next submission as a new attempt, such as after editing fields. */
    reset(): void;
}
/**
 * Submit one consented contact form to the org-scoped public capture endpoint.
 * This endpoint does not use a browser API key; the server binds the handle to
 * that organization's lead record and checks the request origin.
 */
export declare function submitContactForm({ apiBaseUrl, orgHandle, form, idempotencyKey, signal, fetcher, }: SubmitContactFormOptions): Promise<ContactFormReceipt>;
/**
 * Submit a contact form with first-party page/referrer attribution assembled in one
 * shared path for static forms and framework-specific form components.
 */
export declare function submitContactFormWithAttribution({ pageUrl, referrerUrl, form, ...options }: SubmitContactFormWithAttributionOptions): Promise<ContactFormReceipt>;
/**
 * Keep form retry behavior consistent across static and framework-specific
 * sites. Failed submissions retain their key; successful or edited attempts
 * receive a fresh key. The controller owns request identity, while each site
 * remains responsible for its form fields and presentation.
 */
export declare function createContactFormController(submitter?: typeof submitContactFormWithAttribution, createKey?: () => string): ContactFormController;
