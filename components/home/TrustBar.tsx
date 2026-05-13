const items = [
  { icon: "✦", text: "Free shipping over $35" },
  { icon: "✦", text: "Printed on demand" },
  { icon: "✦", text: "30-day returns" },
  { icon: "✦", text: "Ships in 3–7 days" },
]

export default function TrustBar() {
  return (
    <div className="border-y border-[#E2DDD6] bg-[#F4F2EE] py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-2">
            <span className="text-[#C9A96E] text-[10px]">{item.icon}</span>
            <span className="font-sans text-xs uppercase tracking-[0.1em] text-[#8C8880]">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
