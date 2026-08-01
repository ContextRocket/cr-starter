/**
 * English i18n message tree for the cr-starter.
 *
 * Pattern adapted from context-rocket/frontend/i18n/messages/en.ts.
 * Keys use SCREAMING_SNAKE_CASE to match the existing call-sites (t("AUTH_LOGIN_TITLE")).
 * Spanish and German bundles live in ./es.ts and ./de.ts.
 * Parity across all three locales is enforced by scripts/check-i18n-parity.js
 * (runs as a pre-commit hook).
 *
 * BOUNDARY NOTE:
 *   messages/* = UI copy (button labels, prompts, validation messages, legal boilerplate).
 *   site.config.ts = brand identity (companyName, tagline, description, siteUrl, legal fields).
 *   Do NOT duplicate brand identity strings here; components read from siteConfig directly.
 */

export const en = {
  // ── Locale labels (used by LocaleSwitcher) ───────────────────────────────
  locale: {
    labelEnglish: "English",
    labelSpanish: "Spanish",
    labelGerman: "German",
    changeLanguage: "Change language",
  },

  // ── Home / landing ────────────────────────────────────────────────────────
  HOME_SUBTITLE:
    "Build products on ContextRocket. Auth, dashboard shell, and OpenAPI-driven type safety included. Conversation state and agent runs delegate to ContextRocket via A2A.",
  HOME_CTA: "Go to Dashboard",

  // ── Auth: login ───────────────────────────────────────────────────────────
  AUTH_LOGIN_TITLE: "Login",
  AUTH_LOGIN_DESCRIPTION: "Enter your email below to log in to your account.",
  AUTH_LOGIN_SUBMIT: "Sign In",
  AUTH_LOGIN_NO_ACCOUNT: "Don't have an account?",
  AUTH_LOGIN_SIGN_UP: "Sign up",
  AUTH_FORGOT_PASSWORD: "Forgot your password?",

  // ── Auth: register ────────────────────────────────────────────────────────
  AUTH_REGISTER_TITLE: "Sign Up",
  AUTH_REGISTER_DESCRIPTION:
    "Enter your email and password below to create your account.",
  AUTH_REGISTER_SUBMIT: "Sign Up",
  AUTH_REGISTER_BACK: "Back to login",

  // ── Auth: password recovery ───────────────────────────────────────────────
  AUTH_PASSWORD_RECOVERY_TITLE: "Password Recovery",
  AUTH_PASSWORD_RECOVERY_DESCRIPTION:
    "Enter your email to receive instructions to reset your password.",
  AUTH_PASSWORD_RECOVERY_SUBMIT: "Send",
  AUTH_PASSWORD_RECOVERY_BACK: "Back to login",
  AUTH_PASSWORD_RESET_TITLE: "Reset your Password",
  AUTH_PASSWORD_RESET_DESCRIPTION: "Enter the new password and confirm it.",
  AUTH_PASSWORD_RESET_SUBMIT: "Send",
  AUTH_PASSWORD_RESET_LOADING: "Loading reset form...",
  AUTH_PASSWORD_RESET_SUCCESS:
    "Password reset instructions sent to your email.",

  // ── Form labels (shared) ──────────────────────────────────────────────────
  FORM_EMAIL: "Email",
  FORM_PASSWORD: "Password",
  FORM_PASSWORD_CONFIRM: "Password Confirm",
  FORM_USERNAME: "Username",
  FORM_PLACEHOLDER_EMAIL: "m@example.com",

  // ── Validation messages ───────────────────────────────────────────────────
  FORM_VALIDATION_PASSWORD_MIN: "Password should be at least 8 characters.",
  FORM_VALIDATION_PASSWORD_UPPERCASE:
    "Password should contain at least one uppercase letter.",
  FORM_VALIDATION_PASSWORD_SPECIAL:
    "Password should contain at least one special character.",
  FORM_VALIDATION_PASSWORDS_MATCH: "Passwords must match.",
  FORM_VALIDATION_TOKEN_REQUIRED: "Token is required",
  FORM_VALIDATION_EMAIL_INVALID: "Invalid email address",
  FORM_VALIDATION_PASSWORD_REQUIRED: "Password is required",
  FORM_VALIDATION_USERNAME_REQUIRED: "Username is required",

  // ── Navigation / breadcrumbs ──────────────────────────────────────────────
  NAV_DASHBOARD: "Dashboard",
  NAV_LOGOUT: "Logout",

  // ── Dashboard (landing when logged in) ────────────────────────────────────
  NAV_WELCOME: "Welcome to your Dashboard",
  DASHBOARD_TITLE: "Dashboard",
  DASHBOARD_SUBTITLE:
    "Your ContextRocket-powered workspace. Configure your application and connect to ContextRocket for agent runs, conversation state, and knowledge management.",
  // Cards
  DASHBOARD_CARD_CHAT_TITLE: "Continue chatting",
  DASHBOARD_CARD_CHAT_DESCRIPTION:
    "Your conversation history is saved. Pick up where you left off.",
  DASHBOARD_CARD_CHAT_ACTION: "Open chat",
  DASHBOARD_CARD_PROFILE_TITLE: "Profile & settings",
  DASHBOARD_CARD_PROFILE_DESCRIPTION:
    "Update your email, password, or language preference.",
  DASHBOARD_CARD_PROFILE_ACTION: "Edit profile",
  DASHBOARD_CARD_USERS_TITLE: "Users",
  DASHBOARD_CARD_USERS_DESCRIPTION:
    "Review registered accounts and guest sessions.",
  DASHBOARD_CARD_USERS_ACTION: "View users",
  // Guest dashboard prompt
  DASHBOARD_GUEST_PROMPT_TITLE: "Save your conversation",
  DASHBOARD_GUEST_PROMPT_DESCRIPTION:
    "Create a free account to keep your chat history. Your current conversation will continue either way.",
  DASHBOARD_GUEST_PROMPT_ACTION: "Create account",

  // ── Dashboard: users list (operator only) ─────────────────────────────────
  DASHBOARD_USERS_TITLE: "Users",
  DASHBOARD_USERS_DESCRIPTION: "All registered and guest accounts.",
  DASHBOARD_USERS_COL_EMAIL: "Email",
  DASHBOARD_USERS_COL_TYPE: "Type",
  DASHBOARD_USERS_COL_STATUS: "Status",
  DASHBOARD_USERS_TYPE_GUEST: "Guest",
  DASHBOARD_USERS_TYPE_REGISTERED: "Registered",
  DASHBOARD_USERS_STATUS_ACTIVE: "Active",
  DASHBOARD_USERS_STATUS_INACTIVE: "Inactive",
  DASHBOARD_USERS_FORBIDDEN: "This page is for operators only.",

  // ── Dashboard: profile ────────────────────────────────────────────────────
  DASHBOARD_PROFILE_TITLE: "Profile & settings",

  // ── Error pages ───────────────────────────────────────────────────────────
  ERROR_GENERIC: "Something went wrong. Please try again.",
  ERROR_DASHBOARD: "Something went wrong loading this page.",
  ERROR_TRY_AGAIN: "Try again",
  ERROR_UNEXPECTED: "An unexpected error occurred. Please try again later.",
  ERROR_NETWORK: "Network error",
  ERROR_NO_TOKEN: "No access token found",
  ERROR_NO_DATA: "No data returned from server",
  ERROR_UNKNOWN: "Unknown error",

  // ── Backend error keys (returned as raw keys from API) ────────────────────
  ERROR_INTERNAL: "Internal server error",

  // ── Footer ────────────────────────────────────────────────────────────────
  FOOTER_IMPRESSUM: "Impressum",
  FOOTER_PRIVACY: "Privacy Policy",

  // ── Legal pages ───────────────────────────────────────────────────────────
  IMPRESSUM_TITLE: "Impressum",
  IMPRESSUM_LEGAL_NOTICE: "Legal Notice",
  IMPRESSUM_ENTITY_LABEL: "Entity",
  IMPRESSUM_ADDRESS_LABEL: "Address",
  IMPRESSUM_REGISTER_LABEL: "Company Register",
  IMPRESSUM_VAT_LABEL: "VAT ID",
  IMPRESSUM_REPRESENTED_BY_LABEL: "Represented by",
  IMPRESSUM_CONTACT_LABEL: "Contact",
  IMPRESSUM_DISCLAIMER:
    "This Impressum is legally required for commercial websites in Germany and the European Union. All placeholder values must be replaced before going live.",
  PRIVACY_TITLE: "Privacy Policy",
  PRIVACY_CONTACT_LABEL: "Privacy Contact",
  PRIVACY_PLACEHOLDER:
    "This is a placeholder privacy policy. Replace this page with your complete, legally compliant privacy statement before going live.",

  // ── Privacy policy (generated sections) ──────────────────────────────────
  PRIVACY_GENERATED_NOTICE:
    "Generated from site.config. Review with legal counsel before launch.",
  PRIVACY_INTRO:
    "This privacy policy explains how we collect, use, and protect your personal data when you use this website. It is a starting point generated from the site configuration and must be reviewed by qualified legal counsel before this site goes live.",
  PRIVACY_CONTROLLER_HEADING: "Data Controller",
  PRIVACY_CONTROLLER_INTRO:
    "The entity responsible for processing your personal data (the data controller within the meaning of the GDPR) is:",
  PRIVACY_CONTACT_INTRO:
    "For questions about your personal data or to exercise your rights, contact our privacy team:",
  PRIVACY_DATA_HEADING: "Data We Process",
  PRIVACY_DATA_AUTH_HEADING: "Account and Authentication Data",
  PRIVACY_DATA_AUTH_BODY:
    "When you register or log in, we process your email address, a hashed password, and your preferred language. This data is necessary to provide and secure your account. Legal basis: performance of a contract (Art. 6(1)(b) GDPR).",
  PRIVACY_DATA_COOKIES_HEADING: "Strictly Necessary Cookies",
  PRIVACY_DATA_COOKIES_BODY:
    "We use technically necessary cookies and browser storage to keep you logged in (authentication session), remember your language preference (locale cookie), and store your cookie consent choice. These are essential for the site to function and do not require your consent.",
  PRIVACY_ANALYTICS_HEADING: "Analytics",
  PRIVACY_ANALYTICS_BODY:
    "This site uses analytics to understand how visitors interact with the service. Analytics scripts load only after you grant consent via the cookie banner. You can withdraw consent at any time by clicking the privacy policy link in the footer and using the consent reset option. Legal basis: consent (Art. 6(1)(a) GDPR).",
  PRIVACY_ANALYTICS_GA_LABEL: "Google Analytics 4 (Google LLC)",
  PRIVACY_ANALYTICS_POSTHOG_LABEL: "PostHog (PostHog Inc.)",
  PRIVACY_ANALYTICS_PROVIDERS_INTRO:
    "The following analytics providers are configured on this site:",
  PRIVACY_CONSENT_HEADING: "Cookie Consent and Withdrawal",
  PRIVACY_CONSENT_BODY:
    "When you first visit, a cookie banner asks for your consent to analytics cookies. You can accept or decline. Your choice is stored in your browser. To change your choice or withdraw consent, clear the consent setting stored under the key",
  PRIVACY_CONSENT_BODY_AFTER_KEY: "in your browser's local storage.",
  PRIVACY_RIGHTS_HEADING: "Your Rights",
  PRIVACY_RIGHTS_INTRO:
    "Under the GDPR you have the following rights regarding your personal data:",
  PRIVACY_RIGHTS_ACCESS: "Right of access (Art. 15 GDPR)",
  PRIVACY_RIGHTS_RECTIFICATION: "Right to rectification (Art. 16 GDPR)",
  PRIVACY_RIGHTS_ERASURE: "Right to erasure (Art. 17 GDPR)",
  PRIVACY_RIGHTS_PORTABILITY: "Right to data portability (Art. 20 GDPR)",
  PRIVACY_RIGHTS_COMPLAINT:
    "Right to lodge a complaint with a supervisory authority (Art. 77 GDPR)",
  PRIVACY_RIGHTS_OUTRO:
    "To exercise your rights, contact the privacy address above.",

  // ── Pagination ────────────────────────────────────────────────────────────
  PAGINATION_ITEMS_PER_PAGE: "Items per page:",
  PAGINATION_NO_RESULTS: "0 results",

  // ── Chat ──────────────────────────────────────────────────────────────────
  CHAT_PLACEHOLDER: "Ask anything...",
  CHAT_PLACEHOLDER_STREAMING: "Thinking...",
  CHAT_THINKING: "Thinking",
  CHAT_SLOW_RESPONSE_TITLE: "Still working...",
  CHAT_SLOW_RESPONSE_HINT: "This is taking a little longer than usual.",
  CHAT_VERY_SLOW_RESPONSE_HINT:
    "Still processing. Complex questions take time.",
  CHAT_SEND: "Send",
  CHAT_STOP: "Stop",
  CHAT_EMPTY_TITLE: "How can I help?",
  CHAT_EMPTY_SUBTITLE: "Ask a question to get started.",
  CHAT_COPY: "Copy",
  CHAT_COPIED: "Copied",
  CHAT_SOURCES: "Sources",
  CHAT_SCROLL_TO_BOTTOM: "Scroll to bottom",
  CHAT_CLEAR: "Clear chat",
  CHAT_OPEN: "Open chat",
  CHAT_CLOSE: "Close chat",
  CHAT_CONNECT_REQUIRED_TITLE: "Connect ContextRocket",
  CHAT_CONNECT_REQUIRED_BODY:
    "Set NEXT_PUBLIC_CR_AGENT_URL to enable the AI agent.",
  ACCESSIBILITY_TYPING: "Assistant is typing",

  // ── Cookie consent ────────────────────────────────────────────────────────
  COOKIE_CONSENT_ARIA_LABEL: "Cookie consent",
  COOKIE_CONSENT_TITLE: "This site uses cookies",
  COOKIE_CONSENT_BODY:
    "We use analytics cookies to improve your experience. See our",
  COOKIE_CONSENT_POLICY_LINK: "Privacy Policy",
  COOKIE_CONSENT_ACCEPT: "Accept",
  COOKIE_CONSENT_DECLINE: "Decline",
} as const;
