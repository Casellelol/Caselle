import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

async function saveToGitHub(content: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/sales-performance.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() : null
  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/sales-performance.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Sales performance update",
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

export async function GET() {
  try {
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60

    // Fetch completed checkout sessions with metadata
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: thirtyDaysAgo },
    })

    const designSales: Record<string, { units: number; revenue: number }> = {}
    const modelSales: Record<string, { units: number; revenue: number }> = {}
    let totalRevenue = 0
    let totalOrders = 0

    for (const session of sessions.data) {
      if (session.payment_status !== "paid") continue

      totalOrders++
      const amount = session.amount_total || 0
      totalRevenue += amount

      // Parse items from metadata
      try {
        const items = JSON.parse(session.metadata?.items || "[]")
        for (const item of items) {
          const design = item.designId || "unknown"
          const model = item.modelId || "unknown"
          const qty = item.quantity || 1

          designSales[design] = designSales[design] || { units: 0, revenue: 0 }
          designSales[design].units += qty
          designSales[design].revenue += Math.round((amount / items.length) * qty)

          modelSales[model] = modelSales[model] || { units: 0, revenue: 0 }
          modelSales[model].units += qty
        }
      } catch {}
    }

    // Sort designs by units sold
    const topDesigns = Object.entries(designSales)
      .sort((a, b) => b[1].units - a[1].units)
      .slice(0, 10)

    const topModels = Object.entries(modelSales)
      .sort((a, b) => b[1].units - a[1].units)
      .slice(0, 5)

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")

    const lines = [
      `# Sales Performance Report`,
      `*Generated: ${date} | Last 30 days*\n`,
      `## Overview`,
      `- Total orders: ${totalOrders}`,
      `- Total revenue: $${(totalRevenue / 100).toFixed(2)}\n`,
      `## Top Designs by Units Sold`,
      ...topDesigns.map(([id, d], i) =>
        `${i + 1}. **${id}** — ${d.units} units | $${(d.revenue / 100).toFixed(2)}`
      ),
      `\n## Top Phone Models`,
      ...topModels.map(([id, d], i) =>
        `${i + 1}. **${id}** — ${d.units} units`
      ),
      `\n## Dead Stock (no sales)`,
      `Designs with zero orders: ${
        totalOrders === 0
          ? "No sales data yet"
          : "Cross-reference with published-products.md"
      }`,
    ]

    const content = lines.join("\n")
    await saveToGitHub(content)

    return NextResponse.json({ success: true, totalOrders, totalRevenue, topDesigns })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
