import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/layout/CartDrawer"
import EmailCaptureBanner from "@/components/layout/EmailCaptureBanner"

const SITE_URL = "https://caselle.store"
const OG_IMAGE = "https://images-api.printify.com/mockup/69fe63e9f0f38ff1d503b486/103561/101039/cherry-red-quiet-luxury-phone-case.jpg?camera_label=front"

export const metadata: Metadata = {
  title: {
    default: "Caselle — Premium Phone Cases",
    template: "%s — Caselle",
  },
  description: "Premium aesthetic phone cases made to order. Dark academia, celestial, quiet luxury, and more. Ships in 3–7 days.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "Caselle",
    title: "Caselle — Premium Phone Cases",
    description: "Premium aesthetic phone cases made to order. Dark academia, celestial, quiet luxury, and more.",
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 900, alt: "Caselle phone cases" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caselle — Premium Phone Cases",
    description: "Premium aesthetic phone cases made to order.",
    images: [OG_IMAGE],
  },
  verification: {
    google: "FHnQXB3xip0ci4aZjVzOhc00wa4f8Y7UUwquALNbvNU",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] text-[#1A1A18]">
        <Header />
        <CartDrawer />
        <main className="pt-14">{children}</main>
        <EmailCaptureBanner />
        <Footer />
      </body>
    </html>
  )
}
