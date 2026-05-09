# Caselle — Store Raw Source

*Auto-updated every conversation. All store-related data lives here. → Part of the [[CLAUDE.md|LLM Wiki]] system. Full synthesised knowledge lives in [[Master Knowledge — Caselle + Claude System]].*

→ [[Learning]] (all session logs) · [[Master Knowledge — Caselle + Claude System]] · [[Master Knowledge — Atelier + Fiverr]] · [[Master Knowledge — Lumière + Etsy]]

---

## Business Overview

**Name:** Caselle  
**Model:** Phone case dropshipping (Print-on-Demand, zero manual work)  
**Aesthetic:** [[Master Knowledge — Caselle + Claude System|Quiet Luxury]] — minimal, warm off-white, Georgia serif, gold accents  
**Inspired by:** BURGA (burga.com)

---

## Live URLs

| Resource | URL |
|---|---|
| **Store** | https://[[Master Knowledge — Caselle + Claude System|burga-store.vercel.app]] |
| **GitHub** | https://github.com/Casellelol/Caselle |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Printify Dashboard** | https://printify.com/app |
| **Vercel Dashboard** | https://vercel.com/casellelols-projects/burga-store |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | [[Master Knowledge — Caselle + Claude System|Next.js 15]] (App Router, TypeScript) |
| Styling | [[Master Knowledge — Caselle + Claude System|Tailwind CSS v4]] |
| Cart state | [[Master Knowledge — Caselle + Claude System|Zustand]] (persisted to localStorage) |
| Payments | [[Master Knowledge — Caselle + Claude System|Stripe Checkout]] (hosted, handles card + Apple Pay) |
| Fulfillment | [[Master Knowledge — Caselle + Claude System|Printify]] (blueprint 269 — Tough Phone Cases, provider 1) |
| Hosting | Vercel (casellelols-projects) |
| Repo | GitHub — Casellelol/Caselle |

**Local path:** `~/burga-store`

---

## Payment Flow (Stripe)

- Customer clicks "Checkout with Stripe" → POST `/api/checkout` → Stripe Checkout Session created
- Customer pays on Stripe hosted page
- On success → redirected to `/success`
- Stripe fires `checkout.session.completed` webhook → `/api/webhooks/stripe`
- Webhook auto-creates Printify order
- **Webhook secret:** `[REDACTED]`
- **Webhook ID:** `we_1TUEzSIpmbucOAGXmtsK3nfT`
- **Mode:** Test mode (sk_test_...) — switch to live keys when ready to go live

---

## Fulfillment (Printify)

**Shop ID:** `27451784`  
**Blueprint:** 269 (Tough Phone Cases)  
**Print Provider:** 1 ([[Master Knowledge — Caselle + Claude System|SPOKE]])

### Device Model → Printify Variant ID Map

| Our Model ID | Printify Variant ID |
|---|---|
| iphone-17-pro-max | 130117 |
| iphone-17-pro | 130116 |
| iphone-17-plus | 130118 (iPhone 17 Air) |
| iphone-17 | 130115 |
| iphone-16-pro-max | 112813 |
| iphone-16-pro | 112812 |
| iphone-16-plus | 112815 |
| iphone-16 | 112814 |
| iphone-15-pro-max | 103564 |
| iphone-15-pro | 103562 |
| iphone-15-plus | 103563 |
| iphone-15 | 103561 |

---

## Designs (10 total — uploaded to Printify S3)

Generated programmatically in Python (Pillow), 1800×2400px at 300 DPI.  
Served as static assets at `https://burga-store.vercel.app/designs/`  
Local files: `~/burga-store/public/designs/` and `~/burga-store/designs/`

| Design ID | Name | Style | Printify S3 URL |
|---|---|---|---|
| marble-white | White Marble | Organic vein pattern | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/4822bf66-d730-486d-b415-d791aabfc6e3 |
| marble-black | Black Marble | Organic vein pattern | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/94ef4c53-c1d3-4242-8de3-c743fa81dce5 |
| sage-green | Sage Green | Linen texture | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/7b5ea2c0-d48d-4070-8bad-56db58ed6409 |
| dusty-rose | Dusty Rose | Watercolor wash | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/fd2cd758-693a-43d0-b7a1-8251e8682559 |
| midnight-navy | Midnight Navy | Gradient | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/e37167be-a30a-410c-9eae-db939d7b7984 |
| champagne-gold | Champagne Gold | 3-stop diagonal gradient | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/72dcb17c-b838-4733-a79e-a608f428f59d |
| cloud-grey | Cloud Grey | Linen texture | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/0d4bdb75-90bf-4969-8234-17fc9992f7d6 |
| terracotta | Terracotta | Watercolor wash | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/1b66284d-6d54-46ed-80b3-a037aec25731 |
| lavender-mist | Lavender Mist | Soft gradient | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/c9006376-1ac9-404a-9f99-7f907019ba68 |
| obsidian | Obsidian | Deep gradient | https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/78388749-afea-4391-a4dd-64e444b373de |

---

## Collections (6)

| Slug | Name |
|---|---|
| iphone-17 | iPhone 17 Cases |
| iphone-16 | iPhone 16 Cases |
| iphone-15 | iPhone 15 Cases |
| samsung-s25 | Galaxy S25 Cases |
| pixel-9 | Pixel 9 Cases |
| bestsellers | Bestsellers |

---

## Products (12)

aurora, onyx, soleil, lune, terra, ciel, noir, brume, quartz, dusk, haven, mist  
All products: 10 designs each, prices $24.99–$34.99

---

## Profit Model

- Case cost (Printify): ~$8–12
- Sell price: $24.99–$34.99
- Margin: ~40–60%
- Shipping: Free standard (Printify covers) or $6.99 express

---

## Environment Variables (Vercel Production)

| Key | Purpose |
|---|---|
| STRIPE_SECRET_KEY | Stripe payments |
| STRIPE_WEBHOOK_SECRET | Webhook signature verification |
| PRINTIFY_API_TOKEN | Printify order creation |
| NEXT_PUBLIC_BASE_URL | https://burga-store.vercel.app |

---

## Next Steps / Ideas

- [ ] Switch Stripe from test mode to live mode
- [ ] Add custom domain (caselle.com or similar)
- [ ] Add Samsung/Pixel variant IDs to Printify map
- [ ] Create TikTok/Instagram content with product mockups
- [ ] Add email confirmation (Stripe already sends receipts)
- [ ] Add more designs (seasonal, trending)

---

## Session — 2026-05-07

**Completed today:**
- Created `~/create-store.sh` — a full bootstrapper script that spins up a new dropshipping store from scratch with zero manual steps: copies Caselle template, generates designs, pushes to GitHub, deploys to Vercel, registers Stripe webhook, uploads designs to Printify, and updates Obsidian
- Confirmed store is live at https://burga-store.vercel.app
- [[Master Knowledge — Caselle + Claude System|[[Master Knowledge — Caselle + Claude System|Caselle Trend Monitor]]]] routine is active, updated to run daily at midnight UTC (routine ID: `trig_013K4BMScBQFRz7KJ44wXBha`)
- Fixed Stop hook (`~/.claude/save_to_obsidian.py`) — was reading transcript at wrong JSON level, now saves every session correctly to Exelixis/Learning/
- Created Master Knowledge file at `Exelixis/Learning/Master Knowledge — Caselle + Claude System.md`
- Created **[[Master Knowledge — Caselle + Claude System|[[Master Knowledge — Caselle + Claude System|Universal Store Creator]]]]** remote agent (routine ID: `trig_01RYGCEv37NfJ8T7erTHMgdb`) — can build any ecommerce store (POD, physical, digital) with all credentials pre-loaded

**How to create a new store in future:** Write a `store-request.md` to the Caselle repo, then trigger the Universal Store Creator agent. Claude handles the spec writing automatically.

---

## Remote Agents

| Agent                   | Routine ID                      | Schedule           | Purpose                                     |
| ----------------------- | ------------------------------- | ------------------ | ------------------------------------------- |
| Caselle Trend Monitor   | `trig_013K4BMScBQFRz7KJ44wXBha` | Daily midnight UTC | Research trends, add new designs to Caselle |
| Universal Store Creator | `trig_01RYGCEv37NfJ8T7erTHMgdb` | On-demand only     | Build any new ecommerce store from scratch  |

**View all agents:** https://claude.ai/code/routines

*Full agent documentation: [[Master Knowledge — Caselle + Claude System]]*

---

## Stripe

- **Live key:** `[REDACTED]`
- **Webhook secret (Caselle):** `[REDACTED]`
- **Webhook ID (Caselle):** `we_1TUEzSIpmbucOAGXmtsK3nfT`
