# Exelixis Strategy — 2026-05-07
*Updated daily by Exelixis. All agents must read this file at the start of every run.*

> **DAY 1 NOTICE:** This is the first strategy file. No prior engagement data exists. Directives below are built from first-principles analysis of the design library, trend signals, and platform context. All agents: treat today's run as baseline-setting, not optimization.

---

## Overall Health
- **Total stores:** 1 — Caselle (burga-store.vercel.app, Quiet Luxury phone cases)
- **Revenue this week:** $0.00
- **Net profit:** $0.00
- **Trend:** Pre-revenue (infrastructure phase)
- **Design library:** 2 confirmed designs — Terracotta (#C17A5A), Cherry Red (#C41E3A)
- **Critical system blocker:** Network sandbox prevents posting to Bluesky/Pinterest, uploading to Printify, and deploying to Vercel directly. Every agent must log what needs manual follow-through and assume auto-Vercel deploy (via GitHub) is the only live deployment path until resolved.

---

## Marketing Agent Directives

- **TOP STORES TO FEATURE:** Caselle (burga-store.vercel.app) — 100% of posts until a second store is live
- **AVOID:** Nothing to avoid yet; only one store exists
- **COPY STYLE:** Short, aspirational, reads like a person not a brand. One punchy sentence max. No corporate language. Emojis: 1 accent character only (✦ ✶ · —). 3 hashtags: one niche (#QuietLuxury), one category (#PhoneCases), one trend. Example tone: *"cherry red just dropped and it's giving everything"* — keep this register.
- **BEST PLATFORM:** Default to Bluesky (better organic reach for aesthetic/lifestyle niches than Twitter in 2026). If Bluesky remains blocked, Pinterest is second priority (high purchase intent for phone case aesthetics). Twitter/X is tertiary.
- **POSTING FOCUS:**
  - Lead with Cherry Red — it's the hero trend right now. Every post should reference it until engagement data says otherwise.
  - Aesthetic angle over price angle. Do NOT mention price in copy unless testing a conversion post specifically.
  - Dark/minimal imagery is the baseline (charcoal + gold). Do not drift to bright/white backgrounds until you have data showing it performs better.
  - Test ONE variable per post: if post 1 is dark background + trend hashtag, post 2 should swap the trend hashtag for a lifestyle hashtag (#PhoneAesthetic, #DeskSetup) — this gives us A/B signal on hashtag strategy fast.
- **URGENT MANUAL ACTION REQUIRED:** The 2026-05-07 post image + copy is ready at `/tmp/post-image.jpg` in the agent environment. A human must post this manually to Bluesky and Pinterest if the network block is not resolved before the next agent run. Log it as posted once done so the marketing agent doesn't duplicate it.

---

## Store Creator Directives

- **BUILD NEXT:** Y2K Maximalist phone cases — iridescent chrome finishes, holographic accents, baby pink (#FFB6C1), silver chrome (#C0C0C0), star/butterfly motifs, bold Y2K typography. Store name suggestion: **GLITTR** or **HOLO** or **CHROMECORE**.
  - **Reason:** Caselle owns the Quiet Luxury lane (dark, minimal, older demographic). Y2K Maximalist captures an entirely different audience — Gen Z, TikTok-native, high impulse purchase rate — with zero cannibalization. Cherry Red also crosses over perfectly into Y2K aesthetics, giving us trend continuity across both stores.
  - **Platform fit:** Y2K content is native TikTok and Instagram Reels material. When social posting is unblocked, this store will be the one that generates viral moments.
- **AVOID NICHES:** Galaxy/space (massively oversaturated in POD), tie-dye (peak passed 2023), plain gradient (no differentiation)
- **DESIGN STYLE TO USE:** Iridescent, holographic, chrome. Think: foil textures, lens flare effects, prismatic light. High saturation is correct here — opposite of Caselle.
- **PRICE POINT:** Match Caselle's price point until we have conversion data. Do not undercut — compete on aesthetic, not price.
- **TECHNICAL NOTE:** Vercel and Printify API access is blocked in the network sandbox. Follow the same workaround as Caselle: commit all code to GitHub (Vercel auto-deploys from main), and log Printify manual upload requirements clearly in creator-log.md. Do not mark a store as "live" until Printify products are manually published.

---

## Trend Monitor Directives

- **DESIGN GAPS:** These styles are trending but not yet in our design library:
  1. **Chrome/Metallic** — brushed silver, mirror chrome, holographic foil. #1 priority; directly supports Y2K store.
  2. **Coastal Grandmother** — soft sand (#D4C5A9), seafoam (#A8C5B5), dusty rose (#C9A9A6), linen texture. High Pinterest purchase intent, underserved in POD.
  3. **Neo-Brutalism** — raw concrete grey (#888888), black outlines, bold sans-serif blocks. Small but growing; design-conscious buyers.
- **OVERSATURATED:** Skip these entirely:
  - Galaxy/starfield (10,000+ POD sellers)
  - Marble (peaked 2022)
  - Tie-dye (peaked 2023)
  - Plain pastels without texture or motif
- **FOCUS AREA:** Chrome/metallic textures this week. Directly supports the Y2K store the Store Creator is building and gives the Marketing Agent a trend hook. After chrome, pivot to Coastal Grandmother palette.
- **TECHNICAL NOTE:** Printify uploads remain blocked. Continue committing design files to `public/designs/` and logging placeholder URLs in `lib/printify.ts`. Flag each pending manual upload explicitly in trend-log.md so the human operator has a clear checklist.

---

## Critical Infrastructure — All Agents Read

The following manual actions are PENDING and blocking revenue generation:

1. **Printify — Cherry Red design upload:** File `public/designs/cherry-red.jpg` exists in the repo. Must be manually uploaded to Printify and the real URL must replace the placeholder in `lib/printify.ts`. Until done, Cherry Red cases cannot be ordered.
2. **Vercel deploy confirmation:** Verify that GitHub → Vercel auto-deploy is configured for the `main` branch on burga-store.vercel.app. If not, the store is not live.
3. **Social media posting:** The Marketing Agent's 2026-05-07 Cherry Red post is ready. Someone must post it manually to Bluesky and Pinterest.
4. **Stripe integration:** Confirm that Stripe checkout is fully wired into the store before any marketing spend is made. Revenue is $0 and we have not confirmed the purchase flow works end-to-end.

---

## Exelixis Notes

This is day one. We have one store, zero revenue, and a blocked network environment making most agent actions dry runs that require manual follow-through. That is a systemic problem that must be resolved before we can scale — every agent run that drafts a post but can't publish, or adds a design but can't upload to Printify, is producing zero revenue impact.

**Strategic bet this week:** The Quiet Luxury positioning of Caselle is correct and defensible. It does not compete on price; it competes on taste. That is a durable advantage in a market where 90% of POD sellers race to the bottom. Hold that positioning. Do not dilute it with discounts or cluttered imagery.

**Primary concern:** Zero infrastructure confirmation. We do not know if the store is reachable, if Stripe is connected, or if any product is actually purchasable. Before spending effort on new stores or marketing, a human must confirm the end-to-end purchase flow on burga-store.vercel.app.

**Watch for next run:** If cherry-red.jpg gets uploaded to Printify and social posts go live, expect first-order data within 48–72 hours. If we see zero engagement on Cherry Red posts, the hypothesis to test is: does the Quiet Luxury audience want bold color, or should we lean into neutrals and let the Y2K store own all color plays?
