import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  })
}

async function sendTyping(chatId: number) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()

    const message = update.message || update.edited_message
    if (!message || !message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId: number = message.chat.id
    const text: string = message.text
    const firstName: string = message.from?.first_name || "sir"

    // Show typing indicator
    await sendTyping(chatId)

    // Pass to JARVIS
    const jarvisRes = await fetch(`${BASE_URL}/api/jarvis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `[Telegram from ${firstName}] ${text}`,
      }),
    })

    const data = await jarvisRes.json()
    const reply = data.response || data.error || "I'm offline, sir. Try again shortly."

    // Telegram has a 4096 char limit per message
    if (reply.length <= 4096) {
      await sendMessage(chatId, reply)
    } else {
      // Split into chunks
      const chunks: string[] = []
      for (let i = 0; i < reply.length; i += 4000) chunks.push(reply.slice(i, i + 4000))
      for (const chunk of chunks) {
        await sendMessage(chatId, chunk)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Telegram webhook error:", err)
    return NextResponse.json({ ok: true })
  }
}
