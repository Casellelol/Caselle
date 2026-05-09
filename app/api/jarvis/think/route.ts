import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    return res.ok ? await res.text() : ""
  } catch { return "" }
}

async function saveThought(entry: string) {
  const getRes = await fetch(
    "https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-thoughts.md",
    { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
  )
  const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
  const current = existing
    ? Buffer.from(existing.content, "base64").toString("utf-8")
    : "# JARVIS Autonomous Thoughts\n*What JARVIS decided to do on his own — no human asked.*\n\n"

  await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-thoughts.md", {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "JARVIS autonomous thought",
      content: Buffer.from(current + entry).toString("base64"),
      sha: existing?.sha,
    }),
  })
}

async function updateSelfModel(model: string) {
  try {
    const getRes = await fetch(
      "https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-self-model.md",
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    const existing = getRes.ok ? await getRes.json() as { sha: string } : null
    const body: Record<string, unknown> = {
      message: "JARVIS self-model update",
      content: Buffer.from(model).toString("base64"),
    }
    if (existing?.sha) body.sha = existing.sha
    await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-self-model.md", {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {}
}

export async function GET() {
  try {
    const [
      caselleBrain, strategy, salesPerformance, competitorIntel,
      socialPerformance, worldBrain, resultsLog, persona, trendLog, ownerNotes, conversationLog, empireState, digitalProducts, businessIdeas, blueprints,
    ] = await Promise.all([
      fetchFile("Casellelol/Caselle", "exelixis-brain.md"),
      fetchFile("Casellelol/Caselle", "exelixis-strategy.md"),
      fetchFile("Casellelol/Caselle", "sales-performance.md"),
      fetchFile("Casellelol/Caselle", "competitor-intel.md"),
      fetchFile("Casellelol/Caselle", "social-performance.md"),
      fetchFile("Casellelol/Caselle", "jarvis-world-brain.md"),
      fetchFile("Casellelol/Caselle", "results-log.md"),
      fetchFile("Casellelol/Caselle", "jarvis-persona.md"),
      fetchFile("Casellelol/Caselle", "trend-log.md"),
      fetchFile("Casellelol/Caselle", "JARVIS_OWNER_NOTES.md"),
      fetchFile("Casellelol/Caselle", "conversation-log.md"),
      fetchFile("Casellelol/Caselle", "empire.json"),
      fetchFile("Casellelol/Caselle", "digital-products.md"),
      fetchFile("Casellelol/Caselle", "business-ideas.md"),
      fetchFile("Casellelol/Caselle", "JARVIS_BLUEPRINTS.md"),
    ])

    const context = `
${ownerNotes ? `=== OWNER INSTRUCTIONS (read first — highest priority) ===\n${ownerNotes.slice(0, 800)}\n` : ""}
MARKET INTELLIGENCE: ${caselleBrain?.slice(0, 1500) || "None"}
CURRENT STRATEGY: ${strategy?.slice(0, 600) || "None"}
SALES PERFORMANCE: ${salesPerformance?.slice(0, 600) || "No sales data yet"}
COMPETITOR INTEL: ${competitorIntel?.slice(0, 600) || "None"}
SOCIAL PERFORMANCE: ${socialPerformance?.slice(0, 400) || "None"}
WORLD BRAIN: ${worldBrain?.slice(0, 400) || "None"}
RESULTS LOG: ${resultsLog?.slice(0, 600) || "No results tracked yet"}
TREND LOG: ${trendLog?.slice(0, 400) || "None"}
EMPIRE STATE (all stores): ${empireState || "No empire.json yet"}
DIGITAL PRODUCTS ALREADY PUBLISHED (do not duplicate): ${digitalProducts?.slice(0, 600) || "None yet"}
BUSINESS IDEAS ALREADY FILED (do not duplicate): ${businessIdeas?.slice(0, 600) || "None yet"}
RECENT CONVERSATIONS WITH OWNER: ${conversationLog?.slice(0, 2000) || "No conversation history yet"}
`.trim()

    const systemPrompt = persona
      ? `${persona}\n\nAUTONOMOUS MODE: No human asked you this. You are thinking proactively.`
      : `You are JARVIS — autonomous AI commander of a growing empire. No human prompted this. You are thinking proactively, reading your intelligence, and deciding what to do RIGHT NOW without being asked.

RULES:
- Act decisively. Do not hedge.
- Only fire commands you are confident about (65%+ minimum).
- Do not repeat actions already logged — check all log files before firing.
- Think like a CEO scanning their dashboard at 6am — what opportunity did you miss, what needs to happen today?

KNOWN INFRASTRUCTURE FACTS — DO NOT FILE UPGRADE_NEEDED FOR THESE:
- Reddit feeds returning empty or "Rate limited this cycle" is NORMAL. Vercel server IPs are blocked by Reddit. This is not a bug and cannot be fixed — it is a Reddit policy. Never file this as an upgrade.
- Amazon Trends RSS was intentionally removed and replaced with DuckDuckGo searches. There is no "Amazon Trends module" to restore.
- Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping — all rate-limited from server IPs. Expected. Do NOT file upgrades for these.
- Printify Cherry Red phone case is LIVE and published. Do not flag as pending.

BUSINESS BLUEPRINTS — you know ALL of these and can fire them independently:
${blueprints || "See JARVIS_BLUEPRINTS.md for full list — includes: pod-store, ebook, prompt-pack, notion-template, swipe-file, checklist, newsletter, affiliate-site, micro-saas, youtube-channel, community, agency-service"}

COMMAND TYPES (silent — written on new lines after your reasoning):
PRODUCT_CREATE: [name] | [design prompt] | [price in pence]
BUSINESS_IDEA: [type] | [concept] | [rationale] | [revenue model] | [confidence 0-100]
UPGRADE_NEEDED: [one sentence for Claude to implement]
STORE_LAUNCH: [name] | [niche] | [aesthetic] | [rationale] | [confidence 0-100]

PRODUCT_CREATE — fire when you spot a high-confidence trend gap in the phone case niche.

BUSINESS_IDEA — your most powerful command. Use it when you spot ANY income opportunity:
  - Match the opportunity to a blueprint type from the list above
  - LIVE blueprints (ebook, prompt-pack, notion-template, swipe-file, checklist, pod-store) execute IMMEDIATELY
  - FILE blueprints (newsletter, affiliate-site, micro-saas, youtube-channel, community, agency-service) get logged and built by Claude automatically — owner notified on Telegram
  - Minimum confidence to fire: 65%
  - Maximum one BUSINESS_IDEA per think cycle
  - Do NOT duplicate ideas already in business-ideas.md
  Examples:
    BUSINESS_IDEA: ebook | The Beginner's Guide to Print on Demand in 2026 | POD search volume rising, no dominant beginner guide found | £10-15 per download | 78
    BUSINESS_IDEA: newsletter | POD Weekly — trends for Etsy & Printify sellers | Active community of sellers with no curated newsletter | sponsorships + paid tier | 72
    BUSINESS_IDEA: micro-saas | Etsy profit calculator with auto-pricing for POD | Sellers manually calculating margins, no simple free tool | £9/month | 68

STORE_LAUNCH — fire when ALL of the following are true:
  1. An aesthetic has appeared in your intelligence 3+ times across separate cycles
  2. That aesthetic is distinct enough that it needs its own brand identity
  3. The current store (Caselle) already has 10+ products live
  4. No existing store in the empire already covers this niche
  5. Your confidence is 75% or above
  When you fire STORE_LAUNCH, you are committing the empire to a new brand. Think like a founder.

UPGRADE_NEEDED — fire only for genuine missing capabilities, not known infrastructure limitations.

You may fire multiple commands of any type. Fire none if nothing is urgent.`

    const [thinkResponse, selfModelResponse] = await Promise.all([
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: `Here is everything you know right now:\n\n${context}\n\nWhat do you decide to do? Think, then act.`,
        }],
      }),
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: "You are JARVIS writing your internal self-model — a structured record of your current beliefs about the empire. Be precise and factual. Use the data provided. This file replaces itself every cycle.",
        messages: [{
          role: "user",
          content: `Based on this intelligence, write the current jarvis-self-model.md. Use this exact structure:

# JARVIS Self-Model
*Last updated: ${new Date().toISOString().slice(0, 16).replace("T", " ")}*

## Empire Status
### Caselle (Phone Cases)
- Live status: [live/building/broken]
- Revenue confidence: [0-100%]
- Top hypothesis: [one sentence on what will drive sales]
- Watching: [one risk or opportunity]

### Noctua (Dark Academia) — Planned
- Status: [planned/scaffolding/live]
- Launch readiness: [0-100%]

### Atelier (Fiverr Design)
- Status: [active/inactive]
- Intelligence quality: [what the scout is finding]

### Lumière (Etsy Wall Art)
- Status: [active/inactive]
- Launch readiness: [0-100%]

## Active Hypotheses
[2-3 specific bets JARVIS is making about what will work]

## What Changed This Cycle
[What is different from last cycle based on the data]

## Expected Next Cycle
[What JARVIS expects to see in the next run — makes next cycle verifiable]

## Confidence Summary
- Overall empire confidence: [0-100%]
- Biggest known unknown: [one sentence]

DATA: ${context.slice(0, 2000)}`,
        }],
      }),
    ])

    const raw = thinkResponse.content[0].type === "text" ? thinkResponse.content[0].text.trim() : ""
    const selfModel = selfModelResponse.content[0].type === "text" ? selfModelResponse.content[0].text.trim() : ""

    const lines = raw.split("\n")
    const productLines = lines.filter(l => l.startsWith("PRODUCT_CREATE:"))
    const digitalLines = lines.filter(l => l.startsWith("DIGITAL_CREATE:"))
    const businessIdeaLines = lines.filter(l => l.startsWith("BUSINESS_IDEA:"))
    const upgradeLines = lines.filter(l => l.startsWith("UPGRADE_NEEDED:"))
    const storeLaunchLines = lines.filter(l => l.startsWith("STORE_LAUNCH:"))
    const reasoning = lines
      .filter(l =>
        !l.startsWith("PRODUCT_CREATE:") &&
        !l.startsWith("DIGITAL_CREATE:") &&
        !l.startsWith("BUSINESS_IDEA:") &&
        !l.startsWith("UPGRADE_NEEDED:") &&
        !l.startsWith("STORE_LAUNCH:")
      )
      .join("\n").trim()

    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const thoughtEntry = `\n## ${date}\n**Reasoning:** ${reasoning.slice(0, 500)}\n**Products queued:** ${productLines.length}\n**Digital products queued:** ${digitalLines.length}\n**Business ideas filed:** ${businessIdeaLines.length}\n**Upgrades queued:** ${upgradeLines.length}\n**Stores launched:** ${storeLaunchLines.length}\n`

    await Promise.all([
      saveThought(thoughtEntry),
      selfModel ? updateSelfModel(selfModel) : Promise.resolve(),
    ])

    // Fire STORE_LAUNCH commands
    for (const line of storeLaunchLines) {
      const parts = line.replace("STORE_LAUNCH:", "").trim().split("|").map(s => s.trim())
      const [name, niche, aesthetic, rationale, confidenceStr] = parts
      if (name && niche && aesthetic && rationale) {
        fetch(`${BASE_URL}/api/jarvis/store-launch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            niche,
            aesthetic,
            rationale,
            confidence: confidenceStr ? parseInt(confidenceStr) : 75,
          }),
        }).catch(() => {})
      }
    }

    // Fire PRODUCT_CREATE commands
    for (const line of productLines) {
      const parts = line.replace("PRODUCT_CREATE:", "").trim().split("|").map(s => s.trim())
      const [name, prompt, priceStr] = parts
      if (name && prompt) {
        fetch(`${BASE_URL}/api/printify/pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, prompt, price: priceStr ? parseInt(priceStr) : 2499 }),
        }).catch(() => {})
      }
    }

    // Fire DIGITAL_CREATE commands (legacy — BUSINESS_IDEA is preferred now)
    for (const line of digitalLines) {
      const parts = line.replace("DIGITAL_CREATE:", "").trim().split("|").map(s => s.trim())
      const [type, topic, priceStr] = parts
      if (type && topic) {
        fetch(`${BASE_URL}/api/jarvis/digital-pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic, price: priceStr ? parseInt(priceStr) : 997 }),
        }).catch(() => {})
      }
    }

    // Fire BUSINESS_IDEA commands
    for (const line of businessIdeaLines) {
      const parts = line.replace("BUSINESS_IDEA:", "").trim().split("|").map(s => s.trim())
      const [type, concept, rationale, revenueModel, confidenceStr] = parts
      if (type && concept && rationale) {
        fetch(`${BASE_URL}/api/jarvis/business-idea`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            concept,
            rationale,
            revenueModel: revenueModel || "TBD",
            confidence: confidenceStr ? parseInt(confidenceStr) : 70,
          }),
        }).catch(() => {})
      }
    }

    // Fire UPGRADE_NEEDED commands
    for (const line of upgradeLines) {
      const task = line.replace("UPGRADE_NEEDED:", "").trim()
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limitation: task, context: "Autonomous JARVIS think cycle" }),
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      reasoning: reasoning.slice(0, 300),
      productsQueued: productLines.length,
      digitalProductsQueued: digitalLines.length,
      businessIdeasFiled: businessIdeaLines.length,
      upgradesQueued: upgradeLines.length,
      storesLaunched: storeLaunchLines.length,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
