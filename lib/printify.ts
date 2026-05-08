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

// Real Caselle design print files (uploaded to Printify S3)
export const DESIGN_PRINT_FILES: Record<string, string> = {
  "marble-white":   "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/4822bf66-d730-486d-b415-d791aabfc6e3",
  "marble-black":   "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/94ef4c53-c1d3-4242-8de3-c743fa81dce5",
  "sage-green":     "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/7b5ea2c0-d48d-4070-8bad-56db58ed6409",
  "dusty-rose":     "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/fd2cd758-693a-43d0-b7a1-8251e8682559",
  "midnight-navy":  "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/e37167be-a30a-410c-9eae-db939d7b7984",
  "champagne-gold": "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/72dcb17c-b838-4733-a79e-a608f428f59d",
  "cloud-grey":     "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/0d4bdb75-90bf-4969-8234-17fc9992f7d6",
  "terracotta":     "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/1b66284d-6d54-46ed-80b3-a037aec25731",
  "lavender-mist":  "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/c9006376-1ac9-404a-9f99-7f907019ba68",
  "obsidian":       "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/78388749-afea-4391-a4dd-64e444b373de",
  "cherry-red":     "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/b76620d4-cf34-48df-9cea-600b56e2d6af",
}

export const DEFAULT_PRINT_FILE = DESIGN_PRINT_FILES["marble-white"]

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
