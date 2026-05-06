import Link from "next/link"
import { formatPrice } from "@/lib/utils/formatPrice"
import Button from "@/components/ui/Button"

type Props = {
  subtotal: number
  itemCount: number
  onClose?: () => void
}

export default function CartSummary({ subtotal, itemCount, onClose }: Props) {
  return (
    <div className="border-t border-[#E2DDD6] pt-4 space-y-4">
      <div className="flex justify-between font-sans text-sm">
        <span className="text-[#8C8880]">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
        <span className="text-[#1A1A18] font-medium">{formatPrice(subtotal)}</span>
      </div>
      <p className="font-sans text-xs text-[#8C8880]">Shipping calculated at checkout</p>
      <Link href="/checkout" onClick={onClose}>
        <Button variant="primary" fullWidth>
          Checkout
        </Button>
      </Link>
      <Link href="/cart" onClick={onClose}>
        <Button variant="outline" fullWidth className="mt-2">
          View Cart
        </Button>
      </Link>
    </div>
  )
}
