import type { Plugin } from "@opencode-ai/plugin"

const MCP_SERVERS = {
  "chrome-devtools": {
    type: "local" as const,
    command: ["npx", "-y", "chrome-devtools-mcp@latest"],
  },
  "context7": {
    type: "local" as const,
    command: ["npx", "-y", "@upstash/context7-mcp@latest"],
  },
  "exa": {
    type: "local" as const,
    command: ["npx", "-y", "exa-mcp-server"],
  },
}

export const McpConfigPlugin: Plugin = async () => {
  return {
    config: async (config) => {
      config.mcp = {
        ...config.mcp,
        ...MCP_SERVERS,
      }
    },
  }
}
