import type { PluginInput, ToolDefinition } from "@opencode-ai/plugin"
import { type ToolContext, tool } from "@opencode-ai/plugin/tool"

const MS_PER_SECOND = 1000

interface SessionCreateResponse {
  readonly data?: { readonly id?: string }
}

interface MessagePart {
  readonly type: string
  readonly text?: string
}

interface SessionMessage {
  readonly info?: { readonly role?: "user" | "assistant" }
  readonly parts?: MessagePart[]
}

interface SessionMessagesResponse {
  readonly data?: SessionMessage[]
}

interface AgentTask {
  readonly agent: string
  readonly prompt: string
  readonly description: string
}

function updateProgress(
  toolCtx: ToolContext,
  progressState: { completed: number; total: number; startTime: number } | undefined,
  status: string,
): void {
  if (progressState) {
    const elapsed = ((Date.now() - progressState.startTime) / MS_PER_SECOND).toFixed(0)
    toolCtx.metadata({
      title: `[${progressState.completed}/${progressState.total}] ${status} (${elapsed}s)`,
    })
  }
}

async function executeAgentSession(ctx: PluginInput, task: AgentTask): Promise<string> {
  const sessionResp = (await ctx.client.session.create({
    body: {},
    query: { directory: ctx.directory },
  })) as SessionCreateResponse

  const sessionID = sessionResp.data?.id
  if (!sessionID) {
    return `## ${task.description}\n\n**Agent**: ${task.agent}\n**Error**: Failed to create session`
  }

  await ctx.client.session.prompt({
    path: { id: sessionID },
    body: {
      parts: [{ type: "text", text: task.prompt }],
      agent: task.agent,
    },
    query: { directory: ctx.directory },
  })

  const messagesResp = (await ctx.client.session.messages({
    path: { id: sessionID },
    query: { directory: ctx.directory },
  })) as SessionMessagesResponse

  const messages = messagesResp.data || []
  const lastAssistant = messages.filter((m) => m.info?.role === "assistant").pop()
  const agentResponse =
    lastAssistant?.parts
      ?.filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("\n") || "(No response from agent)"

  await ctx.client.session
    .delete({ path: { id: sessionID }, query: { directory: ctx.directory } })
    .catch(() => {
      /* fire-and-forget cleanup */
    })

  return agentResponse
}

async function runAgent(
  ctx: PluginInput,
  task: AgentTask,
  toolCtx: ToolContext,
  progressState?: { completed: number; total: number; startTime: number },
): Promise<string> {
  const agentStartTime = Date.now()
  updateProgress(toolCtx, progressState, `Running ${task.agent}...`)

  try {
    const agentOutput = await executeAgentSession(ctx, task)
    const agentTime = ((Date.now() - agentStartTime) / MS_PER_SECOND).toFixed(1)
    return `## ${task.description} (${agentTime}s)\n\n**Agent**: ${task.agent}\n\n### Result\n\n${agentOutput}`
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return `## ${task.description}\n\n**Agent**: ${task.agent}\n**Error**: ${errorMsg}`
  }
}

async function runParallelAgents(ctx: PluginInput, agentTasks: AgentTask[], toolCtx: ToolContext): Promise<string> {
  const startTime = Date.now()
  const progressState = { completed: 0, total: agentTasks.length, startTime }

  toolCtx.metadata({ title: `Running ${agentTasks.length} agents in parallel...` })

  const runWithProgress = async (task: AgentTask): Promise<string> => {
    const agentOutput = await runAgent(ctx, task, toolCtx, progressState)
    progressState.completed++
    const elapsed = ((Date.now() - startTime) / MS_PER_SECOND).toFixed(0)
    toolCtx.metadata({
      title: `[${progressState.completed}/${agentTasks.length}] ${task.agent} done (${elapsed}s)`,
    })
    return agentOutput
  }

  const results = await Promise.all(agentTasks.map(runWithProgress))
  const totalTime = ((Date.now() - startTime) / MS_PER_SECOND).toFixed(1)

  toolCtx.metadata({ title: `${agentTasks.length} agents completed in ${totalTime}s` })

  return `# ${agentTasks.length} agents completed in ${totalTime}s (parallel)\n\n${results.join("\n\n---\n\n")}`
}

export function createSpawnAgentTool(ctx: PluginInput): ToolDefinition {
  return tool({
    description: `Spawn subagents to execute tasks in PARALLEL.
All agents in the array run concurrently via Promise.all.

Example:
spawn_agent({
  agents: [
    {agent: "locator", prompt: "Find all files related to auth", description: "Find auth files"},
    {agent: "analyzer", prompt: "Explain how the auth module works", description: "Analyze auth"}
  ]
})`,
    args: {
      agents: tool.schema
        .array(
          tool.schema.object({
            agent: tool.schema.string().describe("Agent to spawn"),
            prompt: tool.schema.string().describe("Full prompt/instructions"),
            description: tool.schema.string().describe("Short description"),
          }),
        )
        .describe("Agents to spawn in parallel"),
    },
    execute: async (args, toolCtx) => {
      const { agents } = args

      if (!agents || agents.length === 0) return "## spawn_agent Failed\n\nNo agents specified."

      if (agents.length === 1) {
        toolCtx.metadata({ title: `Running ${agents[0].agent}...` })
        return runAgent(ctx, agents[0], toolCtx)
      }

      return runParallelAgents(ctx, agents, toolCtx)
    },
  })
}
