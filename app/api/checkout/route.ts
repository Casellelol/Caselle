import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: items.map((item: {
        productName: string
        designName: string
        modelName: string
        quantity: number
        unitPrice: number
        image: string
      }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.productName} Case`,
            description: `${item.designName} · ${item.modelName}`,
            images: [item.image].filter(Boolean),
          },
          unit_amount: item.unitPrice,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ["US", "GB", "CA", "AU", "DE", "FR", "NL", "SE", "NO", "DK"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 699, currency: "usd" },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        items: JSON.stringify(items.map((i: { productId: string; designId: string; modelId: string; quantity: number }) => ({
          productId: i.productId,
          designId: i.designId,
          modelId: i.modelId,
          quantity: i.quantity,
        }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe error:", err)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
