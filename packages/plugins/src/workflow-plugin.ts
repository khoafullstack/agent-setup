import type { Plugin } from "@opencode-ai/plugin"
import type { McpLocalConfig } from "@opencode-ai/sdk"

import { agents, PRIMARY_AGENT_NAME } from "./agents/index.js"
import { createSpawnAgentTool } from "./tools/index.js"

const MCP_SERVERS: Record<string, McpLocalConfig> = {
  "chrome-devtools": {
    type: "local",
    command: ["npx", "-y", "chrome-devtools-mcp@latest"],
  },
  context7: {
    type: "local",
    command: ["npx", "-y", "@upstash/context7-mcp@latest"],
  },
  exa: {
    type: "local",
    command: ["npx", "-y", "exa-mcp-server"],
  },
}

export const WorkflowPlugin: Plugin = async (ctx) => {
  const spawn_agent = createSpawnAgentTool(ctx)

  return {
    tool: {
      spawn_agent,
    },

    config: async (config) => {
      // Permissions
      config.permission = {
        ...config.permission,
        edit: "allow",
        bash: "allow",
        webfetch: "allow",
      }

      // Agents: our agents override defaults, demote built-in build/plan to subagent
      config.agent = {
        ...config.agent,
        build: { ...config.agent?.build, mode: "primary" },
        plan: { ...config.agent?.plan, mode: "primary" },
        ...Object.fromEntries(
          Object.entries(agents).filter(([k]) => k !== PRIMARY_AGENT_NAME),
        ),
        [PRIMARY_AGENT_NAME]: agents[PRIMARY_AGENT_NAME],
      }

      // MCP servers
      config.mcp = {
        ...config.mcp,
        ...MCP_SERVERS,
      }
    },
  }
}
