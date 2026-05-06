import Link from "next/link"

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
            {["iPhone 17", "iPhone 16", "iPhone 15", "Galaxy S25", "Pixel 9", "Bestsellers"].map((name) => {
              const slug = name.toLowerCase().replace(" ", "-")
              return (
                <li key={name}>
                  <Link href={`/collections/${slug}`} className="font-sans text-sm text-[#8C8880] hover:text-[#1A1A18] transition-colors">
                    {name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-4">Info</p>
          <ul className="space-y-2">
            {["About", "Shipping & Returns", "FAQ", "Contact"].map((item) => (
              <li key={item}>
                <span className="font-sans text-sm text-[#8C8880]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E2DDD6] py-6 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs text-[#8C8880]">© 2026 Caselle. All rights reserved.</p>
        <p className="font-sans text-xs text-[#8C8880]">Fulfilled by Printify · Made to order</p>
      </div>
    </footer>
  )
}
