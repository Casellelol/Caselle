import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  createPrintifyOrder,
  PRINTIFY_VARIANT_MAP,
  PRINTIFY_BLUEPRINT_ID,
  PRINTIFY_PRINT_PROVIDER_ID,
  DEFAULT_PRINT_FILE,
} from "@/lib/printify"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Only process paid sessions
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true })
  }

  try {
    const items: Array<{
      productId: string
      designId: string
      modelId: string
      quantity: number
    }> = JSON.parse(session.metadata?.items ?? "[]")

    const shipping = (session as Stripe.Checkout.Session & { shipping_details?: { name?: string; address?: { country?: string; state?: string; line1?: string; line2?: string; city?: string; postal_code?: string } } }).shipping_details
    const nameParts = (shipping?.name ?? "Customer").split(" ")
    const firstName = nameParts[0] ?? "Customer"
    const lastName = nameParts.slice(1).join(" ") || "."

    const address = {
      first_name: firstName,
      last_name: lastName,
      email: session.customer_details?.email ?? "",
      phone: session.customer_details?.phone ?? "",
      country: shipping?.address?.country ?? "US",
      region: shipping?.address?.state ?? "",
      address1: shipping?.address?.line1 ?? "",
      address2: shipping?.address?.line2 ?? "",
      city: shipping?.address?.city ?? "",
      zip: shipping?.address?.postal_code ?? "",
    }

    const lineItems = items.map((item) => ({
      print_provider_id: PRINTIFY_PRINT_PROVIDER_ID,
      blueprint_id: PRINTIFY_BLUEPRINT_ID,
      variant_id: PRINTIFY_VARIANT_MAP[item.modelId] ?? 130115,
      print_areas: { front: DEFAULT_PRINT_FILE },
      quantity: item.quantity,
    }))

    await createPrintifyOrder({
      externalId: session.id,
      label: `Caselle Order — ${session.id.slice(-8).toUpperCase()}`,
      address,
      lineItems,
    })

    console.log("Printify order created for session:", session.id)
  } catch (err) {
    console.error("Failed to create Printify order:", err)
    // Don't return 500 — Stripe would retry. Log and return 200.
  }

  return NextResponse.json({ received: true })
}
