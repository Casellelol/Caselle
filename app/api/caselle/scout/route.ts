import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchTrends(): Promise<string> {
  try {
    const searches = [
      "https://www.reddit.com/r/streetwear/hot.json?limit=5",
      "https://www.reddit.com/r/femalefashionadvice/hot.json?limit=5",
      "https://www.reddit.com/r/malelivingspace/hot.json?limit=5",
    ]
    const results = await Promise.all(
      searches.map(url =>
        fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
          .then(r => r.json())
          .then(d => d.data?.children?.map((p: { data: { title: string } }) => p.data.title).join(" | ") || "")
          .catch(() => "")
      )
    )
    return results.join("\n")
  } catch { return "" }
}

async function fetchEtsyTrends(): Promise<string> {
  try {
    const r = await fetch(
      "https://www.reddit.com/r/Etsy/hot.json?limit=5",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const d = await r.json()
    return d.data?.children?.map((p: { data: { title: string } }) => p.data.title).join(" | ") || ""
  } catch { return "" }
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/exelixis-brain.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/exelixis-brain.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Caselle Scout update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const [fashionTrends, etsyTrends] = await Promise.all([fetchTrends(), fetchEtsyTrends()])

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the Caselle Scout — market intelligence agent for a phone case dropshipping store. Analyse the trend data and produce a concise intelligence report covering: top 3 rising aesthetics, recommended design directions, competitor pricing observations, and one high-confidence opportunity. Be specific and actionable.`,
      messages: [{ role: "user", content: `Fashion trends:\n${fashionTrends}\n\nEtsy market:\n${etsyTrends}` }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Caselle Scout — Market Intelligence\n*Last updated: ${date}*\n\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
