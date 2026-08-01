/**
 * German (de) i18n message tree for the cr-starter.
 *
 * Hand-translated. All keys must remain in parity with en.ts.
 * Verified by scripts/check-i18n-parity.js (pre-commit hook).
 *
 * Legal terminology notes:
 *   "Impressum"          -- German legal term (Telemediengesetz TMG); retained verbatim.
 *   "Datenschutzerklärung" -- standard German for "Privacy Policy".
 *   "Handelsregister"    -- Company Register.
 *   "Umsatzsteuer-ID"    -- VAT ID (Umsatzsteuer-Identifikationsnummer).
 *   "Vertreten durch"    -- Represented by (legal representative).
 *   "Datenschutzkontakt" -- Privacy contact.
 */

export const de = {
  // ── Locale labels ─────────────────────────────────────────────────────────
  locale: {
    labelEnglish: "Englisch",
    labelSpanish: "Spanisch",
    labelGerman: "Deutsch",
    changeLanguage: "Sprache wechseln",
  },

  // ── Home / landing ────────────────────────────────────────────────────────
  HOME_SUBTITLE:
    "Entwickle Produkte mit ContextRocket. Authentifizierung, Dashboard-Gerüst und typsichere OpenAPI-Integration inklusive. Gesprächsverlauf und Agenten-Ausführungen werden per A2A an ContextRocket delegiert.",
  HOME_CTA: "Zum Dashboard",

  // ── Auth: login ───────────────────────────────────────────────────────────
  AUTH_LOGIN_TITLE: "Anmelden",
  AUTH_LOGIN_DESCRIPTION:
    "Gib deine E-Mail-Adresse ein, um dich in dein Konto einzuloggen.",
  AUTH_LOGIN_SUBMIT: "Anmelden",
  AUTH_LOGIN_NO_ACCOUNT: "Noch kein Konto?",
  AUTH_LOGIN_SIGN_UP: "Registrieren",
  AUTH_FORGOT_PASSWORD: "Passwort vergessen?",

  // ── Auth: register ────────────────────────────────────────────────────────
  AUTH_REGISTER_TITLE: "Registrieren",
  AUTH_REGISTER_DESCRIPTION:
    "Gib deine E-Mail-Adresse und ein Passwort ein, um ein Konto zu erstellen.",
  AUTH_REGISTER_SUBMIT: "Konto erstellen",
  AUTH_REGISTER_BACK: "Zurück zur Anmeldung",

  // ── Auth: password recovery ───────────────────────────────────────────────
  AUTH_PASSWORD_RECOVERY_TITLE: "Passwort zurücksetzen",
  AUTH_PASSWORD_RECOVERY_DESCRIPTION:
    "Gib deine E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen deines Passworts zu erhalten.",
  AUTH_PASSWORD_RECOVERY_SUBMIT: "Absenden",
  AUTH_PASSWORD_RECOVERY_BACK: "Zurück zur Anmeldung",
  AUTH_PASSWORD_RESET_TITLE: "Neues Passwort setzen",
  AUTH_PASSWORD_RESET_DESCRIPTION:
    "Gib das neue Passwort ein und bestätige es.",
  AUTH_PASSWORD_RESET_SUBMIT: "Absenden",
  AUTH_PASSWORD_RESET_LOADING: "Formular wird geladen...",
  AUTH_PASSWORD_RESET_SUCCESS:
    "Anweisungen zum Zurücksetzen des Passworts wurden an deine E-Mail gesendet.",

  // ── Form labels (shared) ──────────────────────────────────────────────────
  FORM_EMAIL: "E-Mail",
  FORM_PASSWORD: "Passwort",
  FORM_PASSWORD_CONFIRM: "Passwort bestätigen",
  FORM_USERNAME: "Benutzername",
  FORM_PLACEHOLDER_EMAIL: "m@example.com",

  // ── Validation messages ───────────────────────────────────────────────────
  FORM_VALIDATION_PASSWORD_MIN:
    "Das Passwort muss mindestens 8 Zeichen lang sein.",
  FORM_VALIDATION_PASSWORD_UPPERCASE:
    "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
  FORM_VALIDATION_PASSWORD_SPECIAL:
    "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
  FORM_VALIDATION_PASSWORDS_MATCH: "Die Passwörter müssen übereinstimmen.",
  FORM_VALIDATION_TOKEN_REQUIRED: "Token ist erforderlich",
  FORM_VALIDATION_EMAIL_INVALID: "Ungültige E-Mail-Adresse",
  FORM_VALIDATION_PASSWORD_REQUIRED: "Passwort ist erforderlich",
  FORM_VALIDATION_USERNAME_REQUIRED: "Benutzername ist erforderlich",

  // ── Navigation / breadcrumbs ──────────────────────────────────────────────
  NAV_DASHBOARD: "Dashboard",
  NAV_LOGOUT: "Abmelden",

  // ── Dashboard (landing when logged in) ────────────────────────────────────
  NAV_WELCOME: "Willkommen in deinem Dashboard",
  DASHBOARD_TITLE: "Dashboard",
  DASHBOARD_SUBTITLE:
    "Dein ContextRocket-Arbeitsbereich. Konfiguriere deine Anwendung und verbinde dich mit ContextRocket für Agenten-Ausführungen, Gesprächsverlauf und Wissensverwaltung.",
  // Cards
  DASHBOARD_CARD_CHAT_TITLE: "Chat fortsetzen",
  DASHBOARD_CARD_CHAT_DESCRIPTION:
    "Dein Gesprächsverlauf ist gespeichert. Mach dort weiter, wo du aufgehört hast.",
  DASHBOARD_CARD_CHAT_ACTION: "Chat öffnen",
  DASHBOARD_CARD_PROFILE_TITLE: "Profil und Einstellungen",
  DASHBOARD_CARD_PROFILE_DESCRIPTION:
    "Aktualisiere deine E-Mail, dein Passwort oder deine Sprachpräferenz.",
  DASHBOARD_CARD_PROFILE_ACTION: "Profil bearbeiten",
  DASHBOARD_CARD_USERS_TITLE: "Benutzer",
  DASHBOARD_CARD_USERS_DESCRIPTION:
    "Registrierte Konten und Gastsitzungen verwalten.",
  DASHBOARD_CARD_USERS_ACTION: "Benutzer anzeigen",
  // Guest dashboard prompt
  DASHBOARD_GUEST_PROMPT_TITLE: "Gespräch speichern",
  DASHBOARD_GUEST_PROMPT_DESCRIPTION:
    "Erstelle ein kostenloses Konto, um deinen Chatverlauf zu behalten. Dein aktuelles Gespräch wird in jedem Fall fortgesetzt.",
  DASHBOARD_GUEST_PROMPT_ACTION: "Konto erstellen",

  // ── Dashboard: users list (operator only) ─────────────────────────────────
  DASHBOARD_USERS_TITLE: "Benutzer",
  DASHBOARD_USERS_DESCRIPTION: "Alle registrierten Konten und Gastkonten.",
  DASHBOARD_USERS_COL_EMAIL: "E-Mail",
  DASHBOARD_USERS_COL_TYPE: "Typ",
  DASHBOARD_USERS_COL_STATUS: "Status",
  DASHBOARD_USERS_TYPE_GUEST: "Gast",
  DASHBOARD_USERS_TYPE_REGISTERED: "Registriert",
  DASHBOARD_USERS_STATUS_ACTIVE: "Aktiv",
  DASHBOARD_USERS_STATUS_INACTIVE: "Inaktiv",
  DASHBOARD_USERS_FORBIDDEN: "Diese Seite ist nur für Betreiber zugänglich.",

  // ── Dashboard: profile ────────────────────────────────────────────────────
  DASHBOARD_PROFILE_TITLE: "Profil und Einstellungen",

  // ── Error pages ───────────────────────────────────────────────────────────
  ERROR_GENERIC: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  ERROR_DASHBOARD: "Beim Laden dieser Seite ist ein Fehler aufgetreten.",
  ERROR_TRY_AGAIN: "Erneut versuchen",
  ERROR_UNEXPECTED:
    "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.",
  ERROR_NETWORK: "Netzwerkfehler",
  ERROR_NO_TOKEN: "Kein Zugriffstoken gefunden",
  ERROR_NO_DATA: "Keine Daten vom Server zurückgegeben",
  ERROR_UNKNOWN: "Unbekannter Fehler",

  // ── Backend error keys ────────────────────────────────────────────────────
  ERROR_INTERNAL: "Interner Serverfehler",

  // ── Footer ────────────────────────────────────────────────────────────────
  FOOTER_IMPRESSUM: "Impressum",
  FOOTER_PRIVACY: "Datenschutzerklärung",

  // ── Legal pages ───────────────────────────────────────────────────────────
  IMPRESSUM_TITLE: "Impressum",
  IMPRESSUM_LEGAL_NOTICE: "Gesetzlich vorgeschriebene Anbieterangaben",
  IMPRESSUM_ENTITY_LABEL: "Unternehmen",
  IMPRESSUM_ADDRESS_LABEL: "Anschrift",
  IMPRESSUM_REGISTER_LABEL: "Handelsregister",
  IMPRESSUM_VAT_LABEL: "Umsatzsteuer-ID",
  IMPRESSUM_REPRESENTED_BY_LABEL: "Vertreten durch",
  IMPRESSUM_CONTACT_LABEL: "Kontakt",
  IMPRESSUM_DISCLAIMER:
    "Dieses Impressum ist für gewerbliche Websites in Deutschland und der Europäischen Union gesetzlich vorgeschrieben (TMG). Alle Platzhalter müssen vor der Veröffentlichung durch echte Angaben ersetzt werden.",
  PRIVACY_TITLE: "Datenschutzerklärung",
  PRIVACY_CONTACT_LABEL: "Datenschutzkontakt",
  PRIVACY_PLACEHOLDER:
    "Dies ist eine Platzhalter-Datenschutzerklärung. Ersetze diese Seite vor der Veröffentlichung durch eine vollständige, rechtskonforme Datenschutzerklärung.",

  // ── Pagination ────────────────────────────────────────────────────────────
  PAGINATION_ITEMS_PER_PAGE: "Einträge pro Seite:",
  PAGINATION_NO_RESULTS: "0 Ergebnisse",

  // ── Chat ──────────────────────────────────────────────────────────────────
  CHAT_PLACEHOLDER: "Stelle eine beliebige Frage...",
  CHAT_PLACEHOLDER_STREAMING: "Wird verarbeitet...",
  CHAT_THINKING: "Wird verarbeitet",
  CHAT_SLOW_RESPONSE_TITLE: "Noch in Bearbeitung...",
  CHAT_SLOW_RESPONSE_HINT: "Das dauert etwas länger als gewöhnlich.",
  CHAT_VERY_SLOW_RESPONSE_HINT:
    "Noch in Bearbeitung. Komplexe Fragen benötigen mehr Zeit.",
  CHAT_SEND: "Senden",
  CHAT_STOP: "Abbrechen",
  CHAT_EMPTY_TITLE: "Wie kann ich helfen?",
  CHAT_EMPTY_SUBTITLE: "Stelle eine Frage, um zu beginnen.",
  CHAT_COPY: "Kopieren",
  CHAT_COPIED: "Kopiert",
  CHAT_SOURCES: "Quellen",
  CHAT_SCROLL_TO_BOTTOM: "Nach unten scrollen",
  CHAT_CLEAR: "Chat leeren",
  CHAT_OPEN: "Chat öffnen",
  CHAT_CLOSE: "Chat schließen",
  CHAT_CONNECT_REQUIRED_TITLE: "ContextRocket verbinden",
  CHAT_CONNECT_REQUIRED_BODY:
    "Setze NEXT_PUBLIC_CR_AGENT_URL, um den KI-Agenten zu aktivieren.",
  ACCESSIBILITY_TYPING: "Der Assistent tippt",

  // ── Cookie consent ────────────────────────────────────────────────────────
  COOKIE_CONSENT_ARIA_LABEL: "Cookie-Zustimmung",
  COOKIE_CONSENT_TITLE: "Diese Website verwendet Cookies",
  COOKIE_CONSENT_BODY:
    "Wir verwenden Analyse-Cookies, um dein Erlebnis zu verbessern. Weitere Informationen findest du in unserer",
  COOKIE_CONSENT_POLICY_LINK: "Datenschutzerklärung",
  COOKIE_CONSENT_ACCEPT: "Akzeptieren",
  COOKIE_CONSENT_DECLINE: "Ablehnen",
} as const;
