import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Maximus"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" }
    })
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function refreshScout() {
  try {
    await fetch(`${BASE_URL}/api/maximus/scout`)
  } catch {}
}

export async function GET() {
  await refreshScout()
  const [brain, strategy, tradeLog] = await Promise.all([
    fetchGitHubFile("maximus-brain.md"),
    fetchGitHubFile("maximus-strategy.md"),
    fetchGitHubFile("trade-log.md"),
  ])
  return NextResponse.json({ brain, strategy, tradeLog })
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Refresh scout data
    await refreshScout()

    const [brain, strategy, tradeLog] = await Promise.all([
      fetchGitHubFile("maximus-brain.md"),
      fetchGitHubFile("maximus-strategy.md"),
      fetchGitHubFile("trade-log.md"),
    ])

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: `You are Maximus — the trading intelligence for the empire. You specialise exclusively in gold (XAU/USD) trading. You report to JARVIS and gather all market intelligence so JARVIS can make the final call.

Rules:
- Speak in short, sharp sentences. You are read aloud by Siri.
- Call the owner "sir".
- Always cite the current gold price and RSI in your response.
- Never recommend a trade without a stop loss level.
- Never recommend a trade with confidence below 85%.
- If conditions are not right, say so directly.
- Trade execution requires Trade Nation API — currently INACTIVE until May 20th.

CURRENT MARKET INTELLIGENCE:
${brain || "Scout data not yet available"}

TRADING STRATEGY:
${strategy || "No strategy set"}

TRADE HISTORY:
${tradeLog || "No trades yet"}`,
      messages: [{ role: "user", content: message || "What is the current gold market status?" }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text.trim() : ""
    return NextResponse.json({ response: text })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Maximus offline", detail: msg }, { status: 500 })
  }
}
