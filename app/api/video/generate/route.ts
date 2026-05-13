import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function getTopProducts(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/exelixis-brain.md",
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return ""
    const data = await res.json()
    return Buffer.from(data.content, "base64").toString("utf-8").slice(0, 500)
  } catch { return "" }
}

async function saveBriefToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/video-brief.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/video-brief.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Video Generator weekly brief",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const storeContext = await getTopProducts()

    const brief = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `You are the Video Generator agent for a phone case dropshipping brand called Caselle. Create a weekly video content brief for TikTok and Instagram Reels. Each brief should include: (1) Video concept/hook (first 3 seconds), (2) Visual style and aesthetic, (3) On-screen text/captions, (4) Music vibe (describe, don't name copyrighted tracks), (5) CTA at the end. Produce 3 video briefs that can be handed to a video editor or AI video tool.`,
      messages: [{ role: "user", content: `Store context:\n${storeContext}\n\nCreate this week's video content briefs.` }],
    })

    const briefText = brief.content[0].type === "text" ? brief.content[0].text : ""
    const date = new Date().toISOString().slice(0, 10)
    const content = `# Video Generator — Weekly Content Brief\n*Week of ${date}*\n\n${briefText}`

    await saveBriefToGitHub(content)

    return NextResponse.json({ success: true, brief: briefText })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
