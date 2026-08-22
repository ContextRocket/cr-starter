/**
 * Current A2A Agent Card builder -- pure utility, no Next.js server imports.
 *
 * ContextRocket owns the hosted agent and its policy. The starter publishes a
 * small, static discovery card at the customer origin so a crawler can find
 * the configured hosted interface. The card deliberately does not invent a
 * second protocol contract or advertise private capabilities; the hosted
 * ContextRocket card is authoritative for policy-projected skills.
 *
 * Current contract: A2A 1.0 JSON-RPC at
 * https://a2a-protocol.org/latest/topics/agent-discovery/
 */

import { siteConfig } from "@/config/site.config";

const A2A_PROTOCOL_VERSION = "1.0";
const A2A_PROTOCOL_BINDING = "JSONRPC";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/**
 * Build the current A2A Agent Card payload from starter configuration.
 *
 * The default ContextRocket API base and `contextrocket` handle are safe
 * configuration values. The site remains in canned demo mode by default, so
 * publishing this card does not make a browser request to the API.
 */
export function buildAgentCard(): Record<string, unknown> {
  const crAgentUrl = trimTrailingSlash(
    process.env.NEXT_PUBLIC_CR_AGENT_URL || siteConfig.chat.agentUrl,
  );
  const handle =
    process.env.NEXT_PUBLIC_CONTEXTROCKET_HANDLE ||
    siteConfig.chat.handle ||
    "contextrocket";
  const interfaceUrl = `${crAgentUrl}/api/agent/a2a`;

  return {
    name: `${siteConfig.companyName} Agent`,
    description: siteConfig.description,
    supportedInterfaces: [
      {
        url: interfaceUrl,
        protocolBinding: A2A_PROTOCOL_BINDING,
        protocolVersion: A2A_PROTOCOL_VERSION,
        tenant: handle,
      },
    ],
    version: A2A_PROTOCOL_VERSION,
    documentationUrl: "https://docs.contextrocket.com/api/agent",
    provider: {
      organization: "ContextRocket",
      url: "https://contextrocket.com",
    },
    capabilities: {
      streaming: true,
      pushNotifications: false,
      extendedAgentCard: false,
    },
    securitySchemes: {
      bearer: {
        httpAuthSecurityScheme: {
          scheme: "Bearer",
          bearerFormat: "JWT or OAuth 2.1 access token",
          description:
            "OAuth access for authenticated ContextRocket users and agents.",
        },
      },
      apiKey: {
        apiKeySecurityScheme: {
          location: "header",
          name: "X-Api-Key",
          description:
            "Origin-bound ContextRocket API key for an organization-scoped turn.",
        },
      },
    },
    securityRequirements: [
      { schemes: { bearer: { list: [] } } },
      { schemes: { apiKey: { list: [] } } },
    ],
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["text/plain"],
    // ContextRocket projects callable skills from the organization's
    // published policy. Keeping this empty prevents a static starter card
    // from claiming capabilities that the hosted organization has not enabled.
    skills: [],
  };
}
