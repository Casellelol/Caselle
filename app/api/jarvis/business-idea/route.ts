import { NextRequest, NextResponse } from "next/server"
import { notifyOwner } from "@/lib/jarvis/telegram"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const REPO = "Casellelol/Caselle"

// Blueprints that are already buildable with existing infrastructure
const EXECUTABLE_BLUEPRINTS = new Set([
  "digital",
  "ebook",
  "prompt-pack",
  "notion-template",
  "swipe-file",
  "checklist",
  "pod-store",
])

async function githubGet(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    return res.ok ? await res.json() : null
  } catch { return null }
}

async function githubPut(path: string, content: string, message: string): Promise<boolean> {
  try {
    const existing = await githubGet(path)
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        sha: existing?.sha,
      }),
    })
    return res.ok
  } catch { return false }
}

async function saveIdea(idea: {
  type: string; concept: string; rationale: string; revenueModel: string
  confidence: number; status: string
}) {
  const existing = await githubGet("business-ideas.md")
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Business Ideas\n*Ideas JARVIS identified autonomously from market intelligence.*\n\n"
  const date = new Date().toISOString().slice(0, 16).replace("T", " ")
  const entry = `\n## ${idea.concept} — ${date}\n- **Type:** ${idea.type}\n- **Revenue model:** ${idea.revenueModel}\n- **Rationale:** ${idea.rationale}\n- **Confidence:** ${idea.confidence}%\n- **Status:** ${idea.status}\n`
  await githubPut("business-ideas.md", current + entry, `JARVIS: new business idea — ${idea.concept}`)
}

export async function POST(req: NextRequest) {
  try {
    const { type, concept, rationale, revenueModel, confidence = 75 } = await req.json()

    if (!type || !concept || !rationale) {
      return NextResponse.json({ error: "type, concept, and rationale required" }, { status: 400 })
    }

    const lowerType = type.toLowerCase().replace(/\s+/g, "-")
    const isExecutable = EXECUTABLE_BLUEPRINTS.has(lowerType)

    // Save the idea regardless
    await saveIdea({ type: lowerType, concept, rationale, revenueModel: revenueModel || "TBD", confidence, status: isExecutable ? "executing" : "filed for build" })

    if (isExecutable) {
      // Route to the right executor

      if (["digital", "ebook", "prompt-pack", "notion-template", "swipe-file", "checklist"].includes(lowerType)) {
        const digitalType = lowerType === "digital" ? "ebook" : lowerType
        fetch(`${BASE_URL}/api/jarvis/digital-pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: digitalType, topic: concept, price: 997 }),
        }).catch(() => {})

        return NextResponse.json({ success: true, action: "executing", pipeline: "digital-pipeline", concept })
      }

      if (lowerType === "pod-store") {
        fetch(`${BASE_URL}/api/jarvis/store-launch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: concept.split(" ")[0], niche: concept, aesthetic: "modern", rationale, confidence }),
        }).catch(() => {})

        return NextResponse.json({ success: true, action: "executing", pipeline: "store-launch", concept })
      }
    }

    // For unknown/unbuilt blueprint types — notify owner and file upgrade
    const upgradeDescription = `Build autonomous pipeline for "${lowerType}" business type. Concept JARVIS identified: "${concept}". Revenue model: ${revenueModel || "TBD"}. Rationale: ${rationale}. Make it fully executable via BUSINESS_IDEA command next cycle.`

    await notifyOwner(
      `🧠 *JARVIS — New Business Idea*\n\n*Concept:* ${concept}\n*Type:* ${type}\n*Revenue:* ${revenueModel || "TBD"}\n*Confidence:* ${confidence}%\n\n*Why I think this:* ${rationale}\n\n_I've logged this idea and Claude will build the infrastructure to execute it automatically._`
    )

    fetch(`${BASE_URL}/api/jarvis/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limitation: upgradeDescription, context: `BUSINESS_IDEA: ${lowerType}` }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      action: "filed",
      message: `Idea saved. Claude will build the ${lowerType} pipeline. Owner notified on Telegram.`,
      concept,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
