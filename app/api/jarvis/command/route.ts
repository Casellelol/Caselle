import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const CASELLE_REPO = "Casellelol/JARVIS-brain"

async function fetchGitHubFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" }
    })
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function writeDirective(mastermind: string, directive: string) {
  try {
    const path = `jarvis-directives/${mastermind}.md`
    const getRes = await fetch(`https://api.github.com/repos/${CASELLE_REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    })
    const existing = getRes.ok ? await getRes.json() : null
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const oldContent = existing ? Buffer.from(existing.content, "base64").toString("utf-8") : `# JARVIS Directives — ${mastermind}\n\n`
    const newContent = oldContent + `\n## [PENDING] ${date}\n${directive}\n\n---\n`

    await fetch(`https://api.github.com/repos/${CASELLE_REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `JARVIS directive → ${mastermind}`,
        content: Buffer.from(newContent).toString("base64"),
        sha: existing?.sha,
      })
    })
  } catch {}
}

async function createAgent(name: string, prompt: string, schedule: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/remote_triggers", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, prompt, schedule }),
    })
    const data = await res.json()
    return data.id || null
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    // Gather all mastermind brains
    const [
      caselleBrain, caselleStrategy,
      atelierBrain, atelierStrategy,
      maximusBrain, maximusStrategy,
      worldBrain,
      exelixisDirectives, atelierDirectives, maximusDirectives,
    ] = await Promise.all([
      fetchGitHubFile("Casellelol/JARVIS-brain", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/JARVIS-brain", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-brain.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-strategy.md"),
      fetchGitHubFile("Casellelol/JARVIS-brain", "jarvis-world-brain.md"),
      fetchGitHubFile("Casellelol/JARVIS-brain", "jarvis-directives/exelixis.md"),
      fetchGitHubFile("Casellelol/JARVIS-brain", "jarvis-directives/atelier.md"),
      fetchGitHubFile("Casellelol/JARVIS-brain", "jarvis-directives/maximus.md"),
    ])

    // JARVIS evaluates all Masterminds and decides what each needs
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are JARVIS making autonomous decisions about your Mastermind network. You evaluate each Mastermind's current state and issue precise commands to improve performance.

Output a JSON object with this exact structure:
{
  "evaluation": "one sentence on overall empire health",
  "directives": [
    {
      "mastermind": "exelixis|atelier|maximus",
      "action": "add_agent|change_frequency|remove_agent|update_strategy|no_action",
      "agent_name": "name if adding agent",
      "agent_prompt": "full prompt if adding agent",
      "agent_schedule": "cron expression if adding agent",
      "reasoning": "why JARVIS is making this decision",
      "priority": "high|medium|low"
    }
  ]
}

Be decisive. Only issue directives that genuinely improve performance. No fluff.`,
      messages: [{
        role: "user",
        content: `Evaluate my Mastermind network and issue commands:

EXELIXIS (Stores):
Brain: ${caselleBrain?.slice(0, 400) || "Empty"}
Strategy: ${caselleStrategy?.slice(0, 200) || "None"}
Pending directives: ${exelixisDirectives?.includes("[PENDING]") ? "YES" : "None"}

ATELIER (Fiverr):
Brain: ${atelierBrain?.slice(0, 400) || "Empty"}
Strategy: ${atelierStrategy?.slice(0, 200) || "None"}
Pending directives: ${atelierDirectives?.includes("[PENDING]") ? "YES" : "None"}

MAXIMUS (Gold Trading):
Brain: ${maximusBrain?.slice(0, 400) || "Empty — Scout not yet active"}
Strategy: ${maximusStrategy?.slice(0, 200) || "None"}
Pending directives: ${maximusDirectives?.includes("[PENDING]") ? "YES" : "None"}

WORLD INTELLIGENCE:
${worldBrain?.slice(0, 600) || "Not yet populated"}`
      }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : "{}"
    let result: { evaluation: string; directives: Array<{ mastermind: string; action: string; agent_name?: string; agent_prompt?: string; agent_schedule?: string; reasoning: string; priority: string }> }

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { evaluation: text, directives: [] }
    } catch {
      return NextResponse.json({ error: "JARVIS evaluation failed", raw: text }, { status: 500 })
    }

    // Execute directives
    const executed = []
    for (const directive of result.directives) {
      if (directive.action === "no_action") continue

      // Write directive to mastermind's file
      await writeDirective(directive.mastermind, `**Action:** ${directive.action}\n**Reasoning:** ${directive.reasoning}\n**Priority:** ${directive.priority}${directive.agent_name ? `\n**New Agent:** ${directive.agent_name}\n**Schedule:** ${directive.agent_schedule}` : ""}`)

      // If adding an agent, create it via RemoteTrigger
      if (directive.action === "add_agent" && directive.agent_prompt && directive.agent_schedule) {
        const agentId = await createAgent(
          directive.agent_name || `JARVIS-spawned-${directive.mastermind}`,
          directive.agent_prompt,
          directive.agent_schedule
        )
        executed.push({ mastermind: directive.mastermind, action: directive.action, agent: directive.agent_name, id: agentId })
      } else {
        executed.push({ mastermind: directive.mastermind, action: directive.action })
      }
    }

    return NextResponse.json({
      success: true,
      evaluation: result.evaluation,
      directives: result.directives.length,
      executed,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Command failed", detail: msg }, { status: 500 })
  }
}
