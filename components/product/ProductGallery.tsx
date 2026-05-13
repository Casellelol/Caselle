"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

type Props = {
  images: string[]
  productName: string
  activeDesignId: string
  allImages: Record<string, string[]>
}

export default function ProductGallery({ images, productName, activeDesignId, allImages }: Props) {
  const currentImages = allImages[activeDesignId] ?? images
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [activeDesignId])

  const main = currentImages[activeIndex] ?? currentImages[0]

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {currentImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-14 h-14 relative overflow-hidden bg-[#F4F2EE] flex-shrink-0 transition-all ${
              i === activeIndex ? "ring-1 ring-[#1A1A18]" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`${productName} view ${i + 1}`} fill className="object-cover scale-[1.12]" />
          </button>
        ))}
      </div>
      <div className="flex-1 aspect-[3/4] relative overflow-hidden bg-[#F4F2EE]">
        {main && (
          <Image src={main} alt={productName} fill className="object-cover scale-[1.12]" priority />
        )}
      </div>
    </div>
  )
}
