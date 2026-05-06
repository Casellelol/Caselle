"use client"
import { useState } from "react"
import { useCartStore } from "@/lib/store/cart"
import { formatPrice } from "@/lib/utils/formatPrice"
import Button from "@/components/ui/Button"
import Image from "next/image"

type Form = {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  country: string
  postal: string
}

const empty: Form = { email: "", firstName: "", lastName: "", address: "", city: "", country: "US", postal: "" }

export default function CheckoutPage() {
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore()
  const [form, setForm] = useState<Form>(empty)
  const [placed, setPlaced] = useState(false)

  const field = (key: keyof Form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPlaced(true)
    clearCart()
  }

  if (placed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-4xl mb-4">✦</p>
        <h1 className="font-serif text-3xl text-[#1A1A18] mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Order Received
        </h1>
        <p className="font-sans text-sm text-[#8C8880]">
          Thank you. Your order has been placed and will be fulfilled within 24 hours.
        </p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="font-serif text-2xl text-[#1A1A18]" style={{ fontFamily: "Georgia, serif" }}>
          Your cart is empty
        </p>
      </div>
    )
  }

  const inputClass = "w-full border border-[#E2DDD6] bg-transparent px-3 py-2.5 font-sans text-sm text-[#1A1A18] placeholder-[#C8C2B8] focus:outline-none focus:border-[#1A1A18] transition-colors"

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-[#1A1A18] mb-10" style={{ fontFamily: "Georgia, serif" }}>
        Checkout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-3">Contact</p>
            <input placeholder="Email address" required type="email" className={inputClass} {...field("email")} />
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-3">Shipping</p>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="First name" required className={inputClass} {...field("firstName")} />
                <input placeholder="Last name" required className={inputClass} {...field("lastName")} />
              </div>
              <input placeholder="Address" required className={inputClass} {...field("address")} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="City" required className={inputClass} {...field("city")} />
                <input placeholder="Postal code" required className={inputClass} {...field("postal")} />
              </div>
              <select required className={inputClass} {...field("country")}>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary" fullWidth size="lg">
            Place Order
          </Button>
          <p className="font-sans text-xs text-[#8C8880] text-center">
            Orders fulfilled by Printify within 24h
          </p>
        </form>

        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-4">
            Order Summary
          </p>
          <div className="divide-y divide-[#E2DDD6]">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 py-3">
                <div className="w-12 h-12 bg-[#F4F2EE] relative flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-[#1A1A18]" style={{ fontFamily: "Georgia, serif" }}>{item.productName}</p>
                  <p className="font-sans text-xs text-[#8C8880]">{item.designName} · {item.modelName} · ×{item.quantity}</p>
                </div>
                <p className="font-sans text-sm text-[#1A1A18]">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E2DDD6] pt-4 mt-2 flex justify-between font-sans text-sm">
            <span className="text-[#8C8880]">Subtotal ({getItemCount()} items)</span>
            <span className="text-[#1A1A18] font-medium">{formatPrice(getSubtotal())}</span>
          </div>
          <p className="font-sans text-xs text-[#8C8880] mt-2">Shipping calculated after order placement</p>
        </div>
      </div>
    </div>
  )
}
