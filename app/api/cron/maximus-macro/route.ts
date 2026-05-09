import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Maximus"

async function fetchYahooQuote(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1h&range=2d`,
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    const result = data.chart?.result?.[0]
    if (!result) return null
    const closes = result.indicators.quote[0].close.filter(Boolean)
    const price = closes[closes.length - 1]
    const prevPrice = closes[closes.length - 2]
    const change = price - prevPrice
    return {
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round((change / prevPrice) * 10000) / 100,
    }
  } catch { return null }
}

async function fetchMacroNews(): Promise<string> {
  const queries = [
    "Federal Reserve FOMC interest rate decision 2026",
    "US Dollar DXY gold XAU correlation today",
    "NFP non-farm payroll economic calendar 2026",
  ]
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(6000),
      })
        .then(r => r.json())
        .then(d => d.AbstractText || "")
    )
  )
  return results
    .filter(r => r.status === "fulfilled" && (r as PromiseFulfilledResult<string>).value)
    .map(r => (r as PromiseFulfilledResult<string>).value)
    .join("\n")
}

function interpretDXY(dxy: { price: number; changePercent: number } | null): string {
  if (!dxy) return "DXY unavailable — cannot assess dollar pressure"
  if (dxy.changePercent > 0.3) return `DXY RISING (+${dxy.changePercent}%) — BEARISH gold pressure. Dollar strengthening.`
  if (dxy.changePercent < -0.3) return `DXY FALLING (${dxy.changePercent}%) — BULLISH gold support. Dollar weakening.`
  return `DXY FLAT (${dxy.changePercent}%) — neutral dollar pressure on gold.`
}

function interpretUS10Y(bond: { price: number; changePercent: number } | null): string {
  if (!bond) return "US10Y unavailable — cannot assess yield pressure"
  if (bond.changePercent > 0.5) return `US10Y RISING (+${bond.changePercent}%) — HEADWIND for gold. Higher yields compete with gold.`
  if (bond.changePercent < -0.5) return `US10Y FALLING (${bond.changePercent}%) — TAILWIND for gold. Lower yields support gold.`
  return `US10Y STABLE (${bond.changePercent}%) — neutral yield environment for gold.`
}

function assessMaximusRisk(dxy: { changePercent: number } | null, bond: { changePercent: number } | null): string {
  const dxyBearish = dxy && dxy.changePercent > 0.5
  const bondBearish = bond && bond.changePercent > 0.5
  const dxyBullish = dxy && dxy.changePercent < -0.5
  const bondBullish = bond && bond.changePercent < -0.5

  if (dxyBearish && bondBearish) return "RISK: HIGH — Both DXY and US10Y rising. Gold under dual pressure. Tighten stops or avoid longs."
  if (dxyBullish && bondBullish) return "OPPORTUNITY: Confluence — DXY falling + US10Y falling. Strong gold tailwind. Buy signal more reliable."
  if (dxyBearish || bondBearish) return "CAUTION: One headwind active. Reduce position size."
  return "NEUTRAL: No strong macro cross-pressure. Technical signals primary."
}

async function appendToMaximusBrain(content: string) {
  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/maximus-brain.md`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
    const current = existing ? Buffer.from(existing.content, "base64").toString("utf-8") : "# Maximus Intelligence Brain\n\n"
    const updated = content + "\n\n" + current

    await fetch(`https://api.github.com/repos/${REPO}/contents/maximus-brain.md`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "MIA macro intelligence update",
        content: Buffer.from(updated).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function GET() {
  const [dxy, us10y, macroNews] = await Promise.all([
    fetchYahooQuote("DX-Y.NYB"),
    fetchYahooQuote("^TNX"),
    fetchMacroNews(),
  ])

  const dxySignal = interpretDXY(dxy)
  const bondSignal = interpretUS10Y(us10y)
  const riskAssessment = assessMaximusRisk(dxy, us10y)
  const now = new Date().toISOString().slice(0, 16).replace("T", " ")

  const macroBlock = `## MIA Macro Intelligence — ${now} UTC
**DXY (US Dollar Index):** ${dxy ? `$${dxy.price} | ${dxy.changePercent > 0 ? "+" : ""}${dxy.changePercent}%` : "Unavailable"}
→ ${dxySignal}

**US10Y (Treasury Yield):** ${us10y ? `${us10y.price}% | ${us10y.changePercent > 0 ? "+" : ""}${us10y.changePercent}%` : "Unavailable"}
→ ${bondSignal}

**${riskAssessment}**

**Macro Context:**
${macroNews || "No macro news retrieved this cycle"}

---`

  await appendToMaximusBrain(macroBlock)

  return NextResponse.json({
    success: true,
    dxy: dxy ? `${dxy.price} (${dxy.changePercent}%)` : "unavailable",
    us10y: us10y ? `${us10y.price}% (${us10y.changePercent}%)` : "unavailable",
    riskAssessment,
    timestamp: now,
  })
}
