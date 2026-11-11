/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_DEFAULT_LOCALE?: string;
  readonly PUBLIC_CR_CHAT_MODE?: "demo" | "live";
  readonly PUBLIC_CR_CHAT_FULLSCREEN?: "true" | "false" | "1" | "0";
  readonly PUBLIC_CR_CHAT_FULLSCREEN_ON_OPEN?: "true" | "false" | "1" | "0";
  readonly PUBLIC_CR_CHAT_FULLSCREEN_ON_LOAD?: "true" | "false" | "1" | "0";
  readonly PUBLIC_CR_AGENT_URL?: string;
  readonly PUBLIC_CONTEXTROCKET_HANDLE?: string;
  readonly PUBLIC_CONTEXTROCKET_API_KEY?: string;
  readonly PUBLIC_CR_LEAD_CAPTURE_MODE?: "demo" | "live";
  readonly PUBLIC_COOKIE_CONSENT?: "on" | "off";
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
