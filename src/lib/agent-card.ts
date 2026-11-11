/**
 * Static A2A discovery fallback for /.well-known/agent-card.json.
 *
 * This build-time card cannot include current organization policy, skills, or
 * optional signed trust metadata. Verified ContextRocket origins should proxy
 * this path to the API; see docs/integrating-with-contextrocket.md.
 */

import { siteConfig } from "@/config/site.config";
import {
  contextRocketIdentityUrl,
  type ContextRocketSubjectKind,
} from "@/lib/contextrocket-urls";

export interface AgentCardOptions {
  agentUrl?: string;
  handle?: string;
  subjectKind?: ContextRocketSubjectKind;
}

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

export function buildAgentCard(
  options: AgentCardOptions = {},
): Record<string, unknown> {
  const crAgentUrl = trimTrailingSlash(
    options.agentUrl || env("PUBLIC_CR_AGENT_URL") || siteConfig.chat.agentUrl,
  );
  const handle =
    options.handle ||
    env("PUBLIC_CONTEXTROCKET_HANDLE") ||
    siteConfig.chat.handle ||
    "contextrocket";
  const subjectKind = options.subjectKind ?? siteConfig.chat.subjectKind;
  const interfaceUrl = contextRocketIdentityUrl(
    crAgentUrl,
    subjectKind,
    handle,
    "a2a",
  );
  const agentCardUrl = contextRocketIdentityUrl(
    crAgentUrl,
    subjectKind,
    handle,
    "agent-card.json",
  );

  return {
    name: `${siteConfig.companyName} Agent`,
    description: siteConfig.description,
    url: agentCardUrl,
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
      oauth2: {
        oauth2SecurityScheme: {
          description: "OAuth 2.1 authorization code with PKCE (S256).",
          flows: {
            authorizationCode: {
              authorizationUrl: `${crAgentUrl}/oauth/authorize`,
              tokenUrl: `${crAgentUrl}/oauth/token`,
              refreshUrl: `${crAgentUrl}/oauth/token`,
              scopes: {
                "context_graph:read":
                  "Read the organization's governed Context Graph.",
              },
              pkceRequired: true,
            },
          },
          oauth2MetadataUrl: `${crAgentUrl}/.well-known/oauth-authorization-server`,
        },
      },
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
      { schemes: { oauth2: { list: ["context_graph:read"] } } },
      { schemes: { bearer: { list: [] } } },
      { schemes: { apiKey: { list: [] } } },
      // Published public facts may be read anonymously using metadata.handle.
      { schemes: {} },
    ],
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["text/plain"],
    skills: [],
  };
}
