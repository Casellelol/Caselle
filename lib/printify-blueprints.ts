export interface Blueprint {
  blueprint_id: number
  provider_id: number
  provider_name: string
  base_cost_usd: number
  recommended_retail_usd: number
  best_niches: string[]
  design_area: { width: number; height: number }
}

export const BLUEPRINTS: Record<string, Blueprint> = {
  // ─── Phone Cases ────────────────────────────────────────────────────────────
  "Tough Case": {
    blueprint_id: 269,
    provider_id: 1,
    provider_name: "SPOKE Custom Products",
    base_cost_usd: 12.00,
    recommended_retail_usd: 29.99,
    best_niches: ["aesthetic", "dark academia", "coastal grandmother", "streetwear", "cottagecore"],
    design_area: { width: 1800, height: 2400 },
  },

  // ─── Apparel ────────────────────────────────────────────────────────────────
  "Unisex T-Shirt": {
    blueprint_id: 6,
    provider_id: 29,
    provider_name: "Monster Digital",
    base_cost_usd: 12.00,
    recommended_retail_usd: 29.99,
    best_niches: ["fitness", "pet lovers", "pop culture", "minimalist", "motivational"],
    design_area: { width: 4500, height: 5400 },
  },
  "Unisex Hoodie": {
    blueprint_id: 92,
    provider_id: 29,
    provider_name: "Monster Digital",
    base_cost_usd: 27.00,
    recommended_retail_usd: 64.99,
    best_niches: ["fitness", "dark academia", "streetwear", "gaming", "cottagecore"],
    design_area: { width: 4500, height: 5400 },
  },
  "Women's T-Shirt": {
    blueprint_id: 200,
    provider_id: 29,
    provider_name: "Monster Digital",
    base_cost_usd: 12.00,
    recommended_retail_usd: 29.99,
    best_niches: ["boho", "coastal grandmother", "cottagecore", "feminist", "yoga & wellness"],
    design_area: { width: 4500, height: 5400 },
  },

  // ─── Pet Products ────────────────────────────────────────────────────────────
  "Dog Bandana": {
    blueprint_id: 587,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 8.00,
    recommended_retail_usd: 19.99,
    best_niches: ["dog lovers", "pet gifts", "cute dog mom", "golden retriever", "holiday pet"],
    design_area: { width: 3000, height: 1500 },
  },
  "Pet Bowl": {
    blueprint_id: 566,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 12.00,
    recommended_retail_usd: 29.99,
    best_niches: ["dog lovers", "cat lovers", "pet gifts", "personalised pet", "funny pet"],
    design_area: { width: 2475, height: 1275 },
  },
  "Dog T-Shirt": {
    blueprint_id: 571,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 12.00,
    recommended_retail_usd: 29.99,
    best_niches: ["dog lovers", "cute dog mom", "funny dog", "breed-specific", "holiday pet"],
    design_area: { width: 3000, height: 3000 },
  },

  // ─── Home & Living ───────────────────────────────────────────────────────────
  "Mug 11oz": {
    blueprint_id: 68,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 7.00,
    recommended_retail_usd: 17.99,
    best_niches: ["coffee lover", "office gifts", "funny quotes", "plant parent", "morning routine"],
    design_area: { width: 2475, height: 1275 },
  },
  "Poster": {
    blueprint_id: 509,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 8.00,
    recommended_retail_usd: 19.99,
    best_niches: ["home decor", "inspirational quotes", "botanical", "dark academia", "minimalist art"],
    design_area: { width: 3508, height: 4961 },
  },
  "Canvas Print": {
    blueprint_id: 137,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 15.00,
    recommended_retail_usd: 37.99,
    best_niches: ["home decor", "wall art", "boho", "abstract art", "landscape photography"],
    design_area: { width: 3600, height: 3600 },
  },
  "Throw Pillow": {
    blueprint_id: 171,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 15.00,
    recommended_retail_usd: 37.99,
    best_niches: ["home decor", "cosy aesthetic", "boho", "cat mom", "motivational"],
    design_area: { width: 3000, height: 3000 },
  },

  // ─── Accessories ─────────────────────────────────────────────────────────────
  "Tote Bag": {
    blueprint_id: 77,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 8.00,
    recommended_retail_usd: 19.99,
    best_niches: ["bookworm", "coffee shop aesthetic", "plant parent", "feminist", "aesthetic"],
    design_area: { width: 3000, height: 3000 },
  },
  "Sticker": {
    blueprint_id: 358,
    provider_id: 99,
    provider_name: "Printify Choice",
    base_cost_usd: 3.00,
    recommended_retail_usd: 7.99,
    best_niches: ["any niche", "impulse buy", "bundle filler", "fandom", "cute art"],
    design_area: { width: 1200, height: 1200 },
  },
}

export function getBlueprintByName(name: string): Blueprint | null {
  return BLUEPRINTS[name] ?? null
}

export function getBlueprintList(): string {
  return Object.entries(BLUEPRINTS)
    .map(([name, b]) =>
      `- ${name}: blueprint ${b.blueprint_id}, base $${b.base_cost_usd.toFixed(2)}, retail $${b.recommended_retail_usd.toFixed(2)} — best for: ${b.best_niches.join(", ")}`
    )
    .join("\n")
}

export const NICHE_BLUEPRINT_MAP: Record<string, string[]> = {
  "dog/pet":       ["Dog Bandana", "Pet Bowl", "Dog T-Shirt"],
  "coffee":        ["Mug 11oz", "Tote Bag", "Sticker"],
  "fitness":       ["Unisex T-Shirt", "Unisex Hoodie", "Tote Bag"],
  "home decor":    ["Canvas Print", "Throw Pillow", "Poster"],
  "aesthetic":     ["Tough Case", "Tote Bag", "Sticker"],
  "bookworm":      ["Tote Bag", "Mug 11oz", "Sticker"],
  "plant parent":  ["Tote Bag", "Mug 11oz", "Throw Pillow"],
  "dark academia": ["Tough Case", "Unisex Hoodie", "Poster"],
  "boho":          ["Throw Pillow", "Canvas Print", "Women's T-Shirt"],
}
