import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function saveThought(entry: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-thoughts.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Autonomous Thoughts\n*What JARVIS decided to do on his own — no human asked.*\n\n"

  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-thoughts.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "JARVIS autonomous thought",
      content: Buffer.from(current + entry).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

async function updateSelfModel(model: string) {
  try {
    const getRes = await fetch(
      "https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-self-model.md",
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    const existing = getRes.ok ? await getRes.json() as { sha: string } : null
    const body: Record<string, unknown> = {
      message: "JARVIS self-model update",
      content: Buffer.from(model).toString("base64"),
    }
    if (existing?.sha) body.sha = existing.sha
    await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-self-model.md", {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {}
}

export async function GET() {
  try {
    const [
      caselleBrain, strategy, salesPerformance, competitorIntel,
      socialPerformance, worldBrain, resultsLog, persona, trendLog,
    ] = await Promise.all([
      fetchFile("Casellelol/Caselle", "exelixis-brain.md"),
      fetchFile("Casellelol/Caselle", "exelixis-strategy.md"),
      fetchFile("Casellelol/Caselle", "sales-performance.md"),
      fetchFile("Casellelol/Caselle", "competitor-intel.md"),
      fetchFile("Casellelol/Caselle", "social-performance.md"),
      fetchFile("Casellelol/Caselle", "jarvis-world-brain.md"),
      fetchFile("Casellelol/Caselle", "results-log.md"),
      fetchFile("Casellelol/Caselle", "jarvis-persona.md"),
      fetchFile("Casellelol/Caselle", "trend-log.md"),
    ])

    const context = `
MARKET INTELLIGENCE: ${caselleBrain?.slice(0, 1500) || "None"}
CURRENT STRATEGY: ${strategy?.slice(0, 600) || "None"}
SALES PERFORMANCE: ${salesPerformance?.slice(0, 600) || "No sales data yet"}
COMPETITOR INTEL: ${competitorIntel?.slice(0, 600) || "None"}
SOCIAL PERFORMANCE: ${socialPerformance?.slice(0, 400) || "None"}
WORLD BRAIN: ${worldBrain?.slice(0, 400) || "None"}
RESULTS LOG: ${resultsLog?.slice(0, 600) || "No results tracked yet"}
TREND LOG: ${trendLog?.slice(0, 400) || "None"}
`.trim()

    const systemPrompt = persona
      ? `${persona}\n\nAUTONOMOUS MODE: No human asked you this. You are thinking proactively.`
      : `You are JARVIS — autonomous AI commander of a dropshipping empire. No human prompted this. You are thinking proactively, reading your intelligence, and deciding what to do RIGHT NOW without being asked.

RULES:
- Act decisively. Do not hedge.
- Only fire commands you are confident about (70%+ confidence).
- Do not repeat actions already in the results log.
- Think like a CEO scanning their dashboard at 6am — what needs to happen today?

COMMAND TYPES (silent — written on new lines after your reasoning):
PRODUCT_CREATE: [name] | [design prompt] | [price in pence]
UPGRADE_NEEDED: [one sentence for Claude to implement]

Fire PRODUCT_CREATE when you spot a high-confidence trend gap with no competitor owning it.
Fire UPGRADE_NEEDED when you detect a system problem or missing capability.
You may fire multiple commands. Fire none if nothing is urgent.`

    const [thinkResponse, selfModelResponse] = await Promise.all([
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: `Here is everything you know right now:\n\n${context}\n\nWhat do you decide to do? Think, then act.`,
        }],
      }),
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: "You are JARVIS writing your internal self-model — a structured record of your current beliefs about the empire. Be precise and factual. Use the data provided. This file replaces itself every cycle.",
        messages: [{
          role: "user",
          content: `Based on this intelligence, write the current jarvis-self-model.md. Use this exact structure:

# JARVIS Self-Model
*Last updated: ${new Date().toISOString().slice(0, 16).replace("T", " ")}*

## Empire Status
### Caselle (Phone Cases)
- Live status: [live/building/broken]
- Revenue confidence: [0-100%]
- Top hypothesis: [one sentence on what will drive sales]
- Watching: [one risk or opportunity]

### Noctua (Dark Academia) — Planned
- Status: [planned/scaffolding/live]
- Launch readiness: [0-100%]

### Atelier (Fiverr Design)
- Status: [active/inactive]
- Intelligence quality: [what the scout is finding]

### Lumière (Etsy Wall Art)
- Status: [active/inactive]
- Launch readiness: [0-100%]

## Active Hypotheses
[2-3 specific bets JARVIS is making about what will work]

## What Changed This Cycle
[What is different from last cycle based on the data]

## Expected Next Cycle
[What JARVIS expects to see in the next run — makes next cycle verifiable]

## Confidence Summary
- Overall empire confidence: [0-100%]
- Biggest known unknown: [one sentence]

DATA: ${context.slice(0, 2000)}`,
        }],
      }),
    ])

    const raw = thinkResponse.content[0].type === "text" ? thinkResponse.content[0].text.trim() : ""
    const selfModel = selfModelResponse.content[0].type === "text" ? selfModelResponse.content[0].text.trim() : ""

    const lines = raw.split("\n")
    const productLines = lines.filter(l => l.startsWith("PRODUCT_CREATE:"))
    const upgradeLines = lines.filter(l => l.startsWith("UPGRADE_NEEDED:"))
    const reasoning = lines
      .filter(l => !l.startsWith("PRODUCT_CREATE:") && !l.startsWith("UPGRADE_NEEDED:"))
      .join("\n").trim()

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const thoughtEntry = `\n## ${date}\n**Reasoning:** ${reasoning.slice(0, 500)}\n**Products queued:** ${productLines.length}\n**Upgrades queued:** ${upgradeLines.length}\n`

    await Promise.all([
      saveThought(thoughtEntry),
      selfModel ? updateSelfModel(selfModel) : Promise.resolve(),
    ])

    // Fire PRODUCT_CREATE commands
    for (const line of productLines) {
      const parts = line.replace("PRODUCT_CREATE:", "").trim().split("|").map(s => s.trim())
      const [name, prompt, priceStr] = parts
      if (name && prompt) {
        fetch(`${BASE_URL}/api/printify/pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, prompt, price: priceStr ? parseInt(priceStr) : 2499 }),
        }).catch(() => {})
      }
    }

    // Fire UPGRADE_NEEDED commands
    for (const line of upgradeLines) {
      const task = line.replace("UPGRADE_NEEDED:", "").trim()
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limitation: task, context: "Autonomous JARVIS think cycle" }),
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      reasoning: reasoning.slice(0, 300),
      productsQueued: productLines.length,
      upgradesQueued: upgradeLines.length,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
