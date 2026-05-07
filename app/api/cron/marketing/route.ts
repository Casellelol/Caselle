import { NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ── Twitter OAuth 1.0a ──────────────────────────────────────────────────────
function buildTwitterAuth(method: string, url: string) {
  const nonce = crypto.randomBytes(16).toString("hex")
  const timestamp = Math.floor(Date.now() / 1000).toString()

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: process.env.TWITTER_API_KEY!,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: process.env.TWITTER_ACCESS_TOKEN!,
    oauth_version: "1.0",
  }

  const sorted = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&")

  const base = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sorted)}`
  const signingKey = `${encodeURIComponent(process.env.TWITTER_API_SECRET!)}&${encodeURIComponent(process.env.TWITTER_ACCESS_SECRET!)}`
  const signature = crypto.createHmac("sha1", signingKey).update(base).digest("base64")

  const all: Record<string, string> = { ...oauthParams, oauth_signature: signature }
  return (
    "OAuth " +
    Object.keys(all)
      .filter((k) => k.startsWith("oauth_"))
      .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(all[k])}"`)
      .join(", ")
  )
}

async function postToTwitter(text: string) {
  const url = "https://api.twitter.com/2/tweets"
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: buildTwitterAuth("POST", url),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

// ── Bluesky ─────────────────────────────────────────────────────────────────
async function postToBluesky(text: string) {
  const session = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: process.env.BLUESKY_HANDLE!,
      password: process.env.BLUESKY_PASSWORD!,
    }),
  }).then((r) => r.json())

  if (!session.accessJwt) throw new Error("Bluesky login failed: " + JSON.stringify(session))

  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text,
        createdAt: new Date().toISOString(),
      },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

// ── GitHub logging ───────────────────────────────────────────────────────────
async function logToGitHub(entry: string) {
  const apiUrl = `https://api.github.com/repos/Casellelol/Caselle/contents/marketing-log.md`
  const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" }

  const current = await fetch(apiUrl, { headers }).then((r) => r.json())
  const currentContent = current.sha ? Buffer.from(current.content, "base64").toString() : ""
  const newContent = entry + "\n\n" + currentContent

  await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `marketing: auto-post ${new Date().toISOString().slice(0, 10)}`,
      content: Buffer.from(newContent).toString("base64"),
      sha: current.sha,
    }),
  })
}

// ── Post copy templates ──────────────────────────────────────────────────────
const POSTS = [
  "your phone deserves better. quiet luxury phone cases, designed to last. burga-store.vercel.app #QuietLuxury #PhoneCases",
  "minimal. timeless. yours. phone cases that match your aesthetic — marble, sage, navy + more. burga-store.vercel.app #PhoneCase",
  "the details make the difference. caselle quiet luxury phone cases from $24.99. burga-store.vercel.app #QuietLuxury",
  "protect it. style it. own it. tough cases with minimal design. burga-store.vercel.app #PhoneAccessories #MinimalStyle",
  "not loud. just right. caselle — the phone case for people who know. burga-store.vercel.app #QuietLuxury",
  "marble white. midnight navy. champagne gold. your vibe, your case. burga-store.vercel.app #PhoneCase #Aesthetic",
  "quiet luxury isn't a trend. it's a standard. caselle phone cases. burga-store.vercel.app #QuietLuxury #PhoneCases",
  "the phone case you've been looking for. minimal, tough, beautiful. burga-store.vercel.app #PhoneAccessories",
]

// ── Handler ──────────────────────────────────────────────────────────────────
export async function GET() {
  const hour = new Date().getHours()
  const text = POSTS[hour % POSTS.length]

  const results: Record<string, unknown> = { text, timestamp: new Date().toISOString() }
  const errors: string[] = []

  try {
    results.twitter = await postToTwitter(text)
  } catch (e) {
    errors.push(`Twitter: ${e}`)
    results.twitter = "failed"
  }

  try {
    results.bluesky = await postToBluesky(text)
  } catch (e) {
    errors.push(`Bluesky: ${e}`)
    results.bluesky = "failed"
  }

  const logEntry = `## ${new Date().toISOString()}\n- **Text:** ${text}\n- **Twitter:** ${results.twitter === "failed" ? "❌ failed" : "✅ posted"}\n- **Bluesky:** ${results.bluesky === "failed" ? "❌ failed" : "✅ posted"}\n- **Errors:** ${errors.join(" | ") || "none"}\n---`
  try {
    await logToGitHub(logEntry)
  } catch (e) {
    errors.push(`Log: ${e}`)
  }

  return NextResponse.json({ success: errors.length === 0, ...results, errors })
}
