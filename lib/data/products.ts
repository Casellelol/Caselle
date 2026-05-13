import type { Product } from "@/types/product"

const iphone17Models = ["iphone-17-pro-max", "iphone-17-pro", "iphone-17-plus", "iphone-17"]
const iphone16Models = ["iphone-16-pro-max", "iphone-16-pro", "iphone-16-plus", "iphone-16"]
const iphone15Models = ["iphone-15-pro-max", "iphone-15-pro", "iphone-15-plus", "iphone-15"]
const samsungModels = ["galaxy-s25-ultra", "galaxy-s25-plus", "galaxy-s25"]
const pixelModels = ["pixel-9-pro-xl", "pixel-9-pro", "pixel-9"]
const allModels = [...iphone17Models, ...iphone16Models, ...iphone15Models, ...samsungModels, ...pixelModels]

export const products: Product[] = [
  {
    id: "cherry-red-quiet-luxury-phone-case",
    printifyId: "69fe63e9f0f38ff1d503b486",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/cherry-red.jpg",
    slug: "cherry-red-quiet-luxury-phone-case",
    name: "Cherry Red — Quiet Luxury Phone Case",
    tagline: "Bold meets refined",
    description: "Bold meets minimal. The Cherry Red case brings 2026's defining colour to Caselle's signature quiet luxury aesthetic. Crafted for the ones who know.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe63e9f0f38ff1d503b486/103561/101039/cherry-red-quiet-luxury-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-08",
  },
  {
    id: "dark-academia-phone-case",
    printifyId: "69fe8b47f9b3c9205f0fe638",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/dark-academia.jpg",
    slug: "dark-academia-phone-case",
    name: "Dark Academia Phone Case",
    tagline: "Books, candles, and consequence",
    description: "Dark Academia Phone Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe8b47f9b3c9205f0fe638/103561/101039/dark-academia-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-09",
  },
  {
    id: "booktok-romantasy-phone-case",
    printifyId: "69fe8e1149256e824e00e424",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/booktok-romantasy.jpg",
    slug: "booktok-romantasy-phone-case",
    name: "BookTok Romantasy Phone Case",
    tagline: "For the girls who finish series in one sitting",
    description: "BookTok Romantasy Phone Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe8e1149256e824e00e424/103561/101039/booktok-romantasy-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-10",
  },
  {
    id: "coastal-grandmother-case",
    printifyId: "69fe8e754ba2ff981a01962a",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/coastal-grandmother.jpg",
    slug: "coastal-grandmother-case",
    name: "Coastal Grandmother Case",
    tagline: "Linen, light, and sea salt air",
    description: "Coastal Grandmother Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    badge: "new",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe8e754ba2ff981a01962a/103561/101039/coastal-grandmother-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-11",
  },
  {
    id: "coquette-cherry-bow-phone-case",
    printifyId: "69fe92c24b354ada360b812b",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/coquette-cherry-bow.jpg",
    slug: "coquette-cherry-bow-phone-case",
    name: "Coquette Cherry Bow Phone Case",
    tagline: "Sweet with an edge",
    description: "Coquette Cherry Bow Phone Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "new",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe92c24b354ada360b812b/103561/101039/coquette-cherry-bow-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-12",
  },
  {
    id: "pressed-wildflower-dark-academia-case",
    printifyId: "69fe92c2f8abf18d190325cf",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/pressed-wildflower.jpg",
    slug: "pressed-wildflower-dark-academia-case",
    name: "Pressed Wildflower Dark Academia Case",
    tagline: "Preserved beauty",
    description: "Pressed Wildflower Dark Academia Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe92c2f8abf18d190325cf/103561/101039/pressed-wildflower-dark-academia-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-14",
  },
  {
    id: "celestial-witch-case",
    printifyId: "69fe9710b639fab5c10840ad",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/celestial-witch.jpg",
    slug: "celestial-witch-case",
    name: "Celestial Witch Case",
    tagline: "Aligned with the stars",
    description: "Celestial Witch Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fe9710b639fab5c10840ad/103561/101039/celestial-witch-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-16",
  },
  {
    id: "celestial-witch-case-2",
    printifyId: "69fea1983cdbaa898e0efdd1",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/celestial-witch-2.jpg",
    slug: "celestial-witch-case-2",
    name: "Celestial Witch Case",
    tagline: "Moon-touched and magic-minded",
    description: "Celestial Witch Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fea1983cdbaa898e0efdd1/103561/101039/celestial-witch-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-17",
  },
  {
    id: "quiet-luxury-monogram-phone-case",
    printifyId: "69fedc7372bfa4db660426dd",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/quiet-luxury-monogram.jpg",
    slug: "quiet-luxury-monogram-phone-case",
    name: "Quiet Luxury Monogram Phone Case",
    tagline: "Understated. Unmistakable.",
    description: "Quiet Luxury Monogram Phone Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fedc7372bfa4db660426dd/103561/101039/quiet-luxury-monogram-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-18",
  },
  {
    id: "tomato-girl-summer-phone-case",
    printifyId: "69fedc74b639fab5c1087a15",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/tomato-girl.jpg",
    slug: "tomato-girl-summer-phone-case",
    name: "Tomato Girl Summer Phone Case",
    tagline: "Sun-soaked and unapologetic",
    description: "Tomato Girl Summer Phone Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fedc74b639fab5c1087a15/103561/101039/tomato-girl-summer-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-19",
  },
  {
    id: "warm-stone-arch",
    printifyId: "69fedc774b354ada360bbd44",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/warm-stone-arch.jpg",
    slug: "warm-stone-arch",
    name: "Warm Stone Arch",
    tagline: "Architecture of calm",
    description: "Warm Stone Arch — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69fedc774b354ada360bbd44/103561/101039/warm-stone-arch.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-20",
  },
  {
    id: "neo-brutalist-case",
    printifyId: "69ff0686048a81990c0af69d",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/neo-brutalist.jpg",
    slug: "neo-brutalist-case",
    name: "Neo-Brutalist Case",
    tagline: "Structure as statement",
    description: "Neo-Brutalist Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69ff0686048a81990c0af69d/103561/101039/neo-brutalist-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-21",
  },
  {
    id: "neo-brutalist-case-2",
    printifyId: "69ff070272bfa4db660445f7",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/neo-brutalist-2.jpg",
    slug: "neo-brutalist-case-2",
    name: "Neo Brutalist Case",
    tagline: "Form follows feeling",
    description: "Neo Brutalist Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69ff070272bfa4db660445f7/103561/101039/neo-brutalist-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-22",
  },
  {
    id: "coastal-grandmother-case-2",
    printifyId: "69ff07028ba38b1dae06d0d0",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/coastal-grandmother-2.jpg",
    slug: "coastal-grandmother-case-2",
    name: "Coastal Grandmother Case",
    tagline: "Comfort elevated",
    description: "Coastal Grandmother Case — premium tough phone case by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/69ff07028ba38b1dae06d0d0/103561/101039/coastal-grandmother-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-23",
  },
  {
    id: "celestial-witch-dark-case",
    printifyId: "6a03c1827f5b0b906707e079",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/3572dfa0-ae0b-44b4-bd0d-fa48dcc35e6b",
    slug: "celestial-witch-dark-case",
    name: "Celestial Witch Dark Case",
    tagline: "The dark side of magic",
    description: "Celestial Witch Dark Case — premium product by Caselle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/3572dfa0-ae0b-44b4-bd0d-fa48dcc35e6b"]
    },
    featured: false,
    createdAt: "2026-05-24",
  },
  {
    id: "matisse-abstract-art-phone-case",
    printifyId: "6a04e5f6efbe648ab30c80a9",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/76c50bfc-5f14-47c0-a9a7-cd6164b93fe4",
    slug: "matisse-abstract-art-phone-case",
    name: "Matisse Abstract Art Phone Case",
    tagline: "Wearable art for your phone",
    description: "Bold Matisse-inspired cut-out shapes and primary color blocks. Abstract organic forms in vivid red, blue, yellow and black. A wearable piece of art for your phone.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#E63012" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/76c50bfc-5f14-47c0-a9a7-cd6164b93fe4"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "clean-girl-morandi-phone-case",
    printifyId: "6a04e60db14e025c990e9c51",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/b2818810-e556-488e-8f00-a804e7704e1a",
    slug: "clean-girl-morandi-phone-case",
    name: "Clean Girl Morandi Phone Case",
    tagline: "Muted tones, maximum aesthetic",
    description: "Muted Morandi palette meets minimal design. Sage green, clay, haze blue and dusty rose — the frosted aesthetic for the clean girl era.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2599,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#A8B5A2" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/b2818810-e556-488e-8f00-a804e7704e1a"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "fruity-coquette-cherry-phone-case",
    printifyId: "6a04e620c83dedc748055de4",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/f4e18a07-8a66-4d86-acbf-f32e345b44d8",
    slug: "fruity-coquette-cherry-phone-case",
    name: "Fruity Coquette Cherry Phone Case",
    tagline: "Sweet summer energy",
    description: "Sweet cherry and strawberry motifs with a coquette cottagecore twist. Made for the girls who want their phone to match their summer energy.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2499,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#FF6B9D" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/f4e18a07-8a66-4d86-acbf-f32e345b44d8"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "brutalist-minimal-phone-case",
    printifyId: "6a04e633b0d9387dda0ffde4",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/755fda29-8191-4b50-a24d-358a54d34b69",
    slug: "brutalist-minimal-phone-case",
    name: "Brutalist Minimal Phone Case",
    tagline: "Industrial poetry",
    description: "Concrete textures meet asymmetric geometry. Matte industrial design for those who see beauty in intentional rawness.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2699,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#5C5C5C" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/755fda29-8191-4b50-a24d-358a54d34b69"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "dark-academia-revival-phone-case",
    printifyId: "6a04e647b14e025c990e9c71",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/801de8a7-d966-43bd-9a52-719141982ec2",
    slug: "dark-academia-revival-phone-case",
    name: "Dark Academia Revival Phone Case",
    tagline: "Candlelit libraries, worn leather",
    description: "Warm dark academia for the new era — aged parchment, candlelit libraries, worn leather and ink-stained pages. Less gothic, more soul.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2699,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#6B4F2A" }],
    images: {
      "default": ["https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/801de8a7-d966-43bd-9a52-719141982ec2"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCollection(collectionSlug: string) {
  if (collectionSlug === "bestsellers") {
    return products.filter((p) => p.badge === "bestseller")
  }
  return products.filter((p) => p.collectionSlugs.includes(collectionSlug))
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}
