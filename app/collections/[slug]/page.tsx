import { notFound } from "next/navigation"
import { collections, getCollectionBySlug } from "@/lib/data/collections"
import { getProductsByCollection } from "@/lib/data/products"
import CollectionHero from "@/components/collection/CollectionHero"
import ProductGrid from "@/components/collection/ProductGrid"

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) return {}
  return {
    title: collection.name,
    description: `Shop ${collection.name} phone cases at Caselle. Premium aesthetic cases made to order, ships in 3–7 days.`,
    openGraph: {
      title: `${collection.name} — Caselle`,
      description: `Shop ${collection.name} phone cases at Caselle. Premium aesthetic cases made to order.`,
      type: "website",
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) notFound()

  const products = getProductsByCollection(slug)

  return (
    <div>
      <CollectionHero collection={collection} productCount={products.length} />
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {products.length === 0 ? (
          <p className="font-sans text-sm text-[#8C8880] text-center py-16">No designs yet.</p>
        ) : (
          <ProductGrid products={products} columns={3} />
        )}
      </div>
    </div>
  )
}
