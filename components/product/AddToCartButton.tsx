"use client"
import { useCartStore } from "@/lib/store/cart"
import Button from "@/components/ui/Button"
import { deviceModels } from "@/lib/data/variants"
import type { Product } from "@/types/product"

type Props = {
  product: Product
  selectedModelId: string
  selectedDesignId: string
  quantity: number
}

export default function AddToCartButton({ product, selectedModelId, selectedDesignId, quantity }: Props) {
  const { addItem, openCart } = useCartStore()

  const design = product.designs.find((d) => d.id === selectedDesignId)
  const model = deviceModels.find((m) => m.id === selectedModelId)

  const canAdd = !!selectedModelId && !!selectedDesignId

  const handleAdd = () => {
    if (!canAdd || !design || !model) return
    const image = product.images[selectedDesignId]?.[0] ?? ""
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      designId: selectedDesignId,
      designName: design.name,
      modelId: selectedModelId,
      modelName: model.name,
      quantity,
      unitPrice: product.basePrice,
      image,
    })
    openCart()
  }

  return (
    <div>
      {!selectedModelId && (
        <p className="font-sans text-xs text-[#C9A96E] mb-2">Please select a model to continue</p>
      )}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handleAdd}
        disabled={!canAdd}
      >
        Add to Cart
      </Button>
    </div>
  )
}
