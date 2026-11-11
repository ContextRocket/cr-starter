/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * Spanish translations for shared starter UI.
 */

import type { sharedEn } from "./en";
import type { LocaleMessages } from "../en";

export const sharedEs: LocaleMessages<typeof sharedEn> = {
  form: {
    email: "Correo electrónico",
    placeholder: {
      email: "m@example.com",
    },
    validation: {
      email: {
        invalid: "Dirección de correo electrónico no válida",
      },
    },
  },
  nav: {
    blog: "Blog",
    contact: "Contacto",
    skipToContent: "Saltar al contenido",
    features: "Funciones",
    about: "Acerca de",
    pricing: "Precios",
    aria: {
      primary: "Principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
  },
  attribution: {
    poweredBy: "Con tecnología de",
  },
  contact: {
    title: "Inicia una conversación",
    introduction: "Cuéntanos brevemente en qué estás trabajando.",
    directEmail: "¿Prefieres el correo electrónico?",
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    intent: "¿En qué podemos ayudarte?",
    intentContact: "Consulta general",
    intentDemo: "Solicitar una demostración",
    intentAppointment: "Concertar una conversación",
    intentSupport: "Soporte",
    message: "¿Cómo podemos ayudarte?",
    consent: "Acepto que contacten conmigo sobre esta solicitud.",
    submit: "Enviar mensaje",
    sending: "Enviando…",
    demoResult: "Demostración completada. No se envió ni guardó información.",
    success: "Gracias. Hemos recibido tu mensaje.",
    failure: "No hemos podido enviar tu mensaje. Inténtalo de nuevo.",
    liveUnavailable: "La captura de contactos no está configurada en este sitio.",
    javascriptRequired: "Activa JavaScript para enviar este mensaje de forma segura.",
    required: "Completa los campos obligatorios y acepta el consentimiento.",
  },
  notifications: {
    region: "Notificaciones del sitio",
    dismiss: "Descartar notificación",
    example: {
      info: {
        message: "Acabamos de lanzar una nueva función.",
        action: "Leer la novedad",
      },
      warning: {
        message: "Mantenimiento programado este fin de semana.",
      },
    },
  },
  error: {
    generic: {
      title: "Algo ha salido mal",
      description: "Algo ha salido mal. Por favor, inténtalo de nuevo.",
      action: "Intentar de nuevo",
    },
    try: {
      again: "Intentar de nuevo",
    },
    unexpected:
      "Se ha producido un error inesperado. Por favor, inténtalo más tarde.",
    network: "Error de red",
    no: {
      data: "El servidor no devolvió datos",
    },
    unknown: "Error desconocido",
    internal: "Error interno del servidor",
    notFound: {
      title: "Página no encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      action: "Volver al inicio",
    },
  },
  locale: {
    labelEnglish: "Inglés",
    labelSpanish: "Español",
    labelGerman: "Alemán",
    labelChinese: "Chino",
    changeLanguage: "Cambiar idioma",
  },
  breadcrumb: {
    home: "Inicio",
  },
  pagination: {
    items: {
      per: {
        page: "Elementos por página:",
      },
    },
    no: {
      results: "0 resultados",
    },
  },
  cookie: {
    consent: {
      aria: {
        label: "Consentimiento de cookies",
      },
      title: "Preferencias de cookies",
      body: "Este sitio utiliza cookies opcionales.",
      policy: {
        link: "Política de privacidad",
      },
      accept: "Aceptar",
      decline: "Rechazar",
      manage: "Gestionar preferencias",
      prefs: {
        description:
          "Elige qué cookies podemos usar. Puedes cambiar tu elección en cualquier momento.",
        save: "Guardar preferencias",
        title: "Preferencias de cookies",
        close: "Cerrar",
        category: {
          necessary: {
            label: "Estrictamente necesarias",
            description:
              "Necesarias para que el sitio funcione. No se pueden desactivar.",
          },
          functional: {
            label: "Funcionales",
            description:
              "Recuerdan preferencias opcionales, como tu idioma o tus opciones de interfaz.",
          },
          analytics: {
            label: "Analíticas",
            description:
              "Nos ayudan a entender cómo se usa el sitio para poder mejorarlo.",
          },
          marketing: {
            label: "Marketing",
            description:
              "Se usan para personalizar contenido y medir campañas de marketing.",
          },
        },
      },
    },
  },
} as const;
