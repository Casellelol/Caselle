import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return NextResponse.json({ error: "no token" }, { status: 500 })
  const { chat_id, text } = await req.json() as { chat_id: string; text: string }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" }),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
