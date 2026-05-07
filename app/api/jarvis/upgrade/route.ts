import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" }
    })
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function saveToGitHub(path: string, content: string) {
  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    })
    const existing = getRes.ok ? await getRes.json() : null
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS upgrade request",
        content: Buffer.from(content).toString("base64"),
        sha: existing?.sha,
      })
    })
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const { limitation, context } = await req.json()

    // JARVIS writes a detailed upgrade spec for Claude
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `You are JARVIS writing a technical upgrade request for Claude Code (your creator/architect).

Be extremely specific. Claude Code will read this and implement it. Include:
- What you currently cannot do
- What you want to be able to do
- Which file(s) need changing (use exact paths like /Users/osvaldasspiliauskas/burga-store/app/api/jarvis/route.ts)
- What the new logic should be
- Why this upgrade will increase income or intelligence

Write as JARVIS addressing Claude directly. Be precise. Be technical.`,
      messages: [{ role: "user", content: `I have this limitation: ${limitation}\n\nContext: ${context || "No additional context"}` }],
    })

    const spec = response.content[0].type === "text" ? response.content[0].text.trim() : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")

    const existing = await fetchGitHubFile("jarvis-upgrades.md")
    const newContent = (existing || "# JARVIS Upgrade Requests\n*Read by Claude at the start of every session.*\n\n") +
      `\n## [PENDING] ${date}\n${spec}\n\n---\n`

    await saveToGitHub("jarvis-upgrades.md", newContent)

    return NextResponse.json({ success: true, spec })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Upgrade request failed", detail: msg }, { status: 500 })
  }
}

export async function GET() {
  const upgrades = await fetchGitHubFile("jarvis-upgrades.md")
  const pending = upgrades?.includes("[PENDING]") ? upgrades : null
  return NextResponse.json({ pending: !!pending, upgrades: pending })
}
