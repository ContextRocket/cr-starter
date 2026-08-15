/**
 * Shared (@eng) i18n slice — cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Strict tri-locale parity (all keys in
 * all 3 locales).
 *
 * Auto-partitioned from the original de.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../de.ts) re-merges shared+app+site into `de`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const sharedDe = {
  form: {
    email: "E-Mail",
    password: "Passwort",
    passwordConfirm: "Passwort bestätigen",
    username: "Benutzername",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      password: {
        min: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        uppercase: "Das Passwort muss mindestens einen Großbuchstaben enthalten.",
        special: "Das Passwort muss mindestens ein Sonderzeichen enthalten.",
        required: "Passwort ist erforderlich"
      },
      passwords: {
        match: "Die Passwörter müssen übereinstimmen."
      },
      token: {
        required: "Token ist erforderlich"
      },
      email: {
        invalid: "Ungültige E-Mail-Adresse"
      },
      username: {
        required: "Benutzername ist erforderlich"
      }
    }
  },
  nav: {
    dashboard: "Dashboard",
    blog: "Blog",
    logout: "Abmelden",
    welcome: "Willkommen in deinem Dashboard",
    aria: {
      primary: "Hauptnavigation"
    }
  },
  theme: {
    toggle: "Design wechseln",
    light: "Hell",
    dark: "Dunkel"
  },
  notifications: {
    region: "Website-Benachrichtigungen",
    dismiss: "Benachrichtigung schließen",
    example: {
      info: {
        message: "Wir haben gerade eine neue Funktion veröffentlicht.",
        action: "Neuigkeit lesen"
      },
      warning: {
        message: "Geplante Wartung an diesem Wochenende."
      }
    }
  },
  error: {
    generic: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    dashboard: "Beim Laden dieser Seite ist ein Fehler aufgetreten.",
    try: {
      again: "Erneut versuchen"
    },
    unexpected: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.",
    network: "Netzwerkfehler",
    no: {
      token: "Kein Zugriffstoken gefunden",
      data: "Keine Daten vom Server zurückgegeben"
    },
    unknown: "Unbekannter Fehler",
    internal: "Interner Serverfehler"
  },
  locale: {
    labelEnglish: "Englisch",
    labelSpanish: "Spanisch",
    labelGerman: "Deutsch",
    changeLanguage: "Sprache wechseln",
  },
  breadcrumb: {
    home: "Startseite"
  },
  pagination: {
    items: {
      per: {
        page: "Einträge pro Seite:"
      }
    },
    no: {
      results: "0 Ergebnisse"
    }
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie-Zustimmung"
      },
      title: "Diese Website verwendet Cookies",
      body: "Wir verwenden Analyse-Cookies, um dein Erlebnis zu verbessern. Weitere Informationen findest du in unserer",
      policy: {
        link: "Datenschutzerklärung"
      },
      accept: "Akzeptieren",
      decline: "Ablehnen"
    }
  },
} as const;
