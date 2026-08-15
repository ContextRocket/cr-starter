/**
 * App (@eng) i18n slice — authenticated / product surfaces:
 * auth, dashboard, dev, chat, embed. Strict tri-locale parity.
 *
 * Auto-partitioned from the original es.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const appEs = {
  auth: {
    login: {
      title: "Iniciar sesión",
      description: "Introduce tu correo electrónico para acceder a tu cuenta.",
      submit: "Entrar",
      no: {
        account: "¿No tienes cuenta?"
      },
      sign: {
        up: "Registrarse"
      }
    },
    forgot: {
      password: "¿Has olvidado tu contraseña?"
    },
    register: {
      title: "Crear cuenta",
      description: "Introduce tu correo electrónico y contraseña para crear tu cuenta.",
      submit: "Crear cuenta",
      back: "Volver al inicio de sesión"
    },
    password: {
      recovery: {
        title: "Recuperar contraseña",
        description: "Introduce tu correo electrónico para recibir instrucciones para restablecer tu contraseña.",
        submit: "Enviar",
        back: "Volver al inicio de sesión"
      },
      reset: {
        title: "Restablecer contraseña",
        description: "Introduce la nueva contraseña y confírmala.",
        submit: "Enviar",
        loading: "Cargando formulario de restablecimiento...",
        success: "Instrucciones para restablecer la contraseña enviadas a tu correo."
      }
    }
  },
  dashboard: {
    title: "Panel",
    subtitle: "Tu espacio de trabajo con ContextRocket. Configura tu aplicación y conéctate a ContextRocket para ejecuciones de agente, estado de conversación y gestión del conocimiento.",
    card: {
      chat: {
        title: "Continuar el chat",
        description: "Tu historial de conversación está guardado. Retoma donde lo dejaste.",
        action: "Abrir chat"
      },
      profile: {
        title: "Perfil y ajustes",
        description: "Actualiza tu correo, contraseña o preferencia de idioma.",
        action: "Editar perfil"
      },
      users: {
        title: "Usuarios",
        description: "Revisa cuentas registradas y sesiones de invitado.",
        action: "Ver usuarios"
      }
    },
    guest: {
      prompt: {
        title: "Guarda tu conversación",
        description: "Crea una cuenta gratuita para conservar tu historial de chat. Tu conversación actual continuará de todos modos.",
        action: "Crear cuenta"
      }
    },
    users: {
      title: "Usuarios",
      description: "Todas las cuentas registradas y de invitado.",
      col: {
        email: "Correo electrónico",
        type: "Tipo",
        status: "Estado"
      },
      type: {
        guest: "Invitado",
        registered: "Registrado"
      },
      status: {
        active: "Activo",
        inactive: "Inactivo"
      },
      forbidden: "Esta página es solo para operadores."
    },
    profile: {
      title: "Perfil y ajustes"
    }
  },
  dev: {
    notice: {
      label: "Aviso para desarrolladores:"
    },
    siteConfigUrlWarning: "El campo siteUrl de site.config.ts todavía apunta a example.com. Sustitúyelo por tu dominio de producción antes de publicar el sitio."
  },
  chat: {
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
        body: "Establece NEXT_PUBLIC_CR_AGENT_URL para activar el agente de IA."
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
    nudge: {
      title: "Guarda tu conversación",
      body: "Crea una cuenta gratuita para conservar todo tu historial de chat. Tu conversación actual continuará de todos modos.",
      action: "Crear cuenta",
      dismiss: "Descartar"
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
        slug: {
          not: {
            found: "El agente de demostración no está disponible. Contacta con el propietario del sitio para activar la demo pública."
          }
        },
        unauthorized: "Se ha rechazado el acceso a la demo. Es posible que la demo pública no esté habilitada para este agente."
      }
    }
  },
  embed: {
    agent: {
      url: {
        rejected: {
          title: "URL del agente no permitida",
          body: "El parámetro agent-url proporcionado al widget embebido no coincide con el agente configurado para este sitio."
        }
      }
    }
  },
} as const;
