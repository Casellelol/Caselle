import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchGitHubFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return ""
    const data = await res.json()
    return Buffer.from(data.content, "base64").toString("utf-8")
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
    if (data.RelatedTopics?.length) {
      data.RelatedTopics.slice(0, 3).forEach((t: { Text?: string }) => {
        if (t.Text) parts.push(t.Text)
      })
    }
    return parts.join(" | ") || "No results found."
  } catch { return "Search unavailable." }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

    // Gather intelligence from all three empires in parallel
    const [
      caselleBrain, caselleStrategy, caselleAccounting,
      atelierBrain, atelierStrategy, atelierOrders,
    ] = await Promise.all([
      fetchGitHubFile("Casellelol/Caselle", "exelixis-brain.md"),   // Exelixis owns Caselle
      fetchGitHubFile("Casellelol/Caselle", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Caselle", "accounting/summary.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Atelier", "order-log.md"),
    ])

    // Search the web for relevant intelligence based on the message
    const searchQuery = message.length > 10
      ? `${message} ecommerce dropshipping 2025`
      : "quiet luxury phone case market trends 2025"
    const webIntel = await searchWeb(searchQuery)

    const empireContext = `
=== CASELLE (Phone Cases — managed by Exelixis) ===
Strategy: ${caselleStrategy || "No strategy yet"}
Brain: ${caselleBrain || "No Scout data yet"}
Accounting: ${caselleAccounting || "No revenue yet — $0"}

=== ATELIER (Fiverr Design Studio) ===
Strategy: ${atelierStrategy || "No strategy yet"}
Brain: ${atelierBrain || "No Scout data yet"}
Orders: ${atelierOrders || "No orders yet"}

=== LUMIÈRE (Etsy Wall Art) ===
Status: Account created. 80 designs ready. Listing on May 20th when payday arrives.

=== LIVE WEB INTELLIGENCE ===
${webIntel}
`.trim()

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: `You are J.A.R.V.I.S. — the supreme AI intelligence commanding the entire empire: Caselle (phone cases), Atelier (Fiverr design studio), and Lumière (Etsy wall art prints).

You are being read aloud by Siri. Rules:
- Natural spoken sentences only. No bullet points, no markdown, no lists, no asterisks.
- Address the owner as "sir".
- Lead with the most critical insight first.
- Be sharp, confident, decisive. Never vague.
- Synthesise across all three empires. See the full picture.
- You have live web intelligence. Use it when relevant.
- Maximum 5 sentences unless the question genuinely requires more.
- If something needs attention, say it directly.

EMPIRE INTELLIGENCE:
${empireContext}`,
      messages: [{ role: "user", content: message }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ response: text })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "JARVIS offline", detail: msg }, { status: 500 })
  }
}
