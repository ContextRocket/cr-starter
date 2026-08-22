/**
 * Site (@content-owners) i18n slice -- public marketing / legal surfaces:
 * home, blog, faq, footer, impressum, privacy, preview. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../de.ts) re-merges shared+app+site into `de`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { siteEn } from "./en";
import type { LocaleMessages } from "../en";

export const siteDe: LocaleMessages<typeof siteEn> = {
  home: {
    subtitle:
      "Ein flexibler Ausgangspunkt für eine klare und leicht zu pflegende Website.",
    hero: {
      insights: {
        scoreTitle: "Beispiel-Insight",
        scoreValue: "Beispiel",
        thinTitle: "Fundierte Quellenangaben",
        thinDesc: "Jede Antwort verweist auf deine echten Inhalte.",
        bioTitle: "Überall konsistent",
        bioDesc: "Dieselbe Artikulation auf jeder Oberfläche.",
        multiTitle: "Immer aktuell",
        multiDesc:
          "Aktualisierungen fließen ein, sobald sich deine Inhalte ändern.",
      },
      headline: "Dein Wertversprechen in einer Zeile.",
      subhead:
        "Ein unterstützender Satz, der erklärt, für wen es ist und warum es wichtig ist.",
      primaryCta: "Loslegen",
      secondaryCta: "Mehr erfahren",
    },
    features: {
      label: "Funktionen",
      title: "Alles, was du brauchst",
      subtitle: "Eine kurze Beschreibung des Abschnitts.",
      item1: {
        title: "Funktion eins",
        description: "Was sie tut und warum sie hilft.",
      },
      item2: {
        title: "Funktion zwei",
        description: "Was sie tut und warum sie hilft.",
      },
      item3: {
        title: "Funktion drei",
        description: "Was sie tut und warum sie hilft.",
      },
    },
    stats: {
      output: "Beispiel-Metrik",
      integrations: "Integrationen",
      uptime: "Verfügbarkeit",
    },
    faq: {
      title: "Häufig gestellte Fragen",
      item1: {
        question: "Was ist das?",
        answer: "Eine kurze, verständliche Antwort.",
      },
      item2: {
        question: "Für wen ist es?",
        answer: "Eine kurze, verständliche Antwort.",
      },
    },
    cta: {
      title: "Bereit anzufangen?",
      subtitle: "Ein kurzer Schub zur Hauptaktion.",
      button: "Loslegen",
    },
    carousel: {
      alt1: "KI-Gehirn-Visualisierung",
      alt2: "KI-Roboterhände",
      alt3: "Programmier-Setup",
      title: "Ein klarer erster Eindruck",
      description:
        "Nutze diesen Bereich, um die Idee, den Service oder die Geschichte deiner Website vorzustellen.",
      title2: "Platz für Details",
      description2:
        "Ergänze hier eine zweite Perspektive, ein nützliches Beispiel oder eine kurze Erklärung.",
      title3: "Bereit für deine Inhalte",
      description3:
        "Ersetze diese Beispiele durch die Bilder und Worte, die zu deinem Projekt gehören.",
    },
    valueProps: {
      title: "Eine flexible Grundlage",
      subtitle:
        "Beginne mit wenigen Abschnitten und erweitere sie, wenn deine Inhalte bereit sind.",
      see: {
        title: "Klarheit schaffen",
        description:
          "Gib Besuchern eine einfache Möglichkeit zu verstehen, was du machst und wie es weitergeht.",
      },
      fix: {
        title: "Details gestalten",
        description:
          "Nutze diesen Bereich für einen praktischen Vorteil, ein Beispiel oder ein wichtiges Detail.",
      },
      stay: {
        title: "Leicht zu pflegen",
        description:
          "Halte Inhalte in einfachen Dateien und überlasse die wiederkehrende Struktur den gemeinsamen Komponenten.",
      },
    },
    bento: {
      title: "Eine solide Grundlage",
      subtitle:
        "Wiederverwendbare Bausteine für eine Website, die sich weiterentwickeln kann.",
      context: {
        title: "Klare Struktur",
        description:
          "Ordne die wichtigen Teile deiner Geschichte in einem Layout, dem Besucher folgen können.",
      },
      realtime: {
        title: "Einfache Interaktionen",
        description:
          "Halte Navigation, Formulare und Handlungsaufforderungen auf den nächsten sinnvollen Schritt fokussiert.",
      },
      multi: {
        title: "Bereit zum Wachsen",
        description:
          "Füge Seiten, Sprachen und Integrationen erst hinzu, wenn das Projekt sie wirklich braucht.",
      },
      provenance: {
        title: "Einfach zu pflegen",
        description:
          "Halte Konfiguration und Inhalte im Projekt, damit spätere Änderungen verständlich bleiben.",
      },
    },
    widget: {
      section: {
        title: "Den Agenten auf jede Website einbetten",
        body: "Ein einziges Script-Tag fügt jeder Seite ein unabhängiges Chat-Widget hinzu. Der Demo-Modus funktioniert offline, der Live-Modus verbindet sich direkt mit deinem ContextRocket-Agenten – ohne React, Bundler oder Backend auf der Host-Seite.",
      },
      snippet: {
        note: "Kopiere das Snippet, setze den Organisations-Handle und Website-API-Schlüssel und füge es vor </body> ein.",
      },
    },
    featured: {
      title: "Aus dem Blog",
      subtitle: "Artikel, Notizen und Updates dieser Website.",
      viewAll: "Alle Beiträge ansehen",
    },
    testimonials: {
      eyebrow: "Kundenstimmen",
      title: "Was unsere Kunden sagen",
      subtitle: "Echte Ergebnisse von Teams, die auf der Plattform aufbauen.",
      regionLabel: "Kundenstimmen",
      ratingLabel: "Mit {rating} von 5 bewertet",
    },
    integrations: {
      label: "Integrationen",
      title: "Verbunden mit den Tools, die zählen",
      body1:
        "Verbindet sich mit den Tools, die dein Team bereits nutzt, damit deine Daten ohne Mehraufwand einfließen.",
      body2:
        "Diese Integrationen ermöglichen es, auf echte Signale zu reagieren und alles synchron zu halten.",
      cta: "Alle Integrationen ansehen",
    },
    subscribe: {
      title: "Bleib auf dem Laufenden",
      subtitle:
        "Erhalte gelegentlich Updates und Einblicke von unserem Team. Kein Spam.",
      placeholder: "du@beispiel.com",
      submit: "Abonnieren",
      consent: "Ich stimme zu, E-Mails zu erhalten, und akzeptiere die",
      privacyLink: "Datenschutzerklärung",
      success: "Danke -- du bist dabei.",
      errors: {
        emailRequired: "Bitte gib deine E-Mail-Adresse ein.",
        emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
        consentRequired:
          "Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.",
        submitFailed: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
      },
    },
  },
  blog: {
    title: "Blog",
    subtitle: "Artikel, Anleitungen und Produkt-Neuigkeiten.",
    description: "Artikel, Anleitungen und Neuigkeiten.",
    featured: "Empfohlen",
    all_posts: "Alle Beiträge",
    empty: "Noch keine Beiträge. Schauen Sie bald wieder vorbei.",
    back: {
      home: "Zurück zur Startseite",
      to: {
        list: "Alle Beiträge",
      },
    },
    not: {
      found: "Beitrag nicht gefunden",
    },
    min: {
      read: "Min. Lesezeit",
    },
  },
  faq: {
    page: {
      title: "Häufige Fragen",
      description:
        "Antworten auf häufige Fragen zu dieser Website, dem Chat-Agenten, der Datenverarbeitung und der Anpassung.",
    },
    back: {
      home: "Zurück zur Startseite",
    },
  },
  footer: {
    powered_by: "Unterstützt von",
    impressum: "Impressum",
    privacy: "Datenschutzerklärung",
    faq: "Häufige Fragen",
    attribution: "Bildnachweis",
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Gesetzlich vorgeschriebene Anbieterangaben",
    },
    entity: {
      label: "Unternehmen",
    },
    address: {
      label: "Anschrift",
    },
    register: {
      label: "Handelsregister",
    },
    vat: {
      label: "Umsatzsteuer-ID",
    },
    represented: {
      by: {
        label: "Vertreten durch",
      },
    },
    contact: {
      label: "Kontakt",
    },
    disclaimer:
      "Dieses Impressum ist für gewerbliche Websites in Deutschland und der Europäischen Union gesetzlich vorgeschrieben (§ 5 DDG). Alle Platzhalter müssen vor der Veröffentlichung durch echte Angaben ersetzt werden.",
  },
  privacy: {
    title: "Datenschutzerklärung",
    contact: {
      label: "Datenschutzkontakt",
      intro:
        "Bei Fragen zu deinen personenbezogenen Daten oder zur Ausübung deiner Rechte wende dich an unser Datenschutzteam:",
    },
    placeholder:
      "Dies ist eine Platzhalter-Datenschutzerklärung. Ersetze diese Seite vor der Veröffentlichung durch eine vollständige, rechtskonforme Datenschutzerklärung.",
    generated: {
      notice:
        "Aus site.config generiert. Vor der Veröffentlichung mit rechtlichem Beistand prüfen.",
    },
    intro:
      "Diese Datenschutzerklärung erläutert, wie wir deine personenbezogenen Daten erheben, verwenden und schützen, wenn du diese Website nutzt. Sie ist ein aus der Site-Konfiguration generierter Ausgangspunkt und muss vor der Veröffentlichung durch qualifizierte Rechtsberatung geprüft werden.",
    controller: {
      heading: "Verantwortlicher",
      intro:
        "Die für die Verarbeitung deiner personenbezogenen Daten verantwortliche Stelle (Verantwortlicher im Sinne der DSGVO) ist:",
    },
    data: {
      heading: "Von uns verarbeitete Daten",
      site: {
        heading: "Website- und Interaktionsdaten",
        body: "Wir verarbeiten die Informationen, die du über diese Website übermittelst, sowie die technisch notwendigen Daten zur Auslieferung der Seiten und zum Schutz des Dienstes. Prüfe und ergänze diese Vorlage vor der Veröffentlichung.",
      },
      cookies: {
        heading: "Technisch notwendige Cookies",
        body: "Wir verwenden technisch notwendige Cookies und Browser-Speicher, um deine Sprachpräferenz (Locale-Cookie) und deine Cookie-Einwilligungsentscheidung zu speichern. Diese sind für den Betrieb der Website unerlässlich und bedürfen keiner gesonderten Einwilligung.",
      },
    },
    analytics: {
      heading: "Analyse",
      body: "Diese Website verwendet Analyse-Tools, um zu verstehen, wie Besucher den Dienst nutzen. Analyse-Skripte werden nur nach deiner Einwilligung über das Cookie-Banner geladen. Du kannst deine Einwilligung jederzeit widerrufen, indem du den Link zur Datenschutzerklärung im Footer anklickst und die Option zum Zurücksetzen der Einwilligung verwendest. Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).",
      ga: {
        label: "Google Analytics 4 (Google LLC)",
      },
      posthog: {
        label: "PostHog (PostHog Inc.)",
      },
      providers: {
        intro:
          "Auf dieser Website sind folgende Analyse-Anbieter konfiguriert:",
      },
    },
    consent: {
      heading: "Cookie-Einwilligung und Widerruf",
      body: "Beim ersten Besuch fragt ein Cookie-Banner nach deiner Einwilligung zu Analyse-Cookies. Du kannst akzeptieren oder ablehnen. Deine Entscheidung wird im Browser gespeichert. Um deine Wahl zu ändern oder die Einwilligung zu widerrufen, lösche den Eintrag mit dem Schlüssel",
      bodyAfterKey: "aus dem lokalen Speicher deines Browsers.",
    },
    rights: {
      heading: "Deine Rechte",
      intro:
        "Gemäß DSGVO hast du folgende Rechte bezüglich deiner personenbezogenen Daten:",
      access: "Auskunftsrecht (Art. 15 DSGVO)",
      rectification: "Recht auf Berichtigung (Art. 16 DSGVO)",
      erasure: "Recht auf Löschung (Art. 17 DSGVO)",
      portability: "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
      complaint:
        "Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)",
      outro:
        "Zur Ausübung deiner Rechte wende dich an die oben genannte Datenschutzadresse.",
    },
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
          "3": "Wöchentliche Berichte",
        },
      },
      enterprise: {
        name: "Enterprise",
        price: "99 €",
        description:
          "Erweiterte Steuerung und Support für wachsende Organisationen.",
        cta: "Vertrieb kontaktieren",
        features: {
          "0": "Unbegrenzte Teammitglieder",
          "1": "1 TB Speicher",
          "2": "Priorisierter Support",
          "3": "Individuelle Integrationen",
          "4": "Audit-Log und SSO",
        },
      },
    },
    team: {
      title: "Lerne das Team kennen",
      subtitle: "Die Menschen, die das Produkt entwickeln.",
      mark: {
        role: "Gründer & CTO",
        bio: {
          "0": "Mark leitet Produkt und Technik mit Fokus auf fundierte, überprüfbare Markenartikulation.",
          "1": "Zuvor hat er agentische Plattformen gebaut und legt großen Wert auf die Entwicklererfahrung.",
        },
      },
    },
    heroInsights: {
      scoreTitle: "Beispiel-Insight",
      scoreValue: "Beispiel",
      cards: {
        "0": {
          title: "Fundierte Quellenangaben",
          desc: "Jede Antwort verweist auf deine echten Inhalte.",
        },
        "1": {
          title: "Überall konsistent",
          desc: "Dieselbe Artikulation auf jeder Oberfläche.",
        },
        "2": {
          title: "Immer aktuell",
          desc: "Aktualisierungen fließen ein, sobald sich deine Inhalte ändern.",
        },
      },
    },
    attribution: {
      title: "Danksagungen & Attributionen",
      subtitle:
        "Die Schriften, Icons und Open-Source-Bibliotheken, die diese Vorlage antreiben.",
    },
    status: {
      confirmed: {
        title: "Abonnement bestätigt",
        message:
          "Deine E-Mail ist bestätigt. Du bist bereit, Neuigkeiten zu empfangen.",
        action: "Zurück zur Startseite",
      },
      unsubscribed: {
        title: "Du wurdest abgemeldet",
        message:
          "Du erhältst keine weiteren E-Mails aus dieser Liste. Du kannst dich jederzeit erneut anmelden.",
        action: "Zurück zur Startseite",
      },
    },
    surface: {
      terminal: {
        heading: "Terminal-Oberfläche",
        body: "Diese Seite wird auf der inneren Oberfläche gerendert: eine Monospace-Schrift und rechtwinklige Ecken, pro Routengruppe umgeschaltet aus derselben Token-Basis wie die Marketing-Seiten.",
        cardTitle: "Gleiche Tokens, andere Oberfläche",
        cardDescription:
          "Nur die aktive Schrift und der Eckenradius ändern sich; Farben und Semantik bleiben gemeinsam.",
        action: "Primäre Aktion",
      },
    },
  },
  attribution: {
    title: "Credits & Bildnachweise",
    subtitle:
      "Die Bilder und die Open-Source-Software, die diese Website antreiben.",
    description:
      "Diese Website wurde mit Open-Source-Software und selbst gehosteten Bildern erstellt. Alle Quellen werden nachfolgend genannt.",
    images: "Bilder",
    photo_by: "Foto von",
    on: "auf",
    view_original: "Original ansehen",
    libraries: "Open-Source-Bibliotheken",
    license: "Lizenz",
    no_images: "Es sind keine Bildnachweise aufgeführt.",
    no_libraries: "Es sind keine Bibliotheksnachweise aufgeführt.",
    general_note: "Weitere Fotografie bereitgestellt von",
    license_note:
      "Bilder werden unter der Unsplash-Lizenz verwendet. Bibliotheken werden unter ihren jeweiligen Open-Source-Lizenzen verwendet.",
  },
} as const;
