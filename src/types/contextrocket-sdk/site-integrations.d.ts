import type { ConsentCategory } from "./site-consent.js";
export type { ConsentCategory, ConsentPreferences } from "./site-consent.js";
interface IntegrationBase {
    provider: "google-tag-manager" | "google-analytics" | "posthog" | "script";
    enabled?: boolean;
    consentCategory?: ConsentCategory;
}
export interface SiteIntegrationConfig extends IntegrationBase {
    containerId?: string;
    measurementId?: string;
    projectKey?: string;
    apiHost?: string;
    dataLayerName?: string;
    options?: Record<string, string | number | boolean>;
    src?: string;
    attributes?: Record<string, string>;
    async?: boolean;
    defer?: boolean;
}
export interface SiteIntegrationsConfig {
    integrations: Record<string, SiteIntegrationConfig>;
    consentManaged: boolean;
    consentStorage?: boolean;
    consentBanner?: boolean;
}
declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        posthog?: PostHogStub;
    }
}
interface PostHogStub extends Array<unknown> {
    __SV?: number;
    _i?: unknown[][];
    init?: (projectKey: string, options: Record<string, unknown>) => void;
    opt_in_capturing?: () => void;
    opt_out_capturing?: () => void;
    [key: string]: unknown;
}
export declare function initializeSiteIntegrations(config: SiteIntegrationsConfig): void;
