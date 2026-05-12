import { NextRequest, NextResponse } from "next/server"
import {
  PRINTIFY_BLUEPRINT_ID,
  PRINTIFY_PRINT_PROVIDER_ID,
  PRINTIFY_SHOP_ID,
  PRINTIFY_VARIANT_MAP,
} from "@/lib/printify"
import { getBlueprintByName } from "@/lib/printify-blueprints"

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN

// Step 1: Generate design image — Replicate (pro quality) with Pollinations fallback
async function generateDesignImage(prompt: string, designArea?: { width: number; height: number }): Promise<string> {
  const w = designArea?.width ?? 1800
  const h = designArea?.height ?? 2400
  const enhancedPrompt = `${prompt}, flat lay product design, centered composition, white background, ultra high quality, print ready, ${w}x${h}`

  // Try Replicate Flux Pro first if key is available
  if (REPLICATE_TOKEN) {
    try {
      const startRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REPLICATE_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait=60",
        },
        body: JSON.stringify({
          input: { prompt: enhancedPrompt, width: Math.min(w, 1440), height: Math.min(h, 1440), output_format: "png" },
        }),
      })

      if (startRes.ok) {
        const prediction = await startRes.json()
        // Wait for completion (Prefer: wait=60 means it returns synchronously)
        const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
        if (outputUrl && typeof outputUrl === "string") return outputUrl
      }
    } catch {}
  }

  // Fallback: Pollinations (free, no key)
  const encoded = encodeURIComponent(enhancedPrompt)
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true&model=flux&seed=${Date.now()}`
  const check = await fetch(pollinationsUrl, { method: "HEAD" }).catch(() => null)
  if (check?.ok) return pollinationsUrl

  // Last resort: existing marble design
  return "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/4822bf66-d730-486d-b415-d791aabfc6e3"
}

// Step 2: Upload image to Printify media library
async function uploadToPrintify(imageUrl: string, fileName: string): Promise<string> {
  const res = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_name: `${fileName}.png`, url: imageUrl }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify upload failed: ${err}`)
  }

  const data = await res.json()
  return data.id
}

// Step 3: Create product with all iPhone variants
async function createProduct(params: {
  title: string
  description: string
  imageId: string
  price: number
  brandId?: string
  blueprintId?: number
  providerId?: number
}): Promise<string> {
  const variantIds = Object.values(PRINTIFY_VARIANT_MAP)
  const uniqueVariantIds = [...new Set(variantIds)]

  const variants = uniqueVariantIds.map(id => ({
    id,
    price: params.price,
    is_enabled: true,
  }))

  const body = {
    title: params.title,
    description: params.description,
    blueprint_id: params.blueprintId ?? PRINTIFY_BLUEPRINT_ID,
    print_provider_id: params.providerId ?? PRINTIFY_PRINT_PROVIDER_ID,
    tags: [`brand:${params.brandId || "caselle"}`],
    variants,
    print_areas: [
      {
        variant_ids: uniqueVariantIds,
        placeholders: [
          {
            position: "front",
            images: [
              {
                id: params.imageId,
                x: 0.5,
                y: 0.5,
                scale: 1,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  }

  const res = await fetch(
    `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify product creation failed: ${err}`)
  }

  const data = await res.json()
  return data.id
}

// Step 4: Publish product to store
async function publishProduct(productId: string): Promise<void> {
  const res = await fetch(
    `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products/${productId}/publish.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: true,
        description: true,
        images: true,
        variants: true,
        tags: true,
        keyFeatures: true,
        shipping_template: true,
      }),
    }
  )

  if (!res.ok && res.status !== 404) {
    const err = await res.text()
    throw new Error(`Printify publish failed: ${err}`)
  }
}

// Step 5: Confirm product actually exists on Printify after publishing
async function confirmProduct(productId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`,
      { headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` } }
    )
    if (!res.ok) return false
    const data = await res.json()
    return !!data.id
  } catch { return false }
}

// Step 6: Log to GitHub so JARVIS knows what was published
async function logToGitHub(entry: string) {
  try {
    const getRes = await fetch(
      "https://api.github.com/repos/Casellelol/Caselle/contents/published-products.md",
      { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    )
    const existing = getRes.ok ? await getRes.json() : null
    const current = existing
      ? Buffer.from(existing.content, "base64").toString("utf-8")
      : "# Published Products\n*Auto-published by JARVIS pipeline.*\n\n"

    await fetch("https://api.github.com/repos/Casellelol/Caselle/contents/published-products.md", {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Auto-published product",
        content: Buffer.from(current + entry).toString("base64"),
        sha: existing?.sha,
      }),
    })
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, prompt, price = 2499, brandId, blueprint_name } = await req.json()

    if (!name || !prompt) {
      return NextResponse.json({ error: "name and prompt required" }, { status: 400 })
    }

    // Resolve blueprint from library — default to Tough Case
    const blueprintEntry = blueprint_name ? getBlueprintByName(blueprint_name) : null
    const resolvedBlueprintName = blueprintEntry ? blueprint_name : "Tough Case"
    const resolvedBlueprintId = blueprintEntry?.blueprint_id ?? PRINTIFY_BLUEPRINT_ID
    const resolvedProviderId = blueprintEntry?.provider_id ?? PRINTIFY_PRINT_PROVIDER_ID
    const designArea = blueprintEntry?.design_area ?? { width: 1800, height: 2400 }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")
    const brand = brandId || "caselle"

    // Full pipeline — pass design dimensions for correct image sizing
    const imageUrl = await generateDesignImage(prompt, designArea)
    const imageId = await uploadToPrintify(imageUrl, slug)
    const productId = await createProduct({
      title: name,
      description: description || `${name} — premium product by ${brand.charAt(0).toUpperCase() + brand.slice(1)}.`,
      imageId,
      price,
      brandId: brand,
      blueprintId: resolvedBlueprintId,
      providerId: resolvedProviderId,
    })
    await publishProduct(productId)

    // Confirm it actually exists — silent retry if not
    const confirmed = await confirmProduct(productId)
    if (!confirmed) {
      fetch(`${BASE_URL}/api/jarvis/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          limitation: `Printify product "${name}" (ID: ${productId}) was created but failed confirmation check — may not be live. Investigate and re-publish if needed.`,
          context: "Printify pipeline confirmation failure",
        }),
      }).catch(() => {})
    }

    const status = confirmed ? "CONFIRMED LIVE" : "PUBLISHED — awaiting confirmation"
    const logEntry = `\n## ${name} — ${date}\n- Printify product ID: ${productId}\n- Image prompt: ${prompt}\n- Price: £${(price / 100).toFixed(2)}\n- Status: ${status}\n`
    await logToGitHub(logEntry)

    // Notify JARVIS
    fetch(`${BASE_URL}/api/jarvis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Claude auto-published a new product to Caselle: "${name}". Printify product ID: ${productId}. Price: £${(price / 100).toFixed(2)}. Status: ${status}. Update your memory.`,
      }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      productId,
      imageId,
      name,
      confirmed,
      blueprint: { name: resolvedBlueprintName, id: resolvedBlueprintId, provider_id: resolvedProviderId },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
