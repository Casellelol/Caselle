export type DesignVariant = {
  id: string
  name: string
  type: "solid" | "pattern" | "gradient"
  swatch: string
}

export type Product = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  materials: string
  basePrice: number
  badge?: "new" | "bestseller" | "limited"
  collectionSlugs: string[]
  compatibleModels: string[]
  designs: DesignVariant[]
  images: Record<string, string[]>
  featured: boolean
  createdAt: string
}
