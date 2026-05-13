export const metadata = {
  title: 'Returns & Exchanges — Caselle',
  description: 'Our 30-day return and exchange policy for Caselle phone cases.',
}

export default function ReturnsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <h1
        className="font-serif text-4xl text-[#1A1A18] mb-3"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Returns &amp; Exchanges
      </h1>
      <p className="text-sm text-[#8C8880] mb-12">We want you to love your case.</p>

      <div className="space-y-10 text-[#1A1A18]">

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">Return Window</h2>
          <p className="text-sm leading-relaxed text-[#3A3A38]">
            We accept returns within <strong>30 days</strong> of delivery. Items must be unused and in
            their original condition. Once we receive and inspect your return, a refund will be issued
            to your original payment method within 5–7 business days.
          </p>
        </section>

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">Defective Items</h2>
          <p className="text-sm leading-relaxed text-[#3A3A38]">
            If your case arrives damaged, cracked, or with a print defect, we will replace it or
            refund you in full — at no cost to you. <strong>Return shipping is free</strong> on all
            defective items. Just email us a photo and we will sort it immediately.
          </p>
        </section>

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">Non-Defective Returns</h2>
          <p className="text-sm leading-relaxed text-[#3A3A38]">
            Changed your mind? No problem. For returns on non-defective items, the customer is
            responsible for return shipping costs. We recommend using a tracked service as we cannot
            be held responsible for items lost in transit.
          </p>
        </section>

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">Exchanges</h2>
          <p className="text-sm leading-relaxed text-[#3A3A38]">
            Want a different design or model? We accept exchanges within the 30-day window. Contact us
            with your order number and the item you would like instead — we will guide you through
            the process.
          </p>
        </section>

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">How to Start a Return</h2>
          <ol className="text-sm leading-relaxed text-[#3A3A38] space-y-2 list-none">
            <li className="flex gap-3"><span className="text-[#8C8880] shrink-0">01</span><span>Email us at <a href="mailto:the3vka@gmail.com" className="underline decoration-[#C8C2BA] underline-offset-2 hover:text-[#1A1A18]">the3vka@gmail.com</a> with your order number.</span></li>
            <li className="flex gap-3"><span className="text-[#8C8880] shrink-0">02</span><span>Include a brief description of the issue and, for defective items, a photo.</span></li>
            <li className="flex gap-3"><span className="text-[#8C8880] shrink-0">03</span><span>We will respond within 1 business day with next steps.</span></li>
          </ol>
        </section>

        <section>
          <div className="w-8 h-px bg-[#C8C2BA] mb-4" />
          <h2 className="text-xs uppercase tracking-[0.14em] text-[#8C8880] mb-3">Contact</h2>
          <p className="text-sm leading-relaxed text-[#3A3A38]">
            Questions about your order?{' '}
            <a
              href="mailto:the3vka@gmail.com"
              className="underline decoration-[#C8C2BA] underline-offset-2 hover:text-[#1A1A18]"
            >
              the3vka@gmail.com
            </a>
            <br />
            We typically reply within a few hours.
          </p>
        </section>

      </div>
    </main>
  )
}
