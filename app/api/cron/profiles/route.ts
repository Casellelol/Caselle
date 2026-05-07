import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function fetchGitHubFile(path: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/Casellelol/Caselle/contents/${path}`,
    { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
  )
  return res.ok ? res.text() : ""
}

async function blueskyLogin() {
  const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: process.env.BLUESKY_HANDLE!,
      password: process.env.BLUESKY_PASSWORD!,
    }),
  })
  const data = await res.json()
  if (!data.accessJwt) throw new Error("Bluesky login failed: " + JSON.stringify(data))
  return data
}

// Pick the best bio line based on Exelixis strategy
function buildBio(strategy: string): string {
  const bios = [
    "quiet luxury phone cases ✦ minimal. timeless. yours. shop → burga-store.vercel.app",
    "phone cases for people with taste ✦ marble, sage, navy + more → burga-store.vercel.app",
    "caselle — quiet luxury phone cases from $24.99 ✦ burga-store.vercel.app",
    "your phone deserves better ✦ quiet luxury cases, tough build → burga-store.vercel.app",
    "minimal phone cases. maximum aesthetic ✦ caselle → burga-store.vercel.app",
  ]

  // Use strategy to pick angle — default to rotation by week number
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
  return bios[week % bios.length]
}

async function updateBlueskyProfile(session: { accessJwt: string; did: string }, bio: string) {
  // Get current profile first
  const current = await fetch(`https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${session.did}`, {
    headers: { Authorization: `Bearer ${session.accessJwt}` },
  }).then((r) => r.json())

  // Update profile with new bio
  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.putRecord", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.actor.profile",
      rkey: "self",
      record: {
        $type: "app.bsky.actor.profile",
        displayName: current.displayName || "Caselle",
        description: bio,
        avatar: current.avatar,
        banner: current.banner,
      },
    }),
  })

  return res.json()
}

async function pinBestPost(session: { accessJwt: string; did: string }) {
  // Get recent posts
  const feed = await fetch(
    `https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${session.did}&limit=20`,
    { headers: { Authorization: `Bearer ${session.accessJwt}` } }
  ).then((r) => r.json())

  const posts = feed.feed || []
  if (posts.length === 0) return null

  // Find most liked post
  const best = posts.reduce((top: any, item: any) => {
    const score = (item.post?.likeCount || 0) * 3 + (item.post?.repostCount || 0) * 5
    const topScore = (top?.post?.likeCount || 0) * 3 + (top?.post?.repostCount || 0) * 5
    return score > topScore ? item : top
  }, posts[0])

  const postUri = best?.post?.uri
  if (!postUri) return null

  // Pin it via profile update
  const current = await fetch(`https://bsky.social/xrpc/app.bsky.actor.getProfile?actor=${session.did}`, {
    headers: { Authorization: `Bearer ${session.accessJwt}` },
  }).then((r) => r.json())

  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.putRecord", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.actor.profile",
      rkey: "self",
      record: {
        $type: "app.bsky.actor.profile",
        displayName: current.displayName || "Caselle",
        description: current.description,
        avatar: current.avatar,
        banner: current.banner,
        pinnedPost: { uri: postUri, cid: best.post.cid },
      },
    }),
  })

  return { pinned: postUri, text: best?.post?.record?.text?.slice(0, 60) }
}

export async function GET() {
  const results: Record<string, unknown> = {}
  const errors: string[] = []

  try {
    const strategy = await fetchGitHubFile("exelixis-strategy.md")
    const bio = buildBio(strategy)
    results.bio = bio

    const session = await blueskyLogin()

    // Update bio
    try {
      await updateBlueskyProfile(session, bio)
      results.bioUpdated = true
    } catch (e) {
      errors.push(`Bio update: ${e}`)
      results.bioUpdated = false
    }

    // Pin best post
    try {
      const pinResult = await pinBestPost(session)
      results.pinned = pinResult || "no posts to pin yet"
    } catch (e) {
      errors.push(`Pin post: ${e}`)
      results.pinned = "failed"
    }
  } catch (e) {
    errors.push(`Login: ${e}`)
  }

  return NextResponse.json({ success: errors.length === 0, ...results, errors })
}
