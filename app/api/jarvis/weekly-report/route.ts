import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = "7824400934"
const OWNER_EMAIL = "the3vka@gmail.com"

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

function last7DaysOf(content: string): string {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const lines = content.split("\n")
  return lines.filter(l => {
    const match = l.match(/\[(\d{4}-\d{2}-\d{2})/)
    if (!match) return false
    return new Date(match[1]) >= sevenDaysAgo
  }).join("\n")
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
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

async function sendTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" }),
  })
  return res.ok
}

export async function GET() {
  try {
    const [salesPerf, changelog, maximusBrain, jarvisMemory, empireState, storeStatus] = await Promise.all([
      fetchFile("sales-performance.md"),
      fetchFile("empire-changelog.md"),
      fetchFile("jarvis/maximus-brain.md").then(r => r || fetchFile("maximus-brain.md")),
      fetchFile("jarvis-memory.md"),
      fetchFile("empire.json"),
      fetchFile("jarvis-health.md"),
    ])

    const recentChangelog = last7DaysOf(changelog)
    const date = new Date().toISOString().slice(0, 10)
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const report = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: `You are JARVIS generating a weekly investor-style report for Osvaldas. Write in clean HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table> tags. Be sharp, numbers-first, no fluff. This is the empire's weekly board report.`,
      messages: [{
        role: "user",
        content: `Generate the Empire Weekly Report for the week ending ${date} (started ${weekStart}).

SALES DATA: ${salesPerf?.slice(0, 1000) || "No sales data yet — store is pre-revenue"}
CHANGELOG (last 7 days): ${recentChangelog?.slice(0, 2000) || "No activity logged"}
MAXIMUS GOLD INTELLIGENCE: ${maximusBrain?.slice(0, 800) || "Monitoring mode, no trades yet. Credentials arrive May 20."}
JARVIS MEMORY / STATUS: ${jarvisMemory?.slice(0, 600) || "No memory"}
EMPIRE STATE: ${empireState?.slice(0, 400) || "No empire.json"}
SYSTEM HEALTH: ${storeStatus?.slice(0, 400) || "No health report"}

Structure the report as:
1. 📊 Revenue This Week vs Last Week
2. 🏆 Top 3 Performing Products
3. 🆕 New Products Published by JARVIS
4. 🏪 Store Launch Status (Lumière, Atelier, Pawsome/other)
5. 📈 Maximus Gold Signals Summary
6. ✅ Top 3 Wins This Week
7. ❌ Top 3 Problems to Fix
8. 🗓️ JARVIS Plan for Next Week
9. JARVIS Confidence Score: X/100`,
      }],
    })

    const reportHtml = report.content[0].type === "text" ? report.content[0].text : ""
    const emailSent = await sendEmail(`Empire Weekly — ${date}`, reportHtml)

    // Send Telegram summary (first 500 chars of plain text)
    const plainText = reportHtml.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    const telegramMsg = `*Empire Weekly — ${date}*\n\n${plainText.slice(0, 500)}...`
    await sendTelegram(telegramMsg)

    return NextResponse.json({ success: true, emailSent, date })
  } catch (err) {
    console.error("[weekly-report] Error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
