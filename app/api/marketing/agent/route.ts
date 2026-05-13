import { NextRequest, NextResponse } from "next/server"

const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK_URL
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/JARVIS-brain"

const POSTS = [
  "The case that says everything without saying a word. ✦\n#quietluxury #minimalist #caselle",
  "Protect what matters. Look good doing it. —\n#phonecase #luxury #minimal",
  "Less is always more. ✦\n#quietluxury #minimalism #caselle",
  "Understated. Intentional. Yours. —\n#luxurylifestyle #minimal #phoneaccessories",
  "Clean lines. Quiet confidence. ✦\n#minimalstyle #quietluxury #caselle",
  "The details make the difference. —\n#phonecase #aesthetic #luxury",
  "Designed for those who don't need to shout. ✦\n#quietluxury #minimalist #caselle",
  "Simplicity is the ultimate sophistication. —\n#minimal #luxuryaesthetic #phonecase",
  "A case as refined as your taste. ✦\n#caselle #quietluxury #lifestyle",
  "Nothing extra. Nothing missing. —\n#minimalism #phoneaccessories #aesthetic",
  "Timeless over trendy. Every time. ✦\n#quietluxury #caselle #minimal",
  "Your phone. Elevated. —\n#luxury #phonecase #minimalist",
  "Soft tones. Strong impression. ✦\n#aesthetic #quietluxury #caselle",
  "The quiet ones always stand out. —\n#minimalism #luxurystyle #phonecase",
  "Crafted for the intentional. ✦\n#caselle #quietluxury #minimal",
  "Style that whispers, never shouts. —\n#quietluxury #aesthetic #phoneaccessories",
  "Minimalist by choice. Luxurious by nature. ✦\n#minimal #luxury #caselle",
  "Carry less. Mean more. —\n#minimalism #quietluxury #phonecase",
  "A small detail that changes everything. ✦\n#caselle #aesthetic #luxury",
  "For those who appreciate the subtle. —\n#quietluxury #minimal #lifestyle",
  "Quality over quantity. Always. ✦\n#luxurylifestyle #minimalist #caselle",
  "The most elegant things are always the simplest. —\n#quietluxury #phonecase #aesthetic",
  "Refined taste. Zero compromise. ✦\n#caselle #minimal #luxury",
  "Slow down. Choose well. —\n#intentionalliving #quietluxury #phonecase",
  "Built for the long run. Designed to be loved. ✦\n#caselle #minimalism #aesthetic",
  "Your everyday deserves better. —\n#quietluxury #lifestyle #phoneaccessories",
  "Effortless. That's the point. ✦\n#minimal #luxury #caselle",
  "In a world of noise, choose silence. —\n#quietluxury #minimalist #phonecase",
  "The understated is always the most powerful. ✦\n#caselle #aesthetic #luxury",
  "Less clutter. More presence. —\n#minimalism #quietluxury #lifestyle",
]

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
    if (!MAKE_WEBHOOK) {
      return NextResponse.json({ error: "No Make webhook configured" }, { status: 500 })
    }

    // Pick post based on day of year so it rotates automatically
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const postText = POSTS[dayOfYear % POSTS.length]

    const res = await fetch(MAKE_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: postText,
        image_url: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/marble-white.jpg",
        link: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://burga-store.vercel.app",
      }),
    })

    const success = res.ok
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    await logToGitHub(`\n## ${date}\n**Status:** ${success ? "Posted via Make.com" : "Make webhook failed"}\n**Post:**\n${postText}\n`)

    return NextResponse.json({ success, post: postText })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Marketing agent failed", detail: msg }, { status: 500 })
  }
}
