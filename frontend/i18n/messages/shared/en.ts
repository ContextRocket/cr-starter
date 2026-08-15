/**
 * Shared (@eng) i18n slice — cross-cutting UI primitives reused by
 * both app and site surfaces: form, nav, notifications, error, locale,
 * breadcrumb, pagination, cookie. Strict tri-locale parity (all keys in
 * all 3 locales).
 *
 * Auto-partitioned from the original en.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const sharedEn = {
  form: {
    email: "Email",
    password: "Password",
    passwordConfirm: "Password Confirm",
    username: "Username",
    placeholder: {
      email: "m@example.com"
    },
    validation: {
      password: {
        min: "Password should be at least 8 characters.",
        uppercase: "Password should contain at least one uppercase letter.",
        special: "Password should contain at least one special character.",
        required: "Password is required"
      },
      passwords: {
        match: "Passwords must match."
      },
      token: {
        required: "Token is required"
      },
      email: {
        invalid: "Invalid email address"
      },
      username: {
        required: "Username is required"
      }
    }
  },
  nav: {
    dashboard: "Dashboard",
    blog: "Blog",
    logout: "Logout",
    welcome: "Welcome to your Dashboard",
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
    dashboard: "Something went wrong loading this page.",
    try: {
      again: "Try again"
    },
    unexpected: "An unexpected error occurred. Please try again later.",
    network: "Network error",
    no: {
      token: "No access token found",
      data: "No data returned from server"
    },
    unknown: "Unknown error",
    internal: "Internal server error"
  },
  locale: {
    labelEnglish: "English",
    labelSpanish: "Spanish",
    labelGerman: "German",
    changeLanguage: "Change language",
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
  cookie: {
    consent: {
      aria: {
        label: "Cookie consent"
      },
      body: "We use analytics cookies. See our",
      policy: {
        link: "Privacy Policy"
      },
      accept: "Accept",
      decline: "Decline"
    }
  },
} as const;
