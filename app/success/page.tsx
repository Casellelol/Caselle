import Link from "next/link"
import Button from "@/components/ui/Button"
import SuccessClearer from "./SuccessClearer"

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <SuccessClearer />
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border border-[#C9A96E] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-[#C9A96E] text-2xl">✓</span>
        </div>
        <h1
          className="font-serif text-4xl text-[#1A1A18] mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Order Confirmed
        </h1>
        <p className="font-sans text-sm text-[#8C8880] leading-relaxed mb-2">
          Thank you for your order. You'll receive a confirmation email shortly.
        </p>
        <p className="font-sans text-sm text-[#8C8880] leading-relaxed mb-8">
          Your case will be printed and shipped within 24–48 hours.
        </p>
        <Link href="/">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
