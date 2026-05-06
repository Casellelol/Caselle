"use client"
import { useCartStore } from "@/lib/store/cart"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import EmptyCart from "@/components/cart/EmptyCart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getItemCount, getSubtotal } = useCartStore()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1
        className="font-serif text-4xl text-[#1A1A18] mb-10"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Your Cart
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 divide-y divide-[#E2DDD6]">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>
          <div className="md:col-span-1">
            <CartSummary subtotal={getSubtotal()} itemCount={getItemCount()} />
          </div>
        </div>
      )}
    </div>
  )
}
