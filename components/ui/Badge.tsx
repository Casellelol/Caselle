type BadgeType = "new" | "bestseller" | "limited"

const styles: Record<BadgeType, string> = {
  new: "bg-[#EDE0C8] text-[#8C6030]",
  bestseller: "bg-[#1A1A18] text-[#FAFAF8]",
  limited: "bg-[#D4A9A1] text-[#5A2A22]",
}

export default function Badge({ type }: { type: BadgeType }) {
  const labels: Record<BadgeType, string> = {
    new: "New",
    bestseller: "Bestseller",
    limited: "Limited",
  }
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] font-sans ${styles[type]}`}
    >
      {labels[type]}
    </span>
  )
}
