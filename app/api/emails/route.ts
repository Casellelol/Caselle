import { NextRequest, NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/JARVIS-brain"
const FILE = "email-list.md"

async function appendEmail(email: string) {
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
  })

  const now = new Date().toISOString().slice(0, 16).replace("T", " ")
  let currentContent = `# Caselle Email List\n*Subscribers who requested 10% discount*\n\n`
  let sha: string | undefined

  if (getRes.ok) {
    const data = await getRes.json() as { content: string; sha: string }
    currentContent = Buffer.from(data.content, "base64").toString("utf-8")
    sha = data.sha
  }

  if (currentContent.includes(email)) {
    return { ok: true, message: "already subscribed" }
  }

  const newContent = currentContent.trimEnd() + `\n- ${email} (${now})\n`
  const body: Record<string, unknown> = {
    message: `Add subscriber: ${email}`,
    content: Buffer.from(newContent).toString("base64"),
  }
  if (sha) body.sha = sha

  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  return { ok: putRes.ok }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    const result = await appendEmail(email.toLowerCase().trim())
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
