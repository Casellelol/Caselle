import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function fetchRedditEngagement(topic: string): Promise<string> {
  try {
    const searches = [
      `https://www.reddit.com/r/streetwear/search.json?q=${encodeURIComponent(topic)}&sort=hot&limit=3`,
      `https://www.reddit.com/r/femalefashionadvice/search.json?q=${encodeURIComponent(topic)}&sort=hot&limit=3`,
    ]
    const results = await Promise.all(
      searches.map(url =>
        fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
          .then(r => r.json())
          .then(d => d.data?.children?.map((p: { data: { title: string; score: number; num_comments: number } }) =>
            `"${p.data.title}" — ${p.data.score} upvotes, ${p.data.num_comments} comments`
          ).join(" | ") || "")
          .catch(() => "")
      )
    )
    return results.filter(Boolean).join("\n")
  } catch { return "" }
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/social-performance.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/social-performance.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Social performance update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    // Read what's been posted and what's trending
    const [exelixisBrain, publishedProducts] = await Promise.all([
      fetchFile("exelixis-brain.md"),
      fetchFile("published-products.md"),
    ])

    // Extract design names from brain to check Reddit engagement
    const aesthetics = ["coquette phone case", "celestial phone case", "dark academia phone case", "y2k phone case"]
    const engagementData = await Promise.all(
      aesthetics.map(a => fetchRedditEngagement(a).then(r => `[${a}]:\n${r || "No data"}`))
    )

    const context = `
PUBLISHED PRODUCTS:\n${publishedProducts?.slice(0, 500) || "None yet"}

REDDIT ENGAGEMENT BY NICHE:
${engagementData.join("\n\n")}

MARKET INTEL CONTEXT:\n${exelixisBrain?.slice(0, 400) || "None"}
`.trim()

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system: `You are the Social Performance agent for a phone case brand. Analyse engagement signals and produce a weekly social performance report covering: (1) Which aesthetics have the highest community engagement right now, (2) Content format recommendations based on what's getting upvotes/comments, (3) Hashtag and caption strategy per aesthetic, (4) One high-momentum content idea to post this week. Be specific and data-driven.`,
      messages: [{ role: "user", content: context }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Social Performance Report\n*Generated: ${date}*\n\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
