import type { Product } from "@/types/product"
import { designVariants, allModelIds } from "./variants"

const iphone17Models = ["iphone-17-pro-max", "iphone-17-pro", "iphone-17-plus", "iphone-17"]
const iphone16Models = ["iphone-16-pro-max", "iphone-16-pro", "iphone-16-plus", "iphone-16"]
const iphone15Models = ["iphone-15-pro-max", "iphone-15-pro", "iphone-15-plus", "iphone-15"]
const samsungModels = ["galaxy-s25-ultra", "galaxy-s25-plus", "galaxy-s25"]
const pixelModels = ["pixel-9-pro-xl", "pixel-9-pro", "pixel-9"]

function makeImages(seed: string): Record<string, string[]> {
  const themes: Record<string, string> = {
    "marble-white": "marble,white,minimal",
    "marble-black": "marble,black,luxury",
    "sage-green": "green,nature,minimal",
    "dusty-rose": "pink,rose,soft",
    "midnight-navy": "blue,navy,dark",
    "champagne-gold": "gold,luxury,champagne",
    "cloud-grey": "grey,minimal,clean",
    "terracotta": "terracotta,orange,earthy",
    "lavender-mist": "purple,lavender,soft",
    "obsidian": "black,dark,minimal",
  }
  const result: Record<string, string[]> = {}
  for (const [id, theme] of Object.entries(themes)) {
    result[id] = [
      `https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80`,
      `https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80`,
    ]
  }
  return result
}

export const products: Product[] = [
  {
    id: "p-001",
    slug: "aurora-case",
    name: "Aurora",
    tagline: "Light bends to beauty",
    description: "The Aurora case captures the quiet elegance of northern light. A matte finish that feels as good as it looks, with precision cutouts and raised camera protection.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "bestsellers"],
    compatibleModels: [...iphone17Models, ...iphone16Models],
    designs: designVariants,
    images: makeImages("aurora"),
    featured: true,
    createdAt: "2026-01-01",
  },
  {
    id: "p-002",
    slug: "onyx-case",
    name: "Onyx",
    tagline: "Darkness refined",
    description: "Onyx is for those who believe restraint is the highest form of design. Deep tones, clean lines, and a grip that never compromises.",
    materials: "Dual-layer polycarbonate with shock-absorbing TPU lining. Military-grade drop protection. MagSafe compatible.",
    basePrice: 3499,
    badge: "new",
    collectionSlugs: ["iphone-17", "bestsellers"],
    compatibleModels: iphone17Models,
    designs: designVariants,
    images: makeImages("onyx"),
    featured: true,
    createdAt: "2026-02-01",
  },
  {
    id: "p-003",
    slug: "soleil-case",
    name: "Soleil",
    tagline: "Warmth you carry",
    description: "Inspired by golden hour. Soleil brings warmth to your everyday without announcing itself. Subtle, confident, yours.",
    materials: "Slim-profile polycarbonate, 0.8mm thin. Anti-yellowing coating. Fingerprint resistant matte surface.",
    basePrice: 2499,
    collectionSlugs: ["iphone-16", "iphone-15", "bestsellers"],
    compatibleModels: [...iphone16Models, ...iphone15Models],
    designs: designVariants,
    images: makeImages("soleil"),
    featured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "p-004",
    slug: "lune-case",
    name: "Lune",
    tagline: "Still. Luminous.",
    description: "Lune takes its cues from moonlight — present without demanding attention. The perfect case for every outfit, every occasion.",
    materials: "Frosted polycarbonate with UV-resistant coating. Raised bezel protection. Wireless charging compatible.",
    basePrice: 2799,
    collectionSlugs: ["iphone-15"],
    compatibleModels: iphone15Models,
    designs: designVariants,
    images: makeImages("lune"),
    featured: false,
    createdAt: "2025-11-01",
  },
  {
    id: "p-005",
    slug: "terra-case",
    name: "Terra",
    tagline: "Grounded in beauty",
    description: "Earth tones, clean structure. Terra is a case that wears well with time — no trends, no gimmicks.",
    materials: "Bio-based polycarbonate, 30% plant-derived. Slim fit, MagSafe compatible. Carbon-neutral production.",
    basePrice: 3299,
    badge: "new",
    collectionSlugs: ["samsung-s25"],
    compatibleModels: samsungModels,
    designs: designVariants,
    images: makeImages("terra"),
    featured: true,
    createdAt: "2026-03-01",
  },
  {
    id: "p-006",
    slug: "ciel-case",
    name: "Ciel",
    tagline: "Open as the sky",
    description: "Ciel is the lightest case in our lineup — barely-there protection that keeps your phone looking naked while staying safe.",
    materials: "Ultra-thin 0.6mm polycarbonate. Crystal clear option available. Scratch-resistant coating.",
    basePrice: 2499,
    collectionSlugs: ["pixel-9"],
    compatibleModels: pixelModels,
    designs: designVariants,
    images: makeImages("ciel"),
    featured: false,
    createdAt: "2026-02-15",
  },
  {
    id: "p-007",
    slug: "noir-case",
    name: "Noir",
    tagline: "Unapologetically minimal",
    description: "No embellishment. No excess. Noir is the essential case — the one you reach for every day without thinking.",
    materials: "Matte polycarbonate, non-slip grip texture. Raised camera ring. All cutouts laser-precision aligned.",
    basePrice: 2699,
    collectionSlugs: ["iphone-17", "iphone-16"],
    compatibleModels: [...iphone17Models, ...iphone16Models],
    designs: designVariants,
    images: makeImages("noir"),
    featured: false,
    createdAt: "2025-12-01",
  },
  {
    id: "p-008",
    slug: "brume-case",
    name: "Brume",
    tagline: "Soft. Certain.",
    description: "Brume wraps your phone in a soft-touch matte finish that sits perfectly in the hand. Understated color, oversized presence.",
    materials: "Soft-touch TPU with semi-rigid interior frame. Drop tested to 1.8m. Lint-free matte surface.",
    basePrice: 2999,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "bestsellers"],
    compatibleModels: iphone17Models,
    designs: designVariants,
    images: makeImages("brume"),
    featured: true,
    createdAt: "2026-01-20",
  },
  {
    id: "p-009",
    slug: "quartz-case",
    name: "Quartz",
    tagline: "Translucent strength",
    description: "Show off your phone while protecting it. Quartz is a clear case done right — with subtle tinting that ages gracefully.",
    materials: "Anti-yellowing transparent polycarbonate. UV-resistant, stays clear for 2+ years. Shock corners.",
    basePrice: 2499,
    collectionSlugs: ["iphone-16", "samsung-s25"],
    compatibleModels: [...iphone16Models, ...samsungModels],
    designs: designVariants,
    images: makeImages("quartz"),
    featured: false,
    createdAt: "2026-02-10",
  },
  {
    id: "p-010",
    slug: "dusk-case",
    name: "Dusk",
    tagline: "Between two worlds",
    description: "Dusk lives in the space between bold and subtle. Gradient finishes that catch the light differently every time.",
    materials: "Gradient-printed polycarbonate. UV-laminated for color longevity. MagSafe compatible.",
    basePrice: 3199,
    collectionSlugs: ["iphone-15", "pixel-9"],
    compatibleModels: [...iphone15Models, ...pixelModels],
    designs: designVariants,
    images: makeImages("dusk"),
    featured: false,
    createdAt: "2025-10-01",
  },
  {
    id: "p-011",
    slug: "haven-case",
    name: "Haven",
    tagline: "Protection, perfected",
    description: "Haven is our most protective case — built for the real world without sacrificing an ounce of elegance.",
    materials: "Triple-layer construction: hard PC outer + TPU mid + microfibre inner. 2m drop certified. Lip over screen.",
    basePrice: 3499,
    badge: "new",
    collectionSlugs: ["iphone-17", "samsung-s25"],
    compatibleModels: [...iphone17Models, ...samsungModels],
    designs: designVariants,
    images: makeImages("haven"),
    featured: false,
    createdAt: "2026-04-01",
  },
  {
    id: "p-012",
    slug: "mist-case",
    name: "Mist",
    tagline: "Barely there",
    description: "Mist disappears into the background so your phone can speak for itself. The lightest, most invisible case we make.",
    materials: "0.4mm polycarbonate. Crystal transparency. The world's thinnest protective case.",
    basePrice: 2299,
    collectionSlugs: ["iphone-16", "pixel-9"],
    compatibleModels: [...iphone16Models, ...pixelModels],
    designs: designVariants,
    images: makeImages("mist"),
    featured: false,
    createdAt: "2025-09-01",
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCollection(collectionSlug: string) {
  if (collectionSlug === "bestsellers") {
    return products.filter((p) => p.collectionSlugs.includes("bestsellers"))
  }
  return products.filter((p) => p.collectionSlugs.includes(collectionSlug))
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}
