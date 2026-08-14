/**
 * App (@eng) i18n slice — authenticated / product surfaces:
 * auth, dashboard, dev, chat, embed. Strict tri-locale parity.
 *
 * Auto-partitioned from the original en.ts tree (cr-x3j8). Copy is
 * verbatim from the pre-split source — do not retype legal/marketing strings.
 * The merge barrel (../en.ts) re-merges shared+app+site into `en`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

export const appEn = {
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
} as const;
