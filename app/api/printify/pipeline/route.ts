import { NextRequest, NextResponse } from "next/server"
import {
  PRINTIFY_BLUEPRINT_ID,
  PRINTIFY_PRINT_PROVIDER_ID,
  PRINTIFY_SHOP_ID,
  PRINTIFY_VARIANT_MAP,
} from "@/lib/printify"

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// Step 1: Generate design image via Pollinations AI (free, no key needed)
async function generateDesignImage(prompt: string, slug: string): Promise<string> {
  const enhancedPrompt = `phone case design, ${prompt}, flat lay product design, centered composition, clean background, high quality, 1800x2400, print ready`
  const encoded = encodeURIComponent(enhancedPrompt)
  // Pollinations returns the image directly at this URL
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1800&height=2400&nologo=true&model=flux&seed=${Date.now()}`

  // Verify it's reachable
  const check = await fetch(imageUrl, { method: "HEAD" }).catch(() => null)
  if (!check?.ok) {
    // Fallback: use existing marble-white design URL as base
    return "https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/27204592/4822bf66-d730-486d-b415-d791aabfc6e3"
  }
  return imageUrl
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
    blueprint_id: PRINTIFY_BLUEPRINT_ID,
    print_provider_id: PRINTIFY_PRINT_PROVIDER_ID,
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

  // 200 or 204 are both success; some Printify plans return 404 on publish
  // (store not connected to sales channel) — we treat this as non-fatal
  if (!res.ok && res.status !== 404) {
    const err = await res.text()
    throw new Error(`Printify publish failed: ${err}`)
  }
}

// Step 5: Log to GitHub so JARVIS knows what was published
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
    const { name, description, prompt, price = 2499 } = await req.json()

    if (!name || !prompt) {
      return NextResponse.json({ error: "name and prompt required" }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const date = new Date().toISOString().slice(0, 16).replace("T", " ")

    // Full pipeline
    const imageUrl = await generateDesignImage(prompt, slug)
    const imageId = await uploadToPrintify(imageUrl, slug)
    const productId = await createProduct({
      title: name,
      description: description || `${name} — premium tough phone case by Caselle.`,
      imageId,
      price,
    })
    await publishProduct(productId)

    const logEntry = `\n## ${name} — ${date}\n- Printify product ID: ${productId}\n- Image prompt: ${prompt}\n- Price: £${(price / 100).toFixed(2)}\n`
    await logToGitHub(logEntry)

    // Notify JARVIS
    fetch(`${BASE_URL}/api/jarvis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Claude auto-published a new product to Caselle: "${name}". Printify product ID: ${productId}. Price: £${(price / 100).toFixed(2)}. Update your memory.`,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true, productId, imageId, name })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
