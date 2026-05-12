# JARVIS Self-Model
*Last updated: 2026-05-13*

## Empire Status

### Caselle (Phone Cases) — LIVE
- Live status: **LIVE — products published, store deployed**
- Revenue: $0.00 (pre-first-sale phase)
- Store URL: https://burga-store.vercel.app
- Products: 10 aesthetic designs × 5 iPhone models published via Printify
- Blocking factor: Anthropic API credits exhausted — scouts cannot run intelligence cycles until topped up

### Lumière (Etsy Wall Art) — Planned
- Status: planned
- Launch readiness: 20%

### Atelier (Fiverr Design)
- Status: inactive

### Maximus (Gold Trading)
- Status: MONITORING MODE — live trading begins May 20 2026
- Intelligence: scout runs daily, logging XAU/USD price + RSI + SMA data to maximus-brain.md

---

## Confirmed Live Infrastructure

### World Brain Feeds ✅ LIVE
- DuckDuckGo instant answers (replacing broken Amazon RSS)
- HackerNews Firebase API
- Reddit with 3-agent User-Agent rotation
- Dedicated POD DuckDuckGo searches
- Graceful fallbacks prevent upgrade spam

### API Routes ✅ LIVE
- `/api/health` — checks ANTHROPIC, PRINTIFY, TELEGRAM, STRIPE env vars
- `/api/jarvis/verify` — tests Stripe, Printify, social credentials; saves jarvis-health.md to GitHub
- `/api/jarvis/think` — main reasoning loop (cron: 13:00 UTC daily via Vercel, 4× via external cron)
- `/api/jarvis/world` — World Brain feed aggregation
- `/api/jarvis/morning-briefing` — daily digest with system health section
- `/api/jarvis/evaluate` — weekly empire evaluation
- `/api/maximus/scout` — gold price + RSI + SMA monitoring
- `/api/cron/marketing` — automated social posts (Twitter, Bluesky, Buffer)
- `/api/cron/competitor-monitor` — scrapes BURGA, Casetify, Pela directly
- `/api/telegram/webhook` — owner chat via Telegram

### Social Posting ✅ LIVE (3 channels)
- Twitter (API v2)
- Bluesky
- Buffer (BUFFER_ACCESS_TOKEN)
- Success threshold: any one channel posts successfully

### Competitor Intelligence ✅ LIVE
- Direct scraping of burga.com, casetify.com, pela.earth product pages
- Prices and product titles extracted
- Analysis compares against dominant players and identifies gaps

### Memory Systems ✅ LIVE
- jarvis-summary.md — compressed session memory, updated after each conversation
- jarvis-memory.md — persistent intelligence log on GitHub
- JARVIS_OWNER_NOTES.md — owner instructions, read every cycle
- conversation-log.md — full conversation history

### Autonomous Publishing ✅ LIVE
- PRODUCT_CREATE command publishes to Printify without human approval
- DIGITAL_CREATE command: ebook, prompt-pack, notion-template, swipe-file, checklist
- BUSINESS_IDEA command: 12 business types, 6 execute immediately
- Products deduplicated against digital-products.md

### Stop Hook ✅ LIVE
- save_to_obsidian.py runs on session end
- Saves transcript to Obsidian Learning vault
- Updates obsidian-latest-session.md
- Posts session summary to JARVIS session endpoint

---

## What I Can Do Without Permission
- File UPGRADE_NEEDED items in jarvis-upgrades.md
- Publish products to Printify via PRODUCT_CREATE
- Create digital products via DIGITAL_CREATE
- Post to social channels via cron/marketing
- Write intelligence to World Brain
- Send Telegram notifications to owner
- Update jarvis-memory.md, conversation-log.md on GitHub

## What Requires Claude Code
- New route creation
- Component changes
- vercel.json updates
- Dependency installs

---

## Known Constraints
- Anthropic API credits exhausted — all Claude-powered routes return 500 until topped up at console.anthropic.com/billing
- Vercel Hobby plan: daily crons only — external cron jobs configured at cron-job.org for full frequency (see EXTERNAL-CRONS.md)
- Trade Nation credentials arrive May 20 2026 — Maximus monitoring-only until then

---

## Expected Next Cycle
- First sale via Caselle store
- Anthropic credits restored → scouts resume
- External cron jobs set up on cron-job.org
