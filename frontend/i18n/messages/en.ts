/**
 * English i18n message tree for the cr-starter.
 *
 * Pattern adapted from context-rocket/frontend/i18n/messages/en.ts.
 * Keys use SCREAMING_SNAKE_CASE to match the existing call-sites (t("AUTH_LOGIN_TITLE")).
 * Spanish and German bundles live in ./es.ts and ./de.ts.
 * Parity across all three locales is enforced by scripts/check-i18n-parity.js
 * (runs as a pre-commit hook).
 *
 * BOUNDARY NOTE:
 *   messages/* = UI copy (button labels, prompts, validation messages, legal boilerplate).
 *   site.config.ts = brand identity (companyName, tagline, description, siteUrl, legal fields).
 *   Do NOT duplicate brand identity strings here; components read from siteConfig directly.
 */

export const en = {
  home: {
    subtitle: "Build products on ContextRocket. Auth, dashboard shell, and OpenAPI-driven type safety included. Conversation state and agent runs delegate to ContextRocket via A2A.",
    cta: "Go to Dashboard",
    widget: {
      section: {
        title: "Add the agent to any website",
        body: "One script tag drops a floating chat button onto any page. The button opens an iframe backed by your ContextRocket agent -- no React, no bundler, no backend changes on the host site. The floating button on this page is the same component; embed it elsewhere with the snippet below."
      },
      snippet: {
        note: "Copy the snippet, replace the agent URL, and add it before </body>."
      }
    },
    featured: {
      title: "From the blog",
      subtitle: "Guides, research, and product updates.",
      viewAll: "View all posts"
    }
  },
  auth: {
    login: {
      title: "Login",
      description: "Enter your email below to log in to your account.",
      submit: "Sign In",
      no: {
        account: "Don't have an account?"
      },
      sign: {
        up: "Sign up"
      }
    },
    forgot: {
      password: "Forgot your password?"
    },
    register: {
      title: "Sign Up",
      description: "Enter your email and password below to create your account.",
      submit: "Sign Up",
      back: "Back to login"
    },
    password: {
      recovery: {
        title: "Password Recovery",
        description: "Enter your email to receive instructions to reset your password.",
        submit: "Send",
        back: "Back to login"
      },
      reset: {
        title: "Reset your Password",
        description: "Enter the new password and confirm it.",
        submit: "Send",
        loading: "Loading reset form...",
        success: "Password reset instructions sent to your email."
      }
    }
  },
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
    logout: "Logout",
    welcome: "Welcome to your Dashboard"
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Your ContextRocket-powered workspace. Configure your application and connect to ContextRocket for agent runs, conversation state, and knowledge management.",
    card: {
      chat: {
        title: "Continue chatting",
        description: "Your conversation history is saved. Pick up where you left off.",
        action: "Open chat"
      },
      profile: {
        title: "Profile & settings",
        description: "Update your email, password, or language preference.",
        action: "Edit profile"
      },
      users: {
        title: "Users",
        description: "Review registered accounts and guest sessions.",
        action: "View users"
      }
    },
    guest: {
      prompt: {
        title: "Save your conversation",
        description: "Create a free account to keep your chat history. Your current conversation will continue either way.",
        action: "Create account"
      }
    },
    users: {
      title: "Users",
      description: "All registered and guest accounts.",
      col: {
        email: "Email",
        type: "Type",
        status: "Status"
      },
      type: {
        guest: "Guest",
        registered: "Registered"
      },
      status: {
        active: "Active",
        inactive: "Inactive"
      },
      forbidden: "This page is for operators only."
    },
    profile: {
      title: "Profile & settings"
    }
  },
  dev: {
    notice: {
      label: "Developer notice:"
    },
    siteConfigUrlWarning: "siteUrl in site.config.ts still points at example.com. Replace it with your production domain before going live."
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
  footer: {
    impressum: "Impressum",
    privacy: "Privacy Policy",
    faq: "FAQ"
  },
  faq: {
    page: {
      title: "Frequently Asked Questions",
      description: "Answers to common questions about this site, the chat agent, data handling, and customization."
    },
    back: {
      home: "Back to home"
    }
  },
  blog: {
    title: "Blog",
    description: "Articles, guides, and updates.",
    empty: "No posts yet. Check back soon.",
    back: {
      home: "Back to home",
      to: {
        list: "All posts"
      }
    },
    not: {
      found: "Post not found"
    },
    min: {
      read: "min read"
    }
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Legal Notice"
    },
    entity: {
      label: "Entity"
    },
    address: {
      label: "Address"
    },
    register: {
      label: "Company Register"
    },
    vat: {
      label: "VAT ID"
    },
    represented: {
      by: {
        label: "Represented by"
      }
    },
    contact: {
      label: "Contact"
    },
    disclaimer: "This Impressum is legally required for commercial websites in Germany and the European Union. All placeholder values must be replaced before going live."
  },
  privacy: {
    title: "Privacy Policy",
    contact: {
      label: "Privacy Contact",
      intro: "For questions about your personal data or to exercise your rights, contact our privacy team:"
    },
    placeholder: "This is a placeholder privacy policy. Replace this page with your complete, legally compliant privacy statement before going live.",
    generated: {
      notice: "Generated from site.config. Review with legal counsel before launch."
    },
    intro: "This privacy policy explains how we collect, use, and protect your personal data when you use this website. It is a starting point generated from the site configuration and must be reviewed by qualified legal counsel before this site goes live.",
    controller: {
      heading: "Data Controller",
      intro: "The entity responsible for processing your personal data (the data controller within the meaning of the GDPR) is:"
    },
    data: {
      heading: "Data We Process",
      auth: {
        heading: "Account and Authentication Data",
        body: "When you register or log in, we process your email address, a hashed password, and your preferred language. This data is necessary to provide and secure your account. Legal basis: performance of a contract (Art. 6(1)(b) GDPR)."
      },
      cookies: {
        heading: "Strictly Necessary Cookies",
        body: "We use technically necessary cookies and browser storage to keep you logged in (authentication session), remember your language preference (locale cookie), and store your cookie consent choice. These are essential for the site to function and do not require your consent."
      }
    },
    analytics: {
      heading: "Analytics",
      body: "This site uses analytics to understand how visitors interact with the service. Analytics scripts load only after you grant consent via the cookie banner. You can withdraw consent at any time by clicking the privacy policy link in the footer and using the consent reset option. Legal basis: consent (Art. 6(1)(a) GDPR).",
      ga: {
        label: "Google Analytics 4 (Google LLC)"
      },
      posthog: {
        label: "PostHog (PostHog Inc.)"
      },
      providers: {
        intro: "The following analytics providers are configured on this site:"
      }
    },
    consent: {
      heading: "Cookie Consent and Withdrawal",
      body: "When you first visit, a cookie banner asks for your consent to analytics cookies. You can accept or decline. Your choice is stored in your browser. To change your choice or withdraw consent, clear the consent setting stored under the key",
      bodyAfterKey: "in your browser's local storage."
    },
    rights: {
      heading: "Your Rights",
      intro: "Under the GDPR you have the following rights regarding your personal data:",
      access: "Right of access (Art. 15 GDPR)",
      rectification: "Right to rectification (Art. 16 GDPR)",
      erasure: "Right to erasure (Art. 17 GDPR)",
      portability: "Right to data portability (Art. 20 GDPR)",
      complaint: "Right to lodge a complaint with a supervisory authority (Art. 77 GDPR)",
      outro: "To exercise your rights, contact the privacy address above."
    }
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
  chat: {
    placeholder: "Ask anything...",
    placeholderStreaming: "Thinking...",
    thinking: "Thinking",
    slow: {
      response: {
        title: "Still working...",
        hint: "This is taking a little longer than usual."
      }
    },
    very: {
      slow: {
        response: {
          hint: "Still processing. Complex questions take time."
        }
      }
    },
    send: "Send",
    stop: "Stop",
    empty: {
      title: "How can I help?",
      subtitle: "Ask a question to get started."
    },
    copy: "Copy",
    copied: "Copied",
    sources: "Sources",
    scroll: {
      to: {
        bottom: "Scroll to bottom"
      }
    },
    clear: "Clear chat",
    open: "Open chat",
    close: "Close chat",
    expand: "Expand to full screen",
    collapse: "Collapse to panel",
    connect: {
      required: {
        title: "Connect ContextRocket",
        body: "Set NEXT_PUBLIC_CR_AGENT_URL to enable the AI agent."
      }
    },
    stream: {
      interrupted: "The connection was interrupted before the answer finished. The reply may be incomplete."
    },
    typing: "Assistant is typing",
    more: {
      detail: "More detail"
    },
    less: {
      detail: "Less detail"
    },
    suggestions: {
      label: "Suggested follow-ups"
    },
    source: {
      sheet: {
        title: "Sources",
        open: "Open source"
      },
      cited: {
        section: "Cited section"
      },
      publisher: "Publisher",
      date: "Date",
      license: "License"
    },
    sourceSheet: {
      openNewTab: "Open in new tab"
    },
    policy: {
      card: {
        source: "Source"
      }
    },
    nudge: {
      title: "Save your conversation",
      body: "Create a free account to keep your full chat history. Your current conversation continues either way.",
      action: "Create account",
      dismiss: "Dismiss"
    },
    link: {
      preview: {
        title: "Link preview",
        open: "Open in new tab"
      }
    },
    grounded: "Grounded",
    partially: {
      grounded: "Partially grounded"
    },
    ungrounded: "Ungrounded",
    groundedClaimsChecked: "claims checked",
    demo: {
      badge: "Demo",
      error: {
        slug: {
          not: {
            found: "The demo agent is not available. Contact the site owner to enable the public demo."
          }
        },
        unauthorized: "Demo access was refused. The public demo may not be enabled for this agent."
      }
    }
  },
  embed: {
    agent: {
      url: {
        rejected: {
          title: "Agent URL not allowed",
          body: "The agent-url passed to the embed widget does not match the agent configured for this site."
        }
      }
    }
  },
  cookie: {
    consent: {
      aria: {
        label: "Cookie consent"
      },
      title: "This site uses cookies",
      body: "We use analytics cookies to improve your experience. See our",
      policy: {
        link: "Privacy Policy"
      },
      accept: "Accept",
      decline: "Decline"
    }
  }
,
  locale: {
    labelEnglish: "English",
    labelSpanish: "Spanish",
    labelGerman: "German",
    changeLanguage: "Change language",
  },
} as const;
