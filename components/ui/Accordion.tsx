"use client"
import { useState } from "react"

type AccordionItem = {
  title: string
  content: string
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-[#E2DDD6]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left font-sans text-xs uppercase tracking-[0.12em] text-[#1A1A18] hover:text-[#C9A96E] transition-colors"
          >
            {item.title}
            <span className="text-lg font-thin">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="pb-4 font-sans text-sm text-[#8C8880] leading-relaxed">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
