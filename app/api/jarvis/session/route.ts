import { NextRequest, NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function getFileSha(path: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/Caselle/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return undefined
    const data = await res.json()
    return data.sha
  } catch { return undefined }
}

async function getCurrentContent(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/Caselle/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return "# JARVIS — Conversation Log\n*Every session with Osvaldas, permanently remembered.*\n\n"
    return await res.text()
  } catch { return "# JARVIS — Conversation Log\n*Every session with Osvaldas, permanently remembered.*\n\n" }
}

export async function POST(req: NextRequest) {
  try {
    const { summary, date, messages } = await req.json()
    if (!summary && !messages) return NextResponse.json({ error: "No content" }, { status: 400 })

    const sessionDate = date || new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = messages
      ? `\n## Session — ${sessionDate}\n${messages}\n`
      : `\n## Session — ${sessionDate}\n${summary}\n`

    const [current, sha] = await Promise.all([
      getCurrentContent("conversation-log.md"),
      getFileSha("conversation-log.md"),
    ])

    // Prepend so newest sessions are always at the top — JARVIS reads slice(0, N) not slice(-N)
    const header = "# JARVIS — Conversation Log\n*Every session with Osvaldas, permanently remembered. Secrets redacted.*\n\n"
    const body = current.replace(/^# JARVIS[^\n]*\n[^\n]*\n\n/, "")
    const updated = header + content + body

    await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/conversation-log.md", {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Session log — ${sessionDate}`,
        content: Buffer.from(updated).toString("base64"),
        sha,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
