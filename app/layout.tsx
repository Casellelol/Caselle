import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/layout/CartDrawer"

export const metadata: Metadata = {
  title: "Caselle — Premium Phone Cases",
  description: "Minimal, premium phone cases made to order. Free shipping. Ships within 24h.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] text-[#1A1A18]">
        <Header />
        <CartDrawer />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
