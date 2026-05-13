import { NextResponse } from "next/server"

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN || process.env.PRINTIFY_ACCESS_TOKEN
const PRINTIFY_SHOP_ID = "27451784"
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://burga-store.vercel.app"

interface PrintifyVariant {
  price: number
  is_enabled: boolean
}

interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: Array<{ src: string; is_default: boolean }>
  variants: PrintifyVariant[]
  is_locked: boolean
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

function buildXml(products: PrintifyProduct[]): string {
  const items = products.map(p => {
    const price = p.variants.find(v => v.is_enabled)?.price ?? 0
    const priceUsd = (price / 100).toFixed(2)
    const image = p.images.find(i => i.is_default)?.src || p.images[0]?.src || ""
    const slug = slugify(p.title)
    const description = stripHtml(p.description).slice(0, 500) || "Premium quality phone case by Caselle."

    return `  <item>
    <g:id>${p.id}</g:id>
    <g:title><![CDATA[${p.title}]]></g:title>
    <g:description><![CDATA[${description}]]></g:description>
    <g:link>${BASE_URL}/products/${slug}</g:link>
    <g:image_link>${image}</g:image_link>
    <g:price>${priceUsd} USD</g:price>
    <g:availability>in stock</g:availability>
    <g:brand>Caselle</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>Apparel &amp; Accessories &gt; Clothing Accessories &gt; Phone Cases</g:google_product_category>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`
  }).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Caselle — Phone Cases</title>
    <link>${BASE_URL}</link>
    <description>Premium aesthetic phone cases by Caselle</description>
${items}
  </channel>
</rss>`
}

export async function GET() {
  try {
    if (!PRINTIFY_TOKEN) {
      return new NextResponse("Printify token not configured", { status: 500 })
    }

    const res = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json?limit=100`,
      {
        headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      return new NextResponse(`Printify API error: ${res.status}`, { status: 502 })
    }

    const data = await res.json() as { data: PrintifyProduct[] }
    const published = (data.data || []).filter(p => !p.is_locked && p.images.length > 0)

    const xml = buildXml(published)

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    })
  } catch (err) {
    console.error("[google-shopping-feed] Error:", err)
    return new NextResponse(String(err), { status: 500 })
  }
}
