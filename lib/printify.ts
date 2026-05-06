// Printify blueprint 269 (Tough Phone Cases), print provider 1
// Maps our store's device model IDs → Printify variant IDs
export const PRINTIFY_VARIANT_MAP: Record<string, number> = {
  "iphone-17-pro-max": 130117,
  "iphone-17-pro":     130116,
  "iphone-17-plus":    130118, // iPhone 17 Air
  "iphone-17":         130115,
  "iphone-16-pro-max": 112813,
  "iphone-16-pro":     112812,
  "iphone-16-plus":    112815,
  "iphone-16":         112814,
  "iphone-15-pro-max": 103564,
  "iphone-15-pro":     103562,
  "iphone-15-plus":    103563,
  "iphone-15":         103561,
  "galaxy-s25-ultra":  112812, // fallback until Samsung variants confirmed
  "galaxy-s25-plus":   112812,
  "galaxy-s25":        112812,
  "pixel-9-pro-xl":    112812,
  "pixel-9-pro":       112812,
  "pixel-9":           112812,
}

export const PRINTIFY_BLUEPRINT_ID = 269
export const PRINTIFY_PRINT_PROVIDER_ID = 1
export const PRINTIFY_SHOP_ID = "27451784"

// Placeholder print file — replace with real design images per product
export const DEFAULT_PRINT_FILE = "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=90"

type PrintifyAddress = {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  address1: string
  address2: string
  city: string
  zip: string
}

type PrintifyLineItem = {
  print_provider_id: number
  blueprint_id: number
  variant_id: number
  print_areas: { front: string }
  quantity: number
}

export async function createPrintifyOrder(params: {
  externalId: string
  label: string
  address: PrintifyAddress
  lineItems: PrintifyLineItem[]
}) {
  const res = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: params.externalId,
      label: params.label,
      line_items: params.lineItems,
      shipping_method: 1,
      is_printify_express: false,
      send_shipping_notification: true,
      address_to: params.address,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify order failed: ${err}`)
  }

  return res.json()
}
