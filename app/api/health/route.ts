import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    printify: !!process.env.PRINTIFY_API_TOKEN,
    telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    stripe: !!process.env.STRIPE_SECRET_KEY,
  }
  const allHealthy = Object.values(checks).every(Boolean)
  return NextResponse.json(
    { status: allHealthy ? "ok" : "degraded", timestamp: new Date().toISOString(), checks, allHealthy },
    { status: allHealthy ? 200 : 500 }
  )
}
