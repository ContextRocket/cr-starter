/**
 * modules/embed -- en (embed surface, carved from app/).
 */

export const embedEn = {
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
