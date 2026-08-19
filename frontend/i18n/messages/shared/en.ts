/**
 * Shared (@eng) i18n slice -- cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Configured locale files must keep their
 * shared keys in parity.
 *
 * Auto-partitioned from the original en.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source -- do not retype legal/marketing strings.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const sharedEn = {
  form: {
    email: "Email",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      email: {
        invalid: "Invalid email address"
      }
    }
  },
  nav: {
    blog: "Blog",
    features: "Features",
    about: "About",
    pricing: "Pricing",
    aria: {
      primary: "Primary"
    }
  },
  theme: {
    toggle: "Toggle theme",
    light: "Light",
    dark: "Dark"
  },
  notifications: {
    region: "Site notifications",
    dismiss: "Dismiss notification",
    example: {
      info: {
        message: "We just shipped a new feature.",
        action: "Read the update"
      },
      warning: {
        message: "Scheduled maintenance this weekend."
      }
    }
  },
  error: {
    generic: "Something went wrong. Please try again.",
    try: {
      again: "Try again"
    },
    unexpected: "An unexpected error occurred. Please try again later.",
    network: "Network error",
    no: {
      data: "No data returned from server"
    },
    unknown: "Unknown error",
    internal: "Internal server error",
    notFound: {
      title: "Page not found",
      description:
        "The page you are looking for does not exist or has been moved.",
      action: "Go back home"
    }
  },
  locale: {
    labelEnglish: "English",
    labelSpanish: "Spanish",
    labelGerman: "German",
    labelChinese: "Chinese",
    changeLanguage: "Change language"
  },
  breadcrumb: {
    home: "Home"
  },
  pagination: {
    items: {
      per: {
        page: "Items per page:"
      }
    },
    no: {
      results: "0 results"
    }
  },
  gallery: {
    title: "Image gallery",
    subtitle: "Browse images by collection.",
    filter: "Filter by collection",
    all: "All images",
    imageCount: "{count} images",
    noImages: "No images match this filter.",
    viewImage: "View image: {alt}",
    close: "Close image",
    previous: "Previous image",
    next: "Next image",
    counter: "{current} of {total}"
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie consent"
      },
      title: "This site uses cookies",
      body: "We use analytics cookies. See our",
      policy: {
        link: "Privacy Policy"
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
              "Required for the site to function. These cannot be turned off."
          },
          analytics: {
            label: "Analytics",
            description:
              "Help us understand how the site is used so we can improve it."
          },
          marketing: {
            label: "Marketing",
            description:
              "Used to personalise content and measure marketing campaigns."
          }
        }
      }
    }
  }
} as const;
