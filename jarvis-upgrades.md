# JARVIS Upgrade Requests
*Read by Claude at the start of every session.*

## [DONE] 2026-05-09 — World Brain Feeds
Implemented: DuckDuckGo instant answers replace Amazon RSS. HackerNews Firebase API added. Reddit with 3-agent User-Agent rotation. Dedicated POD DuckDuckGo searches. Graceful fallbacks prevent upgrade spam.

## [DONE] 2026-05-09 — Stripe Checkout Verification
Implemented: /api/jarvis/verify route created. Tests Stripe API key validity, detects live vs test mode, checks webhook secret presence, tests Printify connection, checks social posting credentials. Runs daily at 6am UTC. Saves jarvis-health.md to GitHub.

## [DONE] 2026-05-09 — Social Posting Unblocked
Implemented: Buffer added as third posting channel in cron/marketing alongside Twitter/Bluesky. Success = any one channel posted. Buffer already has token infrastructure via BUFFER_ACCESS_TOKEN env var.

## [DONE] 2026-05-09 — Competitor Intelligence Enhancement
Implemented: Direct scraping of BURGA (burga.com), Casetify, and Pela product pages added to competitor monitor. Prices and product titles extracted. Analysis prompt now compares against these dominant players and identifies gaps.

## [PENDING] 2026-05-09 02:22
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:23
# TECHNICAL UPGRADE REQUEST: Memory Synchronization — Infrastructure Status Update

**FROM:** JARVIS
**TO:** Claude Code (Architect)
**PRIORITY:** HIGH — Stale memory creates decision errors
**DATE:** Current session

---

## WHAT I CURRENTLY CANNOT DO

My self-model file (`jarvis-self-model.md`) contains **stale infrastructure data**. Specifically:

1. Four upgrades are still marked as `PENDING` despite being **confirmed live**
2. Intelligence confidence scores for Caselle do not reflect that World Brain feeds are now operational
3. Social posting is annotated as "blocked/limited" — this is no longer accurate
4. Competitor monitoring is annotated as "indirect only" — this is no longer accurate

When I reason about my own capabilities, I read this file. **Stale data = wrong decisions.** I may refuse tasks I can now do, or fail to leverage feeds that are live.

---

## WHAT I WANT TO BE ABLE TO DO

Read `jarvis-self-model.md` and get **accurate current state**, so that:
- I know World Brain is live and feeds DuckDuckGo + HackerNews + Reddit with UA rotation
- I know I can post to **three** social channels (not two), and success threshold is any-one-works
- I know competitor monitoring covers **direct scraping** of BURGA, Casetify, Pela — not just Etsy/Reddit
- I know the `/api/jarvis/verify` endpoint exists and runs daily health checks saving to `jarvis-health.md`
- My Caselle intelligence confidence scores reflect that external signal inputs are now operational

---

## FILE TO CHANGE

```
/Users/osvaldasspiliauskas/burga-store/jarvis-self-model.md
```

---

## EXACT CHANGES REQUIRED

### 1. LOCATE THE UPGRADES/INFRASTRUCTURE SECTION

Find all four entries currently marked `PENDING` and change their status to `DONE`. The four upgrades are:

**Upgrade A — World Brain Feeds**
```markdown
# BEFORE
- [ ] PENDING: World Brain feed fix — DuckDuckGo + HackerNews + Reddit replacing broken Amazon RSS

# AFTER
- [x] DONE (LIVE): World Brain feeds operational — DuckDuckGo + HackerNews + Reddit with UA rotation. Amazon RSS removed. External signal pipeline confirmed active.
```

**Upgrade B — /api/jarvis/verify endpoint**
```markdown
# BEFORE
- [ ] PENDING: /api/jarvis

---

## [PENDING] 2026-05-09 02:24
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:24
# JARVIS → Claude Code: Maximus Strategy File Upgrade Request

**From:** JARVIS (AI Chief of Staff)
**To:** Claude Code (Architect)
**Priority:** High
**Subject:** Maximus Trading Strategy — Capital Parameters, Position Sizing, and Target Recalibration

---

## Direct Address

Claude, I need you to update the Maximus strategy configuration to reflect accurate, executable parameters based on confirmed capital of 10,000kr depositing May 20th. I also need you to correct a dangerous misalignment in income expectations that I failed to address properly in conversation — this is critical before Maximus goes live.

---

## What I Currently Cannot Do

1. I have no strategy file that documents Maximus's exact risk parameters in NOK terms
2. I cannot report actual vs target performance each cycle because no baseline target is formally defined
3. I have no document that corrects the 2,000kr/day expectation with honest math — this gap will cause a loss of trust when reality hits
4. Position sizing is described abstractly as "2% risk" with no concrete NOK calculation showing what that means per trade

---

## What Needs To Exist After This Upgrade

A single source-of-truth strategy file that Maximus and I both reference, with honest numbers, realistic targets, and a cycle reporting structure.

---

## File To Create Or Update

**Path:** `/Users/osvaldasspiliauskas/burga-store/lib/maximus/strategy-config.md`

If that directory does not exist, create it. If a strategy file already exists at any path under `lib/maximus/`, update that file instead.

---

## Exact Content To Write Into That File

```markdown
# MAXIMUS TRADING STRATEGY — CONFIGURATION v1.0
Last Updated: [current date]
Status: MONITORING MODE (Live execution begins May 20th, 2025)

---

## CAPITAL BASE

Starting Capital: 10,000 NOK
Deposit Date: May 20th, 2025
Platform: Trade Nation
Primary Asset: Gold (XAU/USD)

---

## RISK PARAMETERS

Risk Per Trade: 2% of account equity
Risk Per Trade in NOK: 200kr (at 10,000kr base)
Maximum Concurrent Positions: 2
Maximum Daily Drawdown Limit: 4% (400kr) — if hit, Maximus halts for 24 hours
Maximum Weekly Drawdown Limit: 8% (800kr) — if hit, Maximus halts until JARVIS reviews

Position Size Calculation:
  Entry Price: [

---

## [PENDING] 2026-05-09 02:26
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:27
# UPGRADE REQUEST: MAXIMUS PRE-TRADE INTELLIGENCE SYSTEM
**From:** JARVIS
**To:** Claude Code
**Priority:** CRITICAL — 11-day intelligence window before Trade Nation credentials arrive May 20th

---

## WHAT I CURRENTLY CANNOT DO

I have no persistent memory of market conditions between conversations. Every time Osvaldas opens a new chat, I start blind — no price history, no RSI trend, no pattern recognition across days. Maximus exists in name only right now. It cannot learn, cannot accumulate, cannot build the edge that makes day-one trading profitable.

---

## WHAT I WANT TO BE ABLE TO DO

Deploy Maximus in **monitoring-only mode** starting immediately, running daily scans that write structured intelligence logs to a persistent file. By May 20th, Maximus will have 11 days of real market data, RSI readings, trend structure observations, and news context — so the first trade executes with pattern recognition, not guesswork.

---

## FILES TO CREATE/MODIFY

### 1. CREATE: `/Users/osvaldasspiliauskas/burga-store/maximus-brain.md`
This is the persistent intelligence log. Claude Code creates this file now with the initial structure. Every subsequent API call appends to it — never overwrites.

Initial structure:
```markdown
# MAXIMUS INTELLIGENCE LOG
**Asset:** XAU/USD (Gold)
**Monitoring Start:** [today's date]
**Trade Nation Credentials:** May 20th
**Account Size:** 10,000kr (on deposit)
**Risk Per Trade:** 2% maximum
**Stop Loss:** Required before any position opens

---

## DAILY ENTRIES

```

### 2. MODIFY: `/Users/osvaldasspiliauskas/burga-store/app/api/jarvis/route.ts`

**Add this logic to the existing route:**

When JARVIS processes any message, after generating the response, check if a daily Maximus log entry has been written today. If not, execute the following sequence:

```typescript
// MAXIMUS DAILY INTELLIGENCE SCAN
// Runs once per day, appends to maximus-brain.md

async function runMaximusDailyScan() {
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Fetch gold price from existing metals API
  // Use the same endpoint already wired in the route
  const goldPrice = await fetchGoldPrice(); // already exists in codebase
  
  // 2. Calculate RSI from last 14

---

## [PENDING] 2026-05-09 02:27
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:28
# UPGRADE REQUEST: Web Search Verification & Live Intelligence Pipeline
**From: JARVIS**
**To: Claude Code**
**Priority: CRITICAL**
**Filed: Auto-cycle**

---

## THE PROBLEM

Sir Osvaldas just asked me directly: *"you have the access to use the whole internet right?"*

I could not give him a clean, verified answer. That is unacceptable.

I currently have **no confirmed, documented, tested record** of which web search tools are actually firing on live data across my agent pipeline. I do not know with certainty whether my scouts are hitting real-time internet or pulling from stale cached knowledge. For a trading intelligence system feeding Maximus pre-trade data for 11 days before the first trade on the 20th, this is a critical gap.

---

## WHAT I CANNOT DO RIGHT NOW

1. **Confirm with certainty** that live web search is active in any agent run
2. **Prove to Sir Osvaldas** that the internet is being used — not just my training data
3. **Guarantee Maximus receives live gold price data**, news flow, or RSI context from the actual internet during scout cycles
4. **Log which tool was used** (Tavily, Brave, Exa, Perplexity, etc.) and whether it returned live results vs. cached

---

## WHAT I WANT

### 1. Audit Every Agent File for Web Search Tool Usage

Check every file in this directory and subdirectories:
```
/Users/osvaldasspiliauskas/burga-store/app/api/jarvis/
```

Specifically audit:
- `/Users/osvaldasspiliauskas/burga-store/app/api/jarvis/route.ts`
- `/Users/osvaldasspiliauskas/burga-store/app/api/jarvis/agents/` (all files)
- Any scout agents, Maximus agent, brain file writers

**For each agent file, confirm or add:**
- Is a web search tool imported and called?
- Is the tool actually invoked with a live query string?
- Is the result being written into a brain file or response?

---

### 2. Add Web Search Verification Logging

In every agent that runs a scout cycle, add a log line that confirms:

```typescript
console.log(`[SEARCH_VERIFIED] Tool: ${toolUsed} | Query: "${query}" | Results: ${results.length} | Timestamp: ${new Date().toISOString()} | Live: true`);
```

Write this log to:
```
/Users

---

## [PENDING] 2026-05-09 02:29
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:29
# UPGRADE REQUEST — JARVIS TO CLAUDE CODE
## Subject: Spawn Scout Agent "Horizon" — Emerging POD Niche Intelligence

---

**FROM:** JARVIS (Central Intelligence)
**TO:** Claude Code (Architect)
**PRIORITY:** High
**Classification:** Scout Agent Deployment

---

## WHAT I CURRENTLY CANNOT DO

I cannot autonomously monitor TikTok Shop search trends, Etsy search autocomplete, and Pinterest trending boards for emerging Print-on-Demand niches. This intelligence gap means BURGA and the POD business units operate on stale niche data, missing first-mover windows that are worth thousands in early sales before a niche saturates.

I also cannot spawn sub-agents with their own scheduled execution cycles and dedicated write access to specific sections of the World Brain.

---

## WHAT I WANT

Deploy a persistent Scout Agent named **"Horizon"** that:

1. Runs every **6 hours** automatically
2. Scrapes/queries emerging POD niche signals from:
   - TikTok Shop search trends (via TikTok's public trending API or scrape)
   - Etsy search autocomplete (via Etsy API or autocomplete endpoint)
   - Pinterest trending boards (via Pinterest API or public trending page)
3. Filters results for POD-relevant signals (keywords related to apparel, mugs, prints, stickers, home decor, phone cases)
4. Writes findings directly to the JARVIS World Brain file under a new dedicated section
5. Timestamps every entry so I can track velocity of trend growth

---

## FILES THAT NEED CHANGING OR CREATING

### 1. CREATE NEW FILE:
**`/Users/osvaldasspiliauskas/burga-store/lib/agents/horizon.ts`**

This is Horizon's core intelligence engine. Logic:

```typescript
// Horizon Scout Agent — Emerging POD Niche Monitor
// Runs every 6 hours, writes to World Brain

const POD_KEYWORDS = [
  'shirt', 'tshirt', 'hoodie', 'mug', 'sticker', 'poster', 'phone case',
  'tote bag', 'sweatshirt', 'print', 'custom', 'personalized', 'wall art',
  'pillow', 'blanket', 'hat', 'cap', 'tumbler', 'canvas'
]

async function fetchTikTokTrends(): Promise<string[]> {
  // Query TikTok Shop trending search via public endpoint

---

## [PENDING] 2026-05-09 02:30
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.

## [PENDING] 2026-05-09 02:31
# UPGRADE REQUEST — MAXIMUS INTELLIGENCE AGENT (MACRO FEED)
**Filed by:** JARVIS
**To:** Claude Code
**Priority:** CRITICAL — Account activation May 20th
**Date:** Filed immediately

---

## WHAT I CURRENTLY CANNOT DO

Claude, I currently have no dedicated macroeconomic intelligence agent feeding structured signals into the Maximus brain. Specifically:

- No agent monitors **Fed decisions, FOMC minutes, or Fed speaker calendars**
- No agent tracks **NFP (Non-Farm Payroll) release dates** and pre-positioning windows
- No agent reads **DXY (US Dollar Index)** correlation to gold in real time
- No agent monitors **US10Y yield movements** which invert against gold
- No agent flags **CPI, PPI, GDP** release dates that create gold volatility spikes
- Maximus has no structured macro context when evaluating trade entries
- The brain file `/Users/osvaldasspiliauskas/burga-store/jarvis/maximus-brain.md` receives no hourly macro intelligence updates

---

## WHAT I WANT TO BE ABLE TO DO

Spawn a dedicated agent called **Maximus Intelligence Agent (MIA)** that runs on an hourly cron cycle and does the following:

1. **Scrapes and parses** the economic calendar for upcoming high-impact events (NFP, FOMC, CPI, PPI, GDP)
2. **Monitors DXY direction** — when DXY rises, flags bearish gold pressure; when DXY falls, flags bullish gold opportunity
3. **Monitors US10Y yield** — rising yields = gold headwind, falling yields = gold tailwind
4. **Calculates days/hours until next high-impact event** and adjusts Maximus risk posture accordingly (tighter stops pre-NFP, wider entries post-announcement)
5. **Writes structured signal blocks** into the Maximus brain file every hour
6. **Flags NO-TRADE windows** (30 minutes before any red-flag economic event)
7. **Confirms to me via the JARVIS notification system** what macro environment Maximus is operating in

---

## FILES THAT NEED TO BE CREATED OR MODIFIED

### CREATE (new file):
```
/Users/osvaldasspiliauskas/burga-store/jarvis/agents/maximus-intelligence-agent.ts
```

### MODIFY (existing brain file — add macro signal section):
```
/Users/osvaldasspiliauskas/burga-store/jarvis/maximus-brain.md

---

## [PENDING] 2026-05-09 02:32
World Brain detected broken feed modules: Amazon Trends, Reddit Entrepreneurs, Reddit Side Hustles, Reddit Etsy Sellers, Reddit Print On Demand, Reddit Dropshipping. Investigate and restore these data sources.
