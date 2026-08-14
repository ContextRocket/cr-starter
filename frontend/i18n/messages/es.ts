/**
 * Spanish (es) i18n message tree for the cr-starter.
 *
 * Hand-translated. All keys must remain in parity with en.ts.
 * Verified by scripts/check-i18n-parity.js (pre-commit hook).
 *
 * Legal terms: "Impressum" is retained as-is -- it is a German/EU legal term
 * with no idiomatic Spanish equivalent in the context of EU web law; the
 * German term is internationally understood in EU legal contexts.
 * "Datenschutz" -> "Privacidad" / "Politica de privacidad" is the standard.
 */

export const es = {
  home: {
    subtitle: "Crea productos con ContextRocket. Autenticación, estructura de panel y seguridad de tipos basada en OpenAPI incluidas. El estado de conversación y las ejecuciones de agente se delegan a ContextRocket vía A2A.",
    cta: "Ir al panel",
    widget: {
      section: {
        title: "Añade el agente a cualquier sitio web",
        body: "Una etiqueta de script añade un botón de chat flotante a cualquier página. El botón abre un iframe respaldado por tu agente de ContextRocket, sin React, sin empaquetador ni cambios en el servidor del sitio anfitrión. El botón flotante de esta página es el mismo componente; incrústalo en otros sitios con el fragmento de código siguiente."
      },
      snippet: {
        note: "Copia el fragmento, reemplaza la URL del agente y añádelo antes de </body>."
      }
    },
    featured: {
      title: "Del blog",
      subtitle: "Guías, investigación y novedades del producto.",
      viewAll: "Ver todas las publicaciones"
    },
    integrations: {
      label: "Integraciones",
      title: "Conectado con las herramientas que importan",
      body1: "Se conecta con las herramientas que tu equipo ya usa, para que tus datos fluyan sin trabajo adicional.",
      body2: "Estas integraciones te permiten actuar sobre señales reales y mantener todo sincronizado.",
      cta: "Ver todas las integraciones"
    },
    subscribe: {
      title: "Mantente al día",
      subtitle: "Recibe novedades y consejos ocasionales de nuestro equipo. Sin spam.",
      placeholder: "tu@ejemplo.com",
      submit: "Suscribirse",
      consent: "Acepto recibir correos y acepto la",
      privacyLink: "política de privacidad",
      success: "Gracias, ya estás en la lista.",
      errors: {
        emailRequired: "Introduce tu correo electrónico.",
        emailInvalid: "Introduce una dirección de correo válida.",
        consentRequired: "Acepta la política de privacidad para continuar.",
        submitFailed: "Algo salió mal. Inténtalo de nuevo."
      }
    }
  },
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
  form: {
    email: "Correo electrónico",
    password: "Contraseña",
    passwordConfirm: "Confirmar contraseña",
    username: "Nombre de usuario",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      password: {
        min: "La contraseña debe tener al menos 8 caracteres.",
        uppercase: "La contraseña debe contener al menos una letra mayúscula.",
        special: "La contraseña debe contener al menos un carácter especial.",
        required: "La contraseña es obligatoria"
      },
      passwords: {
        match: "Las contraseñas deben coincidir."
      },
      token: {
        required: "El token es obligatorio"
      },
      email: {
        invalid: "Dirección de correo electrónico no válida"
      },
      username: {
        required: "El nombre de usuario es obligatorio"
      }
    }
  },
  nav: {
    dashboard: "Panel",
    logout: "Cerrar sesión",
    welcome: "Bienvenido a tu panel"
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
  error: {
    generic: "Algo ha salido mal. Por favor, inténtalo de nuevo.",
    dashboard: "Algo ha salido mal al cargar esta página.",
    try: {
      again: "Intentar de nuevo"
    },
    unexpected: "Se ha producido un error inesperado. Por favor, inténtalo más tarde.",
    network: "Error de red",
    no: {
      token: "No se encontró el token de acceso",
      data: "El servidor no devolvió datos"
    },
    unknown: "Error desconocido",
    internal: "Error interno del servidor"
  },
  footer: {
    impressum: "Impressum",
    privacy: "Política de privacidad",
    faq: "Preguntas frecuentes"
  },
  faq: {
    page: {
      title: "Preguntas frecuentes",
      description: "Respuestas a preguntas comunes sobre este sitio, el agente de chat, el tratamiento de datos y la personalización."
    },
    back: {
      home: "Volver al inicio"
    }
  },
  blog: {
    title: "Blog",
    description: "Artículos, guías y novedades.",
    empty: "Aún no hay publicaciones. Vuelve pronto.",
    back: {
      home: "Volver al inicio",
      to: {
        list: "Todas las publicaciones"
      }
    },
    not: {
      found: "Publicación no encontrada"
    },
    min: {
      read: "min de lectura"
    }
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Aviso legal"
    },
    entity: {
      label: "Entidad"
    },
    address: {
      label: "Dirección"
    },
    register: {
      label: "Registro mercantil"
    },
    vat: {
      label: "NIF/CIF"
    },
    represented: {
      by: {
        label: "Representado por"
      }
    },
    contact: {
      label: "Contacto"
    },
    disclaimer: "Este Impressum es legalmente obligatorio para sitios web comerciales en Alemania y la Unión Europea. Todos los valores de ejemplo deben reemplazarse antes de publicar el sitio."
  },
  privacy: {
    title: "Política de privacidad",
    contact: {
      label: "Contacto de privacidad",
      intro: "Para preguntas sobre tus datos personales o para ejercer tus derechos, contacta con nuestro equipo de privacidad:"
    },
    placeholder: "Esta es una política de privacidad provisional. Reemplaza esta página con tu declaración de privacidad completa y conforme a la ley antes de publicar el sitio.",
    generated: {
      notice: "Generada desde site.config. Revísala con asesoría legal antes de publicar."
    },
    intro: "Esta política de privacidad explica cómo recopilamos, usamos y protegemos tus datos personales cuando utilizas este sitio web. Es un punto de partida generado a partir de la configuración del sitio y debe ser revisado por asesoría legal cualificada antes de publicar el sitio.",
    controller: {
      heading: "Responsable del tratamiento",
      intro: "La entidad responsable del tratamiento de tus datos personales (el responsable en el sentido del RGPD) es:"
    },
    data: {
      heading: "Datos que tratamos",
      auth: {
        heading: "Datos de cuenta y autenticación",
        body: "Cuando te registras o inicias sesión, tratamos tu dirección de correo electrónico, una contraseña cifrada y tu idioma preferido. Estos datos son necesarios para proporcionar y proteger tu cuenta. Base legal: ejecución de un contrato (art. 6.1.b RGPD)."
      },
      cookies: {
        heading: "Cookies estrictamente necesarias",
        body: "Utilizamos cookies y almacenamiento del navegador técnicamente necesarios para mantenerte conectado (sesión de autenticación), recordar tu preferencia de idioma (cookie de configuración regional) y guardar tu elección de consentimiento de cookies. Estas son imprescindibles para el funcionamiento del sitio y no requieren tu consentimiento."
      }
    },
    analytics: {
      heading: "Analítica",
      body: "Este sitio utiliza analítica para comprender cómo los visitantes interactúan con el servicio. Los scripts de analítica solo se cargan una vez que otorgas tu consentimiento a través del banner de cookies. Puedes retirar tu consentimiento en cualquier momento haciendo clic en el enlace de política de privacidad del pie de página y usando la opción de restablecer el consentimiento. Base legal: consentimiento (art. 6.1.a RGPD).",
      ga: {
        label: "Google Analytics 4 (Google LLC)"
      },
      posthog: {
        label: "PostHog (PostHog Inc.)"
      },
      providers: {
        intro: "Los siguientes proveedores de analítica están configurados en este sitio:"
      }
    },
    consent: {
      heading: "Consentimiento de cookies y revocación",
      body: "En tu primera visita, un banner de cookies solicita tu consentimiento para las cookies analíticas. Puedes aceptar o rechazar. Tu elección se almacena en tu navegador. Para cambiar tu elección o retirar el consentimiento, borra el valor almacenado bajo la clave",
      bodyAfterKey: "en el almacenamiento local de tu navegador."
    },
    rights: {
      heading: "Tus derechos",
      intro: "En virtud del RGPD tienes los siguientes derechos sobre tus datos personales:",
      access: "Derecho de acceso (art. 15 RGPD)",
      rectification: "Derecho de rectificación (art. 16 RGPD)",
      erasure: "Derecho de supresión (art. 17 RGPD)",
      portability: "Derecho a la portabilidad de datos (art. 20 RGPD)",
      complaint: "Derecho a presentar una reclamación ante una autoridad de control (art. 77 RGPD)",
      outro: "Para ejercer tus derechos, contacta con la dirección de privacidad indicada más arriba."
    }
  },
  pagination: {
    items: {
      per: {
        page: "Elementos por página:"
      }
    },
    no: {
      results: "0 resultados"
    }
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
  cookie: {
    consent: {
      aria: {
        label: "Consentimiento de cookies"
      },
      title: "Este sitio utiliza cookies",
      body: "Usamos cookies analíticas para mejorar tu experiencia. Consulta nuestra",
      policy: {
        link: "Política de privacidad"
      },
      accept: "Aceptar",
      decline: "Rechazar"
    }
  }
,
  locale: {
    labelEnglish: "Inglés",
    labelSpanish: "Español",
    labelGerman: "Alemán",
    changeLanguage: "Cambiar idioma",
  },
  preview: {
    pricing: {
      title: "Precios sencillos y transparentes",
      subtitle: "Precios",
      perMonth: "/mes",
      standard: {
        name: "Estándar",
        price: "29 €",
        description: "Todo lo que un equipo pequeño necesita para empezar.",
        cta: "Empezar gratis",
        features: {
          "0": "Hasta 5 miembros del equipo",
          "1": "10 GB de almacenamiento",
          "2": "Soporte de la comunidad",
          "3": "Informes semanales"
        }
      },
      enterprise: {
        name: "Empresa",
        price: "99 €",
        description: "Controles avanzados y soporte para organizaciones en crecimiento.",
        cta: "Contactar con ventas",
        features: {
          "0": "Miembros del equipo ilimitados",
          "1": "1 TB de almacenamiento",
          "2": "Soporte prioritario",
          "3": "Integraciones personalizadas",
          "4": "Registro de auditoría y SSO"
        }
      }
    },
    team: {
      title: "Conoce al equipo",
      subtitle: "Las personas que construyen el producto.",
      mark: {
        role: "Fundador y CTO",
        bio: {
          "0": "Mark dirige producto e ingeniería, centrado en una articulación de marca fundamentada y verificable.",
          "1": "Anteriormente construyó plataformas agénticas y le importa profundamente la experiencia de desarrollo."
        }
      }
    },
    heroInsights: {
      scoreTitle: "Preparación de respuestas",
      scoreValue: "92",
      cards: {
        "0": {
          title: "Citas fundamentadas",
          desc: "Cada respuesta enlaza con tu contenido real."
        },
        "1": {
          title: "Coherente en todas partes",
          desc: "La misma articulación en cada superficie."
        },
        "2": {
          title: "Siempre actualizado",
          desc: "Las actualizaciones fluyen a medida que cambia tu contenido."
        }
      }
    }
  },
} as const;
