# Bug Fix Log

## Bug Fix Report — 2026-05-15 06:00

### Stores Checked: 1

| Store | URL | Status | Issues Found | Fixed? |
|---|---|---|---|---|
| Caselle | burga-store.vercel.app | ⚠️ BUGS | 4 bugs (see below) | ✅ Fixed |

> Note: Live HTTP health checks blocked by network sandbox (403 `host_not_allowed`). Full static code audit performed instead.

### Fixes Applied

- **Caselle — Fulfillment bug: 3 products had wrong PRODUCT_PRINT_FILES keys**: `lib/printify.ts` had `"coastal-grandmother-case"`, `"warm-stone-arch"`, and `"neo-brutalist-case"` as keys, but the actual product IDs are `"coastal-grandmother-phone-case"`, `"warm-stone-arch-phone-case"`, and `"neo-brutalist-phone-case"`. Every order for those products missed the lookup, fell back to `DEFAULT_PRINT_FILE` (marble-white), and had the wrong design printed and shipped to the customer. **Fix**: Replaced the three wrong keys with the correct product IDs, using the actual design files (`coastal-grandmother.jpg` and `warm-stone-arch.jpg` via GitHub raw, the existing S3 URL for neo-brutalist).

- **Caselle — Fulfillment bug: 11 new products missing from PRODUCT_PRINT_FILES**: All products added on 2026-05-13 via the Printify pipeline (Matisse Abstract Art, Clean Girl Morandi, Fruity Coquette Cherry, Brutalist Architecture, Dark Academia Revival, Van Gogh Swirl, William Morris Floral, Mystic Cat Oracle, Klimt Golden Woman, Tarot Moon Card, Mushroom Cottage Core) had no entry in `PRODUCT_PRINT_FILES`. Every sale of these products — which represent 11 of 23 active listings — sent the marble-white fallback design to Printify. **Fix**: Added all 11 entries using the S3 print file URLs from each product's `printFile` field in `lib/data/products.ts`.

- **Caselle — Cart not cleared after checkout**: `app/success/page.tsx` is a server component and never called `clearCart()`. After completing a Stripe checkout, customers returned to `/success` with their full cart still in localStorage. On a return visit, stale items would still appear in the cart drawer, confusing customers and risking duplicate orders. **Fix**: Created `app/success/SuccessClearer.tsx` (a client component that calls `clearCart()` on mount) and rendered it inside the success page.

- **Caselle — Sitemap canonical domain mismatch**: `app/sitemap.ts` fell back to `burga-store.vercel.app` when neither `NEXT_PUBLIC_SITE_URL` nor `NEXT_PUBLIC_BASE_URL` was set, while `app/layout.tsx` hardcodes `caselle.store` as the canonical domain. If the env var is unset, the sitemap submitted to search engines would contain URLs pointing to the old Vercel subdomain instead of the production domain. **Fix**: Changed the fallback default to `"https://caselle.store"`.

### Still Broken (needs manual attention)

- **Caselle — Return policy contradiction** (carried from 2026-05-14): Terms of Service states "we do not accept returns unless the item is defective" (14-day window), while the Returns page offers 30-day returns including non-defective items. Requires a business decision on which policy is correct.

---

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
