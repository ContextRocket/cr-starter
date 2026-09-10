/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_DEFAULT_LOCALE?: string;
  readonly PUBLIC_CR_CHAT_MODE?: "demo" | "live";
  readonly PUBLIC_CR_AGENT_URL?: string;
  readonly PUBLIC_CONTEXTROCKET_HANDLE?: string;
  readonly PUBLIC_CONTEXTROCKET_API_KEY?: string;
  readonly PUBLIC_COOKIE_CONSENT?: "auto" | "on" | "off";
  readonly PUBLIC_DEFAULT_THEME?: "system" | "light" | "dark";
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
