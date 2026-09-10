---
title: "Erste Schritte mit ContextRocket Starter"
author: "CR Team"
date: "2026-08-19"
image: "/images/blog/contextrocket-intro.jpg"
excerpt: "Site einrichten, Marke anpassen und den ersten Markdown-Beitrag veröffentlichen — inklusive Titelbild."
featured: true
---

Der Starter ist eine statische Astro-Site mit Markdown-Blog, rechtlichen Seiten und optionalem ContextRocket-Chat-Widget. Konfiguration und Inhalte bearbeiten, neu bauen, veröffentlichen.

## Schnellstart

```bash
pnpm install
pnpm dev
```

Öffne `http://localhost:3100` (dieser Starter). Forks nutzen oft benachbarte Ports wie 3101+.

## Marke anpassen

Bearbeite `config/site.json`:

- `company.name` — Anzeigename in der Navigation
- `company.legalName` — Footer und Rechtstexte
- `company.tagline` / `company.description` — Startseite und SEO
- `company.siteUrl` — kanonische URLs und Structured Data
- `legal` — Firma, Adresse, Register, USt-IdNr., Datenschutzkontakt
- `theme` — Farbtokens für Hell- und Dunkelmodus

Marketingtexte liegen in `src/i18n/messages/site/`.

## Beitrag hinzufügen

Lege eine Markdown-Datei unter `content/posts/` an. Das Frontmatter steuert Liste, Titelbild und SEO:

```yaml
---
title: "Dein Titel"
author: "Autor"
date: "2026-09-01"
image: "/images/blog/programming-setup.jpg"
excerpt: "Kurze Beschreibung für Karten und Meta-Tags."
featured: false
---
```

Der Körper ist normales Markdown. Assets liegen unter `public/` (hier: `public/images/blog/`); im Frontmatter `image` mit root-relativem Pfad setzen.

Bilder im Beitragstext:

![Laptop auf einem Schreibtisch als Beispiel im Beitrag](/images/blog/programming-setup.jpg)

## Sprachen

- Gemeinsamer Beitrag: `mein-beitrag.md`
- Sprachspezifisch: `mein-beitrag.en.md`, `mein-beitrag.es.md`, `mein-beitrag.de.md`

Eine sprachspezifische Datei hat Vorrang vor der gemeinsamen Datei mit demselben Slug.

## ContextRocket verbinden (optional)

Für Live-Chat die öffentlichen Variablen in `.env` setzen (siehe `.env.example`). Der Demo-Modus funktioniert offline für statische Exporte.
