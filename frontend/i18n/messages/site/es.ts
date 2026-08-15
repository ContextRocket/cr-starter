/**
 * Site (@content-owners) i18n slice — public marketing / legal surfaces:
 * home, blog, faq, footer, impressum, privacy, preview. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Auto-partitioned from the original es.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const siteEs = {
  home: {
    subtitle: "Crea productos con ContextRocket. Autenticación, estructura de panel y seguridad de tipos basada en OpenAPI incluidas. El estado de conversación y las ejecuciones de agente se delegan a ContextRocket vía A2A.",
    cta: "Ir al panel",
    hero: {
      insights: {
        scoreTitle: "Preparación de respuestas",
        scoreValue: "92",
        thinTitle: "Citas fundamentadas",
        thinDesc: "Cada respuesta enlaza con tu contenido real.",
        bioTitle: "Coherente en todas partes",
        bioDesc: "La misma articulación en cada superficie.",
        multiTitle: "Siempre actualizado",
        multiDesc: "Las actualizaciones fluyen a medida que cambia tu contenido."
      }
    },
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
    testimonials: {
      eyebrow: "Testimonios",
      title: "Lo que dicen nuestros clientes",
      subtitle: "Resultados reales de equipos que construyen sobre la plataforma.",
      regionLabel: "Testimonios de clientes",
      ratingLabel: "Valorado con {rating} de 5"
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
  blog: {
    title: "Blog",
    subtitle: "Artículos, guías y novedades del producto.",
    description: "Artículos, guías y novedades.",
    featured: "Destacado",
    all_posts: "Todas las publicaciones",
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
  faq: {
    page: {
      title: "Preguntas frecuentes",
      description: "Respuestas a preguntas comunes sobre este sitio, el agente de chat, el tratamiento de datos y la personalización."
    },
    back: {
      home: "Volver al inicio"
    }
  },
  footer: {
    powered_by: "Desarrollado por",
    impressum: "Impressum",
    privacy: "Política de privacidad",
    faq: "Preguntas frecuentes",
    attribution: "Atribución"
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
    },
    attribution: {
      title: "Créditos y atribuciones",
      subtitle: "Las tipografías, los iconos y las bibliotecas de código abierto que impulsan esta plantilla."
    },
    status: {
      confirmed: {
        title: "Suscripción confirmada",
        message: "Tu correo está verificado. Ya está todo listo para recibir novedades.",
        action: "Volver al inicio"
      },
      unsubscribed: {
        title: "Te has dado de baja",
        message: "No recibirás más correos de esta lista. Puedes volver a suscribirte cuando quieras.",
        action: "Regresar al inicio"
      }
    },
    surface: {
      terminal: {
        heading: "Superficie de terminal",
        body: "Esta página se renderiza en la superficie interior: una tipografía monoespaciada y esquinas rectas, conmutada por grupo de rutas desde la misma base de tokens que las páginas de marketing.",
        cardTitle: "Mismos tokens, otra superficie",
        cardDescription: "Solo cambian la fuente activa y el radio de las esquinas; los colores y la semántica se comparten.",
        action: "Acción principal"
      }
    }
  },
  attribution: {
    title: "Créditos y atribuciones",
    subtitle: "Las imágenes y el software de código abierto que impulsan este sitio.",
    description:
      "Este sitio se ha creado con software de código abierto e imágenes alojadas por nosotros. A continuación acreditamos cada fuente.",
    images: "Imágenes",
    photo_by: "Foto de",
    on: "en",
    view_original: "Ver original",
    libraries: "Bibliotecas de código abierto",
    license: "Licencia",
    no_images: "No se enumeran créditos de imágenes.",
    no_libraries: "No se enumeran créditos de bibliotecas.",
    general_note: "Fotografía adicional proporcionada por",
    license_note:
      "Las imágenes se usan bajo la Licencia de Unsplash. Las bibliotecas se usan bajo sus respectivas licencias de código abierto."
  },
} as const;
