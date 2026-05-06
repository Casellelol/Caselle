"use client"

type Props = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function QuantityInput({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center border border-[#E2DDD6] w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 flex items-center justify-center text-[#8C8880] hover:text-[#1A1A18] transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 h-10 flex items-center justify-center font-sans text-sm text-[#1A1A18]">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 flex items-center justify-center text-[#8C8880] hover:text-[#1A1A18] transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
