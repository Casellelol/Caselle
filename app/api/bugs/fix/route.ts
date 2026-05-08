import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function getRecentErrors(): Promise<string> {
  try {
    const getRes = await fetch(
      "https://api.github.com/repos/Casellelol/Caselle/contents/error-log.md",
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!getRes.ok) return "No error log found."
    const data = await getRes.json()
    return Buffer.from(data.content, "base64").toString("utf-8")
  } catch { return "" }
}

async function fileUpgradeRequest(description: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-upgrades.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  const current = existing ? Buffer.from(existing.content, "base64").toString("utf-8") : ""
  const date = new Date().toISOString().slice(0, 10)
  const newEntry = `\n## [PENDING] Bug Fix — ${date}\n${description}\n`
  const updated = current + newEntry

  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-upgrades.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Bug Fixer filed upgrade request",
      content: Buffer.from(updated).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const errorContext = body.error || await getRecentErrors()

    if (!errorContext) {
      return NextResponse.json({ success: true, message: "No errors to fix" })
    }

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the Bug Fixer agent for a Next.js dropshipping empire. Analyse error logs and produce a clear upgrade spec that Claude Code can implement. Format your response as a precise technical spec: what file to edit, what to change, and why. Be concrete — no vague suggestions.`,
      messages: [{ role: "user", content: `Error context:\n${errorContext}` }],
    })

    const spec = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    await fileUpgradeRequest(spec)

    return NextResponse.json({ success: true, spec })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  return POST(new Request("https://localhost", { method: "POST", body: JSON.stringify({}) }))
}
