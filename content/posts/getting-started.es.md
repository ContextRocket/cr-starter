---
title: "Empezar con ContextRocket Starter"
author: "Equipo CR"
date: "2026-08-19"
image: "/images/blog/contextrocket-intro.jpg"
excerpt: "Configura el sitio, personaliza la marca y publica tu primer artículo Markdown — con imagen de portada."
featured: true
---

El starter es un sitio estático en Astro con blog Markdown, páginas legales y un widget de chat ContextRocket opcional. Edita configuración y contenido; vuelve a construir para publicar.

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3100` (este starter). Los forks suelen usar puertos cercanos como 3101+.

## Personaliza tu marca

Edita `config/site.json`:

- `company.name` — nombre en la cabecera
- `company.legalName` — pie y páginas legales
- `company.tagline` / `company.description` — inicio y SEO
- `company.siteUrl` — URLs canónicas y datos estructurados
- `legal` — entidad, dirección, registro, IVA, contacto de privacidad
- `theme` — tokens de color para modo claro y oscuro

Los textos de marketing viven en `src/i18n/messages/site/`.

## Añade un artículo

Crea un archivo Markdown en `content/posts/`. El frontmatter controla el listado, la portada y el SEO:

```yaml
---
title: "Título del artículo"
author: "Nombre"
date: "2026-09-01"
image: "/images/blog/programming-setup.jpg"
excerpt: "Una descripción breve para tarjetas y metaetiquetas."
featured: false
---
```

El cuerpo es Markdown normal. Coloca las imágenes en `public/` (este starter usa `public/images/blog/`) y referencia la ruta relativa a la raíz en `image`.

También puedes incrustar imágenes en el cuerpo:

![Portátil en un escritorio como ejemplo dentro del artículo](/images/blog/programming-setup.jpg)

## Idiomas

- Artículo compartido: `mi-articulo.md`
- Copia por idioma: `mi-articulo.en.md`, `mi-articulo.es.md`, `mi-articulo.de.md`

Un archivo con sufijo de idioma tiene prioridad sobre el compartido con el mismo slug.

## Conectar ContextRocket (opcional)

Para chat en vivo, configura las variables públicas en `.env` (ver `.env.example`). El modo demo funciona sin red para exportaciones estáticas.
