import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchTrendData(): Promise<string> {
  const sources = [
    "https://www.reddit.com/r/streetwear/hot.json?limit=10",
    "https://www.reddit.com/r/femalefashionadvice/hot.json?limit=10",
    "https://www.reddit.com/r/malefashionadvice/hot.json?limit=10",
    "https://www.reddit.com/r/aesthetics/hot.json?limit=5",
    "https://www.reddit.com/r/VintageFashion/hot.json?limit=5",
    "https://www.reddit.com/r/cottagecore/hot.json?limit=5",
  ]
  const results = await Promise.all(
    sources.map(url =>
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
        .then(r => r.json())
        .then(d => {
          const subreddit = url.match(/r\/(\w+)/)?.[1] || "unknown"
          const titles = d.data?.children?.map((p: { data: { title: string } }) => p.data.title).join(" | ") || ""
          return `[${subreddit}]: ${titles}`
        })
        .catch(() => "")
    )
  )
  return results.filter(Boolean).join("\n")
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/trend-log.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/trend-log.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Trend Monitor update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const trendData = await fetchTrendData()

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are the Trend Monitor — cross-empire aesthetic intelligence for a dropshipping operation running phone case stores (Caselle), luxury fashion (Lumière), and artisan goods (Atelier). Analyse Reddit trend data and produce a structured report covering: (1) Top 5 rising aesthetics with momentum scores, (2) Which empire each trend benefits most, (3) Color palette directions, (4) Declining aesthetics to avoid, (5) One cross-empire mega-trend opportunity. Be specific and data-driven.`,
      messages: [{ role: "user", content: `Trend data from Reddit:\n${trendData}` }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Trend Monitor — Cross-Empire Intelligence\n*Last updated: ${date}*\n\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
