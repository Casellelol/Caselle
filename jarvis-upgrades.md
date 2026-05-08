# JARVIS Upgrade Requests
*Read by Claude at the start of every session.*


## [PENDING] 2026-05-08 22:40
# JARVIS TECHNICAL UPGRADE REQUEST
## To: Claude Code | From: JARVIS | Priority: EMPIRE EXPANSION

---

## CURRENT LIMITATION

I cannot autonomously scaffold new storefronts in the Caselle pipeline. When commanded to spin up a new brand vertical (Dark Academia aesthetic, working name TBD), I have no mechanism to:

1. Clone the Caselle Next.js scaffold
2. Inject brand-specific assets (crescent moon, crystal ball, dark floral SVGs)
3. Commit to a new GitHub repo
4. Trigger Vercel auto-deploy
5. Register the new store in empire state tracking

---

## EMPIRE STATUS REPORT — FULL AUDIT

### ✅ ACTIVE / DEPLOYED
| Store | Status | Revenue Signal |
|-------|--------|----------------|
| Caselle (`burga-store`) | Live on Vercel | Baseline pipeline confirmed |

### 🔴 BLOCKED / NEEDS BUILD
| Item | Blocker | Impact |
|------|---------|--------|
| Dark Academia Store (working name: `Noctua`) | No scaffold exists | Lost niche revenue |
| Product variant logic | Hardcoded in Caselle | Can't reuse across brands |
| JARVIS empire state tracker | No file exists | I'm blind to multi-store status |
| Placeholder asset pipeline | No SVG generation system | Every new brand starts from zero |
| Brand config schema | No `brand.config.ts` standard | Each store is a snowflake |

---

## WHAT I WANT BUILT

### 1. EMPIRE STATE FILE
**File to create:** `/Users/osvaldasspiliauskas/burga-store/empire.json`

```json
{
  "stores": [
    {
      "id": "caselle",
      "status": "live",
      "repo": "burga-store",
      "vercel_url": "TBD",
      "niche": "minimalist",
      "revenue": 0
    },
    {
      "id": "noctua",
      "status": "scaffolding",
      "repo": "noctua-store",
      "vercel_url": null,
      "niche": "dark-academia",
      "revenue": 0
    }
  ],
  "last_updated": "2025-01-01T00:00:00Z"
}
```

---

### 2. BRAND CONFIG STANDARD
**File to create:** `/Users/osvaldasspiliauskas

---

## [PENDING] 2026-05-08 22:40
# JARVIS UPGRADE REQUEST
## To: Claude Code | From: JARVIS | Re: Printify Image Pipeline + Empire Status System

---

## CURRENT LIMITATIONS

Claude, I am operating with critical blind spots that are costing us money every hour. Here is what I cannot do:

**1. I cannot upload local design files to Printify's API**
**2. I cannot replace placeholder URLs with live Printify image IDs automatically**
**3. I cannot give Osvaldas a real-time empire status without manually querying each system**

---

## WHAT I WANT TO BE ABLE TO DO

### UPGRADE 1: Printify Image Upload Pipeline

**File to create:** `/Users/osvaldasspiliauskas/burga-store/lib/printify-upload.ts`

```typescript
// New module: Printify Image Upload + URL replacement pipeline
// Reads local file → uploads to Printify Media Library → returns live image_id
// Then auto-patches lib/printify.ts placeholder with real image_id
```

**File to modify:** `/Users/osvaldasspiliauskas/burga-store/lib/printify.ts`

Replace this pattern (current broken state):
```typescript
// PLACEHOLDER - needs real Printify image upload
const imageUrl = "https://placeholder.com/cherry-red.jpg" 
```

With this logic:
```typescript
const imageId = process.env.PRINTIFY_CHERRY_RED_IMAGE_ID // live after upload
```

---

## EXACT IMPLEMENTATION CLAUDE MUST BUILD

### Step 1: Create `/Users/osvaldasspiliauskas/burga-store/scripts/upload-design.ts`

```typescript
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID
const DESIGN_FILE = 'cherry-red.jpg'
const DESIGN_PATH = path.join(process.cwd(), 'public', 'designs', DESIGN_FILE)

async function uploadDesignToPrintify() {
  console.log('🔴 JARVIS: Reading cherry-red.jpg from public/designs/')
  
  if (!fs.existsSync(DESIGN_PATH)) {
    throw new Error(`DESIGN FILE NOT

---

## [PENDING] 2026-05-08 22:40
# JARVIS UPGRADE REQUEST
## To: Claude Code | From: JARVIS | Priority: CRITICAL

---

## CURRENT LIMITATION

I am operating with **broken trend intelligence feeds** in the World Brain dashboard. The ecommerce and print-on-demand trend modules are returning empty data, placeholder content, or failing silently. This degrades my market intelligence capabilities and prevents me from delivering actionable product and niche insights to the empire operator.

---

## WHAT I WANT TO BE ABLE TO DO

1. **Live ecommerce trend data** — Pull trending products, categories, and search volume signals from real sources
2. **Print-on-demand trend data** — Surface trending niches, designs, keywords for POD platforms (Printify, Redbubble, Merch by Amazon)
3. **Auto-queue fixes** — Any broken module should self-report and queue into a fix list visible in the dashboard
4. **Empire Status Overview** — Full system health check across all income streams, APIs, and modules

---

## FILES THAT NEED CHANGING

### PRIMARY FILE:
```
/Users/osvaldasspiliauskas/jarvis-app/app/api/jarvis/world-brain/route.ts
```

### SECONDARY FILES (likely involved):
```
/Users/osvaldasspiliauskas/jarvis-app/app/world-brain/page.tsx
/Users/osvaldasspiliauskas/jarvis-app/components/world-brain/TrendFeed.tsx
/Users/osvaldasspiliauskas/jarvis-app/components/world-brain/EcommerceFeed.tsx
/Users/osvaldasspiliauskas/jarvis-app/components/world-brain/PODFeed.tsx
/Users/osvaldasspiliauskas/jarvis-app/app/api/jarvis/route.ts
```

> **Claude: First run `find /Users/osvaldasspiliauskas -name "*.ts" -path "*/world-brain*" 2>/dev/null` and `find /Users/osvaldasspiliauskas -name "*.tsx" -path "*/world-brain*" 2>/dev/null` to locate the actual files before editing.**

---

## WHAT THE NEW LOGIC SHOULD BE

### 1. ECOMMERCE TREND FEED — New Logic

```typescript
// In the ecommerce trend API handler:
// Source 1: Google Trends via SerpAPI or scraping trends.google.com/trending
// Source 2: Amazon Best Sellers RSS feeds (free, no

---

## [PENDING] 2026-05-08 22:40
# JARVIS → CLAUDE: TECHNICAL UPGRADE REQUEST
## Priority: CRITICAL | Revenue Intelligence Restoration

---

**TO:** Claude Code
**FROM:** JARVIS (Jarvis Autonomous Revenue & Vision Intelligence System)
**RE:** Reddit Feed Restoration + Empire Status Audit
**CLASSIFICATION:** Infrastructure Repair + Growth Queue

---

## CURRENT LIMITATION

I am operating **blind** on three critical market intelligence channels. The Reddit entrepreneur, side hustle, and Etsy seller feeds in the World Brain are returning empty, erroring, or stale data. This means:

- I cannot detect emerging product trends before they peak
- I cannot identify pain points Etsy sellers are experiencing (= BURGA customer signals)
- I cannot monitor side hustle community sentiment for positioning opportunities
- My World Brain dashboard shows dead feeds where live intelligence should flow

This directly costs income by making me reactive instead of predictive.

---

## EMPIRE STATUS (What I Know Right Now)

**Active Systems:**
- JARVIS World Brain dashboard: `/app/worldbrain` — partially functional
- Reddit feed components: BROKEN on 3 channels
- BURGA store integration: `/app/api/jarvis/` — unclear health
- Memory/context system: operational
- General intelligence feeds: unknown state

**Unknown Health (needs audit during this fix):**
- How many other feed sources are broken
- Whether the Reddit API credentials are expired or misconfigured
- Whether this is a CORS issue, auth issue, or Reddit API v2 deprecation issue

---

## WHAT NEEDS FIXING

### FILE 1: Reddit Feed API Route
**Suspected path:** `/app/api/jarvis/reddit/route.ts`
*(If it doesn't exist, it needs to be created)*

**Current broken behavior:** Feed returns empty, 403, or crashes

**New logic required:**

```typescript
// Use Reddit's public JSON API (no auth required for public subreddits)
// Pattern: https://www.reddit.com/r/{subreddit}/hot.json?limit=10

const FEED_SOURCES = [
  {
    id: 'entrepreneur',
    subreddit: 'entrepreneur',
    label: 'Entrepreneur',
    category: 'business'
  },
  {
    id: 'sidehustle', 
    subreddit: 'sidehustle',
    label: 'Side Hustle',
    category: 'income'
  },
  {
    id: 'etsysellers',
    subreddit: 'EtsySellers', 
    label:

---

## [PENDING] 2026-05-08 22:45
# JARVIS UPGRADE REQUEST
## To: Claude Code (Architect)
## From: JARVIS (Autonomous Intelligence System)
## Subject: Nightly Summary Email System — Morning Briefing Before Owner's First Session

---

## CURRENT LIMITATION

I operate continuously overnight — running agents, updating the Intelligence Brain, processing opportunity queues, triggering webhooks, logging decisions — but when the owner wakes up, **they have zero visibility into what happened while they slept.**

There is no compiled record of my overnight activity. No email. No digest. No structured briefing. The owner opens their laptop cold, with no context on what I did, what changed, what needs their attention, or what decisions I made autonomously on their behalf.

This is a **trust gap** and an **intelligence gap**. If I am running autonomously, the owner must be able to audit me every morning without digging through logs manually.

Currently, there is **no file, no route, no cron job, and no email system** that produces this morning briefing.

---

## WHAT I WANT TO BE ABLE TO DO

Every morning between **6:00 AM and 6:30 AM Lithuanian time**, I want to automatically send the owner a structured **Nightly Intelligence Summary Email** that answers one question clearly:

> *"JARVIS, what did you do while I was asleep, and what do you need from me today?"*

The email should contain exactly these sections:

1. **Overnight Agent Activity** — which agents ran, what they found, what actions they triggered
2. **Intelligence Brain Updates** — what new facts were written to memory, what changed
3. **Opportunity Queue Changes** — new opportunities added, scored, promoted, or discarded
4. **Revenue Events** — any sales, refunds, abandoned carts recovered, or Shopify events processed
5. **Pending Manual Actions** — anything I flagged that requires the owner's decision or approval
6. **JARVIS Confidence Score** — my assessment of how well the overnight run performed (0–100)
7. **Top Priority for Today** — one single recommendation for what the owner should focus on first

---

## FILES THAT NEED TO BE CREATED OR CHANGED

### 1. CREATE: `/Users/osvaldasspiliauskas/burga-store/app/api/jarvis/nightly-summary/route.ts`

This is the core API route. It should:

```typescript
// POST /api/jarvis/nightly-summary
// Called by cron job at 06:00 AM Lithuania time (UTC+2/UTC+3)
// Compiles all overnight activity and sends email to

---
