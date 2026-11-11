/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * Shared UI copy used by starter-owned forms, navigation, status, and consent.
 */

export const sharedEn = {
  form: {
    email: "Email",
    placeholder: {
      email: "m@example.com",
    },
    validation: {
      email: {
        invalid: "Invalid email address",
      },
    },
  },
  nav: {
    blog: "Blog",
    contact: "Contact",
    features: "Features",
    about: "About",
    pricing: "Pricing",
    aria: {
      primary: "Primary",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
  },
  attribution: {
    poweredBy: "Powered by",
  },
  contact: {
    title: "Start a conversation",
    introduction: "Tell us a little about what you are working on.",
    directEmail: "Prefer email?",
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    intent: "What can we help with?",
    intentContact: "General question",
    intentDemo: "Request a demo",
    intentAppointment: "Book a conversation",
    intentSupport: "Support",
    message: "How can we help?",
    consent: "I agree to be contacted about this request.",
    submit: "Send message",
    sending: "Sending…",
    demoResult: "Demo complete. No information was sent or stored.",
    success: "Thanks. Your message has been received.",
    failure: "We could not send your message. Please try again.",
    liveUnavailable: "Live lead capture is not configured for this site.",
    javascriptRequired: "Enable JavaScript to send this message securely.",
    required: "Please complete the required fields and give consent.",
  },
  notifications: {
    region: "Site notifications",
    dismiss: "Dismiss notification",
    example: {
      info: {
        message: "We just shipped a new feature.",
        action: "Read the update",
      },
      warning: {
        message: "Scheduled maintenance this weekend.",
      },
    },
  },
  error: {
    generic: {
      title: "Something went wrong",
      description: "Something went wrong. Please try again.",
      action: "Try again",
    },
    try: {
      again: "Try again",
    },
    unexpected: "An unexpected error occurred. Please try again later.",
    network: "Network error",
    no: {
      data: "No data returned from server",
    },
    unknown: "Unknown error",
    internal: "Internal server error",
    notFound: {
      title: "Page not found",
      description:
        "The page you are looking for does not exist or has been moved.",
      action: "Go back home",
    },
  },
  locale: {
    labelEnglish: "English",
    labelSpanish: "Spanish",
    labelGerman: "German",
    labelChinese: "Chinese",
    changeLanguage: "Change language",
  },
  breadcrumb: {
    home: "Home",
  },
  pagination: {
    items: {
      per: {
        page: "Items per page:",
      },
    },
    no: {
      results: "0 results",
    },
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie consent",
      },
      title: "Cookie preferences",
      body: "This site uses optional cookies.",
      policy: {
        link: "Privacy Policy",
      },
      accept: "Accept",
      decline: "Decline",
      manage: "Manage settings",
      prefs: {
        description:
          "Choose which cookies we may use. You can update your choice at any time.",
        save: "Save preferences",
        title: "Cookie preferences",
        close: "Close",
        category: {
          necessary: {
            label: "Strictly necessary",
            description:
              "Required for the site to function. These cannot be turned off.",
          },
          functional: {
            label: "Functional",
            description:
              "Remembers optional preferences like your language or interface choices.",
          },
          analytics: {
            label: "Analytics",
            description:
              "Help us understand how the site is used so we can improve it.",
          },
          marketing: {
            label: "Marketing",
            description:
              "Used to personalise content and measure marketing campaigns.",
          },
        },
      },
    },
  },
} as const;
