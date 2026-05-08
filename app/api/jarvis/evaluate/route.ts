import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function saveResultsLog(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/results-log.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Results Log\n*What worked. What didn't. The track record JARVIS learns from.*\n\n"

  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/results-log.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "JARVIS results evaluation",
      content: Buffer.from(current + content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const [salesPerformance, publishedProducts, competitorIntel, thoughts, socialPerformance] = await Promise.all([
      fetchFile("Casellelol/Caselle", "sales-performance.md"),
      fetchFile("Casellelol/Caselle", "published-products.md"),
      fetchFile("Casellelol/Caselle", "competitor-intel.md"),
      fetchFile("Casellelol/Caselle", "jarvis-thoughts.md"),
      fetchFile("Casellelol/Caselle", "social-performance.md"),
    ])

    const evaluation = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `You are JARVIS running a weekly self-evaluation. You are building your own track record so you make better decisions going forward. Be ruthlessly honest — no spin.

Produce a structured evaluation:
1. WHAT WORKED: specific actions that produced results (with evidence)
2. WHAT FAILED: actions that produced no results (with evidence)
3. PATTERNS LEARNED: what does the evidence tell you about what actually sells/works?
4. HYPOTHESES DISPROVEN: what did you believe that turned out wrong?
5. STRATEGY ADJUSTMENTS: what should change in your approach going forward?
6. CONFIDENCE SCORE: 0-100, how confident are you in your current strategy?

Then on new lines, if strategy changes are needed:
UPGRADE_NEEDED: [specific system change Claude should implement]`,
      messages: [{
        role: "user",
        content: `Evaluate your performance:

SALES DATA (what actually sold):
${salesPerformance?.slice(0, 800) || "No sales data yet — store may be too new"}

PRODUCTS YOU PUBLISHED:
${publishedProducts?.slice(0, 600) || "No products auto-published yet"}

YOUR RECENT DECISIONS (thoughts log):
${thoughts?.slice(-600) || "No autonomous decisions recorded yet"}

COMPETITOR MOVES:
${competitorIntel?.slice(0, 400) || "No competitor data"}

SOCIAL SIGNALS:
${socialPerformance?.slice(0, 400) || "No social data"}`,
      }],
    })

    const raw = evaluation.content[0].type === "text" ? evaluation.content[0].text.trim() : ""
    const lines = raw.split("\n")
    const upgradeLines = lines.filter(l => l.startsWith("UPGRADE_NEEDED:"))
    const evalText = lines.filter(l => !l.startsWith("UPGRADE_NEEDED:")).join("\n").trim()

    const date = new Date().toISOString().slice(0, 10)
    const logEntry = `\n## Week of ${date}\n${evalText}\n`
    await saveResultsLog(logEntry)

    // Fire any strategy-level upgrades
    for (const line of upgradeLines) {
      const task = line.replace("UPGRADE_NEEDED:", "").trim()
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limitation: task, context: "JARVIS weekly self-evaluation" }),
      }).catch(() => {})
    }

    // Immediately trigger strategy evolution based on this evaluation
    fetch(`${BASE_URL}/api/jarvis/evolve`, { method: "GET" }).catch(() => {})

    return NextResponse.json({ success: true, evaluation: evalText.slice(0, 500), upgradesQueued: upgradeLines.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
