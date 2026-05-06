"use client"
import { useCartStore } from "@/lib/store/cart"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import EmptyCart from "@/components/cart/EmptyCart"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getItemCount, getSubtotal } = useCartStore()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FAFAF8] z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD6]">
          <h2 className="font-serif text-lg tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Cart
          </h2>
          <button
            onClick={closeCart}
            className="text-[#8C8880] hover:text-[#1A1A18] transition-colors text-xl font-thin"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <div className="divide-y divide-[#E2DDD6]">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E2DDD6]">
            <CartSummary
              subtotal={getSubtotal()}
              itemCount={getItemCount()}
              onClose={closeCart}
            />
          </div>
        )}
      </div>
    </>
  )
}
