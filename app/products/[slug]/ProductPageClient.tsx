"use client"
import { useState } from "react"
import { products } from "@/lib/data/products"
import ProductGallery from "@/components/product/ProductGallery"
import DeviceSelector from "@/components/product/DeviceSelector"
import DesignSelector from "@/components/product/DesignSelector"
import AddToCartButton from "@/components/product/AddToCartButton"
import Accordion from "@/components/ui/Accordion"
import Badge from "@/components/ui/Badge"
import QuantityInput from "@/components/ui/QuantityInput"
import ProductCard from "@/components/collection/ProductCard"
import { formatPrice } from "@/lib/utils/formatPrice"
import Link from "next/link"
import type { Product } from "@/types/product"

export default function ProductPageClient({ product }: { product: Product }) {
  const [selectedModelId, setSelectedModelId] = useState("")
  const [selectedDesignId, setSelectedDesignId] = useState(product.designs[0]?.id ?? "")
  const [quantity, setQuantity] = useState(1)

  const firstImages = product.images[selectedDesignId] ?? Object.values(product.images)[0] ?? []

  const accordionItems = [
    { title: "Description", content: product.description },
    { title: "Materials & Quality", content: product.materials },
    {
      title: "Shipping & Returns",
      content: "Printed on demand and shipped in 3–7 business days. Free standard shipping on orders over $35. Returns accepted within 30 days of delivery.",
    },
  ]

  // Related products: same first collection, excluding current
  const firstCollection = product.collectionSlugs.find(
    (s) => !["iphone-17", "iphone-16", "iphone-15", "samsung-s25", "pixel-9"].includes(s)
  ) ?? product.collectionSlugs[0]
  const related = products
    .filter((p) => p.id !== product.id && p.collectionSlugs.includes(firstCollection))
    .slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-sans text-xs text-[#8C8880]">
        <Link href="/collections/bestsellers" className="hover:text-[#1A1A18] transition-colors">All Cases</Link>
        <span>›</span>
        <span className="text-[#1A1A18]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery
          images={firstImages}
          productName={product.name}
          activeDesignId={selectedDesignId}
          allImages={product.images}
        />

        <div className="flex flex-col gap-6">
          <div>
            {product.badge && <div className="mb-3"><Badge type={product.badge} /></div>}
            <h1
              className="font-serif text-4xl text-[#1A1A18] mb-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {product.name}
            </h1>
            <p className="font-sans text-sm text-[#8C8880] mb-3">{product.tagline}</p>
            <p className="font-sans text-xl text-[#1A1A18] font-medium">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          <div className="w-full h-px bg-[#E2DDD6]" />

          {product.designs.length > 1 && (
            <DesignSelector
              designs={product.designs}
              selectedDesignId={selectedDesignId}
              onChange={setSelectedDesignId}
            />
          )}

          <DeviceSelector
            compatibleModels={product.compatibleModels}
            selectedModelId={selectedModelId}
            onChange={setSelectedModelId}
          />

          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-3">
              Quantity
            </p>
            <QuantityInput value={quantity} onChange={setQuantity} />
          </div>

          <AddToCartButton
            product={product}
            selectedModelId={selectedModelId}
            selectedDesignId={selectedDesignId}
            quantity={quantity}
          />

          {/* Shipping trust bar */}
          <div className="border border-[#E2DDD6] rounded p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[#8C8880]">✦</span>
              <span className="font-sans text-xs text-[#1A1A18]">Ships in 3–7 business days</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8C8880]">✦</span>
              <span className="font-sans text-xs text-[#1A1A18]">Printed &amp; shipped by SPOKE (USA)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#8C8880]">✦</span>
              <span className="font-sans text-xs text-[#1A1A18]">Free returns within 30 days</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#1A1A18]">🛡</span>
              <span className="font-sans text-xs text-[#1A1A18]">Quality guaranteed — we replace any defective case</span>
            </div>
          </div>

          {/* Frequently bought together */}
          <div className="border border-[#E2DDD6] rounded p-4">
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#8C8880] mb-3">
              Frequently Bought Together
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F5F2EE] rounded flex items-center justify-center text-lg">👜</div>
              <div className="flex-1">
                <p className="font-sans text-sm font-medium text-[#1A1A18]">Caselle Canvas Tote Bag</p>
                <p className="font-sans text-xs text-[#8C8880]">Matching aesthetic — added automatically at checkout</p>
                <p className="font-sans text-sm text-[#1A1A18] mt-1">
                  <span className="line-through text-[#8C8880] mr-1">$18</span>
                  <strong>$12</strong> when ordered with a case
                </p>
              </div>
            </div>
            <p className="font-sans text-xs text-[#8C8880] mt-3">
              Add both to cart — the tote is offered at checkout automatically.
            </p>
          </div>

          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-24 border-t border-[#E2DDD6] pt-16">
          <h2
            className="font-serif text-2xl text-[#1A1A18] mb-8"
            style={{ fontFamily: "Georgia, serif" }}
          >
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
