import { NextResponse } from "next/server"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

// Pricing per million tokens (claude-sonnet-4-6 as of 2026)
const INPUT_COST_PER_M = 3.0
const OUTPUT_COST_PER_M = 15.0

// Known AI-heavy routes and their avg token usage
const ROUTE_ESTIMATES: Array<{ route: string; avg_input: number; avg_output: number; daily_calls: number }> = [
  { route: "/api/jarvis/think", avg_input: 4000, avg_output: 800, daily_calls: 4 },
  { route: "/api/jarvis/morning-briefing", avg_input: 2500, avg_output: 1200, daily_calls: 1 },
  { route: "/api/jarvis/nightly-summary", avg_input: 2000, avg_output: 600, daily_calls: 1 },
  { route: "/api/jarvis/route (Telegram)", avg_input: 3000, avg_output: 500, daily_calls: 5 },
  { route: "/api/cron/marketing", avg_input: 1500, avg_output: 400, daily_calls: 1 },
  { route: "/api/cron/maximus-macro", avg_input: 2000, avg_output: 600, daily_calls: 1 },
  { route: "/api/jarvis/weekly-report", avg_input: 3000, avg_output: 2000, daily_calls: 0.14 },
]

async function fetchFile(path: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" },
    })
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function getAnthropicUsage(): Promise<{ input_tokens: number; output_tokens: number; total_cost_usd: number } | null> {
  if (!ANTHROPIC_API_KEY) return null
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const res = await fetch(
      `https://api.anthropic.com/v1/usage?start_date=${monthStart}`,
      { headers: { "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" } }
    )
    if (!res.ok) return null
    const data = await res.json() as {
      data?: Array<{ input_tokens: number; output_tokens: number }>
    }
    if (!data.data) return null
    let input_tokens = 0
    let output_tokens = 0
    for (const entry of data.data) {
      input_tokens += entry.input_tokens || 0
      output_tokens += entry.output_tokens || 0
    }
    const total_cost_usd = (input_tokens / 1_000_000) * INPUT_COST_PER_M + (output_tokens / 1_000_000) * OUTPUT_COST_PER_M
    return { input_tokens, output_tokens, total_cost_usd }
  } catch { return null }
}

function countAiCallsInChangelog(changelog: string, dayFilter?: string): number {
  const lines = changelog.split("\n").filter(l => {
    if (dayFilter && !l.startsWith(`[${dayFilter}`)) return false
    return l.toLowerCase().includes("think") || l.toLowerCase().includes("briefing") ||
      l.toLowerCase().includes("claude") || l.toLowerCase().includes("marketing") ||
      l.toLowerCase().includes("summary") || l.toLowerCase().includes("report")
  })
  return lines.length
}

export async function GET() {
  try {
    const changelog = await fetchFile("empire-changelog.md")
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date()
    const daysInMonth = now.getDate()

    const [apiUsage] = await Promise.all([getAnthropicUsage()])

    const daily_ai_calls = countAiCallsInChangelog(changelog, today)
    const weekly_ai_calls = countAiCallsInChangelog(changelog)

    // Calculate estimated daily cost from route estimates
    const routeCosts = ROUTE_ESTIMATES.map(r => {
      const daily_cost = r.daily_calls * (
        (r.avg_input / 1_000_000) * INPUT_COST_PER_M +
        (r.avg_output / 1_000_000) * OUTPUT_COST_PER_M
      )
      return { route: r.route, daily_cost_usd: parseFloat(daily_cost.toFixed(4)) }
    }).sort((a, b) => b.daily_cost_usd - a.daily_cost_usd)

    const estimated_daily_avg = routeCosts.reduce((sum, r) => sum + r.daily_cost_usd, 0)
    const monthly_spend_usd = apiUsage?.total_cost_usd ?? estimated_daily_avg * daysInMonth

    // Estimate remaining days (assume $5 credit limit for safety check — update if known)
    const CREDIT_LIMIT = 50
    const remaining_credit = Math.max(0, CREDIT_LIMIT - monthly_spend_usd)
    const estimated_days_remaining = estimated_daily_avg > 0
      ? Math.floor(remaining_credit / estimated_daily_avg)
      : 999

    return NextResponse.json({
      monthly_spend_usd: parseFloat(monthly_spend_usd.toFixed(4)),
      daily_avg_usd: parseFloat(estimated_daily_avg.toFixed(4)),
      estimated_days_remaining,
      daily_ai_calls_logged: daily_ai_calls,
      weekly_ai_calls_logged: weekly_ai_calls,
      top_cost_routes: routeCosts.slice(0, 5).map(r => `${r.route} (~$${r.daily_cost_usd}/day)`),
      api_usage_source: apiUsage ? "anthropic_api" : "estimated",
      input_tokens_mtd: apiUsage?.input_tokens ?? null,
      output_tokens_mtd: apiUsage?.output_tokens ?? null,
    })
  } catch (err) {
    console.error("[costs] Error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
