import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const RESEND_API_KEY = process.env.RESEND_API_KEY
const REPO = "Casellelol/JARVIS-brain"
const EMAIL_FILE = "email-list.md"
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://burga-store.vercel.app"
const RECOVERY_TAG = "[cart-recovery]"

async function getEmailList(): Promise<{ content: string; sha: string }> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${EMAIL_FILE}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
  })
  if (!res.ok) return { content: "# Caselle Email List\n\n", sha: "" }
  const data = await res.json() as { content: string; sha: string }
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha }
}

async function updateEmailList(content: string, sha: string) {
  const body: Record<string, unknown> = {
    message: "Cart recovery email logged",
    content: Buffer.from(content).toString("base64"),
  }
  if (sha) body.sha = sha
  await fetch(`https://api.github.com/repos/${REPO}/contents/${EMAIL_FILE}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function wasRecentlySent(emailListContent: string, email: string): boolean {
  const lines = emailListContent.split("\n").filter(l => l.includes(email) && l.includes(RECOVERY_TAG))
  if (lines.length === 0) return false
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  for (const line of lines) {
    const match = line.match(/\((\d{4}-\d{2}-\d{2}T[\d:.Z]+)\)/)
    if (match && new Date(match[1]).getTime() > sevenDaysAgo) return true
  }
  return false
}

async function sendRecoveryEmail(email: string, productName: string, checkoutUrl: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Caselle <onboarding@resend.dev>",
      to: email,
      subject: "You left something behind ✨",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A18;">
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Still thinking about it?</p>
          <p style="color: #8C8880; margin-bottom: 24px;">
            <strong>${productName}</strong> is still waiting for you. Cases like this tend to sell out —
            complete your order before it's gone.
          </p>
          <a href="${checkoutUrl}" style="display: inline-block; background: #1A1A18; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 14px; letter-spacing: 0.08em;">
            COMPLETE YOUR ORDER
          </a>
          <p style="margin-top: 32px; font-size: 12px; color: #8C8880;">
            Free standard shipping · 30-day returns · Caselle, London
          </p>
        </div>
      `,
    }),
  })
  return res.ok
}

export async function GET() {
  try {
    const now = Math.floor(Date.now() / 1000)
    const yesterday = now - 86400

    // Fetch expired (abandoned) sessions from last 24h
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: yesterday },
    })

    const abandoned = sessions.data.filter(s => s.status === "expired" && s.customer_details?.email)

    if (abandoned.length === 0) {
      return NextResponse.json({ sent: 0, skipped: 0, message: "No abandoned carts found" })
    }

    const { content: emailListContent, sha } = await getEmailList()
    let updatedContent = emailListContent
    let sent = 0
    let skipped = 0

    for (const session of abandoned) {
      const email = session.customer_details!.email!
      if (wasRecentlySent(updatedContent, email)) {
        skipped++
        continue
      }

      // Extract product name from line items
      let productName = "Your Caselle case"
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
        if (lineItems.data[0]?.description) productName = lineItems.data[0].description
        else if (lineItems.data[0]?.price?.product) {
          const product = await stripe.products.retrieve(lineItems.data[0].price.product as string)
          productName = product.name
        }
      } catch {}

      const checkoutUrl = session.url || `${BASE_URL}/products`
      const ok = await sendRecoveryEmail(email, productName, checkoutUrl)

      if (ok) {
        sent++
        const ts = new Date().toISOString()
        updatedContent = updatedContent.trimEnd() + `\n- ${email} ${RECOVERY_TAG} (${ts})\n`
      }
    }

    if (sent > 0) {
      await updateEmailList(updatedContent, sha)
    }

    return NextResponse.json({ sent, skipped, total_abandoned: abandoned.length })
  } catch (err) {
    console.error("[cart-recovery] Error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
