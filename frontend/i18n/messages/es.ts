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
  // ── Locale labels ─────────────────────────────────────────────────────────
  locale: {
    labelEnglish: "Inglés",
    labelSpanish: "Español",
    labelGerman: "Alemán",
    changeLanguage: "Cambiar idioma",
  },

  // ── Home / landing ────────────────────────────────────────────────────────
  HOME_SUBTITLE:
    "Crea productos con ContextRocket. Autenticación, estructura de panel y seguridad de tipos basada en OpenAPI incluidas. El estado de conversación y las ejecuciones de agente se delegan a ContextRocket vía A2A.",
  HOME_CTA: "Ir al panel",

  // ── Home: sección del widget embebible ───────────────────────────────────
  HOME_WIDGET_SECTION_TITLE: "Añade el agente a cualquier sitio web",
  HOME_WIDGET_SECTION_BODY:
    "Un script tag añade un botón de chat flotante a cualquier página. El botón abre un iframe respaldado por tu agente de ContextRocket, sin React, sin bundler ni cambios en el servidor del sitio anfitrión. El botón flotante de esta página es el mismo componente; incrústalo en otros sitios con el fragmento de código siguiente.",
  HOME_WIDGET_SNIPPET_NOTE:
    "Copia el fragmento, reemplaza la URL del agente y añádelo antes de </body>.",

  // ── Auth: login ───────────────────────────────────────────────────────────
  AUTH_LOGIN_TITLE: "Iniciar sesión",
  AUTH_LOGIN_DESCRIPTION:
    "Introduce tu correo electrónico para acceder a tu cuenta.",
  AUTH_LOGIN_SUBMIT: "Entrar",
  AUTH_LOGIN_NO_ACCOUNT: "¿No tienes cuenta?",
  AUTH_LOGIN_SIGN_UP: "Registrarse",
  AUTH_FORGOT_PASSWORD: "¿Has olvidado tu contraseña?",

  // ── Auth: register ────────────────────────────────────────────────────────
  AUTH_REGISTER_TITLE: "Crear cuenta",
  AUTH_REGISTER_DESCRIPTION:
    "Introduce tu correo electrónico y contraseña para crear tu cuenta.",
  AUTH_REGISTER_SUBMIT: "Crear cuenta",
  AUTH_REGISTER_BACK: "Volver al inicio de sesión",

  // ── Auth: password recovery ───────────────────────────────────────────────
  AUTH_PASSWORD_RECOVERY_TITLE: "Recuperar contraseña",
  AUTH_PASSWORD_RECOVERY_DESCRIPTION:
    "Introduce tu correo electrónico para recibir instrucciones para restablecer tu contraseña.",
  AUTH_PASSWORD_RECOVERY_SUBMIT: "Enviar",
  AUTH_PASSWORD_RECOVERY_BACK: "Volver al inicio de sesión",
  AUTH_PASSWORD_RESET_TITLE: "Restablecer contraseña",
  AUTH_PASSWORD_RESET_DESCRIPTION:
    "Introduce la nueva contraseña y confírmala.",
  AUTH_PASSWORD_RESET_SUBMIT: "Enviar",
  AUTH_PASSWORD_RESET_LOADING: "Cargando formulario de restablecimiento...",
  AUTH_PASSWORD_RESET_SUCCESS:
    "Instrucciones para restablecer la contraseña enviadas a tu correo.",

  // ── Form labels (shared) ──────────────────────────────────────────────────
  FORM_EMAIL: "Correo electrónico",
  FORM_PASSWORD: "Contraseña",
  FORM_PASSWORD_CONFIRM: "Confirmar contraseña",
  FORM_USERNAME: "Nombre de usuario",
  FORM_PLACEHOLDER_EMAIL: "m@example.com",

  // ── Validation messages ───────────────────────────────────────────────────
  FORM_VALIDATION_PASSWORD_MIN:
    "La contraseña debe tener al menos 8 caracteres.",
  FORM_VALIDATION_PASSWORD_UPPERCASE:
    "La contraseña debe contener al menos una letra mayúscula.",
  FORM_VALIDATION_PASSWORD_SPECIAL:
    "La contraseña debe contener al menos un carácter especial.",
  FORM_VALIDATION_PASSWORDS_MATCH: "Las contraseñas deben coincidir.",
  FORM_VALIDATION_TOKEN_REQUIRED: "El token es obligatorio",
  FORM_VALIDATION_EMAIL_INVALID: "Dirección de correo electrónico no válida",
  FORM_VALIDATION_PASSWORD_REQUIRED: "La contraseña es obligatoria",
  FORM_VALIDATION_USERNAME_REQUIRED: "El nombre de usuario es obligatorio",

  // ── Navigation / breadcrumbs ──────────────────────────────────────────────
  NAV_DASHBOARD: "Panel",
  NAV_LOGOUT: "Cerrar sesión",

  // ── Dashboard (landing when logged in) ────────────────────────────────────
  NAV_WELCOME: "Bienvenido a tu panel",
  DASHBOARD_TITLE: "Panel",
  DASHBOARD_SUBTITLE:
    "Tu espacio de trabajo con ContextRocket. Configura tu aplicación y conéctate a ContextRocket para ejecuciones de agente, estado de conversación y gestión del conocimiento.",
  // Cards
  DASHBOARD_CARD_CHAT_TITLE: "Continuar el chat",
  DASHBOARD_CARD_CHAT_DESCRIPTION:
    "Tu historial de conversación está guardado. Retoma donde lo dejaste.",
  DASHBOARD_CARD_CHAT_ACTION: "Abrir chat",
  DASHBOARD_CARD_PROFILE_TITLE: "Perfil y ajustes",
  DASHBOARD_CARD_PROFILE_DESCRIPTION:
    "Actualiza tu correo, contraseña o preferencia de idioma.",
  DASHBOARD_CARD_PROFILE_ACTION: "Editar perfil",
  DASHBOARD_CARD_USERS_TITLE: "Usuarios",
  DASHBOARD_CARD_USERS_DESCRIPTION:
    "Revisa cuentas registradas y sesiones de invitado.",
  DASHBOARD_CARD_USERS_ACTION: "Ver usuarios",
  // Guest dashboard prompt
  DASHBOARD_GUEST_PROMPT_TITLE: "Guarda tu conversación",
  DASHBOARD_GUEST_PROMPT_DESCRIPTION:
    "Crea una cuenta gratuita para conservar tu historial de chat. Tu conversación actual continuará de todos modos.",
  DASHBOARD_GUEST_PROMPT_ACTION: "Crear cuenta",

  // ── Dashboard: users list (operator only) ─────────────────────────────────
  DASHBOARD_USERS_TITLE: "Usuarios",
  DASHBOARD_USERS_DESCRIPTION: "Todas las cuentas registradas y de invitado.",
  DASHBOARD_USERS_COL_EMAIL: "Correo electrónico",
  DASHBOARD_USERS_COL_TYPE: "Tipo",
  DASHBOARD_USERS_COL_STATUS: "Estado",
  DASHBOARD_USERS_TYPE_GUEST: "Invitado",
  DASHBOARD_USERS_TYPE_REGISTERED: "Registrado",
  DASHBOARD_USERS_STATUS_ACTIVE: "Activo",
  DASHBOARD_USERS_STATUS_INACTIVE: "Inactivo",
  DASHBOARD_USERS_FORBIDDEN: "Esta página es solo para operadores.",

  // ── Dashboard: profile ────────────────────────────────────────────────────
  DASHBOARD_PROFILE_TITLE: "Perfil y ajustes",

  // ── Error pages ───────────────────────────────────────────────────────────
  ERROR_GENERIC: "Algo salió mal. Por favor, inténtalo de nuevo.",
  ERROR_DASHBOARD: "Algo salió mal al cargar esta página.",
  ERROR_TRY_AGAIN: "Intentar de nuevo",
  ERROR_UNEXPECTED:
    "Ocurrió un error inesperado. Por favor, inténtalo más tarde.",
  ERROR_NETWORK: "Error de red",
  ERROR_NO_TOKEN: "No se encontró el token de acceso",
  ERROR_NO_DATA: "El servidor no devolvió datos",
  ERROR_UNKNOWN: "Error desconocido",

  // ── Backend error keys ────────────────────────────────────────────────────
  ERROR_INTERNAL: "Error interno del servidor",

  // ── Footer ────────────────────────────────────────────────────────────────
  FOOTER_IMPRESSUM: "Impressum",
  FOOTER_PRIVACY: "Política de privacidad",

  // ── Legal pages ───────────────────────────────────────────────────────────
  IMPRESSUM_TITLE: "Impressum",
  IMPRESSUM_LEGAL_NOTICE: "Aviso legal",
  IMPRESSUM_ENTITY_LABEL: "Entidad",
  IMPRESSUM_ADDRESS_LABEL: "Dirección",
  IMPRESSUM_REGISTER_LABEL: "Registro mercantil",
  IMPRESSUM_VAT_LABEL: "NIF/CIF",
  IMPRESSUM_REPRESENTED_BY_LABEL: "Representado por",
  IMPRESSUM_CONTACT_LABEL: "Contacto",
  IMPRESSUM_DISCLAIMER:
    "Este Impressum es legalmente obligatorio para sitios web comerciales en Alemania y la Unión Europea. Todos los valores de ejemplo deben reemplazarse antes de publicar el sitio.",
  PRIVACY_TITLE: "Política de privacidad",
  PRIVACY_CONTACT_LABEL: "Contacto de privacidad",
  PRIVACY_PLACEHOLDER:
    "Esta es una política de privacidad provisional. Reemplaza esta página con tu declaración de privacidad completa y conforme a la ley antes de publicar el sitio.",

  // ── Política de privacidad (secciones generadas) ──────────────────────────
  PRIVACY_GENERATED_NOTICE:
    "Generada desde site.config. Revísala con asesoría legal antes de publicar.",
  PRIVACY_INTRO:
    "Esta política de privacidad explica cómo recopilamos, usamos y protegemos tus datos personales cuando utilizas este sitio web. Es un punto de partida generado a partir de la configuración del sitio y debe ser revisado por asesoría legal cualificada antes de publicar el sitio.",
  PRIVACY_CONTROLLER_HEADING: "Responsable del tratamiento",
  PRIVACY_CONTROLLER_INTRO:
    "La entidad responsable del tratamiento de tus datos personales (el responsable en el sentido del RGPD) es:",
  PRIVACY_CONTACT_INTRO:
    "Para preguntas sobre tus datos personales o para ejercer tus derechos, contacta con nuestro equipo de privacidad:",
  PRIVACY_DATA_HEADING: "Datos que tratamos",
  PRIVACY_DATA_AUTH_HEADING: "Datos de cuenta y autenticación",
  PRIVACY_DATA_AUTH_BODY:
    "Cuando te registras o inicias sesión, tratamos tu dirección de correo electrónico, una contraseña cifrada y tu idioma preferido. Estos datos son necesarios para proporcionar y proteger tu cuenta. Base legal: ejecución de un contrato (art. 6.1.b RGPD).",
  PRIVACY_DATA_COOKIES_HEADING: "Cookies estrictamente necesarias",
  PRIVACY_DATA_COOKIES_BODY:
    "Utilizamos cookies y almacenamiento del navegador técnicamente necesarios para mantenerte conectado (sesión de autenticación), recordar tu preferencia de idioma (cookie de configuración regional) y guardar tu elección de consentimiento de cookies. Estas son imprescindibles para el funcionamiento del sitio y no requieren tu consentimiento.",
  PRIVACY_ANALYTICS_HEADING: "Analítica",
  PRIVACY_ANALYTICS_BODY:
    "Este sitio utiliza analítica para comprender cómo los visitantes interactúan con el servicio. Los scripts de analítica solo se cargan una vez que otorgas tu consentimiento a través del banner de cookies. Puedes retirar tu consentimiento en cualquier momento haciendo clic en el enlace de política de privacidad del pie de página y usando la opción de restablecer el consentimiento. Base legal: consentimiento (art. 6.1.a RGPD).",
  PRIVACY_ANALYTICS_GA_LABEL: "Google Analytics 4 (Google LLC)",
  PRIVACY_ANALYTICS_POSTHOG_LABEL: "PostHog (PostHog Inc.)",
  PRIVACY_ANALYTICS_PROVIDERS_INTRO:
    "Los siguientes proveedores de analítica están configurados en este sitio:",
  PRIVACY_CONSENT_HEADING: "Consentimiento de cookies y revocación",
  PRIVACY_CONSENT_BODY:
    "En tu primera visita, un banner de cookies solicita tu consentimiento para las cookies analíticas. Puedes aceptar o rechazar. Tu elección se almacena en tu navegador. Para cambiar tu elección o retirar el consentimiento, borra el valor almacenado bajo la clave",
  PRIVACY_CONSENT_BODY_AFTER_KEY: "en el almacenamiento local de tu navegador.",
  PRIVACY_RIGHTS_HEADING: "Tus derechos",
  PRIVACY_RIGHTS_INTRO:
    "En virtud del RGPD tienes los siguientes derechos sobre tus datos personales:",
  PRIVACY_RIGHTS_ACCESS: "Derecho de acceso (art. 15 RGPD)",
  PRIVACY_RIGHTS_RECTIFICATION: "Derecho de rectificación (art. 16 RGPD)",
  PRIVACY_RIGHTS_ERASURE: "Derecho de supresión (art. 17 RGPD)",
  PRIVACY_RIGHTS_PORTABILITY:
    "Derecho a la portabilidad de datos (art. 20 RGPD)",
  PRIVACY_RIGHTS_COMPLAINT:
    "Derecho a presentar una reclamación ante una autoridad de control (art. 77 RGPD)",
  PRIVACY_RIGHTS_OUTRO:
    "Para ejercer tus derechos, contacta con la dirección de privacidad indicada más arriba.",

  // ── Pagination ────────────────────────────────────────────────────────────
  PAGINATION_ITEMS_PER_PAGE: "Elementos por página:",
  PAGINATION_NO_RESULTS: "0 resultados",

  // ── Chat ──────────────────────────────────────────────────────────────────
  CHAT_PLACEHOLDER: "Pregunta lo que quieras...",
  CHAT_PLACEHOLDER_STREAMING: "Pensando...",
  CHAT_THINKING: "Pensando",
  CHAT_SLOW_RESPONSE_TITLE: "Aún procesando...",
  CHAT_SLOW_RESPONSE_HINT: "Esto está tardando un poco más de lo habitual.",
  CHAT_VERY_SLOW_RESPONSE_HINT:
    "Aún procesando. Las preguntas complejas requieren más tiempo.",
  CHAT_SEND: "Enviar",
  CHAT_STOP: "Detener",
  CHAT_EMPTY_TITLE: "¿En qué puedo ayudarte?",
  CHAT_EMPTY_SUBTITLE: "Escribe una pregunta para empezar.",
  CHAT_COPY: "Copiar",
  CHAT_COPIED: "Copiado",
  CHAT_SOURCES: "Fuentes",
  CHAT_SCROLL_TO_BOTTOM: "Ir al final",
  CHAT_CLEAR: "Borrar chat",
  CHAT_OPEN: "Abrir chat",
  CHAT_CLOSE: "Cerrar chat",
  CHAT_EXPAND: "Ampliar a pantalla completa",
  CHAT_COLLAPSE: "Reducir al panel",
  CHAT_CONNECT_REQUIRED_TITLE: "Conecta ContextRocket",
  CHAT_CONNECT_REQUIRED_BODY:
    "Establece NEXT_PUBLIC_CR_AGENT_URL para activar el agente de IA.",
  ACCESSIBILITY_TYPING: "El asistente está escribiendo",

  // ── Chat: tipografía de burbuja ───────────────────────────────────────────
  CHAT_MORE_DETAIL: "Más detalles",
  CHAT_LESS_DETAIL: "Menos detalles",

  // ── Chat: sugerencias ─────────────────────────────────────────────────────
  CHAT_SUGGESTIONS_LABEL: "Sugerencias de seguimiento",

  // ── Chat: ficha de fuentes ────────────────────────────────────────────────
  CHAT_SOURCE_SHEET_TITLE: "Fuentes",
  CHAT_SOURCE_SHEET_OPEN: "Abrir fuente",
  CHAT_SOURCE_SHEET_OPEN_NEW_TAB: "Abrir en nueva pestaña",
  CHAT_SOURCE_CITED_SECTION: "Sección citada",
  CHAT_SOURCE_PUBLISHER: "Editor",
  CHAT_SOURCE_DATE: "Fecha",
  CHAT_SOURCE_LICENSE: "Licencia",

  // ── Chat: tarjeta de clase de política ────────────────────────────────────
  CHAT_POLICY_CARD_SOURCE: "Fuente",

  // ── Chat: aviso de conversión ─────────────────────────────────────────────
  CHAT_NUDGE_TITLE: "Guarda tu conversación",
  CHAT_NUDGE_BODY:
    "Crea una cuenta gratuita para conservar todo tu historial de chat. Tu conversación actual continuará de todos modos.",
  CHAT_NUDGE_ACTION: "Crear cuenta",
  CHAT_NUDGE_DISMISS: "Descartar",

  // ── Chat: vista previa de enlace ──────────────────────────────────────────
  CHAT_LINK_PREVIEW_TITLE: "Vista previa del enlace",
  CHAT_LINK_PREVIEW_OPEN: "Abrir en nueva pestaña",

  // ── Cookie consent ────────────────────────────────────────────────────────
  COOKIE_CONSENT_ARIA_LABEL: "Consentimiento de cookies",
  COOKIE_CONSENT_TITLE: "Este sitio utiliza cookies",
  COOKIE_CONSENT_BODY:
    "Usamos cookies analíticas para mejorar tu experiencia. Consulta nuestra",
  COOKIE_CONSENT_POLICY_LINK: "Política de privacidad",
  COOKIE_CONSENT_ACCEPT: "Aceptar",
  COOKIE_CONSENT_DECLINE: "Rechazar",
} as const;
