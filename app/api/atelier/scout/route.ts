import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchAtelierTrends(): Promise<string> {
  try {
    const sources = [
      "https://www.reddit.com/r/handmade/hot.json?limit=8",
      "https://www.reddit.com/r/artisan/hot.json?limit=5",
      "https://www.reddit.com/r/Etsy/hot.json?limit=8",
      "https://www.reddit.com/r/Pottery/hot.json?limit=5",
      "https://www.reddit.com/r/leathercraft/hot.json?limit=5",
    ]
    const results = await Promise.all(
      sources.map(url =>
        fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
          .then(r => r.json())
          .then(d => {
            const sub = url.match(/r\/(\w+)/)?.[1] || "unknown"
            const titles = d.data?.children?.map((p: { data: { title: string } }) => p.data.title).join(" | ") || ""
            return `[${sub}]: ${titles}`
          })
          .catch(() => "")
      )
    )
    return results.filter(Boolean).join("\n")
  } catch { return "" }
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/atelier-brain.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/atelier-brain.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Atelier Scout update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const trendData = await fetchAtelierTrends()

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the Atelier Scout — market intelligence agent for a luxury artisan goods brand. Analyse handmade/craft market trends and produce a concise report covering: top 3 rising craft aesthetics, recommended product directions for an artisan store, Etsy pricing observations, in-demand materials and techniques, and one high-confidence opportunity. Be specific and actionable.`,
      messages: [{ role: "user", content: `Artisan market trends:\n${trendData}` }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Atelier Scout — Market Intelligence\n*Last updated: ${date}*\n\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
