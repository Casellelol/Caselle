export const metadata = {
  title: 'Privacy Policy — Caselle',
  description: 'Privacy Policy for Caselle',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: May 7, 2026</p>

      <section className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <p>When you place an order we collect your name, email address, shipping address, and payment information. Payment details are processed securely by Stripe and are never stored on our servers.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
          <p>We use your information solely to process and fulfill your order, communicate order updates, and provide customer support. We do not sell or share your personal data with third parties except as required to fulfill your order (e.g. our print and shipping partner).</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Cookies</h2>
          <p>We use cookies to maintain your shopping cart session. No tracking or advertising cookies are used.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">4. Data Retention</h2>
          <p>Order information is retained for up to 2 years for accounting and legal compliance purposes.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at the email below.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
          <p>For any privacy-related questions: <a href="mailto:the3vka@gmail.com" className="underline">the3vka@gmail.com</a></p>
        </div>
      </section>
    </main>
  )
}
