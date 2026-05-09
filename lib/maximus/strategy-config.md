# MAXIMUS TRADING STRATEGY — CONFIGURATION v1.0
Last Updated: 2026-05-09
Status: MONITORING MODE (Live execution begins May 20th, 2026)

---

## CAPITAL BASE

Starting Capital: 10,000 NOK
Deposit Date: May 20th, 2026
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
  Risk Amount (NOK) = Account Equity × 2%
  Stop Loss Distance = Entry Price - Stop Level (in USD pips)
  Lot Size = Risk Amount ÷ (Stop Loss Distance × Pip Value)

---

## HONEST INCOME TARGETS

Monthly target (realistic): 3-8% return = 300kr–800kr
Monthly target (optimistic): 10-15% return = 1,000kr–1,500kr
Daily target equivalent: 15kr–40kr average (NOT 2,000kr — that figure was not grounded in math)

Important: A 2% risk per trade with a 1:2 reward-to-risk means winning trades earn 400kr, losing trades cost 200kr.
To make 1,000kr/month requires approximately 5 net winning trades with 2:1 RR.
This is achievable. 2,000kr/day is not achievable at this capital level.

---

## ENTRY RULES

Entry signal requires ALL of the following:
1. RSI on 1H chart: below 35 (buy) or above 65 (sell)
2. SMA20 and SMA50 alignment confirming trend direction
3. No high-impact economic event within 30 minutes
4. Not within 30 min of NFP, FOMC, CPI, PPI, or GDP release

---

## NO-TRADE WINDOWS

- 30 minutes before any red-flag economic event
- 30 minutes after any red-flag economic event (extreme volatility)
- Friday after 18:00 UTC (weekend gap risk)
- Sunday before 22:00 UTC (market open — spread risk)
- During active Stripe/infrastructure incidents (keeps focus clear)

---

## CYCLE REPORTING

Every Monday JARVIS reports:
- Opening equity vs target
- Net P&L for the week in NOK
- Win rate and average RR achieved
- What macro events affected performance

---

## BLOCKING DEPENDENCIES

- [ ] Trade Nation credentials (resolved May 20th, 2026)
- [x] Gold monitoring active (Maximus scout live, 7am UTC daily)
- [x] Macro intelligence (MIA running — DXY, US10Y, economic calendar)
- [x] Risk parameters documented (this file)
