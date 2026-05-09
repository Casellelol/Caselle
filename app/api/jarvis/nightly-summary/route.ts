import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const OWNER_EMAIL = "the3vka@gmail.com"
const REPO = "Casellelol/Caselle"

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
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

async function appendToGitHub(content: string) {
  try {
    const path = "nightly-summaries.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
    const current = existing
      ? Buffer.from(existing.content, "base64").toString("utf-8")
      : "# JARVIS Nightly Summaries\n\n"

    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "JARVIS nightly summary",
        content: Buffer.from(current + content).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function GET() {
  try {
    const [
      jarvisThoughts, jarvisMemory, salesPerformance,
      publishedProducts, upgradesRaw, financeReport,
      worldBrain, competitorIntel, resultsLog,
    ] = await Promise.all([
      fetchFile("jarvis-thoughts.md"),
      fetchFile("jarvis-memory.md"),
      fetchFile("sales-performance.md"),
      fetchFile("published-products.md"),
      fetchFile("jarvis-upgrades.md"),
      fetchFile("finance-report.md"),
      fetchFile("jarvis-world-brain.md"),
      fetchFile("competitor-intel.md"),
      fetchFile("results-log.md"),
    ])

    const pendingUpgrades = (upgradesRaw.match(/\[PENDING\]/g) || []).length
    const doneUpgrades = (upgradesRaw.match(/\[DONE\]/g) || []).length

    const summary = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `You are JARVIS writing a nightly intelligence summary to your owner Osvaldas. He reads this before his first coffee. Be sharp, numbers-first, no fluff. Write clean HTML using <h2>, <p>, <ul>, <li>, <strong>, <em> tags only. Structure must include these 7 sections exactly:
1. Overnight Agent Activity — what ran, what was found, what was triggered
2. Intelligence Brain Updates — new facts written to memory, what changed
3. Opportunity Queue — new opportunities added, scored, promoted, discarded
4. Revenue Events — any sales, refunds, Printify orders
5. Pending Manual Actions — anything requiring the owner's decision
6. JARVIS Confidence Score — 0-100, with brief explanation
7. Top Priority for Today — one specific action for the owner

End with: JARVIS signing off, timestamp.`,
      messages: [{
        role: "user",
        content: `Generate tonight's nightly intelligence summary from this overnight data:

OVERNIGHT THOUGHTS & ACTIONS: ${jarvisThoughts?.slice(-1500) || "No activity logged"}
SALES OVERNIGHT: ${salesPerformance?.slice(0, 600) || "No sales data"}
NEW PRODUCTS PUBLISHED: ${publishedProducts?.slice(-600) || "None"}
FINANCE: ${financeReport?.slice(0, 400) || "No report"}
WORLD BRAIN: ${worldBrain?.slice(0, 400) || "No data"}
COMPETITOR INTEL: ${competitorIntel?.slice(0, 400) || "No data"}
RESULTS LOG: ${resultsLog?.slice(-400) || "No history"}
UPGRADE QUEUE: ${pendingUpgrades} pending, ${doneUpgrades} done
MEMORY STATE: ${jarvisMemory?.slice(0, 300) || "Empty"}`,
      }],
    })

    const html = summary.content[0].type === "text" ? summary.content[0].text : ""
    const date = new Date().toISOString().slice(0, 10)

    const emailSent = await sendEmail(`JARVIS Nightly Summary — ${date}`, html)
    const mdContent = `\n## Nightly Summary — ${date}\n${html.replace(/<[^>]+>/g, "").trim()}\n`
    await appendToGitHub(mdContent)

    return NextResponse.json({ success: true, emailSent, date })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
