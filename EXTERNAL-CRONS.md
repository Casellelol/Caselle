# External Cron Configuration
*Vercel Hobby plan limits crons to once daily. Set these up at cron-job.org to restore full frequency.*

## Setup Instructions
1. Go to https://cron-job.org and create a free account
2. Add each job below as a new cron job (HTTP GET request)
3. No auth header needed — routes are public Vercel functions

---

## Jobs to Configure

### 1. JARVIS Think Cycle — every 6 hours
**URL:** `https://burga-store.vercel.app/api/jarvis/think`
**Schedule:** `0 1,7,13,19 * * *`
**Description:** JARVIS reasoning, upgrade filing, and intelligence synthesis. Runs 4× daily at 01:00, 07:00, 13:00, 19:00 UTC.

---

### 2. Maximus Macro Intelligence — every hour
**URL:** `https://burga-store.vercel.app/api/cron/maximus-macro`
**Schedule:** `0 * * * *`
**Description:** Gold price, DXY, US10Y, macro calendar scans. Feeds Maximus trading intelligence before May 20 live activation.

---

### 3. Trend Monitor — every 4 hours
**URL:** `https://burga-store.vercel.app/api/cron/trend-monitor`
**Schedule:** `0 0,4,8,12,16,20 * * *`
**Description:** DuckDuckGo trend scans, Etsy niche detection, POD opportunity discovery.

---

## Notes
- These routes are safe to call externally — they authenticate via internal logic only
- If the Anthropic API credit balance is exhausted, calls will log the error gracefully and return 500 (no side effects)
- Vercel's own daily crons still run as configured in `vercel.json` — external crons supplement, not replace
- When upgrading to Vercel Pro, remove external cron jobs and restore original `vercel.json` schedules
