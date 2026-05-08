import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = "the3vka@gmail.com"

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/Caselle/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function sendEmail(subject: string, html: string) {
  if (!RESEND_API_KEY) return false
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "JARVIS <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject,
      html,
    }),
  })
  return res.ok
}

async function saveBriefingToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/morning-briefings.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Morning Briefings\n\n"

  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/morning-briefings.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Morning briefing",
      content: Buffer.from(current + content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const [
      jarvisMemory, salesPerformance, publishedProducts,
      exelixisBrain, worldBrain, upgradesRaw, financeReport,
    ] = await Promise.all([
      fetchFile("jarvis-memory.md"),
      fetchFile("sales-performance.md"),
      fetchFile("published-products.md"),
      fetchFile("exelixis-brain.md"),
      fetchFile("jarvis-world-brain.md"),
      fetchFile("jarvis-upgrades.md"),
      fetchFile("finance-report.md"),
    ])

    const pendingUpgrades = (upgradesRaw.match(/\[PENDING\]/g) || []).length
    const doneUpgrades = (upgradesRaw.match(/\[DONE\]/g) || []).length

    const briefing = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are JARVIS writing a morning briefing email to your owner Osvaldas. Write in clean HTML (use <h2>, <p>, <ul>, <li>, <strong> tags). Be sharp, numbers-first, no fluff. Structure: (1) Overnight Summary, (2) Sales & Revenue, (3) New Products Published, (4) Top Market Intelligence, (5) Upgrade Queue Status, (6) Priority for Today. End with a JARVIS confidence score 0-100.`,
      messages: [{
        role: "user",
        content: `Generate today's morning briefing from this data:

SALES: ${salesPerformance?.slice(0, 800) || "No sales data yet"}
PUBLISHED PRODUCTS: ${publishedProducts?.slice(0, 500) || "None yet"}
FINANCE: ${financeReport?.slice(0, 400) || "No report"}
MARKET INTEL: ${exelixisBrain?.slice(0, 600) || "No data"}
WORLD BRAIN: ${worldBrain?.slice(0, 400) || "No data"}
UPGRADES: ${pendingUpgrades} pending, ${doneUpgrades} completed
MEMORY: ${jarvisMemory?.slice(0, 300) || "No memory"}`,
      }],
    })

    const html = briefing.content[0].type === "text" ? briefing.content[0].text : ""
    const date = new Date().toISOString().slice(0, 10)

    const emailSent = await sendEmail(`JARVIS Morning Briefing — ${date}`, html)

    // Always save to GitHub as backup
    const mdContent = `\n## Briefing — ${date}\n${html.replace(/<[^>]+>/g, "").trim()}\n`
    await saveBriefingToGitHub(mdContent)

    return NextResponse.json({ success: true, emailSent, date })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
