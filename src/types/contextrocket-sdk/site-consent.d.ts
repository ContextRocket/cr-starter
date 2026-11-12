/** Shared browser consent state and the DOM behavior for the starter banner. */
export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";
export interface ConsentPreferences {
    necessary: true;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}
export type ConsentChoice = "accept" | "deny" | "custom";
export declare const CONSENT_CHANGE_EVENT = "cr:consent-change";
export declare const OPEN_SETTINGS_EVENT = "cr:open-cookie-settings";
export declare const CONSENT_STORAGE_KEY = "cr_cookie_consent";
export declare function emptyConsentPreferences(): ConsentPreferences;
/** Read versioned consent, migrating the original all-or-nothing choice. */
export declare function readConsentPreferences(): ConsentPreferences | null;
/** Persist a choice when possible and apply it for this page view regardless. */
export declare function saveConsentPreferences(preferences: ConsentPreferences, choice: ConsentChoice): void;
/** Bind the starter's localized cookie-banner markup to shared consent state. */
export declare function initializeCookieBanner(): void;
