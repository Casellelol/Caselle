import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse("tiktok-developers-site-verification=DCwM2oBs1utTlIedUHt7tYkEi01lETfw", {
    headers: { "Content-Type": "text/plain" },
  })
}
