---
title: Häufige Fragen
description: Antworten auf häufige Fragen zu dieser Website, dem Chat-Agenten, der Datenverarbeitung und der Anpassung.
---

## Was ist diese Vorlage?

Dies ist der ContextRocket Starter, eine produktionsfertige Next.js-Vorlage zum Aufbau KI-gestützter Produkte auf [ContextRocket](https://contextrocket.com). Sie enthält Authentifizierungsabläufe, ein Dashboard-Gerüst, Streaming-Chat auf Basis des A2A-Protokolls und einen vollständigen Agent-Discoverability-Stack (JSON-LD, llms.txt, MCP-Manifest und A2A-Agentenkarte).

Fork das Repository, trage deine Marke in `frontend/site.config.ts` ein, verbinde deine ContextRocket-Organisationsanmeldedaten, und du hast in wenigen Minuten einen markeneigenen Wissensagenten. Kein eigener KI-Backend-Code erforderlich.

## Wie funktioniert der Chat-Agent?

Das Chat-Panel verbindet sich mit deinem ContextRocket-Agenten über das [A2A-Protokoll](https://google.github.io/A2A/), ein auf JSON-RPC 2.0 und Server-Sent Events basierendes Kommunikationsformat, das für die Kommunikation zwischen Agenten entwickelt wurde.

Wenn du eine Nachricht sendest, empfängt das Frontend in Echtzeit eine Folge typisierter Ereignisse von deinem ContextRocket-Agenten: einen Verarbeitungsstatus, schrittweise Textabschnitte während der Agent antwortet und ein abschließendes Ereignis mit den entsprechenden Quellenangaben. Der Agent greift auf das verifizierte Markenwissen deiner Organisation (dein Context Pack) zu und liefert fundierte Antworten mit Quellenverweisen. Es wird keine allgemeine Websuche durchgeführt; der Agent antwortet ausschließlich auf Basis dessen, was deine Organisation explizit in ihr Corpus aufgenommen hat.

## Woher stammen die Antworten?

Die Antworten stammen aus dem Context Pack deiner Organisation in ContextRocket, der verifizierten und kuratierten Wissensbasis, die dein Team im ContextRocket-Dashboard verwaltet. Der Agent durchsucht nicht das offene Web und antwortet nicht allein aus Trainingsdaten; jede Antwort ist auf die Quellen gestützt, die dein Team geprüft und freigegeben hat.

Wenn der Agent keine relevanten Informationen in deinem Corpus findet, teilt er das mit, anstatt zu raten. Du kannst das Corpus erweitern, indem du im ContextRocket-Dashboard Quellen hinzufügst und einen neuen Crawl- oder Anreicherungsvorgang startest.

## Wie verbinde ich meine ContextRocket-Organisation?

Lege zwei Umgebungsvariablen in `frontend/.env.local` fest:

```
NEXT_PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
NEXT_PUBLIC_CR_ORG_KEY=crk_dein_schluessel_hier
```

Beide Werte findest du in deinem ContextRocket-Dashboard unter Einstellungen. `NEXT_PUBLIC_CR_AGENT_URL` ist der A2A-Endpunkt des Agenten deiner Organisation. `NEXT_PUBLIC_CR_ORG_KEY` ist ein maschineller Zugriffsschlüssel mit dem Präfix `crk_`, der den Agenten auf das Wissen deiner Organisation beschränkt.

Starte den Entwicklungsserver nach dem Setzen der Variablen neu. Der schwebende Chat-Button verbindet sich sofort. Alle Details zum Umgebungsvariablen-Vertrag und zur Fehlerbehandlung findest du in `docs/integrating-with-contextrocket.md` im Repository.

## Welche Daten erhebt diese Website?

Wenn du den optionalen lokalen Backend-Server verwendest (Vollstack-Pfad), speichert die Website deine E-Mail-Adresse, ein gehashtes Passwort und deine bevorzugte Sprache, um dein Konto zu verwalten. Ein Sitzungs-Cookie hält dich eingeloggt.

Analyse-Tools sind standardmäßig deaktiviert. Wenn der Betreiber Google Analytics 4 oder PostHog aktiviert hat, werden diese Skripte erst geladen, nachdem du über das Cookie-Banner zugestimmt hast; eine Ablehnung beeinträchtigt die Funktionsfähigkeit der Website nicht. Deine Zustimmungswahl wird im lokalen Speicher deines Browsers gespeichert und kann jederzeit gelöscht werden.

Weitere Einzelheiten findest du auf der Seite [Datenschutzerklärung](/privacy).

## Wie passe ich das Design an?

Design-Token befinden sich in `frontend/app/globals.css` als CSS-benutzerdefinierte Eigenschaften (`--primary`, `--background`, `--foreground` usw.). Ändere diese Werte entsprechend deiner Marke, ohne Komponentencode anfassen zu müssen.

Für tiefergehende Anpassungen ist die Komponentenbibliothek [shadcn/ui](https://ui.shadcn.com/) auf Basis von Radix-UI-Primitiven. Die Komponenten befinden sich in `frontend/components/ui/`. Die CSS-first-Konfiguration von Tailwind v4 bedeutet, dass es keine `tailwind.config.js` gibt; alle Theme-Anpassungen erfolgen in `globals.css`.

Unter `docs/customizing-design.md` findest du die vollständige Komponentenübersicht und eine Liste der Dateien, die du anpassen darfst, im Gegensatz zu denen, die du in deinem Fork nicht verändern solltest.
