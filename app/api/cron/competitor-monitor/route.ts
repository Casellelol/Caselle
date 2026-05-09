import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

async function scrapeBurga(): Promise<string> {
  try {
    const res = await fetch("https://burga.com/collections/iphone-cases", {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    const prices = (html.match(/\$[\d.]+/g) || []).slice(0, 10)
    const titles = (html.match(/"title":"([^"]{5,60})"/g) || [])
      .slice(0, 8).map(m => m.replace(/"title":"/, "").replace(/"$/, ""))
    return `BURGA prices: ${prices.join(", ")} | Products: ${titles.join(" | ")}`
  } catch { return "" }
}

async function scrapeCasetify(): Promise<string> {
  try {
    const res = await fetch("https://www.casetify.com/collections/iphone-cases", {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    const prices = (html.match(/\$[\d.]+/g) || []).slice(0, 10)
    const titles = (html.match(/"name":"([^"]{5,60})"/g) || [])
      .slice(0, 8).map(m => m.replace(/"name":"/, "").replace(/"$/, ""))
    return `Casetify prices: ${prices.join(", ")} | Products: ${titles.join(" | ")}`
  } catch { return "" }
}

async function scrapePela(): Promise<string> {
  try {
    const res = await fetch("https://pelacase.com/collections/iphone-cases", {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    const prices = (html.match(/\$[\d.]+/g) || []).slice(0, 10)
    const titles = (html.match(/"title":"([^"]{5,60})"/g) || [])
      .slice(0, 8).map(m => m.replace(/"title":"/, "").replace(/"$/, ""))
    return `Pela prices: ${prices.join(", ")} | Products: ${titles.join(" | ")}`
  } catch { return "" }
}

async function scrapeEtsySearch(query: string): Promise<string> {
  try {
    const url = `https://www.etsy.com/search?q=${encodeURIComponent(query)}&explicit=1`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html",
      },
    })
    if (!res.ok) return ""
    const html = await res.text()
    // Extract product titles from Etsy HTML
    const titleMatches = html.match(/"title":"([^"]{10,80})"/g) || []
    const priceMatches = html.match(/\$[\d.]+/g) || []
    const titles = titleMatches.slice(0, 10).map(m => m.replace(/"title":"/, "").replace(/"$/, ""))
    const prices = priceMatches.slice(0, 10)
    return `Titles: ${titles.join(" | ")}\nPrices seen: ${prices.join(", ")}`
  } catch { return "" }
}

async function fetchRedditCompetitors(query: string): Promise<string> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=hot&limit=5`
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
    const data = await res.json()
    const posts = data.data?.children?.map((p: { data: { title: string; subreddit: string } }) =>
      `[${p.data.subreddit}] ${p.data.title}`
    ) || []
    return posts.join(" | ")
  } catch { return "" }
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/competitor-intel.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/competitor-intel.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Competitor monitor update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const niches = [
      "phone case dark academia",
      "phone case celestial witch",
      "phone case coquette aesthetic",
      "phone case booktok",
      "phone case y2k",
    ]

    const [etsyResults, redditResults, burga, casetify, pela] = await Promise.all([
      Promise.all(niches.map(q => scrapeEtsySearch(q).then(r => `[${q}]: ${r}`))),
      Promise.all(niches.map(q => fetchRedditCompetitors(`${q} phone case`).then(r => `[${q}]: ${r}`))),
      scrapeBurga(),
      scrapeCasetify(),
      scrapePela(),
    ])

    const rawData = `DIRECT COMPETITORS:
${burga || "BURGA: unavailable"}
${casetify || "Casetify: unavailable"}
${pela || "Pela: unavailable"}

ETSY MARKET:
${etsyResults.join("\n")}

REDDIT SIGNALS:
${redditResults.join("\n")}`

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are the Competitor Monitor for a phone case dropshipping empire (Caselle). Analyse the market data and produce intelligence on:
(1) BURGA, Casetify, Pela — their price points and what they're pushing
(2) Which niches these big players dominate (avoid head-on)
(3) Gaps where no dominant player owns the space yet
(4) One specific immediately actionable opportunity — name the niche, the price point, the angle
Be specific and decisive. No hedging.`,
      messages: [{ role: "user", content: rawData }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Competitor Intelligence\n*Last updated: ${date}*\n\n## Raw Data\n\`\`\`\n${rawData.slice(0, 800)}\n\`\`\`\n\n## Analysis\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
