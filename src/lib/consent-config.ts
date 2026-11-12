export type CookieConsentSetting = "auto" | "on" | "off";
export type IntegrationConsentMode = "auto" | "always" | "external";

export interface ConsentIntegrationConfig {
  enabled?: boolean;
  consentCategory?: string;
}

/** Whether the built-in prompt should appear for this site's configuration. */
export function shouldShowConsentBanner(
  cookieConsent: CookieConsentSetting,
  integrationConsentMode: IntegrationConsentMode,
  integrations: Record<string, ConsentIntegrationConfig>,
): boolean {
  if (integrationConsentMode !== "auto" || cookieConsent === "off") return false;
  if (cookieConsent === "on") return true;

  return Object.values(integrations).some(
    (integration) =>
      integration.enabled !== false &&
      integration.consentCategory !== "necessary",
  );
}
