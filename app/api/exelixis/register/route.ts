import { NextRequest, NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REGISTRY_REPO = "Casellelol/JARVIS-brain"

export async function POST(req: NextRequest) {
  try {
    const { name, repo, url, type } = await req.json()
    if (!name || !repo || !url) {
      return NextResponse.json({ error: "name, repo, url required" }, { status: 400 })
    }

    // Read current registry
    const getRes = await fetch(
      `https://api.github.com/repos/${REGISTRY_REPO}/contents/stores.json`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    const existing = await getRes.json()
    const currentContent = Buffer.from(existing.content, "base64").toString("utf-8")
    const registry = JSON.parse(currentContent)

    // Check if store already registered
    const alreadyExists = registry.stores.find((s: { repo: string }) => s.repo === repo)
    if (alreadyExists) {
      return NextResponse.json({ message: "Store already registered", store: alreadyExists })
    }

    // Add new store
    registry.stores.push({
      name,
      repo,
      url,
      type: type || "dropshipping",
      status: "live",
      created: new Date().toISOString().slice(0, 10),
    })

    // Save back to GitHub
    await fetch(`https://api.github.com/repos/${REGISTRY_REPO}/contents/stores.json`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Register new store: ${name}`,
        content: Buffer.from(JSON.stringify(registry, null, 2)).toString("base64"),
        sha: existing.sha,
      }),
    })

    return NextResponse.json({ success: true, message: `${name} registered with Exelixis`, total: registry.stores.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "Registration failed", detail: msg }, { status: 500 })
  }
}
