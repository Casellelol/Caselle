import Link from "next/link"
import Button from "@/components/ui/Button"

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#F7F4EF] px-6">
      <div className="text-center max-w-2xl">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#C9A96E] mb-6">
          Made to order · Ships in 3–7 days
        </p>
        <h1
          className="font-serif text-5xl md:text-7xl text-[#1A1A18] leading-tight mb-6"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}
        >
          Cases worth keeping
        </h1>
        <p className="font-sans text-sm text-[#8C8880] leading-relaxed mb-10 max-w-md mx-auto">
          Premium phone cases built for the aesthetic you&apos;ve been curating. Dark academia, celestial, quiet luxury — designed with intention.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/collections/bestsellers">
            <Button variant="primary" size="lg">Shop All Cases</Button>
          </Link>
          <Link href="/collections/dark-aesthetic">
            <Button variant="outline" size="lg">Dark Aesthetic</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
