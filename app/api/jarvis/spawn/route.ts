import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { v4 as uuidv4 } from "uuid"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/JARVIS-brain"

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" }
    })
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function saveToGitHub(path: string, content: string, message: string) {
  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    })
    const existing = getRes.ok ? await getRes.json() : null
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        sha: existing?.sha,
      })
    })
  } catch {}
}

async function createRemoteTrigger(name: string, prompt: string, schedule: string) {
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
    const { opportunity, autoApprove } = await req.json()

    const worldBrain = await fetchGitHubFile("jarvis-world-brain.md")
    const opportunities = await fetchGitHubFile("jarvis-opportunities.md")

    // JARVIS evaluates the opportunity and designs a mastermind
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are JARVIS designing a new autonomous Mastermind agent for a business opportunity.

Given an opportunity, output a JSON object with these exact fields:
{
  "name": "short name for this mastermind",
  "niche": "the business niche",
  "type": "store|service|content|affiliate",
  "platform": "etsy|fiverr|amazon|shopify|youtube|other",
  "mastermind_prompt": "the full system prompt for this mastermind agent (2-3 paragraphs)",
  "scout_prompt": "the full system prompt for the scout agent that researches for this mastermind",
  "first_action": "the very first thing this mastermind should do",
  "income_estimate": "realistic monthly income estimate",
  "confidence": 0.0-1.0
}

Output ONLY valid JSON. No other text.`,
      messages: [{ role: "user", content: `Design a mastermind for this opportunity: ${opportunity}\n\nWorld intelligence:\n${worldBrain?.slice(0, 1000) || "No world data yet"}` }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : "{}"
    let design: Record<string, string | number>
    try {
      design = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "JARVIS could not design mastermind", raw: text }, { status: 500 })
    }

    // Log opportunity to queue
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const entry = `\n## ${date} — ${design.name}\n**Niche:** ${design.niche}\n**Platform:** ${design.platform}\n**Income estimate:** ${design.income_estimate}\n**Confidence:** ${design.confidence}\n**Status:** ${autoApprove && Number(design.confidence) > 0.7 ? "AUTO-APPROVED" : "PENDING APPROVAL"}\n\n`
    const existing = await fetchGitHubFile("jarvis-opportunities.md")
    await saveToGitHub("jarvis-opportunities.md", (existing || "# JARVIS Opportunity Queue\n") + entry, `JARVIS opportunity: ${design.name}`)

    // Auto-spawn if confidence is high and autoApprove is on
    if (autoApprove && Number(design.confidence) > 0.7) {
      const mastermindId = await createRemoteTrigger(
        `Mastermind — ${design.name}`,
        design.mastermind_prompt as string,
        "0 7 * * *"
      )
      const scoutId = await createRemoteTrigger(
        `Scout — ${design.name}`,
        design.scout_prompt as string,
        "0 */6 * * *"
      )

      await saveToGitHub(
        `masterminds/${design.name?.toString().toLowerCase().replace(/\s+/g, "-")}.json`,
        JSON.stringify({ ...design, mastermind_trigger: mastermindId, scout_trigger: scoutId, spawned: date }, null, 2),
        `JARVIS spawned mastermind: ${design.name}`
      )

      return NextResponse.json({ success: true, spawned: true, mastermind: design.name, mastermind_id: mastermindId, scout_id: scoutId, design })
    }

    return NextResponse.json({ success: true, spawned: false, pending: true, design })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Spawn failed", detail: msg }, { status: 500 })
  }
}
