import Link from "next/link"
import Image from "next/image"
import type { Collection } from "@/types/collection"

export default function FeaturedCollections({ collections }: { collections: Collection[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2
        className="font-serif text-3xl text-[#1A1A18] mb-10 text-center"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Shop by Device
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {collections.filter(c => c.slug !== "bestsellers").map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group">
            <div className="aspect-square bg-[#F4F2EE] relative overflow-hidden mb-3">
              <Image
                src={collection.coverImage}
                alt={collection.name}
                fill
                className="object-cover opacity-70 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
              />
            </div>
            <p className="font-serif text-sm text-[#1A1A18] group-hover:text-[#C9A96E] transition-colors" style={{ fontFamily: "Georgia, serif" }}>
              {collection.name}
            </p>
            <p className="font-sans text-xs text-[#C9A96E] mt-0.5">Shop →</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
