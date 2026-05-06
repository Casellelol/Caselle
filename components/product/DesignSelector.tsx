"use client"
import type { DesignVariant } from "@/types/product"

type Props = {
  designs: DesignVariant[]
  selectedDesignId: string
  onChange: (designId: string) => void
}

export default function DesignSelector({ designs, selectedDesignId, onChange }: Props) {
  const selected = designs.find((d) => d.id === selectedDesignId)

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] mb-1">
        Colour — <span className="text-[#8C8880] normal-case tracking-normal">{selected?.name}</span>
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {designs.map((design) => (
          <button
            key={design.id}
            onClick={() => onChange(design.id)}
            title={design.name}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              selectedDesignId === design.id
                ? "border-[#1A1A18] scale-110"
                : "border-transparent hover:border-[#C8C2B8]"
            }`}
            style={{ backgroundColor: design.swatch }}
          />
        ))}
      </div>
    </div>
  )
}
