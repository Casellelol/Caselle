import { NextRequest, NextResponse } from "next/server"

const BUFFER_API = "https://api.bufferapp.com/1"

export async function POST(req: NextRequest) {
  const { text, imageUrl, profiles } = await req.json()

  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: "No Buffer token" }, { status: 500 })

  // Get profile IDs if not specified
  let profileIds = profiles
  if (!profileIds) {
    const profilesRes = await fetch(`${BUFFER_API}/profiles.json?access_token=${token}`)
    const profilesData = await profilesRes.json()
    profileIds = profilesData.map((p: { id: string }) => p.id)
  }

  // Schedule post to all connected profiles
  const body = new URLSearchParams({
    text,
    access_token: token,
    now: "true",
  })

  profileIds.forEach((id: string) => body.append("profile_ids[]", id))
  if (imageUrl) body.append("media[photo]", imageUrl)

  const res = await fetch(`${BUFFER_API}/updates/create.json`, {
    method: "POST",
    body,
  })

  const data = await res.json()
  return NextResponse.json(data)
}

export async function GET(req: NextRequest) {
  const token = process.env.BUFFER_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: "No Buffer token" }, { status: 500 })

  const res = await fetch(`${BUFFER_API}/profiles.json?access_token=${token}`)
  const data = await res.json()
  return NextResponse.json(data)
}
