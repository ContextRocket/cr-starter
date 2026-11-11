/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * German translations for shared starter UI.
 */

import type { sharedEn } from "./en";
import type { LocaleMessages } from "../en";

export const sharedDe: LocaleMessages<typeof sharedEn> = {
  form: {
    email: "E-Mail",
    placeholder: {
      email: "m@example.com",
    },
    validation: {
      email: {
        invalid: "Ungültige E-Mail-Adresse",
      },
    },
  },
  nav: {
    blog: "Blog",
    contact: "Kontakt",
    skipToContent: "Zum Inhalt springen",
    features: "Funktionen",
    about: "Über uns",
    pricing: "Preise",
    aria: {
      primary: "Hauptmenü",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
    },
  },
  attribution: {
    poweredBy: "Mit",
  },
  contact: {
    title: "Lassen Sie uns sprechen",
    introduction: "Erzählen Sie uns kurz, woran Sie arbeiten.",
    directEmail: "Lieber per E-Mail?",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon (optional)",
    intent: "Wobei können wir helfen?",
    intentContact: "Allgemeine Anfrage",
    intentDemo: "Demo anfragen",
    intentAppointment: "Gespräch vereinbaren",
    intentSupport: "Support",
    intentOther: "Sonstiges",
    message: "Wie können wir helfen?",
    consent: "Ich bin einverstanden, zu dieser Anfrage kontaktiert zu werden.",
    submit: "Nachricht senden",
    sending: "Wird gesendet…",
    demoResult: "Demo abgeschlossen. Es wurden keine Daten gesendet oder gespeichert.",
    success: "Danke. Ihre Nachricht ist eingegangen.",
    failure: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    liveUnavailable: "Die Live-Erfassung ist für diese Website nicht konfiguriert.",
    javascriptRequired: "Aktivieren Sie JavaScript, um diese Nachricht sicher zu senden.",
    required: "Bitte füllen Sie die Pflichtfelder aus und stimmen Sie der Kontaktaufnahme zu.",
  },
  notifications: {
    region: "Website-Benachrichtigungen",
    dismiss: "Benachrichtigung schließen",
    example: {
      info: {
        message: "Wir haben gerade eine neue Funktion veröffentlicht.",
        action: "Neuigkeit lesen",
      },
      warning: {
        message: "Geplante Wartung an diesem Wochenende.",
      },
    },
  },
  error: {
    generic: {
      title: "Etwas ist schiefgelaufen",
      description: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
      action: "Erneut versuchen",
    },
    try: {
      again: "Erneut versuchen",
    },
    unexpected:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.",
    network: "Netzwerkfehler",
    no: {
      data: "Keine Daten vom Server zurückgegeben",
    },
    unknown: "Unbekannter Fehler",
    internal: "Interner Serverfehler",
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      action: "Zurück zur Startseite",
    },
  },
  locale: {
    labelEnglish: "Englisch",
    labelSpanish: "Spanisch",
    labelGerman: "Deutsch",
    labelChinese: "Chinesisch",
    changeLanguage: "Sprache wechseln",
  },
  breadcrumb: {
    home: "Startseite",
  },
  pagination: {
    items: {
      per: {
        page: "Einträge pro Seite:",
      },
    },
    no: {
      results: "0 Ergebnisse",
    },
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie-Zustimmung",
      },
      title: "Cookie-Einstellungen",
      body: "Diese Website verwendet optionale Cookies.",
      policy: {
        link: "Datenschutzerklärung",
      },
      accept: "Akzeptieren",
      decline: "Ablehnen",
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
              "Für den Betrieb der Website erforderlich. Diese können nicht deaktiviert werden.",
          },
          functional: {
            label: "Funktional",
            description:
              "Merken sich optionale Einstellungen wie Ihre Sprache oder Oberflächenauswahl.",
          },
          analytics: {
            label: "Analyse",
            description:
              "Helfen uns zu verstehen, wie die Website genutzt wird, damit wir sie verbessern können.",
          },
          marketing: {
            label: "Marketing",
            description:
              "Werden verwendet, um Inhalte zu personalisieren und Marketingkampagnen zu messen.",
          },
        },
      },
    },
  },
} as const;
