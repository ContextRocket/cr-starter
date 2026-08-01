---
title: Preguntas frecuentes
description: Respuestas a preguntas comunes sobre este sitio, el agente de chat, el tratamiento de datos y la personalización.
---

## ¿Qué es esta plantilla?

Este es el ContextRocket Starter, una plantilla Next.js lista para producción que permite crear productos de IA sobre [ContextRocket](https://contextrocket.com). Incluye flujos de autenticación, una estructura de panel, chat en streaming basado en el protocolo A2A y una pila completa de visibilidad para agentes (JSON-LD, llms.txt, manifiesto MCP y tarjeta de agente A2A).

Haz un fork del repositorio, rellena `frontend/site.config.ts` con tu marca, conecta tus credenciales de organización de ContextRocket y tendrás un agente de conocimiento de marca en minutos. Sin necesidad de código de IA en el servidor.

## ¿Cómo funciona el agente de chat?

El panel de chat se conecta a tu agente de ContextRocket mediante el [protocolo A2A](https://google.github.io/A2A/), un formato de comunicación basado en JSON-RPC 2.0 y Server-Sent Events diseñado para la comunicación entre agentes.

Cuando envías un mensaje, el frontend recibe en tiempo real una secuencia de eventos tipados desde tu agente de ContextRocket: un estado de procesamiento, fragmentos de texto incrementales mientras el agente razona y un evento de finalización con las citas correspondientes. El agente consulta el conocimiento verificado de tu marca (tu Context Pack) y devuelve respuestas fundamentadas con referencias a las fuentes. No realiza búsquedas en la web abierta; responde exclusivamente desde lo que tu organización ha añadido explícitamente a su corpus.

## ¿De dónde provienen las respuestas?

Las respuestas provienen del Context Pack de tu organización en ContextRocket, la base de conocimiento verificada y curada que tu equipo gestiona en el panel de ContextRocket. El agente no navega por la web abierta ni responde únicamente desde datos de entrenamiento; cada respuesta está fundamentada en las fuentes que tu equipo ha revisado y aprobado.

Si el agente no encuentra información relevante en tu corpus, lo indica en lugar de inventar una respuesta. Puedes ampliar el corpus añadiendo fuentes en el panel de ContextRocket y ejecutando un nuevo rastreo o proceso de enriquecimiento.

## ¿Cómo conecto mi organización de ContextRocket?

Establece dos variables de entorno en `frontend/.env.local`:

```
NEXT_PUBLIC_CR_AGENT_URL=https://api.contextrocket.com
NEXT_PUBLIC_CR_ORG_KEY=crk_tu_clave_aquí
```

Ambos valores se encuentran en tu panel de ContextRocket, en Configuración. `NEXT_PUBLIC_CR_AGENT_URL` es el endpoint A2A del agente de tu organización. `NEXT_PUBLIC_CR_ORG_KEY` es una credencial de máquina con prefijo `crk_` que vincula el agente al conocimiento de tu organización.

Reinicia el servidor de desarrollo tras establecer las variables. El botón flotante de chat se conectará de inmediato. Consulta `docs/integrating-with-contextrocket.md` en el repositorio para conocer el contrato completo de variables de entorno y los detalles de gestión de errores.

## ¿Qué datos recopila este sitio?

Cuando usas el servidor local opcional (ruta con pila completa), el sitio almacena tu dirección de correo electrónico, una contraseña cifrada y tu idioma preferido para gestionar tu cuenta. Una cookie de sesión mantiene tu sesión activa.

La analítica está desactivada por defecto. Si el operador ha habilitado Google Analytics 4 o PostHog, esos scripts solo se cargan después de que aceptes mediante el banner de consentimiento de cookies; rechazar no afecta en absoluto al funcionamiento del sitio. Tu elección de consentimiento se almacena en el almacenamiento local de tu navegador y puede eliminarse en cualquier momento.

Para más detalles, consulta la página de [Política de privacidad](/privacy).

## ¿Cómo personalizo el diseño?

Los tokens de diseño se encuentran en `frontend/app/globals.css` como propiedades personalizadas de CSS (`--primary`, `--background`, `--foreground`, etc.). Cambia esos valores para adaptarlos a tu marca sin tocar el código de los componentes.

Para cambios más profundos, la biblioteca de componentes es [shadcn/ui](https://ui.shadcn.com/) sobre primitivos de Radix UI. Los componentes se encuentran en `frontend/components/ui/`. La configuración CSS-first de Tailwind v4 significa que no existe `tailwind.config.js`; todas las personalizaciones del tema van en `globals.css`.

Consulta `docs/customizing-design.md` para el mapa completo de componentes y la lista de archivos que puedes modificar frente a los que no deberías modificar en tu fork.
