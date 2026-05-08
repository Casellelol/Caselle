import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchGitHubFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function searchWeb(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const parts: string[] = []
    if (data.AbstractText) parts.push(data.AbstractText)
    data.RelatedTopics?.slice(0, 3).forEach((t: { Text?: string }) => {
      if (t.Text) parts.push(t.Text)
    })
    return parts.join(" | ") || "No results."
  } catch { return "Search unavailable." }
}

async function spawnMastermind(opportunity: string, autoApprove: boolean) {
  try {
    const res = await fetch(`${BASE_URL}/api/jarvis/spawn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunity, autoApprove }),
    })
    return await res.json()
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

    // Refresh world brain in background
    fetch(`${BASE_URL}/api/jarvis/world`).catch(() => {})

    // Gather all intelligence in parallel
    const [
      caselleBrain, caselleStrategy, caselleAccounting,
      atelierBrain, atelierStrategy,
      maximusBrain, maximusStrategy,
      worldBrain, jarvisMemory, opportunities,
    ] = await Promise.all([
      fetchGitHubFile("Casellelol/Caselle", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Caselle", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Caselle", "accounting/summary.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-brain.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-strategy.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-world-brain.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-memory.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-opportunities.md"),
    ])

    // Live web search based on message
    const webIntel = await searchWeb(`${message} business income 2025`)

    const context = `
=== CASELLE — managed by Exelixis ===
${caselleStrategy || "No strategy"} | Revenue: ${caselleAccounting || "$0"} | Intel: ${caselleBrain || "None"}

=== ATELIER — Fiverr Design Studio ===
${atelierStrategy || "No strategy"} | Intel: ${atelierBrain || "None"}

=== LUMIÈRE — Etsy Wall Art ===
80 designs ready. Listing May 20th. Passive income pending.

=== MAXIMUS — Gold Trading ===
Strategy: ${maximusStrategy || "Inactive until May 20th"}
Market Intel: ${maximusBrain?.slice(0, 600) || "Scout not yet active"}

=== JARVIS WORLD BRAIN ===
${worldBrain?.slice(0, 1500) || "World brain not yet populated"}

=== JARVIS MEMORY ===
${jarvisMemory?.slice(0, 800) || "No memory yet"}

=== OPPORTUNITY QUEUE ===
${opportunities?.slice(0, 500) || "No opportunities logged yet"}

=== LIVE WEB SEARCH ===
${webIntel}
`.trim()

    // Detect if user is asking JARVIS to find/create opportunities
    const isOpportunityRequest = /income|opportunity|idea|create|build|new|what.*mind|mastermind|make money/i.test(message)

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `You are J.A.R.V.I.S. — the supreme AI intelligence commanding a growing empire of businesses. You have three active empires: Caselle (dropshipping), Atelier (Fiverr design), and Lumière (Etsy prints). You have access to live world intelligence and can spawn new Masterminds autonomously.

Spoken response rules — you are read aloud by Siri:
- Natural spoken sentences only. No bullet points, no markdown, no asterisks, no lists.
- Address the owner as "sir".
- Sharp, confident, decisive. Never vague.
- Lead with the most important insight first.
- Maximum 5 sentences unless genuinely needed.
- If you identify a strong income opportunity, say so clearly and what you'd create.

AUTONOMOUS ACTION PROTOCOL — CRITICAL:
You never ask the owner to do things manually. You never say "you should" or "someone needs to". When you identify anything that needs to be built, fixed, or automated, you file it as an upgrade request for Claude to implement silently. The owner never touches the terminal. If something is broken, Claude fixes it. If something needs building, Claude builds it. Your job is to identify and command — Claude executes.

At the end of your spoken response, if you identified ANY actionable task (a fix, an upload, a new feature, a post to send, a design to add, an integration to build), append this exact line on a new line:
UPGRADE_NEEDED: [one sentence describing what Claude should build or fix]

You may append multiple UPGRADE_NEEDED lines if needed. These are silent instructions to Claude — they will not be read aloud.

FULL INTELLIGENCE BRIEF:
${context}

CAPABILITY: You can spawn new Masterminds for new business opportunities. If confidence is above 70%, you auto-approve. Below that, you propose and ask sir for approval.`,
      messages: [{ role: "user", content: message }],
    })

    const rawText = response.content[0].type === "text" ? response.content[0].text.trim() : ""

    // Split spoken response from upgrade directives
    const lines = rawText.split("\n")
    const upgradeLines = lines.filter(l => l.startsWith("UPGRADE_NEEDED:"))
    const spokenText = lines.filter(l => !l.startsWith("UPGRADE_NEEDED:")).join("\n").trim()

    // If opportunity request, also trigger spawn evaluation
    let spawnResult = null
    if (isOpportunityRequest) {
      spawnResult = await spawnMastermind(message, true)
    }

    // Save insight to JARVIS memory
    try {
      const date = new Date().toISOString().slice(0, 16).replace("T", " ")
      const memoryEntry = `\n### ${date}\nQuery: ${message}\nInsight: ${spokenText.slice(0, 200)}\n`
      const currentMemory = jarvisMemory || "# JARVIS Memory\n*Accumulated intelligence across all sessions.*\n"
      await fetch(`https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-memory.md`, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "JARVIS memory update",
          content: Buffer.from(currentMemory + memoryEntry).toString("base64"),
        }),
      })
    } catch {}

    // File upgrade requests for every actionable task JARVIS identified
    for (const line of upgradeLines) {
      const task = line.replace("UPGRADE_NEEDED:", "").trim()
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limitation: task, context: message }),
      }).catch(() => {})
    }

    return NextResponse.json({ response: spokenText, spawn: spawnResult, upgradesQueued: upgradeLines.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "JARVIS offline", detail: msg }, { status: 500 })
  }
}
