/**
 * App (@eng) i18n slice — authenticated / product surfaces:
 * auth, dashboard, dev, chat, embed. Strict tri-locale parity.
 *
 * Auto-partitioned from the original de.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../de.ts) re-merges shared+app+site into `de`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const appDe = {
  auth: {
    login: {
      title: "Anmelden",
      description: "Gib deine E-Mail-Adresse ein, um dich in dein Konto einzuloggen.",
      submit: "Anmelden",
      no: {
        account: "Noch kein Konto?"
      },
      sign: {
        up: "Registrieren"
      }
    },
    forgot: {
      password: "Passwort vergessen?"
    },
    register: {
      title: "Registrieren",
      description: "Gib deine E-Mail-Adresse und ein Passwort ein, um ein Konto zu erstellen.",
      submit: "Konto erstellen",
      back: "Zurück zur Anmeldung"
    },
    password: {
      recovery: {
        title: "Passwort zurücksetzen",
        description: "Gib deine E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen deines Passworts zu erhalten.",
        submit: "Absenden",
        back: "Zurück zur Anmeldung"
      },
      reset: {
        title: "Neues Passwort setzen",
        description: "Gib das neue Passwort ein und bestätige es.",
        submit: "Absenden",
        loading: "Formular wird geladen...",
        success: "Anweisungen zum Zurücksetzen des Passworts wurden an deine E-Mail gesendet."
      }
    }
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Dein ContextRocket-Arbeitsbereich. Konfiguriere deine Anwendung und verbinde dich mit ContextRocket für Agenten-Ausführungen, Gesprächsverlauf und Wissensverwaltung.",
    card: {
      chat: {
        title: "Chat fortsetzen",
        description: "Dein Gesprächsverlauf ist gespeichert. Mach dort weiter, wo du aufgehört hast.",
        action: "Chat öffnen"
      },
      profile: {
        title: "Profil und Einstellungen",
        description: "Aktualisiere deine E-Mail, dein Passwort oder deine Sprachpräferenz.",
        action: "Profil bearbeiten"
      },
      users: {
        title: "Benutzer",
        description: "Registrierte Konten und Gastsitzungen verwalten.",
        action: "Benutzer anzeigen"
      }
    },
    guest: {
      prompt: {
        title: "Gespräch speichern",
        description: "Erstelle ein kostenloses Konto, um deinen Chatverlauf zu behalten. Dein aktuelles Gespräch wird in jedem Fall fortgesetzt.",
        action: "Konto erstellen"
      }
    },
    users: {
      title: "Benutzer",
      description: "Alle registrierten Konten und Gastkonten.",
      col: {
        email: "E-Mail",
        type: "Typ",
        status: "Status"
      },
      type: {
        guest: "Gast",
        registered: "Registriert"
      },
      status: {
        active: "Aktiv",
        inactive: "Inaktiv"
      },
      forbidden: "Diese Seite ist nur für Betreiber zugänglich."
    },
    profile: {
      title: "Profil und Einstellungen"
    }
  },
  dev: {
    notice: {
      label: "Hinweis für Entwickler:",
      dismiss: "Entwicklerhinweis ausblenden"
    },
    siteConfigUrlWarning: "Das Feld siteUrl in site.config.ts verweist noch auf example.com. Ersetze es vor der Veröffentlichung durch deine Produktionsdomain."
  },
  chat: {
    placeholder: "Stelle eine beliebige Frage...",
    placeholderStreaming: "Wird verarbeitet...",
    thinking: "Wird verarbeitet",
    slow: {
      response: {
        title: "Noch in Bearbeitung...",
        hint: "Das dauert etwas länger als gewöhnlich."
      }
    },
    very: {
      slow: {
        response: {
          hint: "Noch in Bearbeitung. Komplexe Fragen benötigen mehr Zeit."
        }
      }
    },
    send: "Senden",
    stop: "Abbrechen",
    empty: {
      title: "Wie kann ich helfen?",
      subtitle: "Stelle eine Frage, um zu beginnen."
    },
    copy: "Kopieren",
    copied: "Kopiert",
    sources: "Quellen",
    scroll: {
      to: {
        bottom: "Nach unten scrollen"
      }
    },
    clear: "Chat leeren",
    open: "Chat öffnen",
    close: "Chat schließen",
    expand: "Auf Vollbild erweitern",
    collapse: "Zum Panel verkleinern",
    connect: {
      required: {
        title: "ContextRocket verbinden",
        body: "Setze NEXT_PUBLIC_CR_AGENT_URL, um den KI-Agenten zu aktivieren."
      }
    },
    stream: {
      interrupted: "Die Verbindung wurde unterbrochen, bevor die Antwort abgeschlossen war. Die Antwort ist möglicherweise unvollständig."
    },
    typing: "Der Assistent tippt",
    more: {
      detail: "Mehr Details"
    },
    less: {
      detail: "Weniger Details"
    },
    suggestions: {
      label: "Vorgeschlagene Folgefragen"
    },
    source: {
      sheet: {
        title: "Quellen",
        open: "Quelle öffnen"
      },
      cited: {
        section: "Zitierter Abschnitt"
      },
      publisher: "Herausgeber",
      date: "Datum",
      license: "Lizenz"
    },
    sourceSheet: {
      openNewTab: "In neuem Tab öffnen"
    },
    policy: {
      card: {
        source: "Quelle"
      }
    },
    nudge: {
      title: "Gespräch speichern",
      body: "Erstelle ein kostenloses Konto, um deinen vollständigen Chatverlauf zu behalten. Dein aktuelles Gespräch wird in jedem Fall fortgesetzt.",
      action: "Konto erstellen",
      dismiss: "Schließen"
    },
    link: {
      preview: {
        title: "Linkvorschau",
        open: "In neuem Tab öffnen"
      }
    },
    grounded: "Belegt",
    partially: {
      grounded: "Teilweise belegt"
    },
    ungrounded: "Unbelegt",
    groundedClaimsChecked: "Aussagen geprüft",
    demo: {
      badge: "Demo",
      error: {
        slug: {
          not: {
            found: "Der Demo-Agent ist nicht verfügbar. Wende dich an den Website-Betreiber, um die öffentliche Demo zu aktivieren."
          }
        },
        unauthorized: "Der Demo-Zugang wurde abgelehnt. Die öffentliche Demo ist möglicherweise für diesen Agenten nicht aktiviert."
      }
    }
  },
  embed: {
    agent: {
      url: {
        rejected: {
          title: "Agenten-URL nicht erlaubt",
          body: "Der an das eingebettete Widget übergebene agent-url-Parameter stimmt nicht mit dem für diese Website konfigurierten Agenten überein."
        }
      }
    }
  },
} as const;
