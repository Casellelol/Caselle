import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const BUFFER_API = "https://api.bufferapp.com/1"
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

async function postToBuffer(text: string, imageUrl?: string): Promise<{ success: boolean; ids: string[] }> {
  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) return { success: false, ids: [] }

  // Get all connected profiles
  const profilesRes = await fetch(`${BUFFER_API}/profiles.json?access_token=${token}`)
  const profiles = await profilesRes.json()
  const profileIds: string[] = profiles.map((p: { id: string }) => p.id)

  if (!profileIds.length) return { success: false, ids: [] }

  const body = new URLSearchParams({ text, access_token: token, now: "true" })
  profileIds.forEach((id) => body.append("profile_ids[]", id))
  if (imageUrl) body.append("media[photo]", imageUrl)

  const res = await fetch(`${BUFFER_API}/updates/create.json`, { method: "POST", body })
  const data = await res.json()

  return { success: data.success ?? false, ids: profileIds }
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
    const { platform, topic } = await req.json().catch(() => ({}))

    const [brain, strategy] = await Promise.all([
      fetchGitHubFile("exelixis-brain.md"),
      fetchGitHubFile("exelixis-strategy.md"),
    ])

    // Generate post with Claude
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: `You are the Caselle social media marketing agent. Caselle is a quiet luxury phone case brand.
Write ONE social media post. Rules:
- Tone: minimal, aspirational, luxury lifestyle
- No hashtag spam — max 3 relevant hashtags
- No emojis except 1-2 subtle ones (✦ · —)
- Under 150 characters for the main text
- End with 2-3 hashtags on a new line
- Never mention prices or discounts
- Focus on aesthetic, lifestyle, feeling
${topic ? `Topic: ${topic}` : ""}
${brain ? `Market intelligence: ${brain.slice(0, 500)}` : ""}`,
      messages: [{ role: "user", content: `Write a post for ${platform || "Instagram and Pinterest"}.` }],
    })

    const postText = response.content[0].type === "text" ? response.content[0].text.trim() : ""

    // Post through Buffer
    const result = await postToBuffer(postText)

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const platforms = result.ids.length ? `${result.ids.length} platforms via Buffer` : "Buffer (no profiles connected)"
    await logToGitHub(`\n## ${date}\n**Platforms:** ${platforms}\n**Post:**\n${postText}\n`)

    return NextResponse.json({
      success: result.success,
      post: postText,
      platforms: result.ids.length,
      buffered: result.success,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Marketing agent failed", detail: msg }, { status: 500 })
  }
}
