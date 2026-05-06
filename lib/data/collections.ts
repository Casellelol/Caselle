import type { Collection } from "@/types/collection"

export const collections: Collection[] = [
  {
    id: "col-iphone-17",
    slug: "iphone-17",
    name: "iPhone 17 Cases",
    headline: "Designed for iPhone 17",
    description: "Premium cases crafted for every iPhone 17 model. Minimalist designs that protect without compromise.",
    coverImage: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80",
    deviceSeriesFilter: "iPhone 17 Series",
    sortOrder: 1,
  },
  {
    id: "col-iphone-16",
    slug: "iphone-16",
    name: "iPhone 16 Cases",
    headline: "Designed for iPhone 16",
    description: "Slim, protective cases for the iPhone 16 lineup. Every detail considered.",
    coverImage: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=80",
    deviceSeriesFilter: "iPhone 16 Series",
    sortOrder: 2,
  },
  {
    id: "col-iphone-15",
    slug: "iphone-15",
    name: "iPhone 15 Cases",
    headline: "Designed for iPhone 15",
    description: "Refined cases for iPhone 15. Where protection meets aesthetic.",
    coverImage: "https://images.unsplash.com/photo-1587840171670-8b850147754e?w=1200&q=80",
    deviceSeriesFilter: "iPhone 15 Series",
    sortOrder: 3,
  },
  {
    id: "col-samsung-s25",
    slug: "samsung-s25",
    name: "Galaxy S25 Cases",
    headline: "Designed for Galaxy S25",
    description: "Precision-fit cases for the Samsung Galaxy S25 series.",
    coverImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80",
    deviceSeriesFilter: "Galaxy S25 Series",
    sortOrder: 4,
  },
  {
    id: "col-pixel-9",
    slug: "pixel-9",
    name: "Pixel 9 Cases",
    headline: "Designed for Pixel 9",
    description: "Clean, minimal cases built for Google Pixel 9.",
    coverImage: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=1200&q=80",
    deviceSeriesFilter: "Pixel 9 Series",
    sortOrder: 5,
  },
  {
    id: "col-bestsellers",
    slug: "bestsellers",
    name: "Bestsellers",
    headline: "Our Most Loved Designs",
    description: "The cases our customers keep coming back for.",
    coverImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80",
    deviceSeriesFilter: "",
    sortOrder: 0,
  },
]

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug)
}
