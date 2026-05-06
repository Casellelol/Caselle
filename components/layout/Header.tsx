"use client"
import Link from "next/link"
import { useCartStore } from "@/lib/store/cart"
import { collections } from "@/lib/data/collections"

export default function Header() {
  const { getItemCount, openCart } = useCartStore()
  const count = getItemCount()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAF8] border-b border-[#E2DDD6]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.15em] text-[#1A1A18] uppercase"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Caselle
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <div className="group relative">
            <button className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] hover:text-[#C9A96E] transition-colors">
              Shop
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              <div className="bg-[#FAFAF8] border border-[#E2DDD6] shadow-lg p-6 w-48">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    className="block py-1.5 font-sans text-xs text-[#8C8880] hover:text-[#1A1A18] transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/collections/bestsellers" className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] hover:text-[#C9A96E] transition-colors">
            Bestsellers
          </Link>
        </nav>

        <button
          onClick={openCart}
          className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] hover:text-[#C9A96E] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {count > 0 && (
            <span className="bg-[#1A1A18] text-[#FAFAF8] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
