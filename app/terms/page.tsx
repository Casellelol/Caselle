export const metadata = {
  title: 'Terms of Service — Caselle',
  description: 'Terms of Service for Caselle',
}

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: May 7, 2026</p>

      <section className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
          <p>By using the Caselle website and placing an order, you agree to these terms. Caselle is an online store selling phone cases via print-on-demand fulfillment.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. Orders & Payment</h2>
          <p>All prices are listed in USD. Payments are processed securely via Stripe. Your order is confirmed once payment is successfully completed. We reserve the right to cancel orders at our discretion.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Shipping</h2>
          <p>Orders are fulfilled and shipped by our print partner within 3–7 business days. Delivery times vary by location. We are not responsible for delays caused by carriers or customs.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">4. Returns & Refunds</h2>
          <p>As all products are made to order, we do not accept returns unless the item is defective or damaged on arrival. Contact us within 14 days of delivery with a photo of the issue and we will arrange a replacement or refund.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">5. Intellectual Property</h2>
          <p>All designs, images, and content on this site are owned by Caselle. You may not reproduce or use them without written permission.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">6. Limitation of Liability</h2>
          <p>Caselle is not liable for any indirect or consequential damages arising from the use of our products or website.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">7. Contact</h2>
          <p>For any questions regarding these terms: <a href="mailto:the3vka@gmail.com" className="underline">the3vka@gmail.com</a></p>
        </div>
      </section>
    </main>
  )
}
