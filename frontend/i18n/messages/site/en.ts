/**
 * Site (@content-owners) i18n slice — public marketing / legal surfaces:
 * home, blog, faq, footer, impressum, privacy, preview. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Auto-partitioned from the original en.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const siteEn = {
  home: {
    subtitle: "Build products on ContextRocket. Auth, dashboard shell, and OpenAPI-driven type safety included. Conversation state and agent runs delegate to ContextRocket via A2A.",
    cta: "Go to Dashboard",
    hero: {
      // Copy for the animated image-overlay hero (`<HeroInsights layout="overlay">`)
      // rendered on the home. GENERIC placeholder copy so a fork edits it — the
      // score badge plus three floating insight cards that cascade in on load.
      insights: {
        scoreTitle: "Answer Readiness",
        scoreValue: "92",
        thinTitle: "Grounded citations",
        thinDesc: "Every answer links back to your real content.",
        bioTitle: "Consistent everywhere",
        bioDesc: "The same articulation across every surface.",
        multiTitle: "Always current",
        multiDesc: "Updates flow in as your content changes."
      }
    },
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
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What our customers say",
      subtitle: "Real results from teams building on the platform.",
      regionLabel: "Customer testimonials",
      ratingLabel: "Rated {rating} out of 5"
    },
    integrations: {
      label: "Integrations",
      title: "Connected to the tools that matter",
      body1: "Connects with the tools your team already uses, so your data flows in without extra work.",
      body2: "These integrations let you act on real signals and keep everything in sync.",
      cta: "See all integrations"
    },
    subscribe: {
      title: "Stay in the loop",
      subtitle: "Get occasional updates and insights from our team. No spam.",
      placeholder: "you@example.com",
      submit: "Subscribe",
      consent: "I agree to receive emails and accept the",
      privacyLink: "privacy policy",
      success: "Thanks — you're on the list.",
      errors: {
        emailRequired: "Please enter your email.",
        emailInvalid: "Please enter a valid email address.",
        consentRequired: "Please accept the privacy policy to continue.",
        submitFailed: "Something went wrong. Please try again."
      }
    }
  },
  blog: {
    title: "Blog",
    subtitle: "Articles, guides, and product updates.",
    description: "Articles, guides, and updates.",
    featured: "Featured",
    all_posts: "All posts",
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
  faq: {
    page: {
      title: "Frequently Asked Questions",
      description: "Answers to common questions about this site, the chat agent, data handling, and customization."
    },
    back: {
      home: "Back to home"
    }
  },
  footer: {
    impressum: "Impressum",
    privacy: "Privacy Policy",
    faq: "FAQ"
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
  preview: {
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Pricing",
      perMonth: "/month",
      standard: {
        name: "Standard",
        price: "€29",
        description: "Everything a small team needs to get started.",
        cta: "Start free",
        features: {
          "0": "Up to 5 team members",
          "1": "10 GB storage",
          "2": "Community support",
          "3": "Weekly reports"
        }
      },
      enterprise: {
        name: "Enterprise",
        price: "€99",
        description: "Advanced controls and support for growing organizations.",
        cta: "Contact sales",
        features: {
          "0": "Unlimited team members",
          "1": "1 TB storage",
          "2": "Priority support",
          "3": "Custom integrations",
          "4": "Audit log and SSO"
        }
      }
    },
    team: {
      title: "Meet the team",
      subtitle: "The people building the product.",
      mark: {
        role: "Founder & CTO",
        bio: {
          "0": "Mark leads product and engineering, focused on grounded, verifiable brand articulation.",
          "1": "He previously built agentic platforms and cares deeply about developer experience."
        }
      }
    },
    heroInsights: {
      scoreTitle: "Answer Readiness",
      scoreValue: "92",
      cards: {
        "0": {
          title: "Grounded citations",
          desc: "Every answer links back to your real content."
        },
        "1": {
          title: "Consistent everywhere",
          desc: "The same articulation across every surface."
        },
        "2": {
          title: "Always current",
          desc: "Updates flow in as your content changes."
        }
      }
    },
    attribution: {
      title: "Credits & attributions",
      subtitle: "The fonts, icons, and open-source libraries that power this template."
    },
    status: {
      confirmed: {
        title: "Subscription confirmed",
        message: "Your email is verified. You're all set to receive updates.",
        action: "Back to home"
      },
      unsubscribed: {
        title: "You've been unsubscribed",
        message: "You won't receive any more emails from this list. You can resubscribe anytime.",
        action: "Return home"
      }
    },
    surface: {
      terminal: {
        heading: "Terminal surface",
        body: "This page renders on the inner surface: a mono typeface and square corners, switched per route-group from the same token foundation as the marketing pages.",
        cardTitle: "Same tokens, different surface",
        cardDescription: "Only the active font and corner radius change — colors and semantics stay shared.",
        action: "Primary action"
      }
    }
  },
} as const;
