/**
 * Shared (@eng) i18n slice — cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Strict tri-locale parity (all keys in
 * all 3 locales).
 *
 * Auto-partitioned from the original es.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const sharedEs = {
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
    dashboard: "Panel de control",
    blog: "Blog",
    login: "Iniciar sesión",
    signup: "Registrarse",
    logout: "Cerrar sesión",
    welcome: "Bienvenido a tu panel de control",
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
  locale: {
    labelEnglish: "Inglés",
    labelSpanish: "Español",
    labelGerman: "Alemán",
    changeLanguage: "Cambiar idioma",
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
      accept: "Aceptar",
      decline: "Rechazar",
      manage: "Gestionar preferencias",
      prefs: {
        description:
          "Elige qué cookies podemos usar. Puedes cambiar tu elección en cualquier momento.",
        save: "Guardar preferencias",
        category: {
          necessary: {
            label: "Estrictamente necesarias",
            description:
              "Necesarias para que el sitio funcione. No se pueden desactivar."
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
  },
} as const;
