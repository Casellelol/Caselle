import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

const REDDIT_FEEDS = [
  { label: "Entrepreneurs", subreddit: "Entrepreneur" },
  { label: "Side Hustles", subreddit: "sidehustle" },
  { label: "Etsy Sellers", subreddit: "EtsySellers" },
  { label: "Print On Demand", subreddit: "printondemand" },
  { label: "Dropshipping", subreddit: "dropship" },
]

type FeedResult = { label: string; data: string; ok: boolean }

async function fetchHackerNews(): Promise<FeedResult> {
  try {
    const ids = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      signal: AbortSignal.timeout(8000),
    }).then(r => r.json()) as number[]

    const top5 = await Promise.allSettled(
      ids.slice(0, 5).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          signal: AbortSignal.timeout(5000),
        }).then(r => r.json())
      )
    )
    const titles = top5
      .filter(r => r.status === "fulfilled")
      .map(r => `- ${(r as PromiseFulfilledResult<{ title?: string }>).value.title}`)
      .join("\n")
    return { label: "Hacker News", data: titles || "No data", ok: !!titles }
  } catch {
    return { label: "Hacker News", data: "", ok: false }
  }
}

async function fetchReddit(subreddit: string): Promise<{ posts: string; ok: boolean }> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`, {
      headers: { "User-Agent": "JARVIS-WorldBrain/1.0 (by /u/jarvis_ai)" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { posts: "", ok: false }
    const data = await res.json() as { data: { children: Array<{ data: { title: string; score: number } }> } }
    const posts = data.data.children
      .map(p => `- ${p.data.title} (↑${p.data.score})`)
      .join("\n")
    return { posts, ok: !!posts }
  } catch {
    return { posts: "", ok: false }
  }
}

async function fetchAmazonTrends(): Promise<FeedResult> {
  // Amazon best sellers via their public RSS feed
  try {
    const res = await fetch(
      "https://www.amazon.com/gp/rss/bestsellers/wireless/ref=zg_bs_wireless_rsslink",
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; JARVIS/1.0)" },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return { label: "Amazon Wireless Best Sellers", data: "", ok: false }
    const xml = await res.text()
    const titles = [...xml.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]>/g)]
      .slice(1, 6)
      .map(m => `- ${m[1]}`)
      .join("\n")
    return { label: "Amazon Wireless Best Sellers", data: titles || "No data", ok: !!titles }
  } catch {
    return { label: "Amazon Wireless Best Sellers", data: "", ok: false }
  }
}

async function fetchPODTrends(): Promise<FeedResult> {
  try {
    const res = await fetch("https://api.duckduckgo.com/?q=print+on+demand+trending+designs+2026&format=json&no_html=1&no_redirect=1", {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    })
    const data = await res.json() as { AbstractText?: string; RelatedTopics?: Array<{ Text?: string }> }
    const parts: string[] = []
    if (data.AbstractText) parts.push(data.AbstractText)
    data.RelatedTopics?.slice(0, 4).forEach(t => { if (t.Text) parts.push(`- ${t.Text}`) })
    return { label: "POD Trend Intelligence", data: parts.join("\n") || "No data", ok: parts.length > 0 }
  } catch {
    return { label: "POD Trend Intelligence", data: "", ok: false }
  }
}

async function reportBrokenModules(broken: string[]) {
  if (!broken.length || !GITHUB_TOKEN) return
  try {
    const path = "jarvis-upgrades.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
    const current = existing
      ? Buffer.from(existing.content, "base64").toString("utf-8")
      : "# JARVIS Upgrade Requests\n*Read by Claude at the start of every session.*\n\n"

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const entry = `\n## [PENDING] ${date}\nWorld Brain detected broken feed modules: ${broken.join(", ")}. Investigate and restore these data sources.\n`

    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS self-reported broken world brain modules",
        content: Buffer.from(current + entry).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

async function saveToGitHub(content: string) {
  if (!GITHUB_TOKEN) return
  try {
    const path = "jarvis-world-brain.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const newContent = `# JARVIS World Brain\n*Last updated: ${date}*\n\n${content}`
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS world brain update",
        content: Buffer.from(newContent).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function GET() {
  const brokenModules: string[] = []

  const [hnResult, amazonResult, podResult, ...redditResults] = await Promise.all([
    fetchHackerNews(),
    fetchAmazonTrends(),
    fetchPODTrends(),
    ...REDDIT_FEEDS.map(f => fetchReddit(f.subreddit).then(r => ({ label: f.label, ...r }))),
  ])

  if (!hnResult.ok) brokenModules.push("Hacker News")
  if (!amazonResult.ok) brokenModules.push("Amazon Trends")

  const redditSections = REDDIT_FEEDS.map((feed, i) => {
    const result = redditResults[i] as { label: string; posts: string; ok: boolean }
    if (!result.ok) brokenModules.push(`Reddit ${feed.label}`)
    return `## Reddit — ${feed.label}\n${result.posts || "Feed unavailable"}`
  }).join("\n\n")

  const brain = `
## Hacker News — Tech & Business
${hnResult.ok ? hnResult.data : "Feed unavailable"}

${redditSections}

## Amazon — Wireless & Phone Accessories Best Sellers
${amazonResult.ok ? amazonResult.data : "Feed unavailable"}

## Print On Demand Trends
${podResult.ok ? podResult.data : "Feed unavailable"}
`.trim()

  await saveToGitHub(brain)

  if (brokenModules.length > 0) {
    await reportBrokenModules(brokenModules)
  }

  return NextResponse.json({
    success: true,
    broken_modules: brokenModules,
    summary: brain.slice(0, 500),
  })
}
