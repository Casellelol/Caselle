import type { Product } from "@/types/product"
import ProductCard from "@/components/collection/ProductCard"
import Link from "next/link"
import Button from "@/components/ui/Button"

export default function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <h2
          className="font-serif text-3xl text-[#1A1A18]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Featured Designs
        </h2>
        <Link href="/collections/bestsellers">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, i) => (
          <div key={product.id} className={i === 0 ? "row-span-2" : ""}>
            <ProductCard product={product} size={i === 0 ? "featured" : "default"} />
          </div>
        ))}
      </div>
    </section>
  )
}
