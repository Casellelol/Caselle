import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Maximus"

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
    return { price: Math.round(price * 100) / 100, change: Math.round(change * 100) / 100, changePercent: Math.round(changePercent * 100) / 100 }
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

function calculateSMA(prices: number[], period: number): number {
  const slice = prices.slice(-period)
  return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length * 100) / 100
}

async function getGoldHistory(): Promise<number[]> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=30d",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    return data.chart.result[0].indicators.quote[0].close.filter(Boolean)
  } catch { return [] }
}

async function getGoldNews(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.duckduckgo.com/?q=gold+price+XAU+today+2025&format=json&no_html=1",
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

async function saveToGitHub(content: string) {
  try {
    const path = "maximus-brain.md"
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    })
    const existing = getRes.ok ? await getRes.json() : null
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const newContent = `# Maximus Intelligence Brain\n*Last updated: ${date} UTC*\n\n${content}`
    await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Gold Scout update",
        content: Buffer.from(newContent).toString("base64"),
        sha: existing?.sha,
      })
    })
  } catch {}
}

export async function GET() {
  const [spotData, history, news] = await Promise.all([
    getGoldPrice(),
    getGoldHistory(),
    getGoldNews(),
  ])

  const rsi = history.length > 14 ? calculateRSI(history) : null
  const sma20 = history.length >= 20 ? calculateSMA(history, 20) : null
  const sma50 = history.length >= 50 ? calculateSMA(history, 50) : null

  const trend = sma20 && sma50
    ? sma20 > sma50 ? "BULLISH (SMA20 above SMA50)" : "BEARISH (SMA20 below SMA50)"
    : "UNKNOWN"

  const rsiSignal = rsi
    ? rsi < 30 ? "OVERSOLD — potential buy" : rsi > 70 ? "OVERBOUGHT — potential sell" : "NEUTRAL"
    : "UNKNOWN"

  const brain = `
## Gold Price
Price: $${spotData?.price ?? "unavailable"} | Change: ${spotData?.change ?? "?"} (${spotData?.changePercent ?? "?"}%)

## Technical Indicators
RSI (14): ${rsi ?? "N/A"} — ${rsiSignal}
SMA 20: $${sma20 ?? "N/A"}
SMA 50: $${sma50 ?? "N/A"}
Trend: ${trend}

## Market News
${news}

## Maximus Assessment
${rsi && spotData
  ? `Price at $${spotData.price}. RSI ${rsi} signals ${rsiSignal}. Trend is ${trend}. ${
      rsi < 35 && sma20 && sma50 && sma20 > sma50
        ? "Conditions FAVOUR A BUY. Recommend JARVIS alert."
        : rsi > 65 && sma20 && sma50 && sma20 < sma50
        ? "Conditions FAVOUR A SELL. Recommend JARVIS alert."
        : "No clear signal. Monitoring."
    }`
  : "Insufficient data for assessment."
}
`.trim()

  await saveToGitHub(brain)

  return NextResponse.json({
    price: spotData,
    rsi,
    sma20,
    sma50,
    trend,
    rsiSignal,
    news: news.slice(0, 200),
  })
}
