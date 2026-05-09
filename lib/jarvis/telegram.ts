const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID || "7824400934"

export async function notifyOwner(message: string): Promise<boolean> {
  if (!TELEGRAM_TOKEN) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: OWNER_CHAT_ID, text: message, parse_mode: "Markdown" }),
    })
    return res.ok
  } catch { return false }
}
