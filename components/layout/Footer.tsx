import Link from "next/link"
import { collections } from "@/lib/data/collections"

const shopLinks = collections
  .filter((c) => c.slug !== "bestsellers")
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .concat(collections.filter((c) => c.slug === "bestsellers"))

const infoLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact", href: "mailto:the3vka@gmail.com" },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#E2DDD6] bg-[#F4F2EE] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="font-serif text-xl tracking-[0.15em] text-[#1A1A18] uppercase mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Caselle
          </p>
          <p className="font-sans text-sm text-[#8C8880] leading-relaxed max-w-xs">
            Premium phone cases. Designed with restraint, made on demand, shipped to you.
          </p>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-4">Shop</p>
          <ul className="space-y-2">
            {shopLinks.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="font-sans text-sm text-[#8C8880] hover:text-[#1A1A18] transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-4">Info</p>
          <ul className="space-y-2">
            {infoLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-sans text-sm text-[#8C8880] hover:text-[#1A1A18] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E2DDD6] py-6 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs text-[#8C8880]">© 2026 Caselle. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="font-sans text-xs text-[#8C8880] hover:text-[#1A1A18] transition-colors">Privacy</Link>
          <Link href="/terms" className="font-sans text-xs text-[#8C8880] hover:text-[#1A1A18] transition-colors">Terms</Link>
          <p className="font-sans text-xs text-[#8C8880]">Fulfilled by Printify · Made to order</p>
        </div>
      </div>
    </footer>
  )
}
