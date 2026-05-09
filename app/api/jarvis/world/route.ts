import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

// DuckDuckGo instant answer — works reliably from Vercel
async function ddgSearch(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(6000) }
    )
    const d = await res.json() as { AbstractText?: string; RelatedTopics?: Array<{ Text?: string }> }
    const parts: string[] = []
    if (d.AbstractText) parts.push(d.AbstractText)
    d.RelatedTopics?.slice(0, 3).forEach(t => { if (t.Text) parts.push(`- ${t.Text}`) })
    return parts.join("\n") || ""
  } catch { return "" }
}

// Hacker News — always works
async function fetchHN(): Promise<string> {
  try {
    const ids = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      signal: AbortSignal.timeout(6000),
    }).then(r => r.json()) as number[]
    const items = await Promise.allSettled(
      ids.slice(0, 6).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: AbortSignal.timeout(4000) })
          .then(r => r.json())
      )
    )
    return items
      .filter(r => r.status === "fulfilled")
      .map(r => `- ${(r as PromiseFulfilledResult<{ title?: string }>).value.title}`)
      .join("\n")
  } catch { return "" }
}

// Reddit via public JSON — rotate agents, best-effort
async function fetchReddit(subreddit: string): Promise<string> {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    "facebookexternalhit/1.1",
  ]
  for (const ua of agents) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5&raw_json=1`, {
        headers: { "User-Agent": ua },
        signal: AbortSignal.timeout(6000),
      })
      if (!res.ok) continue
      const d = await res.json() as { data: { children: Array<{ data: { title: string; score: number } }> } }
      const posts = d.data.children.map(p => `- ${p.data.title} (↑${p.data.score})`).join("\n")
      if (posts) return posts
    } catch { continue }
  }
  return ""
}

// POD-specific searches via DuckDuckGo
async function fetchPODIntel(): Promise<string> {
  const queries = [
    "trending phone case designs 2026 aesthetic",
    "print on demand bestsellers coquette dark academia",
    "phone case TikTok viral 2026",
  ]
  const results = await Promise.all(queries.map(q => ddgSearch(q)))
  return results.filter(Boolean).join("\n\n")
}

async function saveToGitHub(content: string) {
  if (!GITHUB_TOKEN) return
  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/jarvis-world-brain.md`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { sha: string } : null
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    await fetch(`https://api.github.com/repos/${REPO}/contents/jarvis-world-brain.md`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS world brain update",
        content: Buffer.from(`# JARVIS World Brain\n*Last updated: ${date}*\n\n${content}`).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function GET() {
  const [hn, entrepreneur, sidehustle, etsy, pod, ecomTrend, phoneTrend] = await Promise.all([
    fetchHN(),
    fetchReddit("Entrepreneur"),
    fetchReddit("sidehustle"),
    fetchReddit("EtsySellers"),
    fetchPODIntel(),
    ddgSearch("ecommerce dropshipping product trends 2026"),
    ddgSearch("phone case market trending designs viral 2026"),
  ])

  const brain = `
## Hacker News — Tech & Business
${hn || "Unavailable this cycle"}

## Reddit — Entrepreneurs
${entrepreneur || "Rate limited this cycle"}

## Reddit — Side Hustles
${sidehustle || "Rate limited this cycle"}

## Reddit — Etsy Sellers
${etsy || "Rate limited this cycle"}

## Print On Demand Intelligence
${pod || "No data"}

## Ecommerce Trends
${ecomTrend || "No data"}

## Phone Case Market
${phoneTrend || "No data"}
`.trim()

  await saveToGitHub(brain)

  return NextResponse.json({ success: true, summary: brain.slice(0, 400) })
}
