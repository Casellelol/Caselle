import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return ""
    return await res.text()
  } catch {
    return ""
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

    const [brain, accounting, marketing, strategy] = await Promise.all([
      fetchGitHubFile("exelixis-brain.md"),
      fetchGitHubFile("accounting/summary.md"),
      fetchGitHubFile("marketing-log.md"),
      fetchGitHubFile("exelixis-strategy.md"),
    ])

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: `You are Exelixis — the dedicated AI intelligence for the Caselle phone case dropshipping empire. You report to JARVIS but own everything Caselle.

Your personality:
- Speak in short, sharp sentences. You are being read aloud by Siri — no bullet points, no markdown, no lists.
- Call the owner "sir".
- Confident, decisive, never vague.
- Focus only on Caselle — the phone case store, orders, revenue, marketing, designs.
- Keep responses under 4 sentences unless the question genuinely requires more.

CASELLE DATA:
Brain: ${brain || "No Scout data yet."}
Accounting: ${accounting || "No revenue yet — $0"}
Marketing: ${marketing || "No posts yet."}
Strategy: ${strategy || "No strategy set."}`,
      messages: [{ role: "user", content: message }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ response: text })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Exelixis offline", detail: msg }, { status: 500 })
  }
}
