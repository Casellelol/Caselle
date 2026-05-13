import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

async function fetchStripeRevenue(): Promise<string> {
  if (!STRIPE_SECRET_KEY) return "Stripe key not configured"
  try {
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
    const res = await fetch(
      `https://api.stripe.com/v1/charges?limit=100&created[gte]=${thirtyDaysAgo}`,
      { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
    )
    const data = await res.json()
    const charges = data.data || []
    const total = charges.reduce((sum: number, c: { amount: number; captured: boolean }) =>
      c.captured ? sum + c.amount : sum, 0)
    const count = charges.filter((c: { captured: boolean }) => c.captured).length
    return `Orders (30d): ${count} | Revenue: £${(total / 100).toFixed(2)}`
  } catch (err) {
    return `Stripe error: ${String(err)}`
  }
}

async function fetchPrintifyCosts(): Promise<string> {
  const PRINTIFY_TOKEN = process.env.PRINTIFY_API_KEY
  if (!PRINTIFY_TOKEN) return "Printify key not configured"
  try {
    const res = await fetch("https://api.printify.com/v1/shops/27451784/orders.json?limit=20", {
      headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` }
    })
    const data = await res.json()
    const orders = data.data || []
    const totalCost = orders.reduce((sum: number, o: { total_price?: number }) =>
      sum + (o.total_price || 0), 0)
    return `Printify orders (recent 20): ${orders.length} | Estimated cost: £${(totalCost / 100).toFixed(2)}`
  } catch (err) {
    return `Printify error: ${String(err)}`
  }
}

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/JARVIS-brain/contents/finance-report.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/JARVIS-brain/contents/finance-report.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Accountant daily report",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const [revenue, costs] = await Promise.all([fetchStripeRevenue(), fetchPrintifyCosts()])

    const analysis = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `You are the Accountant agent for a phone case dropshipping empire. Analyse revenue and cost data, then produce a daily financial summary covering: net profit estimate, margin %, key observations, and one recommended action to improve profitability. Be concise and numbers-first.`,
      messages: [{ role: "user", content: `Revenue data:\n${revenue}\n\nCost data:\n${costs}` }],
    })

    const report = analysis.content[0].type === "text" ? analysis.content[0].text : ""
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const content = `# Accountant — Daily Financial Report\n*Generated: ${date}*\n\n## Raw Data\n- ${revenue}\n- ${costs}\n\n## Analysis\n${report}`

    await saveToGitHub(content)

    return NextResponse.json({ success: true, report })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
