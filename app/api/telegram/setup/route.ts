import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 })

  const webhookUrl = "https://burga-store.vercel.app/api/telegram/webhook"

  const setRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`)
  const setData = await setRes.json()

  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
  const infoData = await infoRes.json()

  return NextResponse.json({ set: setData, info: infoData })
}
