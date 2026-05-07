import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK_URL
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return ""
    const data = await res.json()
    return Buffer.from(data.content, "base64").toString("utf-8")
  } catch { return "" }
}

async function postToMake(text: string, imageUrl?: string) {
  if (!MAKE_WEBHOOK) return false
  const res = await fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      caption: text,
      image_url: imageUrl || "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/marble-white.jpg",
      link: "https://burga-store.vercel.app",
    }),
  })
  return res.ok
}

async function logToGitHub(content: string) {
  try {
    const path = "marketing-log.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() : null
    const oldContent = existing ? Buffer.from(existing.content, "base64").toString("utf-8") : "# Marketing Log\n\n"
    const newContent = oldContent + content + "\n"
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Marketing agent post",
        content: Buffer.from(newContent).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json().catch(() => ({}))
    const brain = await fetchGitHubFile("exelixis-brain.md")

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `You are the Caselle social media marketing agent. Caselle is a quiet luxury phone case brand.
Write ONE social media post. Rules:
- Tone: minimal, aspirational, luxury lifestyle
- Max 3 hashtags
- 1-2 subtle emojis only (✦ · —)
- Under 150 characters for main text
- Hashtags on a new line
- Never mention prices
- Focus on aesthetic and feeling
${topic ? `Topic: ${topic}` : ""}
${brain ? `Market intel: ${brain.slice(0, 300)}` : ""}`,
      messages: [{ role: "user", content: "Write a post for Instagram, Facebook and Pinterest." }],
    })

    const postText = response.content[0].type === "text" ? response.content[0].text.trim() : ""
    const success = await postToMake(postText)

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    await logToGitHub(`\n## ${date}\n**Status:** ${success ? "Posted via Make.com" : "Make webhook failed"}\n**Post:**\n${postText}\n`)

    return NextResponse.json({ success, post: postText })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Marketing agent failed", detail: msg }, { status: 500 })
  }
}
