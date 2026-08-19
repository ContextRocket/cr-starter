/**
 * A2A AgentCard builder -- pure utility, no Next.js server imports.
 *
 * Exports buildAgentCard() for use by the /.well-known/agent.json route.
 * Kept in lib/ so tests can import it without pulling in the Next.js
 * server runtime (which requires Request/Response globals not in jsdom).
 *
 * Field names mirror ContextRocket's public A2A agent-card contract.
 *
 * A2A spec: https://google.github.io/A2A/
 */

import { siteConfig } from "@/config/site.config";

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
      // Browser integrations use a publishable, origin-bound API key.
      schemes: ["Bearer"],
      description:
        "Website API keys are scoped to the organization handle and allowed origins. " +
        "Server-side machine credentials must never be exposed in browser integrations.",
    },
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
    skills: [
      {
        id: "chat",
        name: "Context Graph chat",
        description:
        "Conversational assistant scoped to the configured organization's Context Graph. " +
          "Answers with citations from verified brand knowledge.",
        tags: ["chat", "context-graph"],
        inputModes: ["text"],
        outputModes: ["text"],
      },
    ],
    // Site origin for CORS / origin-binding checks.
    siteOrigin: origin,
  };
}
