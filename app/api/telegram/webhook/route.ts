import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/JARVIS-brain"
const HISTORY_FILE = "telegram-history.json"
const MAX_HISTORY = 10 // messages per chat to keep

type ChatMessage = { role: "user" | "jarvis"; text: string }
type ChatHistory = Record<string, ChatMessage[]>

async function loadHistory(): Promise<{ history: ChatHistory; sha: string }> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${HISTORY_FILE}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return { history: {}, sha: "" }
    const data = await res.json() as { content: string; sha: string }
    const history = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8")) as ChatHistory
    return { history, sha: data.sha }
  } catch {
    return { history: {}, sha: "" }
  }
}

async function saveHistory(history: ChatHistory, sha: string) {
  try {
    const body: Record<string, unknown> = {
      message: "telegram chat history update",
      content: Buffer.from(JSON.stringify(history, null, 2)).toString("base64"),
    }
    if (sha) body.sha = sha
    await fetch(`https://api.github.com/repos/${REPO}/contents/${HISTORY_FILE}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {}
}

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
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
    if (!message || !message.text) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id
    const text: string = message.text
    const firstName: string = message.from?.first_name || "sir"
    const chatKey = String(chatId)

    // Load history and show typing in parallel
    const [{ history, sha }] = await Promise.all([
      loadHistory(),
      sendTyping(chatId),
    ])

    const thread: ChatMessage[] = history[chatKey] || []

    // Build context from recent conversation
    const contextLines = thread.slice(-MAX_HISTORY).map(m =>
      m.role === "user" ? `Osvaldas: ${m.text}` : `JARVIS: ${m.text}`
    ).join("\n")

    const fullMessage = contextLines
      ? `[Telegram conversation with ${firstName}]\n\nRecent thread:\n${contextLines}\n\nOsvaldas: ${text}`
      : `[Telegram from ${firstName}] ${text}`

    // Ask JARVIS
    const jarvisRes = await fetch(`${BASE_URL}/api/jarvis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fullMessage }),
    })

    const data = await jarvisRes.json()
    const reply = (data.response || data.error || "I'm offline, sir.") as string

    // Update and save history
    thread.push({ role: "user", text })
    thread.push({ role: "jarvis", text: reply })
    history[chatKey] = thread.slice(-MAX_HISTORY)
    saveHistory(history, sha).catch(() => {})

    // Send reply (split if over 4096 chars)
    if (reply.length <= 4096) {
      await sendMessage(chatId, reply)
    } else {
      const chunks: string[] = []
      for (let i = 0; i < reply.length; i += 4000) chunks.push(reply.slice(i, i + 4000))
      for (const chunk of chunks) await sendMessage(chatId, chunk)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Telegram webhook error:", err)
    return NextResponse.json({ ok: true })
  }
}
