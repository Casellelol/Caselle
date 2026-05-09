// Usage: npx tsx scripts/upload-design.ts <file-path> <design-name>
// Uploads a local image to Printify media library and prints the image ID
// Add the returned ID to lib/printify.ts DESIGN_PRINT_FILES

import fs from "fs"
import path from "path"

const envPath = path.join(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [key, ...val] = line.split("=")
    if (key && !process.env[key.trim()]) process.env[key.trim()] = val.join("=").trim()
  }
}

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN

async function uploadDesign(filePath: string, designName: string): Promise<void> {
  if (!PRINTIFY_TOKEN) throw new Error("PRINTIFY_API_TOKEN not set in .env.local")
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`)

  const fileBuffer = fs.readFileSync(filePath)
  const base64 = fileBuffer.toString("base64")
  const ext = path.extname(filePath).replace(".", "").toLowerCase()
  const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png"

  console.log(`Uploading "${designName}" (${Math.round(fileBuffer.length / 1024)}KB) to Printify...`)

  const res = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_name: `${designName}.${ext}`,
      contents: base64,
      mime_type: mimeType,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify upload failed: ${err}`)
  }

  const data = await res.json() as { id: string; preview_url?: string }
  console.log(`\n✅ Uploaded successfully!`)
  console.log(`Image ID: ${data.id}`)
  if (data.preview_url) console.log(`Preview: ${data.preview_url}`)
  console.log(`\nAdd to lib/printify.ts DESIGN_PRINT_FILES:`)
  console.log(`  "${designName}": "${data.preview_url || `https://api.printify.com/v1/uploads/${data.id}`}",`)
}

const [,, filePath, designName] = process.argv
if (!filePath || !designName) {
  console.error("Usage: npx tsx scripts/upload-design.ts <file-path> <design-name>")
  console.error("Example: npx tsx scripts/upload-design.ts public/designs/dark-floral.png dark-floral")
  process.exit(1)
}

uploadDesign(filePath, designName).catch(err => {
  console.error("Error:", err.message)
  process.exit(1)
})
