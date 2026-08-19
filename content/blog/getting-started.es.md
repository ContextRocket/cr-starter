---
title: "Un punto de partida sencillo"
author: "El equipo"
date: "2026-08-01"
image: "/images/blog/default-featured.jpg"
excerpt: "Un pequeño ejemplo del flujo de publicación basado en Markdown."
featured: true
---

## Empieza por el contenido

Este artículo de ejemplo es deliberadamente breve. Añade un archivo Markdown
en `content/blog/`, incluye un título y una fecha en los metadatos y escribe el
artículo debajo. El starter convierte el archivo en una tarjeta del listado,
una página propia y los metadatos de búsqueda correspondientes.

## Mantén sencillo el flujo

La estructura del sitio vive en el starter. Un fork normalmente solo cambia su
configuración, tema y contenido. Así, publicar un artículo nuevo no requiere
crear un componente React ni un nuevo paquete de traducciones.

Para otro idioma, añade otro archivo Markdown con el mismo slug y un sufijo de
idioma, como `getting-started.en.md`. La URL pública sigue siendo
`/blog/getting-started`; el idioma de la URL selecciona el archivo Markdown
correspondiente.
