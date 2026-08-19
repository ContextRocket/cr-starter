/**
 * modules/chat -- en (chat surface, carved from app/).
 */

export const chatEn = {
  chat: {
    mock: {
      response: "This is a simulated response. The chat operates in an offline showcase mode.\n\nTo connect a live agent, set live mode, an organization handle, and a website API key in `.env.local`.\n\nEnjoy exploring the UI!"
    },
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
        body: "Set NEXT_PUBLIC_CR_CHAT_MODE=live, NEXT_PUBLIC_CR_AGENT_URL, and NEXT_PUBLIC_CONTEXTROCKET_HANDLE to enable live A2A."
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
        not: {
          found: "The demo agent is not available. Contact the site owner to enable the public demo."
        },
        unauthorized: "Demo access was refused. The public demo may not be enabled for this agent."
      }
    }
  },
} as const;
