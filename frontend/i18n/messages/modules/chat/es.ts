/**
 * modules/chat -- es (chat surface, carved from app/).
 */

export const chatEs = {
  chat: {
    mock: {
      response: "Esta es una respuesta simulada. El chat opera en modo de demostración offline.\n\nPara conectar un agente en vivo, configura el modo live, un handle de organización y una clave API para sitios web en `.env.local`.\n\n¡Disfruta explorando la interfaz!"
    },
    placeholder: "Pregunta lo que quieras...",
    placeholderStreaming: "Pensando...",
    thinking: "Pensando",
    slow: {
      response: {
        title: "Aún procesando...",
        hint: "Esto está tardando un poco más de lo habitual."
      }
    },
    very: {
      slow: {
        response: {
          hint: "Aún procesando. Las preguntas complejas requieren más tiempo."
        }
      }
    },
    send: "Enviar",
    stop: "Detener",
    empty: {
      title: "¿En qué puedo ayudarte?",
      subtitle: "Escribe una pregunta para empezar."
    },
    copy: "Copiar",
    copied: "Copiado",
    sources: "Fuentes",
    scroll: {
      to: {
        bottom: "Ir al final"
      }
    },
    clear: "Borrar chat",
    open: "Abrir chat",
    close: "Cerrar chat",
    expand: "Ampliar a pantalla completa",
    collapse: "Reducir al panel",
    connect: {
      required: {
        title: "Conecta ContextRocket",
        body: "Establece NEXT_PUBLIC_CR_CHAT_MODE=live, NEXT_PUBLIC_CR_AGENT_URL y NEXT_PUBLIC_CONTEXTROCKET_HANDLE para activar A2A en vivo."
      }
    },
    stream: {
      interrupted: "La conexión se ha interrumpido antes de completar la respuesta. La respuesta puede estar incompleta."
    },
    typing: "El asistente está escribiendo",
    more: {
      detail: "Más detalles"
    },
    less: {
      detail: "Menos detalles"
    },
    suggestions: {
      label: "Sugerencias de seguimiento"
    },
    source: {
      sheet: {
        title: "Fuentes",
        open: "Abrir fuente"
      },
      cited: {
        section: "Sección citada"
      },
      publisher: "Editor",
      date: "Fecha",
      license: "Licencia"
    },
    sourceSheet: {
      openNewTab: "Abrir en nueva pestaña"
    },
    policy: {
      card: {
        source: "Fuente"
      }
    },
    link: {
      preview: {
        title: "Vista previa del enlace",
        open: "Abrir en nueva pestaña"
      }
    },
    grounded: "Fundamentada",
    partially: {
      grounded: "Parcialmente fundamentada"
    },
    ungrounded: "Sin fundamentar",
    groundedClaimsChecked: "afirmaciones verificadas",
    demo: {
      badge: "Demo",
      error: {
        not: {
          found: "El agente de demostración no está disponible. Contacta con el propietario del sitio para activar la demo pública."
        },
        unauthorized: "Se ha rechazado el acceso a la demo. Es posible que la demo pública no esté habilitada para este agente."
      }
    }
  },
} as const;
