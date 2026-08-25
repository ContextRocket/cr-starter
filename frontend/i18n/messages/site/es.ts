/**
 * Site (@content-owners) i18n slice -- public marketing / legal surfaces:
 * home, blog, faq, footer, impressum, privacy, preview. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { siteEn } from "./en";
import type { LocaleMessages } from "../en";

export const siteEs: LocaleMessages<typeof siteEn> = {
  home: {
    subtitle:
      "Un punto de partida flexible para un sitio web claro y fácil de mantener.",
    hero: {
      insights: {
        scoreTitle: "Ejemplo de insight",
        scoreValue: "Ejemplo",
        thinTitle: "Citas fundamentadas",
        thinDesc: "Cada respuesta enlaza con tu contenido real.",
        bioTitle: "Coherente en todas partes",
        bioDesc: "La misma articulación en cada superficie.",
        multiTitle: "Siempre actualizado",
        multiDesc:
          "Las actualizaciones fluyen a medida que cambia tu contenido.",
      },
      headline: "Tu propuesta de valor en una línea.",
      subhead:
        "Una oración de apoyo que explica para quién es y por qué importa.",
      primaryCta: "Empezar",
      secondaryCta: "Saber más",
    },
    features: {
      label: "Características",
      title: "Todo lo que necesitas",
      subtitle: "Una breve descripción de la sección.",
      item1: {
        title: "Característica uno",
        description: "Qué hace y por qué ayuda.",
      },
      item2: {
        title: "Característica dos",
        description: "Qué hace y por qué ayuda.",
      },
      item3: {
        title: "Característica tres",
        description: "Qué hace y por qué ayuda.",
      },
    },
    stats: {
      output: "Métrica de ejemplo",
      integrations: "Integraciones",
      uptime: "Disponibilidad",
    },
    faq: {
      title: "Preguntas frecuentes",
      item1: {
        question: "¿Qué es esto?",
        answer: "Una respuesta breve y clara.",
      },
      item2: {
        question: "¿Para quién es?",
        answer: "Una respuesta breve y clara.",
      },
    },
    cta: {
      title: "¿Listo para empezar?",
      subtitle: "Un breve empujón hacia la acción principal.",
      button: "Empezar",
    },
    carousel: {
      alt1: "Visualización de cerebro IA",
      alt2: "Manos de robot IA",
      alt3: "Configuración de programación",
      title: "Una primera impresión clara",
      description:
        "Usa este espacio para presentar la idea, el servicio o la historia de tu sitio.",
      title2: "Espacio para los detalles",
      description2:
        "Añade aquí otro punto de vista, un ejemplo útil o una explicación breve.",
      title3: "Listo para hacerlo tuyo",
      description3:
        "Sustituye estos ejemplos por las imágenes y palabras de tu proyecto.",
    },
    valueProps: {
      title: "Una base flexible",
      subtitle:
        "Empieza con unas pocas secciones y crece cuando tu contenido esté preparado.",
      see: {
        title: "Hazlo claro",
        description:
          "Ofrece a los visitantes una forma sencilla de entender qué haces y cuál es el siguiente paso.",
      },
      fix: {
        title: "Da forma a los detalles",
        description:
          "Usa esta sección para un beneficio práctico, un ejemplo o un detalle importante.",
      },
      stay: {
        title: "Mantenlo sencillo",
        description:
          "Guarda el contenido en archivos simples y deja que los componentes compartidos repitan la estructura.",
      },
    },
    bento: {
      title: "Una base sólida",
      subtitle:
        "Unos pocos bloques reutilizables para un sitio que puede evolucionar con el tiempo.",
      context: {
        title: "Estructura clara",
        description:
          "Organiza las partes importantes de tu historia en un diseño que los visitantes puedan seguir.",
      },
      realtime: {
        title: "Interacciones sencillas",
        description:
          "Mantén la navegación, los formularios y las llamadas a la acción centrados en el siguiente paso útil.",
      },
      multi: {
        title: "Listo para crecer",
        description:
          "Añade páginas, idiomas e integraciones solo cuando el proyecto realmente los necesite.",
      },
      provenance: {
        title: "Fácil de mantener",
        description:
          "Mantén la configuración y el contenido cerca del proyecto para que las futuras ediciones sean comprensibles.",
      },
    },
    widget: {
      section: {
        title: "Añade el agente a cualquier sitio web",
        body: "Una etiqueta de script añade un widget de chat sin dependencias a cualquier página. El modo demo funciona sin conexión y el modo live conecta directamente con tu agente de ContextRocket, sin React, empaquetador ni backend anfitrión.",
      },
      snippet: {
        note: "Copia el fragmento, establece el handle de la organización y la clave API del sitio, y añádelo antes de </body>.",
      },
    },
    featured: {
      title: "Del blog",
      subtitle: "Artículos, notas y novedades de este sitio.",
      viewAll: "Ver todas las publicaciones",
    },
    testimonials: {
      eyebrow: "Testimonios",
      title: "Lo que dicen nuestros clientes",
      subtitle:
        "Resultados reales de equipos que construyen sobre la plataforma.",
      regionLabel: "Testimonios de clientes",
      ratingLabel: "Valorado con {rating} de 5",
    },
    integrations: {
      label: "Integraciones",
      title: "Conectado con las herramientas que importan",
      body1:
        "Se conecta con las herramientas que tu equipo ya usa, para que tus datos fluyan sin trabajo adicional.",
      body2:
        "Estas integraciones te permiten actuar sobre señales reales y mantener todo sincronizado.",
      cta: "Ver todas las integraciones",
    },
    subscribe: {
      title: "Mantente al día",
      subtitle:
        "Recibe novedades y consejos ocasionales de nuestro equipo. Sin spam.",
      placeholder: "tu@ejemplo.com",
      submit: "Suscribirse",
      consent: "Acepto recibir correos y acepto la",
      privacyLink: "política de privacidad",
      success: "Gracias, ya estás en la lista.",
      errors: {
        emailRequired: "Introduce tu correo electrónico.",
        emailInvalid: "Introduce una dirección de correo válida.",
        consentRequired: "Acepta la política de privacidad para continuar.",
        submitFailed: "Algo salió mal. Inténtalo de nuevo.",
      },
    },
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
        list: "Todas las publicaciones",
      },
    },
    not: {
      found: "Publicación no encontrada",
    },
    min: {
      read: "min de lectura",
    },
  },
  faq: {
    page: {
      title: "Preguntas frecuentes",
      description:
        "Respuestas a preguntas comunes sobre este sitio, el agente de chat, el tratamiento de datos y la personalización.",
    },
    back: {
      home: "Volver al inicio",
    },
  },
  footer: {
    powered_by: "Desarrollado por",
    impressum: "Impressum",
    privacy: "Política de privacidad",
    terms: "Términos",
    cookies: "Cookies",
    faq: "Preguntas frecuentes",
    attribution: "Atribución",
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Aviso legal",
    },
    entity: {
      label: "Entidad",
    },
    address: {
      label: "Dirección",
    },
    register: {
      label: "Registro mercantil",
    },
    vat: {
      label: "NIF/CIF",
    },
    represented: {
      by: {
        label: "Representado por",
      },
    },
    contact: {
      label: "Contacto",
    },
    disclaimer:
      "Este Impressum es legalmente obligatorio para sitios web comerciales en Alemania y la Unión Europea. Todos los valores de ejemplo deben reemplazarse antes de publicar el sitio.",
  },
  privacy: {
    title: "Política de privacidad",
    contact: {
      label: "Contacto de privacidad",
      intro:
        "Para preguntas sobre tus datos personales o para ejercer tus derechos, contacta con nuestro equipo de privacidad:",
    },
    placeholder:
      "Esta es una política de privacidad provisional. Reemplaza esta página con tu declaración de privacidad completa y conforme a la ley antes de publicar el sitio.",
    generated: {
      notice:
        "Generada desde site.config. Revísala con asesoría legal antes de publicar.",
    },
    intro:
      "Esta política de privacidad explica cómo recopilamos, usamos y protegemos tus datos personales cuando utilizas este sitio web. Es un punto de partida generado a partir de la configuración del sitio y debe ser revisado por asesoría legal cualificada antes de publicar el sitio.",
    controller: {
      heading: "Responsable del tratamiento",
      intro:
        "La entidad responsable del tratamiento de tus datos personales (el responsable en el sentido del RGPD) es:",
    },
    data: {
      heading: "Datos que tratamos",
      site: {
        heading: "Datos del sitio y de interacción",
        body: "Tratamos la información que eliges enviar mediante este sitio, junto con los datos técnicos necesarios para entregar las páginas y proteger el servicio. Revisa y adapta esta política antes de publicar tu sitio.",
      },
      cookies: {
        heading: "Cookies estrictamente necesarias",
        body: "Utilizamos cookies y almacenamiento del navegador técnicamente necesarios para recordar tu preferencia de idioma (cookie de configuración regional) y guardar tu elección de consentimiento. Son imprescindibles para el funcionamiento del sitio y no requieren tu consentimiento.",
      },
    },
    analytics: {
      heading: "Analítica",
      body: "Este sitio utiliza analítica para comprender cómo los visitantes interactúan con el servicio. Los scripts de analítica solo se cargan una vez que otorgas tu consentimiento a través del banner de cookies. Puedes retirar tu consentimiento en cualquier momento haciendo clic en el enlace de política de privacidad del pie de página y usando la opción de restablecer el consentimiento. Base legal: consentimiento (art. 6.1.a RGPD).",
      ga: {
        label: "Google Analytics 4 (Google LLC)",
      },
      posthog: {
        label: "PostHog (PostHog Inc.)",
      },
      providers: {
        intro:
          "Los siguientes proveedores de analítica están configurados en este sitio:",
      },
    },
    consent: {
      heading: "Consentimiento de cookies y revocación",
      body: "En tu primera visita, un banner de cookies solicita tu consentimiento para las cookies analíticas. Puedes aceptar o rechazar. Tu elección se almacena en tu navegador. Para cambiar tu elección o retirar el consentimiento, borra el valor almacenado bajo la clave",
      bodyAfterKey: "en el almacenamiento local de tu navegador.",
    },
    rights: {
      heading: "Tus derechos",
      intro:
        "En virtud del RGPD tienes los siguientes derechos sobre tus datos personales:",
      access: "Derecho de acceso (art. 15 RGPD)",
      rectification: "Derecho de rectificación (art. 16 RGPD)",
      erasure: "Derecho de supresión (art. 17 RGPD)",
      portability: "Derecho a la portabilidad de datos (art. 20 RGPD)",
      complaint:
        "Derecho a presentar una reclamación ante una autoridad de control (art. 77 RGPD)",
      outro:
        "Para ejercer tus derechos, contacta con la dirección de privacidad indicada más arriba.",
    },
  },
  terms: {
    title: "Términos del servicio",
    generated: {
      notice:
        "Generado desde site.config. Es una plantilla genérica, no asesoramiento legal. Revísala con asesoría legal antes de publicar.",
    },
    disclaimer:
      "Estos Términos son un punto de partida genérico con valores de identidad de ejemplo. Reemplaza los datos de la entidad en site.config y haz que los revise asesoría legal cualificada antes de publicar el sitio.",
    intro:
      "Estos Términos del servicio («Términos») regulan tu acceso y uso de este servicio. Léelos con atención. Al crear una cuenta o usar el servicio, aceptas estos Términos.",
    provider: {
      heading: "Quiénes somos",
      intro: "El servicio es prestado por:",
    },
    service: {
      heading: "El servicio",
      body: "Prestamos el servicio descrito en este sitio. Las funciones disponibles pueden depender de tu plan y configuración. Podemos mejorar, cambiar, añadir o eliminar funciones con el tiempo.",
    },
    acceptance: {
      heading: "Aceptación de estos Términos",
      body1:
        "Al registrarte, acceder o usar el servicio confirmas que has leído, comprendido y aceptas estos Términos y nuestra Política de privacidad. Si usas el servicio en nombre de una organización, confirmas que estás autorizado para vincularla, y «tú» incluye a esa organización. Si no estás de acuerdo, no uses el servicio.",
      body2:
        "Cuando sea necesario, la aceptación de estos Términos se registra como un acto separado y explícito respecto de tu confirmación de la Política de privacidad y de cualquier consentimiento de marketing, junto con la versión de los documentos que se te mostraron.",
    },
    accounts: {
      heading: "Cuentas y elegibilidad",
      body: "Debes facilitar información de cuenta veraz y mantenerla actualizada, proteger tus credenciales y responsabilizarte de toda la actividad de tu cuenta. Debes tener edad suficiente para celebrar un contrato vinculante en tu jurisdicción. Comunícanos de inmediato cualquier uso no autorizado.",
    },
    acceptableUse: {
      heading: "Uso aceptable",
      intro: "Te comprometes a no:",
      item: {
        unlawful: "usar el servicio de forma ilícita ni enviar spam;",
        rights:
          "subir o tratar contenido sobre el que no tengas derechos, ni vulnerar los derechos de terceros;",
        security:
          "intentar acceder sin autorización, interrumpir o sobrecargar el servicio o su infraestructura;",
        reverse:
          "aplicar ingeniería inversa, extraer datos ni eludir límites técnicos, salvo cuando la ley prohíba dicha restricción;",
        resell:
          "revender o proporcionar el servicio a terceros salvo autorización expresa.",
      },
      outro:
        "Podemos suspender o limitar el acceso para proteger el servicio, a nuestros usuarios o a terceros, o para cumplir la ley.",
    },
    ip: {
      heading: "Propiedad intelectual",
      body: "El servicio, incluidos su software, diseño y el contenido que proporcionamos (excluido tu contenido), es propiedad del prestador o de sus licenciantes y está protegido por las leyes de propiedad intelectual. Te concedemos un derecho limitado, no exclusivo, intransferible y revocable de uso del servicio conforme a estos Términos y tu plan. No se conceden otros derechos.",
    },
    content: {
      heading: "Tu contenido y su titularidad",
      body1:
        "Conservas la titularidad del contenido y los datos que envías («Tu contenido»). Nos concedes una licencia limitada para alojar, tratar, transmitir y mostrar Tu contenido con el único fin de prestar, proteger y mejorar el servicio para ti, y según lo descrito en la Política de privacidad.",
      body2:
        "Eres responsable de Tu contenido y de contar con los derechos y consentimientos necesarios para enviarlo y tratarlo. Tratamos los datos personales incluidos en Tu contenido según lo descrito en la Política de privacidad.",
    },
    thirdParty: {
      heading: "Servicios de terceros y resultados automatizados",
      body: "El servicio puede usar proveedores externos para prestar funciones. Cuando el servicio genere resultados automatizados o generados por IA, estos pueden ser inexactos, incompletos o inadecuados para un fin concreto; eres responsable de revisarlos antes de basarte en ellos o publicarlos. No garantizamos que los resultados estén libres de errores ni sean aptos para un fin particular.",
    },
    disclaimers: {
      heading: "Exenciones de responsabilidad",
      body: "En la máxima medida permitida por la ley, el servicio se presta «tal cual» y «según disponibilidad», sin garantías de ningún tipo, expresas o implícitas, incluidas la idoneidad para un fin concreto, la no infracción, la exactitud o la disponibilidad ininterrumpida. Nada en estos Términos excluye los derechos que te correspondan como consumidor y que no puedan renunciarse conforme a la ley aplicable.",
    },
    liability: {
      heading: "Limitación de responsabilidad",
      body: "En la máxima medida permitida por la ley, no somos responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de la pérdida de beneficios, ingresos, datos o fondo de comercio. Nada en estos Términos limita la responsabilidad que no pueda limitarse por ley, incluida la derivada de dolo, mala conducta intencionada, negligencia grave, muerte o lesiones causadas por negligencia, o los derechos imperativos del consumidor.",
    },
    fees: {
      heading: "Tarifas",
      body: "Cuando el servicio se ofrezca por una tarifa, las tarifas aplicables, las condiciones de facturación y los impuestos se presentan en el momento de la compra o en un pedido independiente antes de cualquier cargo. Salvo que se indique lo contrario, las tarifas ya cobradas no son reembolsables, excepto cuando la ley lo exija.",
    },
    termination: {
      heading: "Duración y resolución",
      body: "Estos Términos se aplican mientras uses el servicio. Puedes dejar de usar el servicio y cerrar tu cuenta en cualquier momento. Podemos suspender o resolver tu acceso por incumplimiento de estos Términos, por motivos legales o por la interrupción del servicio, con aviso razonable cuando sea posible. Tras la resolución, tu derecho de uso finaliza y tratamos los datos personales restantes según la Política de privacidad, con sujeción a las obligaciones legales de conservación.",
    },
    changes: {
      heading: "Cambios en estos Términos",
      body: "Podemos actualizar estos Términos. Cuando realicemos un cambio sustancial, publicaremos una nueva versión y, cuando proceda, te avisaremos. Cada versión está fechada; el uso continuado tras la entrada en vigor de un cambio implica que aceptas los Términos actualizados. Si no aceptas un cambio, deja de usar el servicio.",
    },
    governingLaw: {
      heading: "Legislación aplicable y jurisdicción",
      body: "Estos Términos se rigen por la legislación de la jurisdicción del prestador, sin perjuicio de las normas imperativas de protección al consumidor de tu país de residencia. Define la legislación aplicable y los tribunales competentes de tu entidad antes de publicar.",
    },
    miscellaneous: {
      heading: "Disposiciones varias",
      body: "Si alguna disposición de estos Términos resulta inaplicable, las demás seguirán en vigor. El hecho de no exigir el cumplimiento de una disposición no supone renuncia. No puedes ceder estos Términos sin nuestro consentimiento; nosotros podemos cederlos en el marco de una fusión, adquisición o venta de activos.",
    },
    contact: {
      heading: "Contacto",
      intro: "Preguntas sobre estos Términos:",
    },
  },
  cookies: {
    title: "Aviso de cookies",
    generated: {
      notice:
        "Generado desde site.config. Es una plantilla genérica, no asesoramiento legal. Revísala con asesoría legal antes de publicar.",
    },
    intro:
      "Este Aviso de cookies explica cómo este sitio utiliza cookies y almacenamiento similar en el dispositivo (conjuntamente, «cookies») y cómo puedes controlarlas. Complementa nuestra Política de privacidad.",
    what: {
      heading: "Qué son las cookies",
      body: "Las cookies son pequeños archivos o datos que se almacenan en tu dispositivo al visitar un sitio. Ayudan a que un sitio funcione, recuerde elecciones, entienda el uso o dé soporte al marketing.",
    },
    controls: {
      heading: "Tus controles de consentimiento",
      necessary:
        "Las cookies estrictamente necesarias funcionan sin consentimiento: son imprescindibles para que el sitio funcione.",
      optionalOff:
        "Las demás categorías están desactivadas por defecto. Las cookies funcionales, de analítica y de marketing solo se activan tras tu consentimiento previo y afirmativo.",
      noPreTicked:
        "Sin casillas premarcadas: las categorías opcionales nunca vienen preseleccionadas.",
      noWall:
        "Sin muro de cookies: puedes usar el sitio principal aceptes o no las cookies opcionales.",
      rejectEasy:
        "Rechazar es tan fácil como aceptar: el banner ofrece Aceptar, Rechazar y Gestionar ajustes con la misma relevancia.",
      withdraw:
        "Puedes cambiar o retirar tu elección en cualquier momento desde los ajustes de cookies.",
      reprompt:
        "Te volvemos a preguntar si cambia la versión de este aviso o caduca tu elección guardada.",
      proof:
        "Registramos la fecha y hora, la versión y tus elecciones por categoría para acreditar el cumplimiento.",
    },
    categories: {
      heading: "Categorías de cookies",
      necessary: {
        name: "Estrictamente necesarias",
        purpose:
          "Sesión, autenticación y seguridad, además de recordar tu elección de consentimiento de cookies. Necesarias para que el sitio funcione.",
        consent: "Siempre activas: no requieren consentimiento.",
      },
      functional: {
        name: "Funcionales",
        purpose:
          "Recordar preferencias opcionales, como tu idioma o tus opciones de interfaz.",
        consent: "Opcional: se activan solo tras el consentimiento.",
      },
      analytics: {
        name: "Analítica",
        purpose: "Entender cómo se usa el sitio para poder mejorarlo.",
        consent: "Opcional: se cargan solo tras el consentimiento.",
      },
      marketing: {
        name: "Marketing",
        purpose: "Medir y ofrecer marketing relevante.",
        consent: "Opcional: se cargan solo tras el consentimiento.",
      },
      analyticsActive:
        "La analítica está actualmente configurada en este sitio y se carga solo tras otorgar tu consentimiento.",
      analyticsInactive:
        "Actualmente no hay ningún proveedor de analítica o marketing configurado en este sitio, por lo que solo se utiliza almacenamiento estrictamente necesario. Cualquier proveedor añadido más adelante se cargará únicamente tras otorgar tu consentimiento.",
    },
    manage: {
      heading: "Gestionar tu elección",
      body: "En tu primera visita, un banner de cookies solicita tu consentimiento. Usa «Aceptar», «Rechazar» o «Gestionar ajustes» para definir tus elecciones por categoría. Puedes volver a abrir los controles de «Gestionar ajustes» del banner en cualquier momento para cambiar o retirar tu consentimiento.",
      storageIntro: "Tu elección se almacena en tu navegador bajo la clave",
      storageAfterKey: "; al borrarla, el banner volverá a mostrarse.",
    },
    browser: {
      heading: "Gestionar cookies en tu navegador",
      body: "También puedes bloquear o eliminar cookies desde los ajustes de tu navegador. Ten en cuenta que bloquear las cookies estrictamente necesarias puede impedir que partes del sitio funcionen.",
    },
    privacy: {
      heading: "Relación con la Política de privacidad",
      body: "Para más detalles sobre cómo tratamos los datos personales, incluidos los recabados mediante cookies, consulta nuestra",
      link: "Política de privacidad",
    },
    contact: {
      heading: "Contacto",
      intro: "Preguntas sobre las cookies:",
    },
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
          "3": "Informes semanales",
        },
      },
      enterprise: {
        name: "Empresa",
        price: "99 €",
        description:
          "Controles avanzados y soporte para organizaciones en crecimiento.",
        cta: "Contactar con ventas",
        features: {
          "0": "Miembros del equipo ilimitados",
          "1": "1 TB de almacenamiento",
          "2": "Soporte prioritario",
          "3": "Integraciones personalizadas",
          "4": "Registro de auditoría y SSO",
        },
      },
    },
    team: {
      title: "Conoce al equipo",
      subtitle: "Las personas que construyen el producto.",
      mark: {
        role: "Fundador y CTO",
        bio: {
          "0": "Mark dirige producto e ingeniería, centrado en una articulación de marca fundamentada y verificable.",
          "1": "Anteriormente construyó plataformas agénticas y le importa profundamente la experiencia de desarrollo.",
        },
      },
    },
    heroInsights: {
      scoreTitle: "Ejemplo de insight",
      scoreValue: "Ejemplo",
      cards: {
        "0": {
          title: "Citas fundamentadas",
          desc: "Cada respuesta enlaza con tu contenido real.",
        },
        "1": {
          title: "Coherente en todas partes",
          desc: "La misma articulación en cada superficie.",
        },
        "2": {
          title: "Siempre actualizado",
          desc: "Las actualizaciones fluyen a medida que cambia tu contenido.",
        },
      },
    },
    attribution: {
      title: "Créditos y atribuciones",
      subtitle:
        "Las tipografías, los iconos y las bibliotecas de código abierto que impulsan esta plantilla.",
    },
    status: {
      confirmed: {
        title: "Suscripción confirmada",
        message:
          "Tu correo está verificado. Ya está todo listo para recibir novedades.",
        action: "Volver al inicio",
      },
      unsubscribed: {
        title: "Te has dado de baja",
        message:
          "No recibirás más correos de esta lista. Puedes volver a suscribirte cuando quieras.",
        action: "Regresar al inicio",
      },
    },
    surface: {
      terminal: {
        heading: "Superficie de terminal",
        body: "Esta página se renderiza en la superficie interior: una tipografía monoespaciada y esquinas rectas, conmutada por grupo de rutas desde la misma base de tokens que las páginas de marketing.",
        cardTitle: "Mismos tokens, otra superficie",
        cardDescription:
          "Solo cambian la fuente activa y el radio de las esquinas; los colores y la semántica se comparten.",
        action: "Acción principal",
      },
    },
  },
  attribution: {
    title: "Créditos y atribuciones",
    subtitle:
      "Las imágenes y el software de código abierto que impulsan este sitio.",
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
      "Las imágenes se usan bajo la Licencia de Unsplash. Las bibliotecas se usan bajo sus respectivas licencias de código abierto.",
  },
} as const;
