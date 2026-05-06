"use client"
import { use } from "react"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { products, getProductBySlug } from "@/lib/data/products"
import ProductGallery from "@/components/product/ProductGallery"
import DeviceSelector from "@/components/product/DeviceSelector"
import DesignSelector from "@/components/product/DesignSelector"
import AddToCartButton from "@/components/product/AddToCartButton"
import Accordion from "@/components/ui/Accordion"
import Badge from "@/components/ui/Badge"
import QuantityInput from "@/components/ui/QuantityInput"
import { formatPrice } from "@/lib/utils/formatPrice"

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const [selectedModelId, setSelectedModelId] = useState("")
  const [selectedDesignId, setSelectedDesignId] = useState(product.designs[0]?.id ?? "")
  const [quantity, setQuantity] = useState(1)

  const firstImages = product.images[selectedDesignId] ?? Object.values(product.images)[0] ?? []

  const accordionItems = [
    { title: "Description", content: product.description },
    { title: "Materials & Quality", content: product.materials },
    {
      title: "Shipping & Returns",
      content: "Printed on demand and shipped within 24 hours. Free standard shipping on orders over $35. Returns accepted within 30 days of delivery.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
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

          <DesignSelector
            designs={product.designs}
            selectedDesignId={selectedDesignId}
            onChange={setSelectedDesignId}
          />

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

          <Accordion items={accordionItems} />
        </div>
      </div>
    </div>
  )
}
