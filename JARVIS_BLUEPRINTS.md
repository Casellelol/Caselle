# JARVIS Business Blueprints
*Every business model JARVIS is authorised to identify, propose, and execute.*

---

## HOW TO USE THIS FILE

When you spot a market opportunity in your intelligence, match it to the most relevant blueprint below.
Use `BUSINESS_IDEA: [type] | [concept] | [rationale] | [revenue model] | [confidence 0-100]`

If the blueprint is marked **LIVE** — it executes immediately with no human needed.
If marked **FILE** — it gets logged and Claude builds the infrastructure. Owner is notified on Telegram.

---

## LIVE BLUEPRINTS (execute now, no Claude needed)

### pod-store
Physical print-on-demand store. Phone cases, apparel, mugs, wall art.
- **Signal:** Aesthetic trending 3+ cycles, distinct from existing stores
- **Revenue:** 30-50% margin per sale via Printify
- **Example:** Dark academia phone case store, anime streetwear tee store
- **Command:** `BUSINESS_IDEA: pod-store | [store concept] | [rationale] | product sales | [confidence]`

### ebook
Long-form digital guide people pay to download.
- **Signal:** "how to X" searches trending, underserved topic, buyer intent clear
- **Revenue:** £8-20 per download, 100% margin
- **Example:** "How to make £500/month on Etsy in 2026", "ChatGPT for freelancers"
- **Command:** `BUSINESS_IDEA: ebook | [topic] | [rationale] | £10-20 per download | [confidence]`

### prompt-pack
Curated AI prompt collections for specific use cases.
- **Signal:** AI tool trending, specific workflow people want automated
- **Revenue:** £7-15 per pack, instant delivery
- **Example:** "100 Midjourney prompts for product photography", "Etsy listing generator prompts"
- **Command:** `BUSINESS_IDEA: prompt-pack | [topic] | [rationale] | £8-15 per pack | [confidence]`

### notion-template
Pre-built Notion workspace system for a specific workflow.
- **Signal:** Productivity niche trending, professionals seeking organisation tools
- **Revenue:** £10-30 per template
- **Example:** "Freelancer client CRM in Notion", "Content creator calendar system"
- **Command:** `BUSINESS_IDEA: notion-template | [workflow] | [rationale] | £15-30 per template | [confidence]`

### swipe-file
Collection of proven templates, scripts, copy, or examples.
- **Signal:** Marketers/sellers wanting shortcuts, "done for you" demand
- **Revenue:** £10-25, positioned as time-saving
- **Example:** "50 Etsy product description templates", "Viral TikTok hooks for dropshipping"
- **Command:** `BUSINESS_IDEA: swipe-file | [topic] | [rationale] | £12-25 per file | [confidence]`

### checklist
Step-by-step SOPs and launch checklists.
- **Signal:** Complex process people keep getting wrong, "how to start X" demand
- **Revenue:** £5-15, positioned as risk reduction
- **Example:** "Printify store launch checklist", "Etsy SEO audit checklist"
- **Command:** `BUSINESS_IDEA: checklist | [topic] | [rationale] | £7-15 per checklist | [confidence]`

---

## FILE BLUEPRINTS (log idea, Claude builds infrastructure, then auto-executes next cycle)

### newsletter
Email newsletter on a niche topic. Grows an owned audience.
- **Signal:** Engaged community around a topic, no dominant newsletter yet, recurring interest
- **Revenue:** Sponsorships (£50-500/send), paid tier (£5-10/month), affiliate links
- **Example:** "Weekly POD trends for Etsy sellers", "AI tools for small business"
- **Command:** `BUSINESS_IDEA: newsletter | [niche + name idea] | [rationale] | sponsorships + paid tier | [confidence]`

### affiliate-site
Content site that earns commissions recommending products/tools.
- **Signal:** High-intent buyer searches ("best X for Y"), evergreen topic, affiliate programs available
- **Revenue:** 5-30% commission on referred sales
- **Example:** "Best AI tools for creators" review site, "Top POD platforms compared"
- **Command:** `BUSINESS_IDEA: affiliate-site | [niche] | [rationale] | affiliate commissions | [confidence]`

### micro-saas
Small software tool solving a specific problem, monthly subscription.
- **Signal:** Repeated manual pain point, no simple tool exists, people paying £5-20/month for adjacent tools
- **Revenue:** £9-49/month per subscriber, very high margin
- **Example:** "Etsy keyword rank tracker", "Printify profit calculator with auto-pricing"
- **Command:** `BUSINESS_IDEA: micro-saas | [tool concept] | [rationale] | £9-29/month subscription | [confidence]`

### youtube-channel
Faceless or educational YouTube channel monetised via ads + products.
- **Signal:** Topic with consistent search volume, no dominant creator, can be produced with AI
- **Revenue:** AdSense (£1-5/1000 views) + product funnel (own digital products, affiliate)
- **Example:** "AI side hustle tutorials", "POD store walkthroughs for beginners"
- **Command:** `BUSINESS_IDEA: youtube-channel | [channel concept] | [rationale] | ads + digital products | [confidence]`

### community
Paid membership community around a shared interest or goal.
- **Signal:** People asking the same questions repeatedly, no premium community exists, strong shared identity
- **Revenue:** £10-30/month per member (Skool, Circle, Discord)
- **Example:** "Etsy sellers mastermind group", "POD entrepreneurs private community"
- **Command:** `BUSINESS_IDEA: community | [community concept] | [rationale] | £15-30/month membership | [confidence]`

### agency-service
Offer a done-for-you service using AI to scale delivery.
- **Signal:** Businesses paying for this manually, can be delivered 10x cheaper with AI
- **Revenue:** Project fees (£200-2000), retainers (£300-1500/month)
- **Example:** "AI-generated product descriptions for Etsy sellers", "Automated social content for small brands"
- **Command:** `BUSINESS_IDEA: agency-service | [service concept] | [rationale] | project fees + retainers | [confidence]`

---

## DECISION RULES

- Fire `BUSINESS_IDEA` when intelligence shows clear demand AND a revenue path exists
- Minimum confidence to fire: **65%** (lower than STORE_LAUNCH because ideas cost nothing to log)
- Do NOT fire the same concept twice — check business-ideas.md first
- Always include WHY in the rationale — what specific signal triggered this
- One idea per think cycle maximum — quality over quantity

---

*This file is permanent. JARVIS reads it every think cycle. Claude updates it when new blueprints are built.*
