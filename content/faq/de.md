---
title: Häufige Fragen
description: Antworten zu dieser Website, dem Chat-Agenten, ContextRocket und der Anpassung.
---

## Was ist dieses Template?

ContextRocket Starter ist ein produktionsbereites Next.js-Template für
statische Websites und Marken-Agenten auf
[ContextRocket](https://contextrocket.com). Es bietet einen Demo-Modus mit
vorgefertigten Antworten, direktes A2A-Streaming im Browser, ein eigenständiges
Chat-Widget, SEO/AEO-Oberflächen und eine Kunden-CLI.

## Wie arbeitet der Chat-Agent?

Im Demo-Modus verwendet die Website vorgefertigte Antworten und läuft auf
jedem statischen Host. Im Live-Modus verbindet sich der Browser direkt über das
[A2A-Protokoll](https://google.github.io/A2A/) und Server-Sent Events mit dem
ContextRocket-Agenten. Ein Next.js-Backend dazwischen ist nicht erforderlich.

## Was brauche ich für den Live-Modus?

Konfiguriere die Agent-URL, den Organisations-Handle und den veröffentlichbaren API
Key in der Umgebung der Website. ContextRocket prüft, ob der Schlüssel für den
anfragenden Website-Ursprung freigegeben ist. Administrative Schlüssel und
Geheimnisse gehören nicht in Browser-Code.

## Woher kommen die Antworten?

Live-Antworten stammen aus den verifizierten Quellen, die mit dem
ContextRocket-Agenten verbunden sind. Wenn keine relevanten Informationen
gefunden werden, sollte der Agent dies sagen, statt zu raten. Der Demo-Modus
verwendet die vorbereitete Beispielantwort der Website.

## Welche Daten sammelt die Website?

Der öffentliche Starter enthält kein Konto- oder lokales Anwendungs-Backend.
Technisch notwendiger Browser-Speicher und optionale Analyse können nach der
Cookie-Einwilligung verwendet werden. Einzelheiten stehen in der
[Datenschutzerklärung](/privacy).

## Wie passe ich das Design an?

Bearbeite `frontend/config/site.json` für Markendaten, Theme-Tokens, Assets und
Funktionsschalter. Bearbeite `frontend/i18n/messages/site/` für Website-Texte
oder füge Markdown unter `content/` für umfangreiche Inhalte hinzu.
Gemeinsame Komponenten und Integrationscode bleiben Starter-eigen, damit Forks
Verbesserungen sauber übernehmen können.
