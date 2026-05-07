import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

const WORLD_FEEDS = [
  { name: "Hacker News", url: "https://hacker-news.firebaseio.com/v0/topstories.json" },
  { name: "Reddit Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur/hot.json?limit=5" },
  { name: "Reddit SideHustle", url: "https://www.reddit.com/r/sidehustle/hot.json?limit=5" },
  { name: "Reddit Etsy", url: "https://www.reddit.com/r/Etsy/hot.json?limit=5" },
  { name: "Product Hunt", url: "https://www.producthunt.com/feed" },
]

async function fetchHackerNews(): Promise<string> {
  try {
    const ids = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(r => r.json())
    const top5 = await Promise.all(
      ids.slice(0, 5).map((id: number) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
      )
    )
    return top5.map((s: { title?: string; url?: string }) => `- ${s.title}`).join("\n")
  } catch { return "" }
}

async function fetchReddit(subreddit: string): Promise<string> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`, {
      headers: { "User-Agent": "JARVIS-WorldBrain/1.0" }
    })
    const data = await res.json()
    return data.data.children
      .map((p: { data: { title: string } }) => `- ${p.data.title}`)
      .join("\n")
  } catch { return "" }
}

async function searchTrends(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const parts: string[] = []
    if (data.AbstractText) parts.push(data.AbstractText)
    data.RelatedTopics?.slice(0, 3).forEach((t: { Text?: string }) => {
      if (t.Text) parts.push(t.Text)
    })
    return parts.join(" | ")
  } catch { return "" }
}

async function saveToGitHub(content: string) {
  try {
    const path = "jarvis-world-brain.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    })
    const existing = getRes.ok ? await getRes.json() : null
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const newContent = `# JARVIS World Brain\n*Last updated: ${date}*\n\n${content}`
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS world brain update",
        content: Buffer.from(newContent).toString("base64"),
        sha: existing?.sha,
      })
    })
  } catch {}
}

export async function GET() {
  const [hn, entrepreneur, sidehustle, etsy, ecomTrends, printTrends] = await Promise.all([
    fetchHackerNews(),
    fetchReddit("Entrepreneur"),
    fetchReddit("sidehustle"),
    fetchReddit("Etsy"),
    searchTrends("ecommerce dropshipping trends 2025"),
    searchTrends("print on demand bestsellers 2025"),
  ])

  const brain = `
## Hacker News — Tech & Business
${hn || "No data"}

## Reddit — Entrepreneurs
${entrepreneur || "No data"}

## Reddit — Side Hustles
${sidehustle || "No data"}

## Reddit — Etsy Sellers
${etsy || "No data"}

## Ecommerce Trends
${ecomTrends || "No data"}

## Print On Demand Trends
${printTrends || "No data"}
`.trim()

  await saveToGitHub(brain)
  return NextResponse.json({ success: true, summary: brain.slice(0, 500) })
}
