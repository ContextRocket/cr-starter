/**
 * modules/chat -- de (chat surface, carved from app/).
 */

export const chatDe = {
  chat: {
    mock: {
      response:
        "Dies ist eine simulierte Antwort. Der Chat läuft in einem Offline-Showcase-Modus.\n\nUm einen Live-Agenten zu verbinden, aktiviere den Live-Modus und setze den Organisations-Handle und einen Website-API-Schlüssel in `.env.local`.\n\nViel Spaß beim Erkunden der Benutzeroberfläche!",
    },
    placeholder: "Stelle eine beliebige Frage...",
    placeholderStreaming: "Wird verarbeitet...",
    thinking: "Wird verarbeitet",
    slow: {
      response: {
        title: "Noch in Bearbeitung...",
        hint: "Das dauert etwas länger als gewöhnlich.",
      },
    },
    very: {
      slow: {
        response: {
          hint: "Noch in Bearbeitung. Komplexe Fragen benötigen mehr Zeit.",
        },
      },
    },
    send: "Senden",
    stop: "Abbrechen",
    empty: {
      title: "Wie kann ich helfen?",
      subtitle: "Stelle eine Frage, um zu beginnen.",
    },
    copy: "Kopieren",
    copied: "Kopiert",
    sources: "Quellen",
    scroll: {
      to: {
        bottom: "Nach unten scrollen",
      },
    },
    clear: "Chat leeren",
    open: "Chat öffnen",
    close: "Chat schließen",
    expand: "Auf Vollbild erweitern",
    collapse: "Zum Panel verkleinern",
    connect: {
      required: {
        title: "ContextRocket verbinden",
        body: "Setze NEXT_PUBLIC_CR_CHAT_MODE=live, NEXT_PUBLIC_CR_AGENT_URL und NEXT_PUBLIC_CONTEXTROCKET_HANDLE, um A2A zu aktivieren.",
      },
    },
    stream: {
      interrupted:
        "Die Verbindung wurde unterbrochen, bevor die Antwort abgeschlossen war. Die Antwort ist möglicherweise unvollständig.",
    },
    typing: "Der Assistent tippt",
    more: {
      detail: "Mehr Details",
    },
    less: {
      detail: "Weniger Details",
    },
    suggestions: {
      label: "Vorgeschlagene Folgefragen",
    },
    source: {
      sheet: {
        title: "Quellen",
        open: "Quelle öffnen",
      },
      cited: {
        section: "Zitierter Abschnitt",
      },
      publisher: "Herausgeber",
      date: "Datum",
      license: "Lizenz",
    },
    sourceSheet: {
      openNewTab: "In neuem Tab öffnen",
    },
    policy: {
      card: {
        source: "Quelle",
      },
    },
    link: {
      preview: {
        title: "Linkvorschau",
        open: "In neuem Tab öffnen",
      },
    },
    grounded: "Belegt",
    partially: {
      grounded: "Teilweise belegt",
    },
    ungrounded: "Unbelegt",
    groundedClaimsChecked: "Aussagen geprüft",
    demo: {
      badge: "Demo",
      error: {
        not: {
          found:
            "Der Demo-Agent ist nicht verfügbar. Wende dich an den Website-Betreiber, um die öffentliche Demo zu aktivieren.",
        },
        unauthorized:
          "Der Demo-Zugang wurde abgelehnt. Die öffentliche Demo ist möglicherweise für diesen Agenten nicht aktiviert.",
      },
    },
  },
} as const;
