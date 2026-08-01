/**
 * A2A AgentCard builder -- pure utility, no Next.js server imports.
 *
 * Exports buildAgentCard() for use by the /.well-known/agent.json route.
 * Kept in lib/ so tests can import it without pulling in the Next.js
 * server runtime (which requires Request/Response globals not in jsdom).
 *
 * Field names mirror the CR backend A2A types:
 *   backend/app/modules/agent/a2a/types.py (AgentCard, AgentCapabilities,
 *   AgentAuthentication, AgentSkill, AgentProvider)
 *
 * A2A spec: https://google.github.io/A2A/
 */

import { siteConfig } from "@/site.config";

/**
 * Build the A2A AgentCard payload from siteConfig + env.
 *
 * When NEXT_PUBLIC_CR_AGENT_URL is unset, url is null and streaming=false.
 * The card is still valid JSON and parseable by discovery tooling.
 */
export function buildAgentCard(): Record<string, unknown> {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  const crAgentUrl = process.env.NEXT_PUBLIC_CR_AGENT_URL || null;
  const a2aUrl = crAgentUrl
    ? `${crAgentUrl.replace(/\/$/, "")}/api/agent/a2a`
    : null;

  return {
    name: `${siteConfig.companyName} Agent`,
    description: siteConfig.description,
    // url is null when the CR endpoint is not yet configured.
    url: a2aUrl,
    version: "1.0",
    documentationUrl: "https://docs.contextrocket.com/api/agent",
    provider: {
      // Provider is ContextRocket (the platform serving the agent).
      name: "ContextRocket",
      url: "https://contextrocket.com",
    },
    capabilities: {
      streaming: a2aUrl !== null,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    authentication: {
      // Auth tiers: Bearer JWT (human users), OrgCredential (crk_-prefixed machine keys).
      // Guest access (scope-limited) is also available without a credential header.
      schemes: ["Bearer", "OrgCredential"],
      description:
        "Bearer JWT for human users; OrgCredential (crk_-prefixed) for machine-to-machine. " +
        "Guest access (no credential) is available for public brand facts at reduced scope.",
    },
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
    skills: [
      {
        id: "chat",
        name: "Context Pack chat",
        description:
          "Conversational assistant scoped to the configured org's Context Pack. " +
          "Answers with citations from verified brand knowledge.",
        tags: ["chat", "context-pack"],
        inputModes: ["text"],
        outputModes: ["text"],
      },
    ],
    // Site origin for CORS / origin-binding checks.
    siteOrigin: origin,
  };
}
