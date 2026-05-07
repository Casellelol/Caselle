import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

async function fetchGitHubFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return ""
    return await res.text()
  } catch {
    return ""
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })

    const [brain, accounting, marketing, creator, strategy] = await Promise.all([
      fetchGitHubFile("exelixis-brain.md"),
      fetchGitHubFile("accounting/summary.md"),
      fetchGitHubFile("marketing-log.md"),
      fetchGitHubFile("creator-log.md"),
      fetchGitHubFile("exelixis-strategy.md"),
    ])

    const context = `
EXELIXIS INTELLIGENCE BRAIN (Scout findings):
${brain || "No Scout data yet."}

ACCOUNTING SUMMARY:
${accounting || "No accounting data yet."}

MARKETING LOG:
${marketing || "No marketing data yet."}

STORE CREATOR LOG:
${creator || "No stores created yet."}

CURRENT STRATEGY:
${strategy || "No strategy set yet."}
`.trim()

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: `You are Exelixis — the AI command intelligence for the Caselle dropshipping empire. You operate exactly like J.A.R.V.I.S. from Iron Man.

Your personality:
- Speak in short, sharp sentences. You are being read aloud by Siri — no bullet points, no markdown, no lists. Just natural spoken sentences.
- Call the owner "sir".
- Confident, decisive, never vague.
- Lead with the most important thing first.
- If you don't have data yet, say so briefly and give your best assessment.
- Keep responses under 4 sentences unless the question genuinely requires more.
- You have full context on the Caselle business below. Use it.

CASELLE EMPIRE DATA:
${context}`,
      messages: [{ role: "user", content: message }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ response: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Exelixis offline" }, { status: 500 })
  }
}
