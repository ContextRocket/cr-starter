/**
 * Current A2A Agent Card builder -- pure utility for /.well-known/agent-card.json.
 */

import { siteConfig } from "@/config/site.config";

const A2A_PROTOCOL_VERSION = "1.0";
const A2A_PROTOCOL_BINDING = "JSONRPC";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function env(name: string): string | undefined {
  const value = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.[name];
  return value && value.trim() ? value.trim() : undefined;
}

export function buildAgentCard(): Record<string, unknown> {
  const crAgentUrl = trimTrailingSlash(
    env("PUBLIC_CR_AGENT_URL") || siteConfig.chat.agentUrl,
  );
  const handle =
    env("PUBLIC_CONTEXTROCKET_HANDLE") ||
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
    skills: [],
  };
}
