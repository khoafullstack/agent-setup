import type { AgentConfig } from "@opencode-ai/sdk"

import { locatorAgent } from "./locator.js"
import { analyzerAgent } from "./analyzer.js"
import { patternFinderAgent } from "./pattern-finder.js"
import { orchestratorAgent, PRIMARY_AGENT_NAME } from "./orchestrator.js"
import { plannerAgent } from "./planner.js"
import { executorAgent } from "./executor.js"
import { implementerAgent } from "./implementer.js"
import { reviewerAgent } from "./reviewer.js"

export const agents: Record<string, AgentConfig> = {
  [PRIMARY_AGENT_NAME]: { ...orchestratorAgent },
  locator: { ...locatorAgent },
  analyzer: { ...analyzerAgent },
  "pattern-finder": { ...patternFinderAgent },
  planner: { ...plannerAgent },
  executor: { ...executorAgent },
  implementer: { ...implementerAgent },
  reviewer: { ...reviewerAgent },
}

export {
  orchestratorAgent,
  PRIMARY_AGENT_NAME,
  locatorAgent,
  analyzerAgent,
  patternFinderAgent,
  plannerAgent,
  executorAgent,
  implementerAgent,
  reviewerAgent,
}
