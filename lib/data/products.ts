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
    printifyId: "6a04f286cfd24d7595085e26",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/dark-academia.jpg",
    slug: "dark-academia-phone-case",
    name: "Dark Academia Phone Case",
    tagline: "Books, candles, and consequence",
    description: "Dark academia aesthetic with vintage books, botanical illustrations, and candlelit atmosphere. Rich amber tones and classic literary charm.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#6B4F2A" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f286cfd24d7595085e26/103561/101039/dark-academia-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-09",
  },
  {
    id: "booktok-romantasy-phone-case",
    printifyId: "6a04f2dd40ee4b37d0041292",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/booktok-romantasy.jpg",
    slug: "booktok-romantasy-phone-case",
    name: "BookTok Romantasy Phone Case",
    tagline: "For the girls who finish series in one sitting",
    description: "Fantasy romance aesthetic with dragons, enchanted forests, and magical elements for book lovers.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "bestseller",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#4B0082" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f2dd40ee4b37d0041292/103561/101039/booktok-romantasy-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-10",
  },
  {
    id: "coastal-grandmother-phone-case",
    printifyId: "6a04f337963577f6d9077200",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/coastal-grandmother.jpg",
    slug: "coastal-grandmother-phone-case",
    name: "Coastal Grandmother Case",
    tagline: "Linen, light, and sea salt air",
    description: "Coastal grandmother aesthetic with seashells, botanicals, and nautical charm in soft sage and cream.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    badge: "new",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#8FAF9A" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f337963577f6d9077200/103561/101039/coastal-grandmother-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-11",
  },
  {
    id: "coquette-cherry-bow-phone-case",
    printifyId: "6a04f6075540b782e103e732",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/coquette-cherry-bow.jpg",
    slug: "coquette-cherry-bow-phone-case",
    name: "Coquette Cherry Bow Phone Case",
    tagline: "Sweet with an edge",
    description: "Ultra-feminine coquette aesthetic with oversized satin bows, cherries, pearls, and pastel romance.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    badge: "new",
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#FFB6C1" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f6075540b782e103e732/103561/101039/coquette-cherry-bow-phone-case.jpg?camera_label=front"]
    },
    featured: true,
    createdAt: "2026-05-12",
  },
  {
    id: "pressed-wildflower-dark-academia-case",
    printifyId: "6a04f661afb8c5abaa09e75d",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/pressed-wildflower.jpg",
    slug: "pressed-wildflower-dark-academia-case",
    name: "Pressed Wildflower Dark Academia Case",
    tagline: "Preserved beauty",
    description: "Herbarium-style pressed wildflower design on vintage parchment for the botanical dark academia lover.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#C8B89A" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f661afb8c5abaa09e75d/103561/101039/pressed-wildflower-dark-academia-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-14",
  },
  {
    id: "celestial-witch-case",
    printifyId: "6a04f6bbafb8c5abaa09e776",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/celestial-witch.jpg",
    slug: "celestial-witch-case",
    name: "Celestial Witch Case",
    tagline: "Aligned with the stars",
    description: "Celestial witchy aesthetic with moons, stars, black cats, and mystical symbols in deep purple and gold.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#4B0082" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f6bbafb8c5abaa09e776/103561/101039/celestial-witch-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-16",
  },
  {
    id: "quiet-luxury-monogram-phone-case",
    printifyId: "6a04f715840084100608a7ca",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/quiet-luxury-monogram.jpg",
    slug: "quiet-luxury-monogram-phone-case",
    name: "Quiet Luxury Monogram Phone Case",
    tagline: "Understated. Unmistakable.",
    description: "Quiet luxury aesthetic with gold leaf botanicals, delicate line art, and sophisticated champagne tones.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#C9A96E" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f715840084100608a7ca/103561/101039/quiet-luxury-monogram-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-18",
  },
  {
    id: "tomato-girl-summer-phone-case",
    printifyId: "6a04f3ebafb8c5abaa09e657",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/tomato-girl.jpg",
    slug: "tomato-girl-summer-phone-case",
    name: "Tomato Girl Summer Phone Case",
    tagline: "Sun-soaked and unapologetic",
    description: "Tomato girl summer aesthetic with lush red tomatoes, sunflowers, and Italian garden vibes.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "trending"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#CC2200" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f3ebafb8c5abaa09e657/103561/101039/tomato-girl-summer-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-19",
  },
  {
    id: "warm-stone-arch-phone-case",
    printifyId: "6a04f44599858a661f07feeb",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/warm-stone-arch.jpg",
    slug: "warm-stone-arch-phone-case",
    name: "Warm Stone Arch Case",
    tagline: "Architecture of calm",
    description: "Mediterranean architecture with terracotta arches, climbing bougainvillea, and warm sunset tones.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "quiet-luxury"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#C47A3A" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f44599858a661f07feeb/103561/101039/warm-stone-arch-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-20",
  },
  {
    id: "neo-brutalist-phone-case",
    printifyId: "6a04f49f40ee4b37d0041346",
    printFile: "https://raw.githubusercontent.com/Casellelol/Caselle/main/public/designs/neo-brutalist.jpg",
    slug: "neo-brutalist-phone-case",
    name: "Neo-Brutalist Case",
    tagline: "Structure as statement",
    description: "Bold neo-brutalist graphic design with high-contrast geometry and Swiss design sensibility.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#1A1A18" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f49f40ee4b37d0041346/103561/101039/neo-brutalist-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-21",
  },
  {
    id: "celestial-witch-dark-case",
    printifyId: "6a03c1827f5b0b906707e079",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/3572dfa0-ae0b-44b4-bd0d-fa48dcc35e6b",
    slug: "celestial-witch-dark-case",
    name: "Celestial Witch Dark Case",
    tagline: "The dark side of magic",
    description: "The darker sister of the Celestial Witch. Deep midnight tones, silver moons, and shadowed celestial symbols for those who prefer their magic without the sparkle.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 3499,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#F5F2EE" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a03c1827f5b0b906707e079/103561/101039/celestial-witch-dark-case.jpg?camera_label=front"]
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
      "default": ["https://images-api.printify.com/mockup/6a04e5f6efbe648ab30c80a9/103561/101039/matisse-abstract-art-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "clean-girl-morandi-phone-case",
    printifyId: "6a04f5ac40ee4b37d00413ab",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/b2818810-e556-488e-8f00-a804e7704e1a",
    slug: "clean-girl-morandi-phone-case",
    name: "Clean Girl Morandi Phone Case",
    tagline: "Muted tones, maximum aesthetic",
    description: "Morandi palette clean girl aesthetic with muted tones, abstract organic shapes, and editorial sophistication.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2599,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#A8B5A2" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f5ac40ee4b37d00413ab/103561/101039/clean-girl-morandi-phone-case.jpg?camera_label=front"]
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
      "default": ["https://images-api.printify.com/mockup/6a04e620c83dedc748055de4/103561/101039/fruity-coquette-cherry-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "brutalist-minimal-phone-case",
    printifyId: "6a04f553ebaa7af8c40abf8c",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/755fda29-8191-4b50-a24d-358a54d34b69",
    slug: "brutalist-minimal-phone-case",
    name: "Brutalist Architecture Case",
    tagline: "Industrial poetry",
    description: "Raw brutalist architecture aesthetic with bold concrete textures and geometric patterns.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2699,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#5C5C5C" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f553ebaa7af8c40abf8c/103561/101039/brutalist-minimal-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "dark-academia-revival-phone-case",
    printifyId: "6a04f4f9afb8c5abaa09e6cb",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/801de8a7-d966-43bd-9a52-719141982ec2",
    slug: "dark-academia-revival-phone-case",
    name: "Dark Academia Revival Phone Case",
    tagline: "Candlelit libraries, worn leather",
    description: "Ancient library interior with gothic windows, candlelit bookshelves, and scholarly atmosphere in warm sepia tones.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2699,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#6B4F2A" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04f4f9afb8c5abaa09e6cb/103561/101039/dark-academia-revival-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "van-gogh-swirl-phone-case",
    printifyId: "6a04ea545540b782e103e200",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/290c1db7-01e5-47c8-aa02-26d245c2e2d3",
    slug: "van-gogh-swirl-phone-case",
    name: "Van Gogh Swirl Phone Case",
    tagline: "Wearable impressionism",
    description: "Swirling oil-painting texture inspired by Starry Night. Deep midnight blue, gold and teal brushstrokes covering every inch. Wearable impressionism.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#1B3A6B" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea545540b782e103e200/103561/101039/van-gogh-swirl-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "william-morris-floral-phone-case",
    printifyId: "6a04ea60efbe648ab30c82fd",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/a03dd706-10cf-4acf-b3ae-d5fbaf1baf04",
    slug: "william-morris-floral-phone-case",
    name: "William Morris Floral Phone Case",
    tagline: "Victorian botanical maximalism",
    description: "Dense Victorian botanical pattern inspired by William Morris. Interlocking leaves, blooms and vines covering the entire case in rich jewel tones.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2899,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#2D5016" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea60efbe648ab30c82fd/103561/101039/william-morris-floral-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "mystic-cat-oracle-phone-case",
    printifyId: "6a04ea6e40ee4b37d0040e8a",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/2df3d4a5-e5d8-4722-a23f-61abc9695d15",
    slug: "mystic-cat-oracle-phone-case",
    name: "Mystic Cat Oracle Phone Case",
    tagline: "Dark and enchanting",
    description: "A detailed illustration of a mystical black cat surrounded by crescent moons, celestial orbs and glowing stars. Dark and enchanting.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#1A0A2E" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea6e40ee4b37d0040e8a/103561/101039/mystic-cat-oracle-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "klimt-golden-woman-phone-case",
    printifyId: "6a04ea7cb14e025c990e9eac",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/1c1b1287-62db-43ff-8e5f-e620562ed94f",
    slug: "klimt-golden-woman-phone-case",
    name: "Klimt Golden Woman Phone Case",
    tagline: "Art Nouveau in gold",
    description: "Art Nouveau gold leaf pattern inspired by Gustav Klimt. Ornate geometric shapes, spirals and a woman silhouette in shimmering gold and jewel tones.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2999,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#C9A96E" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea7cb14e025c990e9eac/103561/101039/klimt-golden-woman-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "tarot-moon-card-phone-case",
    printifyId: "6a04ea899c35c408d201de64",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/a542cc33-d502-43f4-b572-5613d255a13b",
    slug: "tarot-moon-card-phone-case",
    name: "Tarot Moon Card Phone Case",
    tagline: "Mystical and ornate",
    description: "A detailed tarot card illustration of The Moon. Mystical night scene with a glowing moon, howling wolves and a crawfish emerging from the deep.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2899,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9", "dark-aesthetic"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#1E1B4B" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea899c35c408d201de64/103561/101039/tarot-moon-card-phone-case.jpg?camera_label=front"]
    },
    featured: false,
    createdAt: "2026-05-13",
  },
  {
    id: "mushroom-cottage-core-phone-case",
    printifyId: "6a04ea97b796133c9d07b984",
    printFile: "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/941fa837-884d-455f-ad06-57a3b0765864",
    slug: "mushroom-cottage-core-phone-case",
    name: "Mushroom Cottage Core Phone Case",
    tagline: "Whimsical woodland dream",
    description: "A whimsical detailed illustration of giant mushrooms, tiny fairy doors, flowers and woodland creatures. The ultimate cottagecore dream.",
    materials: "Premium polycarbonate shell with soft-touch matte coating. 1.5mm raised edges protect screen and camera. Wireless charging compatible.",
    basePrice: 2799,
    badge: "new" as const,
    collectionSlugs: ["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"],
    compatibleModels: allModels,
    designs: [{ id: "default", name: "Original Design", type: "pattern" as const, swatch: "#5C7A3E" }],
    images: {
      "default": ["https://images-api.printify.com/mockup/6a04ea97b796133c9d07b984/103561/101039/mushroom-cottage-core-phone-case.jpg?camera_label=front"]
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
