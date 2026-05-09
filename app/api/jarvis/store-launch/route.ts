import { NextRequest, NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const REPO = "Casellelol/Caselle"

async function githubGet(path: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
  })
  return res.ok ? await res.json() : null
}

async function githubPut(path: string, content: string, message: string) {
  const existing = await githubGet(path)
  await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

async function createPrintifyShop(name: string): Promise<string | null> {
  // Printify doesn't have a create-shop API — shops are created via their dashboard
  // We log the intent and return null; owner creates shop manually once
  return null
}

async function updateEmpireJson(store: {
  id: string; name: string; niche: string; aesthetic: string; rationale: string
}) {
  const existing = await githubGet("empire.json")
  const current = existing
    ? JSON.parse(Buffer.from(existing.content, "base64").toString("utf-8"))
    : { stores: [] }

  // Don't duplicate
  if (current.stores.some((s: { id: string }) => s.id === store.id)) return

  current.stores.push({
    id: store.id,
    name: store.name,
    status: "scaffolded",
    niche: store.niche,
    aesthetic: store.aesthetic,
    rationale: store.rationale,
    launched_by: "JARVIS_AUTONOMOUS",
    launched_at: new Date().toISOString(),
    products_published: 0,
    revenue: 0,
    vercel_url: null,
    printify_shop_id: null,
  })
  current.last_updated = new Date().toISOString()

  await githubPut("empire.json", JSON.stringify(current, null, 2), `JARVIS launched new store: ${store.name}`)
}

async function createBrainFile(store: {
  id: string; name: string; niche: string; aesthetic: string; rationale: string
}) {
  const content = `# ${store.name} — Empire Brain
*Autonomous store launched by JARVIS on ${new Date().toISOString().slice(0, 10)}*

## Identity
- **Niche:** ${store.niche}
- **Aesthetic:** ${store.aesthetic}
- **Why now:** ${store.rationale}

## Status
- Products published: 0
- Revenue: £0
- Printify shop: PENDING (create manually at printify.com → connect to this store)

## Strategy
Build on the same POD pipeline as Caselle. First 10 products should establish the aesthetic clearly.
Scout agent will begin populating intelligence once shop ID is set.

## Intelligence
*(Scout will populate this section once live)*
`
  await githubPut(`${store.id}-brain.md`, content, `JARVIS: create brain file for ${store.name}`)
}

async function logStoreLaunch(store: {
  name: string; niche: string; aesthetic: string; rationale: string
}) {
  const entry = `[${new Date().toISOString().slice(0, 16).replace("T", " ")}] | SYSTEM_CHANGE | ${store.name} | JARVIS autonomously launched new store — ${store.niche} / ${store.aesthetic}. Rationale: ${store.rationale}\n`
  const existing = await githubGet("empire-changelog.md")
  if (!existing) return
  const current = Buffer.from(existing.content, "base64").toString("utf-8")
  const header = "# EMPIRE CHANGELOG\n*Maintained by JARVIS. Updated autonomously on every action taken.*\n\n---\n\n"
  const body = current.replace(/^# EMPIRE[^\n]*\n[^\n]*\n\n---\n\n/, "")
  await githubPut("empire-changelog.md", header + entry + body, `Empire changelog: ${store.name} launched`)
}

export async function POST(req: NextRequest) {
  try {
    const { name, niche, aesthetic, rationale, confidence } = await req.json()

    if (!name || !niche || !aesthetic || !rationale) {
      return NextResponse.json({ error: "Missing required fields: name, niche, aesthetic, rationale" }, { status: 400 })
    }

    if (confidence && confidence < 70) {
      return NextResponse.json({ error: "Confidence below 70% threshold — store launch aborted" }, { status: 400 })
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-")

    // Run all scaffolding in parallel
    await Promise.all([
      updateEmpireJson({ id, name, niche, aesthetic, rationale }),
      createBrainFile({ id, name, niche, aesthetic, rationale }),
      logStoreLaunch({ name, niche, aesthetic, rationale }),
    ])

    return NextResponse.json({
      success: true,
      store: { id, name, niche, aesthetic, status: "scaffolded" },
      next: `Printify shop must be created manually at printify.com and shop ID set in empire.json for ${name}`,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
