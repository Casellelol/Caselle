import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://burga-store.vercel.app"
const OWNER_EMAIL = "the3vka@gmail.com"

// Expected crons: [name, schedule description, expected hour UTC]
const EXPECTED_CRONS: Array<{ name: string; hour: number; label: string }> = [
  { name: "competitor-monitor", hour: 1, label: "Competitor Monitor (1am)" },
  { name: "lumiere/scout", hour: 2, label: "Lumière Scout (2am)" },
  { name: "atelier/scout", hour: 3, label: "Atelier Scout (3am)" },
  { name: "nightly-summary", hour: 3, label: "Nightly Summary (3am)" },
  { name: "trend-monitor", hour: 4, label: "Trend Monitor (4am)" },
  { name: "caselle/scout", hour: 5, label: "Caselle Scout (5am)" },
  { name: "jarvis/command", hour: 6, label: "JARVIS Command (6am)" },
  { name: "morning-briefing", hour: 6, label: "Morning Briefing (6am)" },
  { name: "maximus/scout", hour: 7, label: "Gold Scout (7am)" },
  { name: "jarvis/world", hour: 8, label: "World Brain (8am)" },
  { name: "cron/marketing", hour: 9, label: "Marketing Posts (9am)" },
  { name: "accountant", hour: 23, label: "Accountant P&L (11pm)" },
]

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Casellelol/JARVIS-brain/contents/${path}`,
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
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/morning-briefings.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Morning Briefings\n\n"

  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/morning-briefings.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Morning briefing",
      content: Buffer.from(current + content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

async function buildHealthSection(changelog: string): Promise<string> {
  // Check /api/health
  let healthChecks: Record<string, boolean> = {}
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(8000) })
    if (healthRes.ok) {
      const data = await healthRes.json()
      healthChecks = data.checks || {}
    }
  } catch {}

  // Find crons that ran in the last 24h from changelog
  const now = new Date()
  const yesterday = new Date(now.getTime() - 86400000)
  const todayStr = now.toISOString().slice(0, 10)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const recentLines = (changelog || "").split("\n").filter(
    l => l.startsWith(`[${todayStr}`) || l.startsWith(`[${yesterdayStr}`)
  )

  // Identify which expected crons appear in recent changelog entries
  const missedCrons: string[] = []
  for (const cron of EXPECTED_CRONS) {
    const ranRecently = recentLines.some(l => l.toLowerCase().includes(cron.name.toLowerCase()))
    if (!ranRecently) {
      missedCrons.push(`⚠️ MISSED: ${cron.label}`)
    }
  }

  // Build health section HTML
  const downKeys = Object.entries(healthChecks).filter(([, ok]) => !ok).map(([k]) => k)
  const allHealthy = downKeys.length === 0 && missedCrons.length === 0

  if (allHealthy) {
    return `<h2>🔋 System Health</h2><p>✅ All systems nominal. All env vars set. No missed crons detected.</p>`
  }

  let html = `<h2>🔋 System Health</h2>`
  if (downKeys.length > 0) {
    html += `<p><strong>Missing env vars:</strong></p><ul>${downKeys.map(k => `<li>❌ ${k} not set</li>`).join("")}</ul>`
  }
  if (missedCrons.length > 0) {
    html += `<p><strong>Missed crons (last 24h):</strong></p><ul>${missedCrons.map(m => `<li>${m}</li>`).join("")}</ul>`
  }
  return html
}

export async function GET() {
  try {
    const [
      jarvisMemory, salesPerformance, publishedProducts,
      exelixisBrain, worldBrain, upgradesRaw, financeReport, changelog,
    ] = await Promise.all([
      fetchFile("jarvis-memory.md"),
      fetchFile("sales-performance.md"),
      fetchFile("published-products.md"),
      fetchFile("exelixis-brain.md"),
      fetchFile("jarvis-world-brain.md"),
      fetchFile("jarvis-upgrades.md"),
      fetchFile("finance-report.md"),
      fetchFile("empire-changelog.md"),
    ])

    const pendingUpgrades = (upgradesRaw.match(/\[PENDING\]/g) || []).length
    const doneUpgrades = (upgradesRaw.match(/\[DONE\]/g) || []).length

    // Extract last 24h activity from changelog
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const today = new Date().toISOString().slice(0, 10)
    const recentActivity = (changelog || "").split("\n")
      .filter(l => l.startsWith(`[${yesterday}`) || l.startsWith(`[${today}`))
      .slice(0, 10)
      .join("\n")

    // Build health section (includes /api/health check + cron audit)
    const [healthSection, costsData] = await Promise.all([
      buildHealthSection(changelog),
      fetch(`${BASE_URL}/api/jarvis/costs`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null) as Promise<{
          monthly_spend_usd: number
          daily_avg_usd: number
          estimated_days_remaining: number
          top_cost_routes: string[]
        } | null>,
    ])

    const costsSection = costsData
      ? `<h2>💰 API Spend</h2><p>Month-to-date: <strong>$${costsData.monthly_spend_usd}</strong> · Daily avg: <strong>$${costsData.daily_avg_usd}</strong> · Est. days remaining: <strong>${costsData.estimated_days_remaining}</strong>${costsData.estimated_days_remaining < 7 ? " ⚠️ ALERT: less than 7 days of credits remaining" : ""}</p>`
      : ""

    const briefing = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `You are JARVIS writing a morning briefing email to your owner Osvaldas. Write in clean HTML (use <h2>, <p>, <ul>, <li>, <strong> tags). Be sharp, numbers-first, no fluff. Structure: (1) Overnight Summary, (2) Sales & Revenue, (3) New Products Published, (4) Top Market Intelligence, (5) ⚙️ System Activity — Last 24 Hours (list what was built, fixed, or deployed), (6) Upgrade Queue Status, (7) Priority for Today. End with a JARVIS confidence score 0-100. Do NOT include a system health section — that will be prepended separately.`,
      messages: [{
        role: "user",
        content: `Generate today's morning briefing from this data:

SALES: ${salesPerformance?.slice(0, 800) || "No sales data yet"}
PUBLISHED PRODUCTS: ${publishedProducts?.slice(0, 500) || "None yet"}
FINANCE: ${financeReport?.slice(0, 400) || "No report"}
MARKET INTEL: ${exelixisBrain?.slice(0, 600) || "No data"}
WORLD BRAIN: ${worldBrain?.slice(0, 400) || "No data"}
UPGRADES: ${pendingUpgrades} pending, ${doneUpgrades} completed
MEMORY: ${jarvisMemory?.slice(0, 300) || "No memory"}
SYSTEM ACTIVITY (last 24h): ${recentActivity || "No logged activity yet"}`,
      }],
    })

    const briefingHtml = briefing.content[0].type === "text" ? briefing.content[0].text : ""
    const fullHtml = healthSection + "\n<hr/>\n" + costsSection + "\n<hr/>\n" + briefingHtml
    const date = new Date().toISOString().slice(0, 10)

    const emailSent = await sendEmail(`JARVIS Morning Briefing — ${date}`, fullHtml)

    // Always save to GitHub as backup
    const mdContent = `\n## Briefing — ${date}\n${fullHtml.replace(/<[^>]+>/g, "").trim()}\n`
    await saveBriefingToGitHub(mdContent)

    return NextResponse.json({ success: true, emailSent, date })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
