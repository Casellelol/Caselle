import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils/formatPrice"
import Badge from "@/components/ui/Badge"
import type { Product } from "@/types/product"

type Props = {
  product: Product
  size?: "default" | "featured"
}

export default function ProductCard({ product, size = "default" }: Props) {
  const firstDesign = product.designs[0]
  const image = product.images[firstDesign?.id]?.[0] ?? ""

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className={`relative overflow-hidden bg-[#F4F2EE] mb-3 ${
          size === "featured" ? "aspect-[3/4]" : "aspect-square"
        }`}
      >
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover scale-[1.12] transition-transform duration-500 group-hover:scale-[1.18]"
          />
        )}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge type={product.badge} />
          </div>
        )}
      </div>
      <p className="font-serif text-base text-[#1A1A18] mb-0.5 group-hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "Georgia, serif" }}>
        {product.name}
      </p>
      <p className="font-sans text-xs text-[#8C8880] mb-1">{product.tagline}</p>
      <p className="font-sans text-sm text-[#1A1A18]">{formatPrice(product.basePrice)}</p>
    </Link>
  )
}
