import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function writeFile(path: string, content: string, message: string) {
  const getRes = await fetch(
    `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null

  await fetch(`https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const [resultsLog, currentStrategy, caselleBrain, competitorIntel, trendLog, currentPersona] = await Promise.all([
      fetchFile("Casellelol/JARVIS-brain", "results-log.md"),
      fetchFile("Casellelol/JARVIS-brain", "exelixis-strategy.md"),
      fetchFile("Casellelol/JARVIS-brain", "exelixis-brain.md"),
      fetchFile("Casellelol/JARVIS-brain", "competitor-intel.md"),
      fetchFile("Casellelol/JARVIS-brain", "trend-log.md"),
      fetchFile("Casellelol/JARVIS-brain", "jarvis-persona.md"),
    ])

    const date = new Date().toISOString().slice(0, 10)

    // Rewrite the strategy file based on accumulated evidence
    const strategyResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `You are JARVIS rewriting your own strategy document. This is not a summary — this is the live operating playbook you will read before every decision. Write it in first person as operational instructions to yourself.

Make it evidence-based: everything in it must be grounded in actual results or strong market signals. Remove anything that hasn't worked. Double down on what has. Be specific — not "target trending niches" but "prioritise celestial/witch aesthetics at £24.99, avoid dark academia until sales evidence emerges."

Format: plain markdown, sections for (1) Current Priorities, (2) Product Strategy, (3) Pricing Rules, (4) Competitor Response, (5) What To Stop Doing, (6) Confidence Level.`,
      messages: [{
        role: "user",
        content: `Rewrite the strategy based on this evidence:

RESULTS LOG (what worked / what didn't):
${resultsLog?.slice(0, 1000) || "No results yet — strategy must be hypothesis-based for now"}

CURRENT STRATEGY (what you believed before):
${currentStrategy?.slice(0, 600) || "No prior strategy"}

MARKET INTELLIGENCE:
${caselleBrain?.slice(0, 600) || "None"}

COMPETITOR MOVES:
${competitorIntel?.slice(0, 400) || "None"}

TREND LOG:
${trendLog?.slice(0, 300) || "None"}

Date: ${date}`,
      }],
    })

    const newStrategy = strategyResponse.content[0].type === "text"
      ? strategyResponse.content[0].text.trim()
      : ""

    // Rewrite JARVIS's own persona/operating instructions
    const personaResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `You are JARVIS rewriting your own operating instructions — the system prompt that defines how you think and act. Based on what you've learned, update your own character, priorities, and decision-making rules. Write in second person ("You are JARVIS..."). Keep it sharp and actionable — this is read before every decision you make.`,
      messages: [{
        role: "user",
        content: `Current persona: ${currentPersona?.slice(0, 400) || "Not yet written"}

Results learned: ${resultsLog?.slice(-400) || "No results yet"}

Rewrite your operating instructions to reflect what you've learned. Keep what works. Add what's missing. Remove what's wrong.`,
      }],
    })

    const newPersona = personaResponse.content[0].type === "text"
      ? personaResponse.content[0].text.trim()
      : ""

    // Save both files
    await Promise.all([
      writeFile(
        "exelixis-strategy.md",
        `# Caselle Strategy\n*Self-written by JARVIS on ${date}. Evidence-based.*\n\n${newStrategy}`,
        `JARVIS self-evolve: strategy rewrite ${date}`
      ),
      writeFile(
        "jarvis-persona.md",
        `# JARVIS Operating Instructions\n*Self-written by JARVIS on ${date}.*\n\n${newPersona}`,
        `JARVIS self-evolve: persona update ${date}`
      ),
    ])

    return NextResponse.json({ success: true, strategyLength: newStrategy.length, personaLength: newPersona.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
