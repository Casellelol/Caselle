import Link from "next/link"
import Button from "@/components/ui/Button"

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#F7F4EF] px-6">
      <div className="text-center max-w-2xl">
        <h1
          className="font-serif text-5xl md:text-7xl text-[#1A1A18] leading-tight mb-6"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}
        >
          Cases worth keeping
        </h1>
        <p className="font-sans text-sm text-[#8C8880] leading-relaxed mb-10 max-w-md mx-auto">
          Premium phone cases in minimal designs. Print-on-demand, fulfilled automatically, delivered to your door.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/collections/bestsellers">
            <Button variant="primary" size="lg">Shop Now</Button>
          </Link>
          <Link href="/collections/bestsellers">
            <Button variant="outline" size="lg">Bestsellers</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
