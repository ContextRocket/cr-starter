/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * Auto-partitioned from the original de.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source -- do not retype legal/marketing strings.
 * The merge barrel (../de.ts) re-merges shared+app+site into `de`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { sharedEn } from "./en";
import type { LocaleMessages } from "../en";

export const sharedDe: LocaleMessages<typeof sharedEn> = {
  form: {
    email: "E-Mail",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      email: {
        invalid: "Ungültige E-Mail-Adresse"
      }
    }
  },
  nav: {
    blog: "Blog",
    features: "Funktionen",
    about: "Über uns",
    pricing: "Preise",
    aria: {
      primary: "Hauptmenü"
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
    try: {
      again: "Erneut versuchen"
    },
    unexpected:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.",
    network: "Netzwerkfehler",
    no: {
      data: "Keine Daten vom Server zurückgegeben"
    },
    unknown: "Unbekannter Fehler",
    internal: "Interner Serverfehler",
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      action: "Zurück zur Startseite"
    }
  },
  locale: {
    labelEnglish: "Englisch",
    labelSpanish: "Spanisch",
    labelGerman: "Deutsch",
    labelChinese: "Chinesisch",
    changeLanguage: "Sprache wechseln"
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
  gallery: {
    title: "Bildergalerie",
    subtitle: "Bilder nach Sammlung durchsuchen.",
    filter: "Nach Sammlung filtern",
    all: "Alle Bilder",
    imageCount: "{count} Bilder",
    noImages: "Keine Bilder entsprechen diesem Filter.",
    viewImage: "Bild anzeigen: {alt}",
    close: "Bild schließen",
    previous: "Vorheriges Bild",
    next: "Nächstes Bild",
    counter: "{current} von {total}"
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie-Zustimmung"
      },
      title: "Diese Website verwendet Cookies",
      body: "Wir verwenden Analyse-Cookies. Siehe unsere",
      policy: {
        link: "Datenschutzerklärung"
      },
      accept: "Alle akzeptieren",
      decline: "Alle ablehnen",
      manage: "Einstellungen verwalten",
      prefs: {
        description:
          "Wählen Sie aus, welche Cookies wir verwenden dürfen. Sie können Ihre Auswahl jederzeit ändern.",
        save: "Einstellungen speichern",
        title: "Cookie-Einstellungen",
        close: "Schließen",
        category: {
          necessary: {
            label: "Unbedingt erforderlich",
            description:
              "Für den Betrieb der Website erforderlich. Diese können nicht deaktiviert werden."
          },
          functional: {
            label: "Funktional",
            description:
              "Merken sich optionale Einstellungen wie Ihre Sprache oder Oberflächenauswahl."
          },
          analytics: {
            label: "Analyse",
            description:
              "Helfen uns zu verstehen, wie die Website genutzt wird, damit wir sie verbessern können."
          },
          marketing: {
            label: "Marketing",
            description:
              "Werden verwendet, um Inhalte zu personalisieren und Marketingkampagnen zu messen."
          }
        }
      }
    }
  }
} as const;
