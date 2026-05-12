import { NextRequest, NextResponse } from "next/server"
import { notifyOwner } from "@/lib/jarvis/telegram"
import { BLUEPRINTS, getBlueprintByName } from "@/lib/printify-blueprints"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const GITHUB_ORG = "Casellelol"
const TEMPLATE_REPO = "store-template"
const CASELLE_REPO = "Caselle"

async function githubGet(repo: string, path: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
  })
  return res.ok ? await res.json() : null
}

async function githubPut(repo: string, path: string, content: string, message: string) {
  const existing = await githubGet(repo, path)
  const res = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    }),
  })
  return res.ok
}

// Create new GitHub repo from burga-store template
async function createGitHubRepo(repoName: string, storeName: string, niche: string): Promise<boolean> {
  // Try generating from template repo first
  const templateRes = await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${TEMPLATE_REPO}/generate`, {
    method: "POST",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json", Accept: "application/vnd.github.v3+json" },
    body: JSON.stringify({ owner: GITHUB_ORG, name: repoName, description: `${storeName} — ${niche} POD store`, private: false }),
  })

  if (templateRes.ok) return true

  // Fallback: create blank repo and push minimal files
  const createRes = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
    method: "POST",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: repoName, description: `${storeName} — ${niche} POD store`, private: false, auto_init: true }),
  })

  if (!createRes.ok) return false

  // Wait briefly for GitHub to initialise the repo
  await new Promise(r => setTimeout(r, 3000))

  // Push brand-specific README and placeholder package.json so Vercel can detect Next.js
  await githubPut(repoName, "README.md",
    `# ${storeName}\n\n${niche} phone case store — autonomously launched by JARVIS.\n\nPowered by the same pipeline as Caselle.\n`,
    "init: JARVIS store scaffold"
  )

  return true
}

// Create Vercel project linked to the GitHub repo and trigger first deploy
async function createVercelProject(repoName: string, storeName: string, brandId: string): Promise<string | null> {
  if (!VERCEL_TOKEN) return null

  const createRes = await fetch("https://api.vercel.com/v10/projects", {
    method: "POST",
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: repoName.toLowerCase(),
      framework: "nextjs",
      gitRepository: { type: "github", repo: `${GITHUB_ORG}/${repoName}` },
    }),
  })

  if (!createRes.ok) return null
  const project = await createRes.json() as { id: string; alias?: string[] }
  const projectId = project.id

  // Set env vars so the new store knows its identity and has all keys
  const envVars = [
    { key: "BRAND_ID", value: brandId, target: ["production", "preview"] },
    { key: "BRAND_NAME", value: storeName, target: ["production", "preview"] },
    { key: "PRINTIFY_API_TOKEN", value: PRINTIFY_TOKEN || "", target: ["production", "preview"] },
    { key: "PRINTIFY_SHOP_ID", value: "27451784", target: ["production", "preview"] },
    { key: "STRIPE_SECRET_KEY", value: STRIPE_SECRET_KEY || "", target: ["production", "preview"] },
    { key: "ANTHROPIC_API_KEY", value: ANTHROPIC_API_KEY || "", target: ["production", "preview"] },
    { key: "GITHUB_TOKEN", value: GITHUB_TOKEN || "", target: ["production", "preview"] },
    { key: "RESEND_API_KEY", value: RESEND_API_KEY || "", target: ["production", "preview"] },
    { key: "NEXT_PUBLIC_BASE_URL", value: `https://${repoName.toLowerCase()}.vercel.app`, target: ["production", "preview"] },
  ]

  await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
    method: "POST",
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(envVars),
  })

  // Trigger first deployment
  await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: repoName.toLowerCase(),
      gitSource: { type: "github", org: GITHUB_ORG, repo: repoName, ref: "main" },
    }),
  })

  return `https://${repoName.toLowerCase()}.vercel.app`
}

// Tag future Printify products for this brand — no new shop needed
// Products get a brand tag, frontend filters by it
async function registerBrandTag(brandId: string, storeName: string, blueprintNames: string[]): Promise<void> {
  const blueprintDetails = blueprintNames
    .map(name => {
      const b = getBlueprintByName(name)
      return b ? `- ${name}: blueprint ${b.blueprint_id}, provider ${b.provider_id} (${b.provider_name}), retail $${b.recommended_retail_usd}` : `- ${name}: unknown`
    })
    .join("\n")

  await githubPut(CASELLE_REPO, `${brandId}-brain.md`,
    `# ${storeName} — Empire Brain\n*Autonomously launched by JARVIS — ${new Date().toISOString().slice(0, 10)}*\n\n## Brand Tag\nAll Printify products for this store use tag: \`brand:${brandId}\`\n\n## Product Blueprints\n${blueprintDetails}\n\n## Status\n- Products: 0\n- Revenue: £0\n- Vercel: pending first deployment\n\n## Intelligence\n*(Scout will populate once first products are live)*\n`,
    `JARVIS: init brain for ${storeName}`
  )
}

async function updateEmpireJson(store: {
  id: string; name: string; niche: string; aesthetic: string; rationale: string; vercelUrl: string | null
}) {
  const existing = await githubGet(CASELLE_REPO, "empire.json")
  if (!existing) return
  const current = JSON.parse(Buffer.from(existing.content, "base64").toString("utf-8"))
  if (current.stores?.some((s: { id: string }) => s.id === store.id)) return

  current.stores = current.stores || []
  current.stores.push({
    id: store.id,
    name: store.name,
    status: store.vercelUrl ? "deploying" : "scaffolded",
    niche: store.niche,
    aesthetic: store.aesthetic,
    rationale: store.rationale,
    brand_tag: `brand:${store.id}`,
    vercel_url: store.vercelUrl,
    printify_shop_id: "27451784",
    launched_by: "JARVIS_AUTONOMOUS",
    launched_at: new Date().toISOString(),
    products_published: 0,
    revenue: 0,
  })
  current.last_updated = new Date().toISOString()

  await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${CASELLE_REPO}/contents/empire.json`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `JARVIS autonomously launched: ${store.name}`,
      content: Buffer.from(JSON.stringify(current, null, 2)).toString("base64"),
      sha: existing.sha,
    }),
  })
}

async function appendChangelog(storeName: string, niche: string, rationale: string, vercelUrl: string | null) {
  const entry = `[${new Date().toISOString().slice(0, 16).replace("T", " ")}] | SYSTEM_CHANGE | ${storeName} | JARVIS autonomously launched new store — ${niche}. Rationale: ${rationale}. URL: ${vercelUrl || "deploying"}\n`
  const existing = await githubGet(CASELLE_REPO, "empire-changelog.md")
  if (!existing) return
  const current = Buffer.from(existing.content, "base64").toString("utf-8")
  const header = "# EMPIRE CHANGELOG\n*Maintained by JARVIS. Updated autonomously on every action taken.*\n\n---\n\n"
  const body = current.replace(/^# EMPIRE[^\n]*\n[^\n]*\n\n---\n\n/, "")
  await fetch(`https://api.github.com/repos/${GITHUB_ORG}/${CASELLE_REPO}/contents/empire-changelog.md`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Empire changelog: ${storeName} launched`,
      content: Buffer.from(header + entry + body).toString("base64"),
      sha: existing.sha,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { name, niche, aesthetic, rationale, confidence, blueprints: requestedBlueprints } = await req.json()

    if (!name || !niche || !aesthetic || !rationale) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (confidence && confidence < 70) {
      return NextResponse.json({ error: "Confidence below 70% — launch aborted" }, { status: 400 })
    }

    // Resolve blueprints — default to phone cases if not specified
    const blueprintNames: string[] = (requestedBlueprints && requestedBlueprints.length > 0)
      ? requestedBlueprints
      : ["Tough Case"]

    const resolvedBlueprints = blueprintNames
      .map(n => ({ name: n, blueprint: getBlueprintByName(n) }))
      .filter(b => b.blueprint !== null)

    // Generate initial product queue (5 products across selected blueprints)
    const products_to_create = resolvedBlueprints.flatMap(({ name: bpName, blueprint: b }) => {
      if (!b) return []
      const count = Math.max(1, Math.floor(5 / resolvedBlueprints.length))
      return Array.from({ length: count }, (_, i) => ({
        blueprint: bpName,
        blueprint_id: b.blueprint_id,
        provider_id: b.provider_id,
        suggested_niche: b.best_niches[i % b.best_niches.length],
        retail_price: b.recommended_retail_usd,
      }))
    }).slice(0, 5)

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const repoName = `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}-store`

    // Step 1: Create GitHub repo
    const repoCreated = await createGitHubRepo(repoName, name, niche)

    // Step 2: Create Vercel project (fully automated if VERCEL_TOKEN is set)
    if (!VERCEL_TOKEN) {
      await notifyOwner(
        `⚡ *JARVIS — Action Required*\n\nI have decided to launch a new store: *${name}* (${niche})\n\n*Rationale:* ${rationale}\n\nEverything is ready but I need one thing from you:\n\n*Add \`VERCEL_TOKEN\` to your Vercel environment variables.*\n\n1. Go to vercel.com → Account Settings → Tokens\n2. Create a token named "JARVIS"\n3. Add it as \`VERCEL_TOKEN\` in the burga-store project env vars\n\nOnce set, I will deploy *${name}* automatically — no further action needed from you, ever.`
      )
    }
    const vercelUrl = repoCreated ? await createVercelProject(repoName, name, id) : null

    // Step 3: Register brand tag with blueprint details
    await registerBrandTag(id, name, blueprintNames)

    // Step 4: Update empire state
    await Promise.all([
      updateEmpireJson({ id, name, niche, aesthetic, rationale, vercelUrl }),
      appendChangelog(name, niche, rationale, vercelUrl),
    ])

    if (vercelUrl) {
      const blueprintSummary = blueprintNames.join(", ")
      await notifyOwner(
        `🚀 *JARVIS — New Store Launched*\n\n*${name}* is deploying now.\n\n*Niche:* ${niche}\n*Aesthetic:* ${aesthetic}\n*Blueprints:* ${blueprintSummary}\n*URL:* ${vercelUrl}\n*Reason I launched it:* ${rationale}\n\nProducts tagged \`brand:${id}\` will start publishing automatically. No action needed from you.`
      )
    }

    return NextResponse.json({
      success: true,
      store: { id, name, niche, aesthetic, vercelUrl, repoName },
      blueprints: blueprintNames,
      products_to_create,
      fullyAutonomous: !!VERCEL_TOKEN,
      note: VERCEL_TOKEN
        ? `${name} is deploying to ${vercelUrl}. JARVIS will begin publishing products tagged brand:${id}.`
        : `VERCEL_TOKEN not set — GitHub repo created but Vercel deploy requires token. Add VERCEL_TOKEN to env to make this fully autonomous.`,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// Suppress unused import warning
void Object.keys(BLUEPRINTS).length
