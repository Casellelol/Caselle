import Link from "next/link"
import { collections } from "@/lib/data/collections"

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconPinterest() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  )
}

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
          <div className="flex items-center gap-4 mt-5">
            <a
              href="https://instagram.com/caselle.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C8880] hover:text-[#1A1A18] transition-colors"
              aria-label="Caselle on Instagram"
            >
              <IconInstagram />
            </a>
            <a
              href="https://pinterest.com/caselleco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C8880] hover:text-[#1A1A18] transition-colors"
              aria-label="Caselle on Pinterest"
            >
              <IconPinterest />
            </a>
          </div>
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
