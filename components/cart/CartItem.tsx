import Image from "next/image"
import { formatPrice } from "@/lib/utils/formatPrice"
import type { CartItem as CartItemType } from "@/types/cart"
import QuantityInput from "@/components/ui/QuantityInput"

type Props = {
  item: CartItemType
  onRemove: (id: string) => void
  onQuantityChange: (id: string, qty: number) => void
}

export default function CartItem({ item, onRemove, onQuantityChange }: Props) {
  return (
    <div className="flex gap-4 py-4">
      <div className="w-16 h-16 bg-[#F4F2EE] flex-shrink-0 relative overflow-hidden">
        <Image src={item.image} alt={item.productName} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <p className="font-serif text-sm text-[#1A1A18]" style={{ fontFamily: "Georgia, serif" }}>{item.productName}</p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[#8C8880] hover:text-[#1A1A18] transition-colors text-xs ml-2 flex-shrink-0"
          >
            ✕
          </button>
        </div>
        <p className="font-sans text-xs text-[#8C8880] mb-2">
          {item.designName} · {item.modelName}
        </p>
        <div className="flex items-center justify-between">
          <QuantityInput
            value={item.quantity}
            onChange={(qty) => onQuantityChange(item.id, qty)}
          />
          <p className="font-sans text-sm text-[#1A1A18]">
            {formatPrice(item.unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}
