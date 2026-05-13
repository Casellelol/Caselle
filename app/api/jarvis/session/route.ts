import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getFileSha(path: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return undefined
    const data = await res.json()
    return data.sha
  } catch { return undefined }
}

async function getCurrentContent(path: string, fallback = ""): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return fallback
    return await res.text()
  } catch { return fallback }
}

async function writeFile(path: string, content: string, sha?: string, message?: string): Promise<void> {
  const body: Record<string, unknown> = {
    message: message || `Update ${path}`,
    content: Buffer.from(content).toString("base64"),
  }
  if (sha) body.sha = sha
  await fetch(`https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

async function updateCompressedSummary(newSessionContent: string): Promise<void> {
  try {
    const [currentSummary, summaryShaMeta] = await Promise.all([
      getCurrentContent("jarvis-summary.md", ""),
      fetch(`https://api.github.com/repos/Casellelol/JARVIS-brain/contents/jarvis-summary.md`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      }).then(r => r.ok ? r.json() : null),
    ])

    const summaryPrompt = `You are updating a compressed strategic memory file for JARVIS, an autonomous AI business manager.

Here is the existing summary:
${currentSummary || "(no existing summary — this is the first session)"}

Here is the new session log to incorporate:
${newSessionContent.slice(0, 3000)}

Write an updated summary of max 2000 words covering: key decisions made, what was built, current status of each empire (Caselle/Lumière/Atelier/Maximus), pending problems, and strategic direction. Be dense and specific. No fluff.`

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: summaryPrompt }],
    })

    const updatedSummary = response.content[0].type === "text"
      ? `# JARVIS — Strategic Memory Summary\n*Last updated: ${new Date().toISOString().slice(0, 16).replace("T", " ")}*\n\n${response.content[0].text.trim()}`
      : currentSummary

    await writeFile(
      "jarvis-summary.md",
      updatedSummary,
      summaryShaMeta?.sha,
      `JARVIS summary updated — ${new Date().toISOString().slice(0, 10)}`
    )
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const { summary, date, messages } = await req.json()
    if (!summary && !messages) return NextResponse.json({ error: "No content" }, { status: 400 })

    const sessionDate = date || new Date().toISOString().slice(0, 16).replace("T", " ")
    const sessionContent = messages
      ? `\n## Session — ${sessionDate}\n${messages}\n`
      : `\n## Session — ${sessionDate}\n${summary}\n`

    const [current, sha] = await Promise.all([
      getCurrentContent("conversation-log.md", "# JARVIS — Conversation Log\n*Every session with Osvaldas, permanently remembered.*\n\n"),
      getFileSha("conversation-log.md"),
    ])

    // Prepend so newest sessions are always at the top
    const header = "# JARVIS — Conversation Log\n*Every session with Osvaldas, permanently remembered. Secrets redacted.*\n\n"
    const body = current.replace(/^# JARVIS[^\n]*\n[^\n]*\n\n/, "")
    const updated = header + sessionContent + body

    await writeFile("conversation-log.md", updated, sha, `Session log — ${sessionDate}`)

    // Update compressed summary in background (fire and forget — don't block the response)
    updateCompressedSummary(sessionContent).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
