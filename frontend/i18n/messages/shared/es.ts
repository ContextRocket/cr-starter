/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * Auto-partitioned from the original es.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source -- do not retype legal/marketing strings.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { sharedEn } from "./en";
import type { LocaleMessages } from "../en";

export const sharedEs: LocaleMessages<typeof sharedEn> = {
  form: {
    email: "Correo electrónico",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      email: {
        invalid: "Dirección de correo electrónico no válida"
      }
    }
  },
  nav: {
    blog: "Blog",
    features: "Funciones",
    about: "Acerca de",
    pricing: "Precios",
    aria: {
      primary: "Principal"
    }
  },
  theme: {
    toggle: "Cambiar tema",
    light: "Claro",
    dark: "Oscuro"
  },
  notifications: {
    region: "Notificaciones del sitio",
    dismiss: "Descartar notificación",
    example: {
      info: {
        message: "Acabamos de lanzar una nueva función.",
        action: "Leer la novedad"
      },
      warning: {
        message: "Mantenimiento programado este fin de semana."
      }
    }
  },
  error: {
    generic: "Algo ha salido mal. Por favor, inténtalo de nuevo.",
    try: {
      again: "Intentar de nuevo"
    },
    unexpected:
      "Se ha producido un error inesperado. Por favor, inténtalo más tarde.",
    network: "Error de red",
    no: {
      data: "El servidor no devolvió datos"
    },
    unknown: "Error desconocido",
    internal: "Error interno del servidor",
    notFound: {
      title: "Página no encontrada",
      description: "La página que buscas no existe o ha sido movida.",
      action: "Volver al inicio"
    }
  },
  locale: {
    labelEnglish: "Inglés",
    labelSpanish: "Español",
    labelGerman: "Alemán",
    labelChinese: "Chino",
    changeLanguage: "Cambiar idioma"
  },
  breadcrumb: {
    home: "Inicio"
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
  gallery: {
    title: "Galería de imágenes",
    subtitle: "Explora las imágenes por colección.",
    filter: "Filtrar por colección",
    all: "Todas las imágenes",
    imageCount: "{count} imágenes",
    noImages: "Ninguna imagen coincide con este filtro.",
    viewImage: "Ver imagen: {alt}",
    close: "Cerrar imagen",
    previous: "Imagen anterior",
    next: "Imagen siguiente",
    counter: "{current} de {total}"
  },
  legal: {
    identity: {
      // Empresa (entidad registrada).
      entity: "Entidad",
      legalForm: "Forma jurídica",
      address: "Dirección",
      register: "Registro mercantil",
      vat: "NIF/IVA",
      representedBy: "Representada por",
      pendingRegistration: "Registro pendiente",
      // Persona física.
      responsiblePerson: "Persona responsable",
      // No registrada (nombre comercial + persona responsable).
      tradingName: "Nombre comercial",
      notRegisteredCompany: "No es una empresa registrada.",
      // Fila de contacto compartida.
      contact: "Contacto"
    }
  },
  cookie: {
    consent: {
      aria: {
        label: "Consentimiento de cookies"
      },
      title: "Este sitio utiliza cookies",
      body: "Usamos cookies analíticas. Consulta nuestra",
      policy: {
        link: "Política de privacidad"
      },
      accept: "Aceptar todo",
      decline: "Rechazar todo",
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
              "Necesarias para que el sitio funcione. No se pueden desactivar."
          },
          functional: {
            label: "Funcionales",
            description:
              "Recuerdan preferencias opcionales, como tu idioma o tus opciones de interfaz."
          },
          analytics: {
            label: "Analíticas",
            description:
              "Nos ayudan a entender cómo se usa el sitio para poder mejorarlo."
          },
          marketing: {
            label: "Marketing",
            description:
              "Se usan para personalizar contenido y medir campañas de marketing."
          }
        }
      }
    }
  }
} as const;
