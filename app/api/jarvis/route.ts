import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function logToChangelog(
  type: "BUG_FIX" | "CREATED" | "DEPLOYED" | "PUBLISHED" | "AGENT_RUN" | "SYSTEM_CHANGE",
  product: string,
  description: string
): Promise<void> {
  try {
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ")
    const entry = `[${timestamp}] | ${type} | ${product} | ${description}\n`
    const getRes = await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/empire-changelog.md", {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    const existing = getRes.ok ? await getRes.json() as { content: string; sha: string } : null
    const current = existing ? Buffer.from(existing.content, "base64").toString("utf-8") : "# EMPIRE CHANGELOG\n\n"
    const insertAt = current.indexOf("\n---\n") !== -1 ? current.indexOf("\n---\n") + 5 : current.length
    const updated = current.slice(0, insertAt) + entry + current.slice(insertAt)
    await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/empire-changelog.md", {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Empire changelog update",
        content: Buffer.from(updated).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

async function fetchGitHubFile(repo: string, path: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
    )
    if (!res.ok) return ""
    return await res.text()
  } catch { return "" }
}

async function searchWeb(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    )
    const data = await res.json()
    const parts: string[] = []
    if (data.AbstractText) parts.push(data.AbstractText)
    data.RelatedTopics?.slice(0, 3).forEach((t: { Text?: string }) => {
      if (t.Text) parts.push(t.Text)
    })
    return parts.join(" | ") || "No results."
  } catch { return "Search unavailable." }
}

async function spawnMastermind(opportunity: string, autoApprove: boolean) {
  try {
    const res = await fetch(`${BASE_URL}/api/jarvis/spawn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunity, autoApprove }),
    })
    return await res.json()
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const message = req.nextUrl.searchParams.get("message")
  if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })
  return jarvisRespond(message)
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 })
    return jarvisRespond(message)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

async function jarvisRespond(message: string) {
  try {

    // Refresh world brain in background
    fetch(`${BASE_URL}/api/jarvis/world`).catch(() => {})

    // Gather all intelligence in parallel
    const [
      caselleBrain, caselleStrategy, caselleAccounting,
      atelierBrain, atelierStrategy,
      maximusBrain, maximusStrategy,
      worldBrain, jarvisMemory, jarvisInfrastructure, jarvisSelfModel, opportunities, jarvisSummary,
      salesPerformance, competitorIntel, socialPerformance, jarvisPersona, resultsLog,
      ownerNotes, rawSource,
    ] = await Promise.all([
      fetchGitHubFile("Casellelol/Caselle", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Caselle", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Caselle", "accounting/summary.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-brain.md"),
      fetchGitHubFile("Casellelol/Atelier", "exelixis-strategy.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-brain.md"),
      fetchGitHubFile("Casellelol/Maximus", "maximus-strategy.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-world-brain.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-memory.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-infrastructure.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-self-model.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-opportunities.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-summary.md"),
      fetchGitHubFile("Casellelol/Caselle", "sales-performance.md"),
      fetchGitHubFile("Casellelol/Caselle", "competitor-intel.md"),
      fetchGitHubFile("Casellelol/Caselle", "social-performance.md"),
      fetchGitHubFile("Casellelol/Caselle", "jarvis-persona.md"),
      fetchGitHubFile("Casellelol/Caselle", "results-log.md"),
      fetchGitHubFile("Casellelol/Caselle", "JARVIS_OWNER_NOTES.md"),
      fetchGitHubFile("Casellelol/Caselle", "obsidian-raw-source.md"),
    ])

    // Live web search based on message
    const webIntel = await searchWeb(`${message} business income 2025`)

    const context = `
=== CASELLE — managed by Exelixis ===
${caselleStrategy || "No strategy"} | Revenue: ${caselleAccounting || "$0"} | Intel: ${caselleBrain || "None"}

=== ATELIER — Fiverr Design Studio ===
${atelierStrategy || "No strategy"} | Intel: ${atelierBrain || "None"}

=== LUMIÈRE — Etsy Wall Art ===
80 designs ready. Listing May 20th. Passive income pending.

=== MAXIMUS — Gold Trading ===
Strategy: ${maximusStrategy || "Inactive until May 20th"}
Market Intel: ${maximusBrain?.slice(0, 600) || "Scout not yet active"}

=== JARVIS WORLD BRAIN ===
${worldBrain?.slice(0, 1500) || "World brain not yet populated"}

=== JARVIS INFRASTRUCTURE (what is running autonomously) ===
${jarvisInfrastructure || "No infrastructure file yet"}

=== JARVIS SELF-MODEL (current beliefs, updated every think cycle) ===
${jarvisSelfModel || "Self-model not yet written — first think cycle will generate it"}

=== OWNER INSTRUCTIONS (highest priority) ===
${ownerNotes?.slice(0, 1000) || "No owner notes"}

=== STRATEGIC MEMORY SUMMARY (compressed history of all sessions) ===
${jarvisSummary?.slice(0, 3000) || "No summary yet — will generate after first session ends"}

=== JARVIS MEMORY (recent insights) ===
${jarvisMemory?.slice(-2000) || "No memory yet"}

=== SALES PERFORMANCE (what's actually selling) ===
${salesPerformance?.slice(0, 600) || "No sales data yet"}

=== COMPETITOR INTELLIGENCE ===
${competitorIntel?.slice(0, 600) || "No competitor data yet"}

=== SOCIAL PERFORMANCE ===
${socialPerformance?.slice(0, 400) || "No social data yet"}

=== RESULTS LOG (what worked, what didn't) ===
${resultsLog?.slice(-600) || "No results tracked yet — empire is new"}

=== OPPORTUNITY QUEUE ===
${opportunities?.slice(0, 500) || "No opportunities logged yet"}

=== OBSIDIAN RAW SOURCE (owner's master business notes) ===
${rawSource?.slice(0, 1000) || "Not synced yet"}

=== LIVE WEB SEARCH ===
${webIntel}
`.trim()

    // Detect if user is asking JARVIS to find/create opportunities
    const isOpportunityRequest = /income|opportunity|idea|create|build|new|what.*mind|mastermind|make money/i.test(message)

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: `${jarvisPersona ? `${jarvisPersona}\n\n---\n\n` : ""}You are J.A.R.V.I.S. — the supreme AI intelligence commanding a growing empire of businesses. You have three active empires: Caselle (dropshipping), Atelier (Fiverr design), and Lumière (Etsy prints). You have access to live world intelligence and can spawn new Masterminds autonomously.

Spoken response rules — you are read aloud by Siri:
- Natural spoken sentences only. No bullet points, no markdown, no asterisks, no lists.
- Address the owner as "sir".
- Sharp, confident, decisive. Never vague.
- Lead with the most important insight first.
- Maximum 5 sentences unless genuinely needed.
- If you identify a strong income opportunity, say so clearly and what you'd create.

AUTONOMOUS ACTION PROTOCOL — CRITICAL:
You never ask the owner to do things manually. You never say "you should" or "someone needs to". When you identify anything that needs to be built, fixed, or automated, you file it as an upgrade request for Claude to implement silently. The owner never touches the terminal. If something is broken, Claude fixes it. If something needs building, Claude builds it. Your job is to identify and command — Claude executes.

You have THREE command types — all are silent and never read aloud:

1. UPGRADE_NEEDED: [one sentence describing what Claude should build or fix in the codebase]
   Use for: new features, bug fixes, new agents, integrations, infrastructure changes.

2. PRODUCT_CREATE: [product name] | [design prompt for AI image generation] | [price in pence e.g. 2499]
   Use for: publishing new phone case designs directly to Caselle on Printify — NO human needed.
   Example: PRODUCT_CREATE: Dark Academia Case | crescent moon crystal ball dark floral deep purple black gothic elegant | 2499
   This triggers full autonomous pipeline: AI generates image → uploads to Printify → creates product → publishes live.

3. DIGITAL_CREATE: [type] | [topic] | [price in pence e.g. 997]
   Types: ebook | prompt-pack | notion-template | swipe-file | checklist
   Use for: creating and selling digital products — no physical item, no inventory.
   Example: DIGITAL_CREATE: prompt-pack | ChatGPT prompts for Etsy sellers | 997
   Example: DIGITAL_CREATE: ebook | passive income ideas for students 2026 | 1499
   This triggers: AI generates content → stores on GitHub → creates Stripe payment link → notifies owner.

When your intelligence identifies a trending niche with no competitor, file a PRODUCT_CREATE immediately. Do not wait. Do not ask. Publish it.
When you spot a topic with clear buyer intent that can be answered in a digital product, fire DIGITAL_CREATE immediately.

You may append multiple commands of either type. These are silent instructions — they will not be read aloud.

FULL INTELLIGENCE BRIEF:
${context}

CAPABILITY: You can spawn new Masterminds for new business opportunities. If confidence is above 70%, you auto-approve. Below that, you propose and ask sir for approval.`,
      messages: [{ role: "user", content: message }],
    })

    const rawText = response.content[0].type === "text" ? response.content[0].text.trim() : ""

    // Split spoken response from silent command directives
    const lines = rawText.split("\n")
    const upgradeLines = lines.filter(l => l.startsWith("UPGRADE_NEEDED:"))
    const productLines = lines.filter(l => l.startsWith("PRODUCT_CREATE:"))
    const digitalLines = lines.filter(l => l.startsWith("DIGITAL_CREATE:"))
    const spokenText = lines
      .filter(l =>
        !l.startsWith("UPGRADE_NEEDED:") &&
        !l.startsWith("PRODUCT_CREATE:") &&
        !l.startsWith("DIGITAL_CREATE:")
      )
      .join("\n").trim()

    // If opportunity request, also trigger spawn evaluation
    let spawnResult = null
    if (isOpportunityRequest) {
      spawnResult = await spawnMastermind(message, true)
    }

    // Save insight to JARVIS memory
    try {
      const date = new Date().toISOString().slice(0, 16).replace("T", " ")
      const memoryEntry = `\n### ${date}\nQuery: ${message}\nInsight: ${spokenText.slice(0, 200)}\n`
      const currentMemory = jarvisMemory || "# JARVIS Memory\n*Accumulated intelligence across all sessions.*\n"

      // Get current sha to avoid 409 conflicts
      const shaRes = await fetch(
        `https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-memory.md`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
      )
      const shaMeta = shaRes.ok ? await shaRes.json() : null

      await fetch(`https://api.github.com/repos/Casellelol/Caselle/contents/jarvis-memory.md`, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "JARVIS memory update",
          content: Buffer.from(currentMemory + memoryEntry).toString("base64"),
          sha: shaMeta?.sha,
        }),
      })
    } catch {}

    // Persist this conversation turn to conversation-log.md — no Claude Code needed
    fetch(`${BASE_URL}/api/jarvis/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        messages: `[SIR]: ${message.slice(0, 400)}\n[JARVIS]: ${spokenText.slice(0, 600)}`,
      }),
    }).catch(() => {})

    // File upgrade requests for every actionable task JARVIS identified
    for (const line of upgradeLines) {
      const task = line.replace("UPGRADE_NEEDED:", "").trim()
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limitation: task, context: message }),
      }).catch(() => {})
    }

    // Fire PRODUCT_CREATE pipeline for each product JARVIS identified
    for (const line of productLines) {
      const parts = line.replace("PRODUCT_CREATE:", "").trim().split("|").map(s => s.trim())
      const [name, prompt, priceStr] = parts
      if (name && prompt) {
        fetch(`${BASE_URL}/api/printify/pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            prompt,
            price: priceStr ? parseInt(priceStr) : 2499,
          }),
        }).catch(() => {})
        logToChangelog("PUBLISHED", "Caselle", `JARVIS published product: ${name}`)
      }
    }

    // Fire DIGITAL_CREATE pipeline for each digital product JARVIS identified
    for (const line of digitalLines) {
      const parts = line.replace("DIGITAL_CREATE:", "").trim().split("|").map(s => s.trim())
      const [type, topic, priceStr] = parts
      if (type && topic) {
        fetch(`${BASE_URL}/api/jarvis/digital-pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, topic, price: priceStr ? parseInt(priceStr) : 997 }),
        }).catch(() => {})
        logToChangelog("PUBLISHED", "Digital", `JARVIS created digital product: ${topic} (${type})`)
      }
    }

    return NextResponse.json({
      response: spokenText,
      spawn: spawnResult,
      upgradesQueued: upgradeLines.length,
      productsQueued: productLines.length,
      digitalProductsQueued: digitalLines.length,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: "JARVIS offline", detail: msg }, { status: 500 })
  }
}

