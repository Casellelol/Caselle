import { NextResponse } from "next/server"
import Stripe from "stripe"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/Caselle"

async function checkStripe(): Promise<{ ok: boolean; mode: string; detail: string }> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return { ok: false, mode: "missing", detail: "STRIPE_SECRET_KEY not set" }

  const mode = key.startsWith("sk_live") ? "live" : "test"
  try {
    const stripe = new Stripe(key)
    await stripe.products.list({ limit: 1 })
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    return {
      ok: true,
      mode,
      detail: webhookSecret ? "Key valid, webhook secret set" : "Key valid — webhook secret missing",
    }
  } catch (err) {
    return { ok: false, mode, detail: String(err) }
  }
}

async function checkSocialPosting(): Promise<{ twitter: string; bluesky: string; buffer: string }> {
  const twitter = process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN
    ? "credentials set"
    : "credentials missing"
  const bluesky = process.env.BLUESKY_HANDLE && process.env.BLUESKY_PASSWORD
    ? "credentials set"
    : "credentials missing"
  const buffer = process.env.BUFFER_ACCESS_TOKEN
    ? "token set"
    : "token missing"
  return { twitter, bluesky, buffer }
}

async function checkPrintify(): Promise<{ ok: boolean; detail: string }> {
  const key = process.env.PRINTIFY_API_KEY
  if (!key) return { ok: false, detail: "PRINTIFY_API_KEY not set" }
  try {
    const res = await fetch("https://api.printify.com/v1/shops.json", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
      ? { ok: true, detail: `Connected (HTTP ${res.status})` }
      : { ok: false, detail: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, detail: String(err) }
  }
}

async function saveVerifyReport(report: string) {
  try {
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/jarvis-health.md`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { sha: string } : null
    const body: Record<string, unknown> = {
      message: "JARVIS health check",
      content: Buffer.from(report).toString("base64"),
    }
    if (existing?.sha) body.sha = existing.sha
    await fetch(`https://api.github.com/repos/${REPO}/contents/jarvis-health.md`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {}
}

export async function GET() {
  const [stripe, social, printify] = await Promise.all([
    checkStripe(),
    checkSocialPosting(),
    checkPrintify(),
  ])

  const date = new Date().toISOString().slice(0, 16).replace("T", " ")
  const report = `# JARVIS Health Report
*Last checked: ${date}*

## Stripe
- Status: ${stripe.ok ? "✅ LIVE" : "❌ DOWN"}
- Mode: ${stripe.mode}
- Detail: ${stripe.detail}

## Social Posting
- Twitter: ${social.twitter}
- Bluesky: ${social.bluesky}
- Buffer: ${social.buffer}

## Printify
- Status: ${printify.ok ? "✅ LIVE" : "❌ DOWN"}
- Detail: ${printify.detail}

## Overall
${stripe.ok && printify.ok ? "Empire infrastructure operational." : "⚠ One or more systems need attention."}
`

  await saveVerifyReport(report)

  return NextResponse.json({
    stripe,
    social,
    printify,
    healthy: stripe.ok && printify.ok,
  })
}
