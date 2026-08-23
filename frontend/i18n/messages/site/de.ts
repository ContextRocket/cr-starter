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
    terms: "AGB",
    cookies: "Cookies",
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
  terms: {
    title: "Allgemeine Geschäftsbedingungen",
    generated: {
      notice:
        "Aus site.config generiert. Dies ist eine generische Vorlage, keine Rechtsberatung. Vor der Veröffentlichung mit rechtlichem Beistand prüfen.",
    },
    disclaimer:
      "Diese AGB sind ein generischer Ausgangspunkt mit Platzhalter-Identitätsangaben. Ersetze die Angaben zur Rechtsperson in site.config und lasse sie vor der Veröffentlichung durch qualifizierten rechtlichen Beistand prüfen.",
    intro:
      "Diese Allgemeinen Geschäftsbedingungen („AGB“) regeln deinen Zugang zu und deine Nutzung dieses Dienstes. Bitte lies sie sorgfältig. Mit dem Anlegen eines Kontos oder der Nutzung des Dienstes stimmst du diesen AGB zu.",
    provider: {
      heading: "Wer wir sind",
      intro: "Der Dienst wird bereitgestellt von:",
    },
    service: {
      heading: "Der Dienst",
      body: "Wir stellen den auf dieser Website beschriebenen Dienst bereit. Die dir verfügbaren Funktionen können von deinem Tarif und deiner Konfiguration abhängen. Wir können Funktionen im Laufe der Zeit verbessern, ändern, hinzufügen oder entfernen.",
    },
    acceptance: {
      heading: "Annahme dieser AGB",
      body1:
        "Mit der Registrierung, dem Zugriff auf oder der Nutzung des Dienstes bestätigst du, dass du diese AGB und unsere Datenschutzerklärung gelesen, verstanden und akzeptiert hast. Wenn du den Dienst im Namen einer Organisation nutzt, bestätigst du, dass du berechtigt bist, diese zu verpflichten, und „du“ schließt diese Organisation ein. Wenn du nicht einverstanden bist, nutze den Dienst nicht.",
      body2:
        "Soweit erforderlich, wird die Annahme dieser AGB als gesondertes, ausdrückliches Ereignis getrennt von deiner Bestätigung der Datenschutzerklärung und einer etwaigen Marketing-Einwilligung erfasst, zusammen mit der dir angezeigten Version der Dokumente.",
    },
    accounts: {
      heading: "Konten und Berechtigung",
      body: "Du musst zutreffende Kontoangaben machen und aktuell halten, deine Zugangsdaten schützen und für alle Aktivitäten unter deinem Konto verantwortlich sein. Du musst alt genug sein, um in deiner Rechtsordnung einen bindenden Vertrag zu schließen. Teile uns eine unbefugte Nutzung unverzüglich mit.",
    },
    acceptableUse: {
      heading: "Zulässige Nutzung",
      intro: "Du verpflichtest dich, nicht:",
      item: {
        unlawful: "den Dienst rechtswidrig zu nutzen oder Spam zu versenden;",
        rights:
          "Inhalte hochzuladen oder zu verarbeiten, für die du keine Rechte hast, oder Rechte Dritter zu verletzen;",
        security:
          "unbefugten Zugriff auf den Dienst oder seine Infrastruktur zu versuchen, diese zu stören oder zu überlasten;",
        reverse:
          "den Dienst zurückzuentwickeln, zu scrapen oder technische Beschränkungen zu umgehen, außer soweit eine solche Beschränkung gesetzlich unzulässig ist;",
        resell:
          "den Dienst an Dritte weiterzuverkaufen oder bereitzustellen, außer soweit ausdrücklich gestattet.",
      },
      outro:
        "Wir können den Zugang einschränken oder aussetzen, um den Dienst, unsere Nutzer oder Dritte zu schützen oder um Gesetze einzuhalten.",
    },
    ip: {
      heading: "Geistiges Eigentum",
      body: "Der Dienst, einschließlich seiner Software, seines Designs und der von uns bereitgestellten Inhalte (ausgenommen deine Inhalte), gehört dem Anbieter oder seinen Lizenzgebern und ist durch Rechte des geistigen Eigentums geschützt. Wir gewähren dir ein beschränktes, nicht ausschließliches, nicht übertragbares und widerrufliches Recht zur Nutzung des Dienstes gemäß diesen AGB und deinem Tarif. Weitere Rechte werden nicht gewährt.",
    },
    content: {
      heading: "Deine Inhalte und deren Eigentum",
      body1:
        "Du behältst das Eigentum an den von dir übermittelten Inhalten und Daten („Deine Inhalte“). Du gewährst uns eine beschränkte Lizenz, Deine Inhalte zu hosten, zu verarbeiten, zu übertragen und anzuzeigen, ausschließlich um den Dienst für dich bereitzustellen, zu sichern und zu verbessern, sowie wie in der Datenschutzerklärung beschrieben.",
      body2:
        "Du bist für Deine Inhalte verantwortlich und dafür, über die zur Übermittlung und Verarbeitung erforderlichen Rechte und Einwilligungen zu verfügen. Personenbezogene Daten innerhalb Deiner Inhalte verarbeiten wir wie in der Datenschutzerklärung beschrieben.",
    },
    thirdParty: {
      heading: "Dienste Dritter und automatisierte Ergebnisse",
      body: "Der Dienst kann Drittanbieter nutzen, um Funktionen bereitzustellen. Soweit der Dienst automatisierte oder KI-generierte Ergebnisse erzeugt, können diese ungenau, unvollständig oder für einen bestimmten Zweck ungeeignet sein; du bist dafür verantwortlich, Ergebnisse zu prüfen, bevor du dich darauf verlässt oder sie veröffentlichst. Wir gewährleisten nicht, dass Ergebnisse fehlerfrei oder für einen bestimmten Zweck geeignet sind.",
    },
    disclaimers: {
      heading: "Haftungsausschlüsse",
      body: "Soweit gesetzlich zulässig, wird der Dienst „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne Gewährleistungen jeglicher Art, ob ausdrücklich oder stillschweigend, einschließlich der Eignung für einen bestimmten Zweck, der Nichtverletzung, der Richtigkeit oder der ununterbrochenen Verfügbarkeit. Nichts in diesen AGB schließt Rechte aus, die dir als Verbraucher zustehen und nach geltendem Recht nicht abbedungen werden können.",
    },
    liability: {
      heading: "Haftungsbeschränkung",
      body: "Soweit gesetzlich zulässig, haften wir nicht für mittelbare, zufällige, besondere, Folge- oder Strafschäden oder für den Verlust von Gewinn, Umsatz, Daten oder Geschäftswert. Nichts in diesen AGB beschränkt eine Haftung, die gesetzlich nicht beschränkt werden kann, einschließlich der Haftung für Vorsatz, arglistiges Verhalten, grobe Fahrlässigkeit, Tod oder Körperverletzung durch Fahrlässigkeit oder zwingende Verbraucherrechte.",
    },
    fees: {
      heading: "Entgelte",
      body: "Soweit der Dienst gegen Entgelt angeboten wird, werden die anwendbaren Entgelte, Abrechnungsbedingungen und Steuern zum Zeitpunkt des Kaufs oder in einer gesonderten Bestellung vor jeder Belastung angezeigt. Sofern nicht anders angegeben, sind einmal berechnete Entgelte nicht erstattungsfähig, außer soweit gesetzlich vorgeschrieben.",
    },
    termination: {
      heading: "Laufzeit und Kündigung",
      body: "Diese AGB gelten, solange du den Dienst nutzt. Du kannst die Nutzung des Dienstes jederzeit beenden und dein Konto schließen. Wir können deinen Zugang bei Verstoß gegen diese AGB, aus rechtlichen Gründen oder bei Einstellung des Dienstes aussetzen oder beenden, soweit möglich mit angemessener Vorankündigung. Mit Beendigung endet dein Nutzungsrecht, und wir behandeln verbleibende personenbezogene Daten wie in der Datenschutzerklärung beschrieben, vorbehaltlich gesetzlicher Aufbewahrungspflichten.",
    },
    changes: {
      heading: "Änderungen dieser AGB",
      body: "Wir können diese AGB aktualisieren. Bei einer wesentlichen Änderung veröffentlichen wir eine neue Version und informieren dich, wo angemessen. Jede Version ist datiert; die fortgesetzte Nutzung nach Inkrafttreten einer Änderung bedeutet, dass du die aktualisierten AGB akzeptierst. Wenn du eine Änderung nicht akzeptierst, beende die Nutzung des Dienstes.",
    },
    governingLaw: {
      heading: "Anwendbares Recht und Gerichtsstand",
      body: "Diese AGB unterliegen dem Recht der Rechtsordnung des Anbieters, unbeschadet zwingender verbraucherschützender Vorschriften deines Wohnsitzlandes. Lege vor der Veröffentlichung das anwendbare Recht und den zuständigen Gerichtsstand für deine Rechtsperson fest.",
    },
    miscellaneous: {
      heading: "Sonstiges",
      body: "Sollte eine Bestimmung dieser AGB unwirksam sein, bleiben die übrigen Bestimmungen wirksam. Verzichten wir auf die Durchsetzung einer Bestimmung, liegt darin kein Verzicht. Du darfst diese AGB nicht ohne unsere Zustimmung abtreten; wir dürfen sie im Zusammenhang mit einer Fusion, Übernahme oder einem Verkauf von Vermögenswerten abtreten.",
    },
    contact: {
      heading: "Kontakt",
      intro: "Fragen zu diesen AGB:",
    },
  },
  cookies: {
    title: "Cookie-Hinweis",
    generated: {
      notice:
        "Aus site.config generiert. Dies ist eine generische Vorlage, keine Rechtsberatung. Vor der Veröffentlichung mit rechtlichem Beistand prüfen.",
    },
    intro:
      "Dieser Cookie-Hinweis erläutert, wie diese Website Cookies und ähnliche Gerätespeicher (zusammen „Cookies“) verwendet und wie du sie steuerst. Er ergänzt unsere Datenschutzerklärung.",
    what: {
      heading: "Was Cookies sind",
      body: "Cookies sind kleine Dateien oder Dateneinträge, die beim Besuch einer Website auf deinem Gerät gespeichert werden. Sie helfen einer Website zu funktionieren, Entscheidungen zu speichern, die Nutzung zu verstehen oder Marketing zu unterstützen.",
    },
    controls: {
      heading: "Deine Einwilligungssteuerung",
      necessary:
        "Technisch notwendige Cookies laufen ohne Einwilligung – sie sind für den Betrieb der Website erforderlich.",
      optionalOff:
        "Alle anderen Kategorien sind standardmäßig aus. Funktionale, Analyse- und Marketing-Cookies werden erst nach deiner vorherigen, ausdrücklichen Einwilligung gesetzt.",
      noPreTicked:
        "Keine vorangekreuzten Kästchen – optionale Kategorien sind nie vorausgewählt.",
      noWall:
        "Keine Cookie-Wand – du kannst die Kernwebsite nutzen, unabhängig davon, ob du optionale Cookies akzeptierst.",
      rejectEasy:
        "Ablehnen ist so einfach wie Akzeptieren – das Banner bietet Akzeptieren, Ablehnen und Einstellungen verwalten gleichrangig an.",
      withdraw:
        "Du kannst deine Wahl jederzeit über die Cookie-Einstellungen ändern oder widerrufen.",
      reprompt:
        "Wir fragen erneut, wenn sich die Version dieses Hinweises ändert oder deine gespeicherte Wahl abläuft.",
      proof:
        "Wir erfassen Zeitstempel, Version und deine Wahl pro Kategorie, um die Einhaltung nachzuweisen.",
    },
    categories: {
      heading: "Cookie-Kategorien",
      necessary: {
        name: "Technisch notwendig",
        purpose:
          "Sitzung, Authentifizierung und Sicherheit sowie das Speichern deiner Cookie-Einwilligung. Für den Betrieb der Website erforderlich.",
        consent: "Immer aktiv – keine Einwilligung erforderlich.",
      },
      functional: {
        name: "Funktional",
        purpose:
          "Speichern optionaler Einstellungen wie deiner Sprache oder Oberflächenauswahl.",
        consent: "Opt-in – werden erst nach Einwilligung gesetzt.",
      },
      analytics: {
        name: "Analyse",
        purpose: "Verstehen, wie die Website genutzt wird, um sie zu verbessern.",
        consent: "Opt-in – werden erst nach Einwilligung geladen.",
      },
      marketing: {
        name: "Marketing",
        purpose: "Messen und Ausspielen relevanter Werbung.",
        consent: "Opt-in – werden erst nach Einwilligung geladen.",
      },
      analyticsActive:
        "Auf dieser Website ist derzeit Analyse konfiguriert; sie wird erst nach deiner Einwilligung geladen.",
      analyticsInactive:
        "Auf dieser Website ist derzeit kein Analyse- oder Marketing-Anbieter konfiguriert, daher wird nur technisch notwendiger Speicher verwendet. Ein später hinzugefügter Anbieter wird erst nach deiner Einwilligung geladen.",
    },
    manage: {
      heading: "Deine Wahl verwalten",
      body: "Bei deinem ersten Besuch fragt ein Cookie-Banner nach deiner Einwilligung. Über „Akzeptieren“, „Ablehnen“ oder „Einstellungen verwalten“ legst du deine Wahl pro Kategorie fest. Du kannst die Steuerung „Einstellungen verwalten“ des Banners jederzeit erneut öffnen, um deine Einwilligung zu ändern oder zu widerrufen.",
      storageIntro:
        "Deine Wahl wird in deinem Browser unter dem Schlüssel gespeichert",
      storageAfterKey: "; beim Löschen wird das Banner erneut angezeigt.",
    },
    browser: {
      heading: "Cookies in deinem Browser verwalten",
      body: "Du kannst Cookies auch über die Einstellungen deines Browsers blockieren oder löschen. Beachte, dass das Blockieren technisch notwendiger Cookies dazu führen kann, dass Teile der Website nicht funktionieren.",
    },
    privacy: {
      heading: "Verhältnis zur Datenschutzerklärung",
      body: "Einzelheiten dazu, wie wir personenbezogene Daten verarbeiten, einschließlich der über Cookies erhobenen Daten, findest du in unserer",
      link: "Datenschutzerklärung",
    },
    contact: {
      heading: "Kontakt",
      intro: "Fragen zu Cookies:",
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
