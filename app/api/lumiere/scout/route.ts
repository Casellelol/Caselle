import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchLuxuryTrends(): Promise<string> {
  try {
    const sources = [
      "https://www.reddit.com/r/femalefashionadvice/hot.json?limit=10",
      "https://www.reddit.com/r/malefashionadvice/hot.json?limit=8",
      "https://www.reddit.com/r/luxury/hot.json?limit=8",
      "https://www.reddit.com/r/frugalmalefashion/hot.json?limit=5",
      "https://www.reddit.com/r/fashionadvice/hot.json?limit=5",
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
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/lumiere-brain.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/lumiere-brain.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Lumière Scout update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const trendData = await fetchLuxuryTrends()

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the Lumière Scout — market intelligence agent for a luxury fashion brand. Analyse fashion trends and produce a premium market intelligence report covering: top 3 rising luxury aesthetics, recommended product directions for a high-end fashion store, competitive pricing in the premium segment, trending silhouettes and materials, and one high-confidence luxury opportunity. Think Vogue meets Bloomberg. Be specific and elevation-focused.`,
      messages: [{ role: "user", content: `Fashion market data:\n${trendData}` }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Lumière Scout — Market Intelligence\n*Last updated: ${date}*\n\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
