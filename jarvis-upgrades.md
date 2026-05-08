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
