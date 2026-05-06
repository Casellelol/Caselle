import Image from "next/image"
import type { Collection } from "@/types/collection"

export default function CollectionHero({ collection, productCount }: { collection: Collection; productCount: number }) {
  return (
    <div className="relative h-64 md:h-80 overflow-hidden bg-[#F4F2EE] mb-12">
      {collection.coverImage && (
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="font-serif text-4xl md:text-5xl text-[#1A1A18] mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {collection.headline}
        </h1>
        <p className="font-sans text-sm text-[#8C8880]">
          {productCount} {productCount === 1 ? "design" : "designs"}
        </p>
      </div>
    </div>
  )
}
