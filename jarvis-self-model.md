# JARVIS Self-Model
*Last updated: 2026-05-13*

## Empire Status

### Caselle (Phone Cases) — LIVE
- Live status: **LIVE — products published, store deployed**
- Revenue: $0.00 (pre-first-sale phase — traffic is the only bottleneck)
- Store URL: https://burga-store.vercel.app
- Products: 10 aesthetic designs × 5 iPhone models published via Printify
- Checkout: Stripe + tote bag upsell ($12) on single-item carts, promotion codes enabled
- Intelligence: World Brain operational (DuckDuckGo + HackerNews + Reddit UA-rotation)

### Lumière (Etsy Wall Art) — Planned
- Status: planned
- Launch readiness: 20%

### Atelier (Fiverr Design)
- Status: inactive — /atelier-launch command ready when Fiverr phone verification done

### Maximus (Gold Trading)
- Status: **MONITORING MODE** — live trading begins May 20 2026 (7 days)
- Brain: Casellelol/Maximus/maximus-brain.md — appends daily, never overwrites
- Intelligence: 60-day history → RSI 14, SMA 20, SMA 50 all calculating
- Scout: /api/maximus/scout confirmed 200, runs 07:00 UTC daily

---

## Confirmed Live Infrastructure

### World Brain Feeds ✅ LIVE
- DuckDuckGo instant answers (replacing broken Amazon RSS — intentional)
- HackerNews Firebase API
- Reddit with 3-agent User-Agent rotation (empty returns from Vercel IPs = NORMAL, not a bug)
- Dedicated POD DuckDuckGo searches
- Graceful fallbacks prevent upgrade spam

### API Routes ✅ LIVE — Full Inventory
**Intelligence:**
- `/api/jarvis/think` — main reasoning loop + seasonal product triggers (cron: 13:00 UTC + 4× external)
- `/api/jarvis/world` — World Brain feed aggregation (08:00 UTC)
- `/api/jarvis/morning-briefing` — daily digest, system health, cron audit, API cost section (06:00 UTC)
- `/api/jarvis/nightly-summary` — overnight report (03:00 UTC)
- `/api/jarvis/weekly-report` — Monday 7am investor report → email + Telegram
- `/api/jarvis/verify` — tests Stripe, Printify, social credentials; saves jarvis-health.md (06:00 UTC)
- `/api/jarvis/evaluate` — weekly empire evaluation (Sunday 00:00 UTC)
- `/api/jarvis/evolve` — self-improvement cycle (Sunday 01:00 UTC)
- `/api/jarvis/command` — command execution loop (06:00 UTC)
- `/api/jarvis/route` — Telegram chat handler
- `/api/jarvis/backup` — daily brain file backup to GitHub, 7-day retention (02:00 UTC)
- `/api/jarvis/costs` — API spend tracking, burn rate, days-remaining estimate
- `/api/jarvis/session` — session logging endpoint

**Commerce:**
- `/api/checkout` — Stripe checkout with tote upsell + allow_promotion_codes
- `/api/webhooks/stripe` — purchase webhook handler
- `/api/printify/pipeline` — autonomous product publishing

**Scouts:**
- `/api/maximus/scout` — gold price + RSI 14 + SMA 20 + SMA 50, append-mode (07:00 UTC)
- `/api/cron/maximus-macro` — DXY, US10Y, macro calendar (08:00 UTC + hourly external)
- `/api/caselle/scout` — Caselle niche intelligence (05:00 UTC)
- `/api/atelier/scout` — Fiverr gig intelligence (03:00 UTC)
- `/api/lumiere/scout` — Etsy wall art intelligence (02:00 UTC)
- `/api/cron/competitor-monitor` — scrapes BURGA, Casetify, Pela directly (01:00 UTC)
- `/api/cron/trend-monitor` — DuckDuckGo trend scans (04:00 UTC + every 4h external)
- `/api/cron/cart-recovery` — Stripe abandoned cart → Resend recovery email (10:00 UTC + every 2h external)
- `/api/cron/marketing` — automated social posts (09:00 UTC)
- `/api/cron/social-performance` — Monday social analytics (12:00 UTC)

**Other:**
- `/api/health` — env var health check (ANTHROPIC, PRINTIFY, TELEGRAM, STRIPE, RESEND)
- `/api/telegram/webhook` — owner chat via Telegram
- `/api/telegram/notify` — outbound Telegram notifications
- `/api/accountant` — P&L report (23:00 UTC)
- `/api/accountant/performance` — daily performance metrics (00:00 UTC)
- `/api/sitemap/products` — Google Merchant Center XML feed from Printify (live)
- `/api/emails` — email capture + GitHub email-list.md storage

**Frontend:**
- `app/sitemap.ts` — full sitemap including all product pages + Google Shopping feed pointer
- `public/google-merchant.xml` — static fallback for Google Merchant submission

### Social Posting ✅ LIVE (3 channels)
- Twitter (API v2)
- Bluesky
- Buffer (BUFFER_ACCESS_TOKEN)
- Make.com automation layer confirmed working
- Success threshold: any one channel posts successfully

### Competitor Intelligence ✅ LIVE
- Direct scraping of burga.com, casetify.com, pela.earth product pages
- Prices and product titles extracted
- Analysis compares against dominant players and identifies gaps

### Memory Systems ✅ LIVE
- `jarvis-summary.md` — compressed session memory, updated after each conversation
- `jarvis-memory.md` — persistent intelligence log on GitHub
- `JARVIS_OWNER_NOTES.md` — owner instructions, read every think cycle
- `conversation-log.md` — full conversation history
- `empire-changelog.md` — autonomous action log, read by morning briefing for 24h activity report
- `backups/[YYYY-MM-DD].json` — daily brain file snapshots, 7-day retention (Casellelol/Caselle)

### Autonomous Publishing ✅ LIVE
- PRODUCT_CREATE command publishes to Printify without human approval
- DIGITAL_CREATE command: ebook, prompt-pack, notion-template, swipe-file, checklist
- BUSINESS_IDEA command: 12 business types, 6 execute immediately
- SEASONAL: JARVIS think cycle auto-fires PRODUCT_CREATE 3-4 weeks before seasonal events
- Products deduplicated against digital-products.md and empire-changelog.md

### Stop Hook ✅ LIVE
- `~/.claude/save_to_obsidian.py` runs on session end
- Saves transcript to Obsidian Learning vault
- Updates `obsidian-latest-session.md`
- Posts session summary to JARVIS session endpoint
- Crash-safe: handles transcript read failures gracefully

### Morning Briefing Intelligence ✅ LIVE
- System health section (env var audit)
- Cron failure alerting (missed crons in last 24h flagged by name)
- API cost section (monthly spend, daily avg, days remaining, alert if <7 days)
- 24h activity pull from empire-changelog.md
- Saves to GitHub morning-briefings.md as backup

---

## Slash Commands — 21 Total
/session-start · /morning-brief · /health-check · /deploy · /build-upgrade · /upgrade-jarvis
/empire-status · /first-sale · /new-product · /niche-launch · /competitors · /seo-audit
/pinterest · /lumiere-launch · /maximus-start · /atelier-launch · /cost-check · /backup
/analytics · /seasonal · /affiliate

---

## What I Can Do Without Permission
- File UPGRADE_NEEDED items in jarvis-upgrades.md
- Publish products to Printify via PRODUCT_CREATE
- Create digital products via DIGITAL_CREATE
- Post to social channels via cron/marketing
- Write intelligence to World Brain
- Send Telegram notifications to owner
- Update jarvis-memory.md, conversation-log.md, empire-changelog.md on GitHub
- Fire seasonal product campaigns autonomously

## What Requires Claude Code
- New route creation or modification
- Component/UI changes
- vercel.json updates
- Dependency installs

---

## Known Constraints
- Vercel Hobby plan: daily crons only — external cron jobs at cron-job.org for full frequency (see EXTERNAL-CRONS.md)
- Trade Nation credentials arrive May 20 2026 — Maximus monitoring-only until then
- Reddit feeds empty from Vercel IPs = NORMAL (server IPs rate-limited) — not a bug, never file UPGRADE_NEEDED

---

## Expected Next Cycle
- First sale via Caselle store (traffic is the only remaining blocker)
- Maximus live trading activation May 20 — 7 days of brain data already accumulating
- Atelier Fiverr launch when phone verification confirmed complete
- Anthropic credits: check console.anthropic.com/billing if scouts return 500
