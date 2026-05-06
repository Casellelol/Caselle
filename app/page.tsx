import Hero from "@/components/home/Hero"
import TrustBar from "@/components/home/TrustBar"
import FeaturedCollections from "@/components/home/FeaturedCollections"
import ProductShowcase from "@/components/home/ProductShowcase"
import { collections } from "@/lib/data/collections"
import { getFeaturedProducts } from "@/lib/data/products"

export default function HomePage() {
  const featured = getFeaturedProducts()
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedCollections collections={collections} />
      <ProductShowcase products={featured} />
    </>
  )
}
