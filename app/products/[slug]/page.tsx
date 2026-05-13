import { notFound } from "next/navigation"
import { products, getProductBySlug } from "@/lib/data/products"
import ProductPageClient from "./ProductPageClient"
import type { Metadata } from "next"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  const heroImage = Object.values(product.images)[0]?.[0] ?? ""
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: heroImage ? [{ url: heroImage, width: 1200, height: 900, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: heroImage ? [heroImage] : [],
    },
  }
}

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
