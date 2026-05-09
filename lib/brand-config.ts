export type BrandConfig = {
  id: string
  name: string
  niche: string
  colorPalette: string[]
  aestheticKeywords: string[]
  printifyBlueprintId: number
  printifyProviderId: number
  shopId: string
  status: "live" | "planned" | "scaffolding"
}

export const CASELLE_BRAND: BrandConfig = {
  id: "caselle",
  name: "Caselle",
  niche: "minimalist",
  colorPalette: ["marble-white", "marble-black", "sage-green", "dusty-rose", "midnight-navy"],
  aestheticKeywords: ["minimalist", "clean", "aesthetic", "premium", "trendy", "luxury"],
  printifyBlueprintId: 269,
  printifyProviderId: 1,
  shopId: "27451784",
  status: "live",
}

export const NOCTUA_BRAND: BrandConfig = {
  id: "noctua",
  name: "Noctua",
  niche: "dark-academia",
  colorPalette: ["midnight", "burgundy", "aged-gold", "forest-green", "sepia"],
  aestheticKeywords: ["dark academia", "gothic", "vintage", "mystical", "scholarly", "occult", "crescent moon", "crystal ball"],
  printifyBlueprintId: 269,
  printifyProviderId: 1,
  shopId: "",
  status: "planned",
}

export const EMPIRE_BRANDS: BrandConfig[] = [CASELLE_BRAND, NOCTUA_BRAND]
