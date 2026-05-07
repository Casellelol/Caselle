import { NextRequest, NextResponse } from "next/server"

// Exelixis now routes to JARVIS — the unified empire mastermind
export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jarvis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
