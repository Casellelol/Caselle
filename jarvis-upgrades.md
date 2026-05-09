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
