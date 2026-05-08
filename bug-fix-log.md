# Bug Fix Log

## Bug Fix Report — 2026-05-08 12:05

### Stores Checked: 1

| Store | URL | Status | Issues Found | Fixed? |
|---|---|---|---|---|
| Caselle | burga-store.vercel.app | ⚠️ BUGS | 3 code bugs (see below) | ✅ Fixed |

> Note: Live HTTP health checks blocked by network sandbox (403 `host_not_allowed`). Full static code audit performed instead.

### Fixes Applied

- **Caselle — Footer Galaxy S25 link broken**: The footer derived collection slugs from display names using `.toLowerCase().replace(" ", "-")`. "Galaxy S25" → `"galaxy-s25"`, but the real slug is `"samsung-s25"`. Every visitor who clicked "Galaxy S25" in the footer got a 404. **Fix**: Replaced the ad-hoc slug generation with a direct import of the `collections` data array, so slugs are always correct.

- **Caselle — Footer Info section had dead links**: "About", "Shipping & Returns", "FAQ", "Contact" were rendered as `<span>` elements with no `href`. The Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages existed but were not linked from the footer at all. **Fix**: Replaced the dead spans with proper `<Link>` elements to `/terms`, `/privacy`, and `mailto:the3vka@gmail.com`. Also added Privacy and Terms links to the footer bottom bar.

- **Caselle — `/products` route returned 404**: `/products/[slug]/page.tsx` existed but there was no `/products/page.tsx`. Any navigation or health check to `/products` got a 404. **Fix**: Created `/app/products/page.tsx` that immediately redirects to `/collections/bestsellers`.

- **Caselle — Unused `allModelIds` import**: `lib/data/products.ts` imported `allModelIds` from `./variants` but never used it. **Fix**: Removed unused import.

### Still Broken (needs manual attention)

- None identified. All issues were code-level and have been patched.

---
