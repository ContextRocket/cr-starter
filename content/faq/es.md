---
title: Preguntas frecuentes
description: Respuestas sobre este sitio, el agente de chat, ContextRocket y la personalización.
---

## ¿Qué es esta plantilla?

ContextRocket Starter es una plantilla Next.js lista para producción para
crear sitios estáticos y experiencias de agentes sobre
[ContextRocket](https://contextrocket.com). Incluye un modo de demostración con
respuestas preparadas, streaming A2A directo desde el navegador, un widget de
chat independiente, superficies SEO/AEO y una CLI para clientes.

## ¿Cómo funciona el agente de chat?

En modo demo, el sitio usa respuestas preparadas y funciona en cualquier host
estático. En modo live, el navegador se conecta directamente con tu agente de
ContextRocket mediante el [protocolo A2A](https://google.github.io/A2A/) y
Server-Sent Events. No hace falta interponer un backend de Next.js.

## ¿Qué necesito para el modo live?

Configura la URL del agente, tu handle de organización y la API key publicable en el
entorno del sitio. ContextRocket comprueba que la clave esté permitida para el
origen del sitio que realiza la petición. Las claves administrativas y los
secretos deben permanecer fuera del código del navegador.

## ¿De dónde provienen las respuestas?

Las respuestas live proceden de las fuentes verificadas conectadas al agente de
ContextRocket. Si el agente no encuentra información relevante, debe indicarlo
en lugar de inventar. El modo demo utiliza la respuesta de ejemplo del sitio.

## ¿Qué datos recopila este sitio?

El starter público no incluye cuentas ni un backend de aplicación local. Puede
usar almacenamiento técnico del navegador y analítica opcional después del
consentimiento de cookies. Consulta la [Política de privacidad](/privacy).

## ¿Cómo personalizo el diseño?

Edita `frontend/config/site.json` para los datos de marca, tokens de tema,
activos y funciones. Edita `frontend/i18n/messages/site/` para el texto del
sitio, o añade Markdown en `content/` para superficies con mucho contenido.
Los componentes compartidos y la integración siguen siendo propiedad del
starter para que los forks puedan incorporar mejoras con facilidad.
