import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Maximus"
const BRAIN_PATH = "maximus-brain.md"
const MAX_ENTRIES = 30 // keep last 30 daily entries in brain file

async function getGoldPrice(): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1h&range=2d",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const result = data.chart.result[0]
    const closes = result.indicators.quote[0].close.filter(Boolean)
    const price = closes[closes.length - 1]
    const prevPrice = closes[closes.length - 2]
    const change = price - prevPrice
    const changePercent = (change / prevPrice) * 100
    return {
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    }
  } catch { return null }
}

function calculateRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50
  let gains = 0, losses = 0
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff > 0) gains += diff
    else losses += Math.abs(diff)
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return Math.round(100 - 100 / (1 + rs))
}

function calculateSMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null
  const slice = prices.slice(-period)
  return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length * 100) / 100
}

// Fetch 60 days of daily closes — enough for SMA 50
async function getGoldHistory(): Promise<number[]> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=60d",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    return data.chart.result[0].indicators.quote[0].close.filter(Boolean)
  } catch { return [] }
}

async function getGoldNews(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.duckduckgo.com/?q=gold+price+XAU+today&format=json&no_html=1",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const parts: string[] = []
    if (data.AbstractText) parts.push(data.AbstractText)
    data.RelatedTopics?.slice(0, 3).forEach((t: { Text?: string }) => {
      if (t.Text) parts.push(t.Text)
    })
    return parts.join(" | ") || "No news found"
  } catch { return "News unavailable" }
}

async function getCurrentBrain(): Promise<{ content: string; sha: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${BRAIN_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    if (!res.ok) return { content: "", sha: "" }
    const data = await res.json() as { content: string; sha: string }
    return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha }
  } catch { return { content: "", sha: "" } }
}

// Split existing content into individual `---` delimited entries, keep last MAX_ENTRIES-1
function trimOldEntries(existing: string): string {
  const header = "# MAXIMUS INTELLIGENCE LOG\n**Asset:** XAU/USD (Gold)\n**Mode:** Monitoring-only (live trading begins May 20, 2026)\n\n---\n\n"
  const body = existing.includes("---\n\n") ? existing.split("---\n\n").slice(1).join("---\n\n") : existing
  const entries = body.split("\n---\n").map(e => e.trim()).filter(Boolean)
  const kept = entries.slice(0, MAX_ENTRIES - 1)
  return header + kept.join("\n\n---\n\n")
}

async function appendToBrain(newEntry: string) {
  const { content: existing, sha } = await getCurrentBrain()
  const trimmed = trimOldEntries(existing)
  const updated = trimmed + "\n\n---\n\n" + newEntry

  const body: Record<string, unknown> = {
    message: `Maximus daily scan — ${new Date().toISOString().slice(0, 10)}`,
    content: Buffer.from(updated).toString("base64"),
  }
  if (sha) body.sha = sha

  await fetch(`https://api.github.com/repos/${REPO}/contents/${BRAIN_PATH}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export async function GET() {
  const [spotData, history, news] = await Promise.all([
    getGoldPrice(),
    getGoldHistory(),
    getGoldNews(),
  ])

  const rsi = history.length > 14 ? calculateRSI(history) : null
  const sma20 = calculateSMA(history, 20)
  const sma50 = calculateSMA(history, 50)

  const trend = sma20 && sma50
    ? sma20 > sma50 ? "BULLISH (SMA20 > SMA50)" : "BEARISH (SMA20 < SMA50)"
    : sma20 ? "PARTIAL — SMA20 calculated, SMA50 needs more history"
    : "UNKNOWN"

  const rsiSignal = rsi !== null
    ? rsi < 30 ? "OVERSOLD — watch for reversal buy"
    : rsi > 70 ? "OVERBOUGHT — watch for reversal sell"
    : "NEUTRAL"
    : "INSUFFICIENT DATA"

  const tradeSignal = rsi && sma20 && sma50
    ? rsi < 35 && sma20 > sma50 ? "LONG BIAS — oversold in uptrend"
    : rsi > 65 && sma20 < sma50 ? "SHORT BIAS — overbought in downtrend"
    : "NO TRADE — wait for clearer signal"
    : "MONITORING — accumulating data"

  const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ")
  const dataPoints = history.length

  const entry = `## Scan — ${timestamp} UTC
**Mode:** MONITORING ONLY (no live trades until May 20, 2026)

| Metric | Value | Signal |
|--------|-------|--------|
| Gold Spot | $${spotData?.price ?? "unavailable"} | Δ ${spotData?.change ?? "?"} (${spotData?.changePercent ?? "?"}%) |
| RSI 14 | ${rsi ?? "N/A"} | ${rsiSignal} |
| SMA 20 | $${sma20 ?? "N/A"} | — |
| SMA 50 | $${sma50 ?? "N/A"} | — |
| Trend | ${trend} | — |
| History depth | ${dataPoints} days | ${dataPoints >= 50 ? "✅ SMA50 ready" : `⏳ need ${50 - dataPoints} more days`} |

**Trade Signal:** ${tradeSignal}

**News context:**
${news.slice(0, 300)}

**Maximus note:** ${
    rsi && spotData
      ? `Price $${spotData.price}. RSI ${rsi} (${rsiSignal}). ${trend}. Pattern accumulating — ${dataPoints} days of data on record.`
      : "Insufficient data. Continuing to accumulate daily closes."
  }`

  await appendToBrain(entry)

  return NextResponse.json({
    status: "ok",
    mode: "monitoring-only",
    trade_live_date: "2026-05-20",
    price: spotData,
    rsi,
    sma20,
    sma50,
    trend,
    rsiSignal,
    tradeSignal,
    history_depth: dataPoints,
    news: news.slice(0, 200),
  })
}
