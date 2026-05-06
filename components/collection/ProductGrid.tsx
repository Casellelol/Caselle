import type { Product } from "@/types/product"
import ProductCard from "./ProductCard"

type Props = {
  products: Product[]
  columns?: 2 | 3 | 4
}

const gridCols: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
}

export default function ProductGrid({ products, columns = 3 }: Props) {
  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
