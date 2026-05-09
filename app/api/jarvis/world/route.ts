import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

// DuckDuckGo instant answer
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

// Generic RSS parser — works for any standard RSS/Atom feed
async function fetchRSS(url: string, limit = 6): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS-Reader/1.0)", "Accept": "application/rss+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ""
    const xml = await res.text()
    // CDATA titles first, then plain titles
    const cdata = [...xml.matchAll(/<title><!\[CDATA\[([^\]]{15,})\]\]><\/title>/g)].map(m => m[1].trim())
    const plain = [...xml.matchAll(/<title>([^<]{15,})<\/title>/g)].map(m => m[1].trim())
    const titles = (cdata.length > 0 ? cdata : plain)
      .filter(t => !t.match(/^(http|www\.)/i))
      .slice(0, limit)
    return titles.map(t => `- ${t}`).join("\n")
  } catch { return "" }
}

// Product Hunt — trending new products
async function fetchProductHunt(): Promise<string> {
  return fetchRSS("https://www.producthunt.com/feed", 6)
}

// Entrepreneur magazine
async function fetchEntrepreneur(): Promise<string> {
  return fetchRSS("https://feeds.feedburner.com/entrepreneur/latest", 6)
}

// Inc.com
async function fetchInc(): Promise<string> {
  return fetchRSS("https://www.inc.com/rss", 5)
}

// POD-specific searches via DuckDuckGo
async function fetchPODIntel(): Promise<string> {
  const queries = [
    "trending phone case designs 2026 aesthetic coquette",
    "print on demand bestsellers viral products 2026",
    "phone case TikTok viral trend 2026",
  ]
  const results = await Promise.all(queries.map(q => ddgSearch(q)))
  return results.filter(Boolean).join("\n\n")
}

// Amazon trends via targeted search
async function fetchAmazonTrends(): Promise<string> {
  const queries = [
    "amazon best sellers phone cases accessories trending 2026",
    "amazon movers shakers gifts popular products now",
  ]
  const results = await Promise.all(queries.map(q => ddgSearch(q)))
  return results.filter(Boolean).join("\n")
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
  const [
    hn,
    entrepreneur, inc, productHunt,
    pod, amazonTrends, ecomTrend, phoneTrend,
  ] = await Promise.all([
    fetchHN(),
    fetchEntrepreneur(),
    fetchInc(),
    fetchProductHunt(),
    fetchPODIntel(),
    fetchAmazonTrends(),
    ddgSearch("ecommerce dropshipping product trends 2026"),
    ddgSearch("phone case market trending designs viral 2026"),
  ])

  const brain = `
## Hacker News — Tech & Business
${hn || "Unavailable this cycle"}

## Entrepreneur Magazine — Latest
${entrepreneur || "Feed unavailable"}

## Inc.com — Business News
${inc || "Feed unavailable"}

## Product Hunt — New Products Trending
${productHunt || "Feed unavailable"}

## Amazon Trends
${amazonTrends || "No data"}

## Print On Demand Intelligence
${pod || "No data"}

## Ecommerce Trends
${ecomTrend || "No data"}

## Phone Case Market
${phoneTrend || "No data"}
`.trim()

  await saveToGitHub(brain)

  return NextResponse.json({ success: true, summary: brain.slice(0, 500) })
}
