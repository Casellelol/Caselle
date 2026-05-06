import Link from "next/link"
import Button from "@/components/ui/Button"

export default function EmptyCart({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
      <div className="w-12 h-12 border border-[#E2DDD6] rounded-full flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C8880" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className="font-serif text-lg text-[#1A1A18] mb-1" style={{ fontFamily: "Georgia, serif" }}>Your cart is empty</p>
      <p className="font-sans text-sm text-[#8C8880] mb-6">Find a case you love.</p>
      <Link href="/collections/iphone-17" onClick={onClose}>
        <Button variant="primary">Shop Now</Button>
      </Link>
    </div>
  )
}
