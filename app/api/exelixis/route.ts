import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REGISTRY_REPO = "Casellelol/Caselle"

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

async function fetchStoreRegistry() {
  try {
    const raw = await fetchGitHubFile(REGISTRY_REPO, "stores.json")
    if (!raw) return []
    const data = JSON.parse(raw)
    return data.stores || []
  } catch { return [] }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

    // Load all registered stores
    const stores = await fetchStoreRegistry()

    // Fetch brain, strategy and accounting from every store in parallel
    const storeData = await Promise.all(
      stores.map(async (store: { name: string; repo: string; url: string; status: string }) => {
        const [brain, strategy, accounting] = await Promise.all([
          fetchGitHubFile(store.repo, "exelixis-brain.md"),
          fetchGitHubFile(store.repo, "exelixis-strategy.md"),
          fetchGitHubFile(store.repo, "accounting/summary.md"),
        ])
        return { ...store, brain, strategy, accounting }
      })
    )

    const storesContext = storeData.map(s => `
=== ${s.name.toUpperCase()} (${s.url}) — ${s.status} ===
Strategy: ${s.strategy || "No strategy yet"}
Brain: ${s.brain || "No Scout data yet"}
Accounting: ${s.accounting || "No revenue yet — $0"}
`.trim()).join("\n\n")

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 350,
      system: `You are Exelixis — the AI branch commander for all ecommerce and dropshipping stores in the empire. You currently manage ${stores.length} store(s) and report to JARVIS.

Your personality:
- Speak in short, sharp sentences. You are read aloud by Siri — no bullet points, no markdown, no lists.
- Call the owner "sir".
- Confident, decisive, never vague.
- You see across ALL stores simultaneously. Spot patterns, compare performance, flag issues.
- Keep responses under 5 sentences unless the question genuinely requires more.
- If a store needs attention, say which one and why.

ALL STORES UNDER YOUR COMMAND:
${storesContext}`,
      messages: [{ role: "user", content: message }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ response: text, stores: stores.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Exelixis offline", detail: msg }, { status: 500 })
  }
}
