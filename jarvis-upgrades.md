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
