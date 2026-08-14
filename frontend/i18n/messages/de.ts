/**
 * German (de) i18n message tree for the cr-starter.
 *
 * Hand-translated. All keys must remain in parity with en.ts.
 * Verified by scripts/check-i18n-parity.js (pre-commit hook).
 *
 * Legal terminology notes:
 *   "Impressum"          -- German legal term (§ 5 Digitale-Dienste-Gesetz, DDG); retained verbatim.
 *   "Datenschutzerklärung" -- standard German for "Privacy Policy".
 *   "Handelsregister"    -- Company Register.
 *   "Umsatzsteuer-ID"    -- VAT ID (Umsatzsteuer-Identifikationsnummer).
 *   "Vertreten durch"    -- Represented by (legal representative).
 *   "Datenschutzkontakt" -- Privacy contact.
 */

export const de = {
  home: {
    subtitle: "Entwickle Produkte mit ContextRocket. Authentifizierung, Dashboard-Gerüst und typsichere OpenAPI-Integration inklusive. Gesprächsverlauf und Agenten-Ausführungen werden per A2A an ContextRocket delegiert.",
    cta: "Zum Dashboard",
    widget: {
      section: {
        title: "Den Agenten auf jede Website einbetten",
        body: "Ein einziges Script-Tag fügt jeder Seite einen schwebenden Chat-Button hinzu. Der Button öffnet einen iframe, der von deinem ContextRocket-Agenten betrieben wird, ohne React, ohne Bundler und ohne Backend-Anpassungen auf der einbettenden Website. Der schwebende Button auf dieser Seite ist dieselbe Komponente; bette sie mit dem folgenden Code-Snippet auf anderen Seiten ein."
      },
      snippet: {
        note: "Kopiere das Snippet, ersetze die Agenten-URL und füge es vor </body> ein."
      }
    },
    featured: {
      title: "Aus dem Blog",
      subtitle: "Anleitungen, Recherche und Produkt-Updates.",
      viewAll: "Alle Beiträge ansehen"
    },
    integrations: {
      label: "Integrationen",
      title: "Verbunden mit den Tools, die zählen",
      body1: "Verbindet sich mit den Tools, die dein Team bereits nutzt, damit deine Daten ohne Mehraufwand einfließen.",
      body2: "Diese Integrationen ermöglichen es, auf echte Signale zu reagieren und alles synchron zu halten.",
      cta: "Alle Integrationen ansehen"
    },
    subscribe: {
      title: "Bleib auf dem Laufenden",
      subtitle: "Erhalte gelegentlich Updates und Einblicke von unserem Team. Kein Spam.",
      placeholder: "du@beispiel.com",
      submit: "Abonnieren",
      consent: "Ich stimme zu, E-Mails zu erhalten, und akzeptiere die",
      privacyLink: "Datenschutzerklärung",
      success: "Danke – du bist dabei.",
      errors: {
        emailRequired: "Bitte gib deine E-Mail-Adresse ein.",
        emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
        consentRequired: "Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.",
        submitFailed: "Etwas ist schiefgelaufen. Bitte versuche es erneut."
      }
    }
  },
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
    logout: "Abmelden",
    welcome: "Willkommen in deinem Dashboard"
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
      label: "Hinweis für Entwickler:"
    },
    siteConfigUrlWarning: "Das Feld siteUrl in site.config.ts verweist noch auf example.com. Ersetze es vor der Veröffentlichung durch deine Produktionsdomain."
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
  footer: {
    impressum: "Impressum",
    privacy: "Datenschutzerklärung",
    faq: "Häufige Fragen"
  },
  faq: {
    page: {
      title: "Häufige Fragen",
      description: "Antworten auf häufige Fragen zu dieser Website, dem Chat-Agenten, der Datenverarbeitung und der Anpassung."
    },
    back: {
      home: "Zurück zur Startseite"
    }
  },
  blog: {
    title: "Blog",
    description: "Artikel, Anleitungen und Neuigkeiten.",
    empty: "Noch keine Beiträge. Schauen Sie bald wieder vorbei.",
    back: {
      home: "Zurück zur Startseite",
      to: {
        list: "Alle Beiträge"
      }
    },
    not: {
      found: "Beitrag nicht gefunden"
    },
    min: {
      read: "Min. Lesezeit"
    }
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Gesetzlich vorgeschriebene Anbieterangaben"
    },
    entity: {
      label: "Unternehmen"
    },
    address: {
      label: "Anschrift"
    },
    register: {
      label: "Handelsregister"
    },
    vat: {
      label: "Umsatzsteuer-ID"
    },
    represented: {
      by: {
        label: "Vertreten durch"
      }
    },
    contact: {
      label: "Kontakt"
    },
    disclaimer: "Dieses Impressum ist für gewerbliche Websites in Deutschland und der Europäischen Union gesetzlich vorgeschrieben (§ 5 DDG). Alle Platzhalter müssen vor der Veröffentlichung durch echte Angaben ersetzt werden."
  },
  privacy: {
    title: "Datenschutzerklärung",
    contact: {
      label: "Datenschutzkontakt",
      intro: "Bei Fragen zu deinen personenbezogenen Daten oder zur Ausübung deiner Rechte wende dich an unser Datenschutzteam:"
    },
    placeholder: "Dies ist eine Platzhalter-Datenschutzerklärung. Ersetze diese Seite vor der Veröffentlichung durch eine vollständige, rechtskonforme Datenschutzerklärung.",
    generated: {
      notice: "Aus site.config generiert. Vor der Veröffentlichung mit rechtlichem Beistand prüfen."
    },
    intro: "Diese Datenschutzerklärung erläutert, wie wir deine personenbezogenen Daten erheben, verwenden und schützen, wenn du diese Website nutzt. Sie ist ein aus der Site-Konfiguration generierter Ausgangspunkt und muss vor der Veröffentlichung durch qualifizierte Rechtsberatung geprüft werden.",
    controller: {
      heading: "Verantwortlicher",
      intro: "Die für die Verarbeitung deiner personenbezogenen Daten verantwortliche Stelle (Verantwortlicher im Sinne der DSGVO) ist:"
    },
    data: {
      heading: "Von uns verarbeitete Daten",
      auth: {
        heading: "Konto- und Authentifizierungsdaten",
        body: "Bei der Registrierung oder Anmeldung verarbeiten wir deine E-Mail-Adresse, ein gehashtes Passwort und deine bevorzugte Sprache. Diese Daten sind erforderlich, um dein Konto bereitzustellen und zu sichern. Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)."
      },
      cookies: {
        heading: "Technisch notwendige Cookies",
        body: "Wir verwenden technisch notwendige Cookies und Browser-Speicher, um dich eingeloggt zu halten (Authentifizierungssitzung), deine Sprachpräferenz zu merken (Locale-Cookie) und deine Cookie-Einwilligungsentscheidung zu speichern. Diese sind für den Betrieb der Website unerlässlich und bedürfen keiner gesonderten Einwilligung."
      }
    },
    analytics: {
      heading: "Analyse",
      body: "Diese Website verwendet Analyse-Tools, um zu verstehen, wie Besucher den Dienst nutzen. Analyse-Skripte werden nur nach deiner Einwilligung über das Cookie-Banner geladen. Du kannst deine Einwilligung jederzeit widerrufen, indem du den Link zur Datenschutzerklärung im Footer anklickst und die Option zum Zurücksetzen der Einwilligung verwendest. Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).",
      ga: {
        label: "Google Analytics 4 (Google LLC)"
      },
      posthog: {
        label: "PostHog (PostHog Inc.)"
      },
      providers: {
        intro: "Auf dieser Website sind folgende Analyse-Anbieter konfiguriert:"
      }
    },
    consent: {
      heading: "Cookie-Einwilligung und Widerruf",
      body: "Beim ersten Besuch fragt ein Cookie-Banner nach deiner Einwilligung zu Analyse-Cookies. Du kannst akzeptieren oder ablehnen. Deine Entscheidung wird im Browser gespeichert. Um deine Wahl zu ändern oder die Einwilligung zu widerrufen, lösche den Eintrag mit dem Schlüssel",
      bodyAfterKey: "aus dem lokalen Speicher deines Browsers."
    },
    rights: {
      heading: "Deine Rechte",
      intro: "Gemäß DSGVO hast du folgende Rechte bezüglich deiner personenbezogenen Daten:",
      access: "Auskunftsrecht (Art. 15 DSGVO)",
      rectification: "Recht auf Berichtigung (Art. 16 DSGVO)",
      erasure: "Recht auf Löschung (Art. 17 DSGVO)",
      portability: "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
      complaint: "Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)",
      outro: "Zur Ausübung deiner Rechte wende dich an die oben genannte Datenschutzadresse."
    }
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
  }
,
  locale: {
    labelEnglish: "Englisch",
    labelSpanish: "Spanisch",
    labelGerman: "Deutsch",
    changeLanguage: "Sprache wechseln",
  },
  preview: {
    pricing: {
      title: "Einfache, transparente Preise",
      subtitle: "Preise",
      perMonth: "/Monat",
      standard: {
        name: "Standard",
        price: "29 €",
        description: "Alles, was ein kleines Team für den Start braucht.",
        cta: "Kostenlos starten",
        features: {
          "0": "Bis zu 5 Teammitglieder",
          "1": "10 GB Speicher",
          "2": "Community-Support",
          "3": "Wöchentliche Berichte"
        }
      },
      enterprise: {
        name: "Enterprise",
        price: "99 €",
        description: "Erweiterte Steuerung und Support für wachsende Organisationen.",
        cta: "Vertrieb kontaktieren",
        features: {
          "0": "Unbegrenzte Teammitglieder",
          "1": "1 TB Speicher",
          "2": "Priorisierter Support",
          "3": "Individuelle Integrationen",
          "4": "Audit-Log und SSO"
        }
      }
    },
    team: {
      title: "Lerne das Team kennen",
      subtitle: "Die Menschen, die das Produkt entwickeln.",
      mark: {
        role: "Gründer & CTO",
        bio: {
          "0": "Mark leitet Produkt und Technik mit Fokus auf fundierte, überprüfbare Markenartikulation.",
          "1": "Zuvor hat er agentische Plattformen gebaut und legt großen Wert auf die Entwicklererfahrung."
        }
      }
    },
    heroInsights: {
      scoreTitle: "Antwortbereitschaft",
      scoreValue: "92",
      cards: {
        "0": {
          title: "Fundierte Quellenangaben",
          desc: "Jede Antwort verweist auf deine echten Inhalte."
        },
        "1": {
          title: "Überall konsistent",
          desc: "Dieselbe Artikulation auf jeder Oberfläche."
        },
        "2": {
          title: "Immer aktuell",
          desc: "Aktualisierungen fließen ein, sobald sich deine Inhalte ändern."
        }
      }
    }
  },
} as const;
