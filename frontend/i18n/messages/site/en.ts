/**
 * Site (@content-owners) i18n slice -- public marketing / legal surfaces:
 * home, blog, faq, footer, impressum, privacy, preview. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const siteEn = {
  home: {
    subtitle: "A flexible starting point for a clear, maintainable website.",
    hero: {
      // Copy for the animated image-overlay hero (`<HeroInsights layout="overlay">`)
      // rendered on the home. GENERIC placeholder copy so a fork edits it -- the
      // score badge plus three floating insight cards that cascade in on load.
      insights: {
        scoreTitle: "Answer Readiness",
        scoreValue: "92",
        thinTitle: "Grounded citations",
        thinDesc: "Every answer links back to your real content.",
        bioTitle: "Consistent everywhere",
        bioDesc: "The same articulation across every surface.",
        multiTitle: "Always current",
        multiDesc: "Updates flow in as your content changes.",
      },
      // Main hero section
      headline: "Your value proposition in one line.",
      subhead:
        "A supporting sentence that explains who it is for and why it matters.",
      primaryCta: "Get started",
      secondaryCta: "Learn more",
    },
    features: {
      label: "Features",
      title: "Everything you need",
      subtitle: "A short line describing the section.",
      item1: {
        title: "Feature one",
        description: "What it does and why it helps.",
      },
      item2: {
        title: "Feature two",
        description: "What it does and why it helps.",
      },
      item3: {
        title: "Feature three",
        description: "What it does and why it helps.",
      },
    },
    stats: {
      output: "Placeholder metric",
      integrations: "Integrations",
      uptime: "Uptime",
    },
    faq: {
      title: "Frequently asked questions",
      item1: {
        question: "What is this?",
        answer: "A short, plain-language answer.",
      },
      item2: {
        question: "Who is it for?",
        answer: "A short, plain-language answer.",
      },
    },
    cta: {
      title: "Ready to get started?",
      subtitle: "A short nudge toward the primary action.",
      button: "Get started",
    },
    carousel: {
      alt1: "AI brain visualization",
      alt2: "AI robot hands",
      alt3: "Programming setup",
      title: "A clear first impression",
      description:
        "Use this space to introduce the idea, service, or story behind your site.",
      title2: "Room for the details",
      description2:
        "Add a second point of view, a useful example, or a short explanation here.",
      title3: "Ready to make it yours",
      description3:
        "Replace these examples with the images and words that belong to your project.",
    },
    valueProps: {
      title: "A flexible foundation",
      subtitle:
        "Start with a small set of sections and grow when your content is ready.",
      see: {
        title: "Make it clear",
        description:
          "Give visitors a simple way to understand what you do and where to go next.",
      },
      fix: {
        title: "Shape the details",
        description:
          "Use this section for a practical benefit, an example, or a detail that needs emphasis.",
      },
      stay: {
        title: "Keep it maintainable",
        description:
          "Keep content in simple files and let shared components handle the repeated structure.",
      },
    },
    bento: {
      title: "A solid foundation",
      subtitle:
        "A few reusable building blocks for a site that can evolve over time.",
      context: {
        title: "Clear structure",
        description:
          "Organize the important parts of your story into a layout visitors can follow.",
      },
      realtime: {
        title: "Simple interactions",
        description:
          "Keep navigation, forms, and calls to action focused on the next useful step.",
      },
      multi: {
        title: "Ready to grow",
        description:
          "Add pages, languages, and integrations only when the project actually needs them.",
      },
      provenance: {
        title: "Easy to maintain",
        description:
          "Keep configuration and content close to the project so future edits stay understandable.",
      },
    },
    widget: {
      section: {
        title: "Add the agent to any website",
        body: "One script tag adds a dependency-free chat widget to any page. Demo mode works offline; live mode connects directly to your ContextRocket agent with no React, bundler, or host backend.",
      },
      snippet: {
        note: "Copy the snippet, set the organization handle and website API key, and add it before </body>.",
      },
    },
    featured: {
      title: "From the blog",
      subtitle: "Articles, notes, and updates from this site.",
      viewAll: "View all posts",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What our customers say",
      subtitle: "Real results from teams building on the platform.",
      regionLabel: "Customer testimonials",
      ratingLabel: "Rated {rating} out of 5",
    },
    integrations: {
      label: "Integrations",
      title: "Connected to the tools that matter",
      body1:
        "Connects with the tools your team already uses, so your data flows in without extra work.",
      body2:
        "These integrations let you act on real signals and keep everything in sync.",
      cta: "See all integrations",
    },
    subscribe: {
      title: "Stay in the loop",
      subtitle: "Get occasional updates and insights from our team. No spam.",
      placeholder: "you@example.com",
      submit: "Subscribe",
      consent: "I agree to receive emails and accept the",
      privacyLink: "privacy policy",
      success: "Thanks -- you're on the list.",
      errors: {
        emailRequired: "Please enter your email.",
        emailInvalid: "Please enter a valid email address.",
        consentRequired: "Please accept the privacy policy to continue.",
        submitFailed: "Something went wrong. Please try again.",
      },
    },
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
        list: "All posts",
      },
    },
    not: {
      found: "Post not found",
    },
    min: {
      read: "min read",
    },
  },
  faq: {
    page: {
      title: "Frequently Asked Questions",
      description:
        "Answers to common questions about this site, the chat agent, data handling, and customization.",
    },
    back: {
      home: "Back to home",
    },
  },
  footer: {
    powered_by: "Powered by",
    impressum: "Impressum",
    privacy: "Privacy Policy",
    faq: "FAQ",
    attribution: "Attribution",
  },
  impressum: {
    title: "Impressum",
    legal: {
      notice: "Legal Notice",
    },
    entity: {
      label: "Entity",
    },
    address: {
      label: "Address",
    },
    register: {
      label: "Company Register",
    },
    vat: {
      label: "VAT ID",
    },
    represented: {
      by: {
        label: "Represented by",
      },
    },
    contact: {
      label: "Contact",
    },
    disclaimer:
      "This Impressum is legally required for commercial websites in Germany and the European Union. All placeholder values must be replaced before going live.",
  },
  privacy: {
    title: "Privacy Policy",
    contact: {
      label: "Privacy Contact",
      intro:
        "For questions about your personal data or to exercise your rights, contact our privacy team:",
    },
    placeholder:
      "This is a placeholder privacy policy. Replace this page with your complete, legally compliant privacy statement before going live.",
    generated: {
      notice:
        "Generated from site.config. Review with legal counsel before launch.",
    },
    intro:
      "This privacy policy explains how we collect, use, and protect your personal data when you use this website. It is a starting point generated from the site configuration and must be reviewed by qualified legal counsel before this site goes live.",
    controller: {
      heading: "Data Controller",
      intro:
        "The entity responsible for processing your personal data (the data controller within the meaning of the GDPR) is:",
    },
    data: {
      heading: "Data We Process",
      site: {
        heading: "Site and Interaction Data",
        body: "We process the information you choose to submit through this site, together with technically necessary request and browser data required to deliver the pages and protect the service. Review and adapt this starter policy for your deployment before launch.",
      },
      cookies: {
        heading: "Strictly Necessary Cookies",
        body: "We use technically necessary cookies and browser storage to remember your language preference (locale cookie) and store your cookie consent choice. These are essential for the site to function and do not require your consent.",
      },
    },
    analytics: {
      heading: "Analytics",
      body: "This site uses analytics to understand how visitors interact with the service. Analytics scripts load only after you grant consent via the cookie banner. You can withdraw consent at any time by clicking the privacy policy link in the footer and using the consent reset option. Legal basis: consent (Art. 6(1)(a) GDPR).",
      ga: {
        label: "Google Analytics 4 (Google LLC)",
      },
      posthog: {
        label: "PostHog (PostHog Inc.)",
      },
      providers: {
        intro: "The following analytics providers are configured on this site:",
      },
    },
    consent: {
      heading: "Cookie Consent and Withdrawal",
      body: "When you first visit, a cookie banner asks for your consent to analytics cookies. You can accept or decline. Your choice is stored in your browser. To change your choice or withdraw consent, clear the consent setting stored under the key",
      bodyAfterKey: "in your browser's local storage.",
    },
    rights: {
      heading: "Your Rights",
      intro:
        "Under the GDPR you have the following rights regarding your personal data:",
      access: "Right of access (Art. 15 GDPR)",
      rectification: "Right to rectification (Art. 16 GDPR)",
      erasure: "Right to erasure (Art. 17 GDPR)",
      portability: "Right to data portability (Art. 20 GDPR)",
      complaint:
        "Right to lodge a complaint with a supervisory authority (Art. 77 GDPR)",
      outro: "To exercise your rights, contact the privacy address above.",
    },
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
          "3": "Weekly reports",
        },
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
          "4": "Audit log and SSO",
        },
      },
    },
    team: {
      title: "Meet the team",
      subtitle: "The people building the product.",
      mark: {
        role: "Founder & CTO",
        bio: {
          "0": "Mark leads product and engineering, focused on grounded, verifiable brand articulation.",
          "1": "He previously built agentic platforms and cares deeply about developer experience.",
        },
      },
    },
    heroInsights: {
      scoreTitle: "Answer Readiness",
      scoreValue: "92",
      cards: {
        "0": {
          title: "Grounded citations",
          desc: "Every answer links back to your real content.",
        },
        "1": {
          title: "Consistent everywhere",
          desc: "The same articulation across every surface.",
        },
        "2": {
          title: "Always current",
          desc: "Updates flow in as your content changes.",
        },
      },
    },
    attribution: {
      title: "Credits & attributions",
      subtitle:
        "The fonts, icons, and open-source libraries that power this template.",
    },
    status: {
      confirmed: {
        title: "Subscription confirmed",
        message: "Your email is verified. You're all set to receive updates.",
        action: "Back to home",
      },
      unsubscribed: {
        title: "You've been unsubscribed",
        message:
          "You won't receive any more emails from this list. You can resubscribe anytime.",
        action: "Return home",
      },
    },
    surface: {
      terminal: {
        heading: "Terminal surface",
        body: "This page renders on the inner surface: a mono typeface and square corners, switched per route-group from the same token foundation as the marketing pages.",
        cardTitle: "Same tokens, different surface",
        cardDescription:
          "Only the active font and corner radius change -- colors and semantics stay shared.",
        action: "Primary action",
      },
    },
  },
  attribution: {
    title: "Credits & attributions",
    subtitle: "The images and open-source software that power this site.",
    description:
      "This site is built with open-source software and self-hosted imagery. We credit every source below.",
    images: "Images",
    photo_by: "Photo by",
    on: "on",
    view_original: "View original",
    libraries: "Open-source libraries",
    license: "License",
    no_images: "No image credits are listed.",
    no_libraries: "No library credits are listed.",
    general_note: "Additional photography is provided by",
    license_note:
      "Images are used under the Unsplash License. Libraries are used under their respective open-source licenses.",
  },
} as const;
