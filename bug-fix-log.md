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

## Bug Fix Report — 2026-05-14 00:00

### Stores Checked: 1

| Store | URL | Status | Issues Found | Fixed? |
|---|---|---|---|---|
| Caselle | burga-store.vercel.app | ⚠️ BUGS | 3 bugs (see below) | ✅ Fixed |

> Note: Live HTTP health checks blocked by network sandbox (403 `host_not_allowed`). Full static code audit performed instead.

### Fixes Applied

- **Caselle — Returns page unreachable**: `/returns/page.tsx` contained a complete return policy but was linked from nowhere — not the footer, not the sitemap. Customers who clicked through product trust bars reading "Free returns within 30 days" had no way to find the actual policy. **Fix**: Added "Returns & Exchanges" to the footer Info section `infoLinks` array and added `/returns` to the sitemap.

- **Caselle — Sitemap missing 3 collection pages**: `/collections/iphone-15`, `/collections/samsung-s25`, and `/collections/pixel-9` were valid, populated pages but entirely absent from the sitemap. Search engines could not crawl them. **Fix**: Added all three collection URLs to `app/sitemap.ts` alongside the `/returns` URL.

- **Caselle — Placeholder product description**: `celestial-witch-dark-case` had a boilerplate description ("Celestial Witch Dark Case — premium product by Caselle.") left over from pipeline scaffolding. **Fix**: Replaced with real copy matching the product's aesthetic.

### Still Broken (needs manual attention)

- **Caselle — Return policy contradiction**: The Terms of Service (`/terms`) states "we do not accept returns unless the item is defective" (14-day window), while the Returns page (`/returns`) describes a full 30-day return policy including non-defective items. These policies contradict each other. Requires a business decision on which is correct before the copy can be reconciled.

---
