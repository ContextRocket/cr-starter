/**
 * modules/embed -- es (embed surface, carved from app/).
 */

export const embedEs = {
  embed: {
    agent: {
      url: {
        rejected: {
          title: "URL del agente no permitida",
          body: "El parámetro agent-url proporcionado al widget embebido no coincide con el agente configurado para este sitio.",
        },
      },
    },
  },
} as const;
