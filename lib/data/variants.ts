import type { DeviceModel } from "@/types/variant"
import type { DesignVariant } from "@/types/product"

export const deviceModels: DeviceModel[] = [
  { id: "iphone-17-pro-max", brand: "Apple", series: "iPhone 17 Series", name: "iPhone 17 Pro Max" },
  { id: "iphone-17-pro", brand: "Apple", series: "iPhone 17 Series", name: "iPhone 17 Pro" },
  { id: "iphone-17-plus", brand: "Apple", series: "iPhone 17 Series", name: "iPhone 17 Plus" },
  { id: "iphone-17", brand: "Apple", series: "iPhone 17 Series", name: "iPhone 17" },
  { id: "iphone-16-pro-max", brand: "Apple", series: "iPhone 16 Series", name: "iPhone 16 Pro Max" },
  { id: "iphone-16-pro", brand: "Apple", series: "iPhone 16 Series", name: "iPhone 16 Pro" },
  { id: "iphone-16-plus", brand: "Apple", series: "iPhone 16 Series", name: "iPhone 16 Plus" },
  { id: "iphone-16", brand: "Apple", series: "iPhone 16 Series", name: "iPhone 16" },
  { id: "iphone-15-pro-max", brand: "Apple", series: "iPhone 15 Series", name: "iPhone 15 Pro Max" },
  { id: "iphone-15-pro", brand: "Apple", series: "iPhone 15 Series", name: "iPhone 15 Pro" },
  { id: "iphone-15-plus", brand: "Apple", series: "iPhone 15 Series", name: "iPhone 15 Plus" },
  { id: "iphone-15", brand: "Apple", series: "iPhone 15 Series", name: "iPhone 15" },
  { id: "galaxy-s25-ultra", brand: "Samsung", series: "Galaxy S25 Series", name: "Galaxy S25 Ultra" },
  { id: "galaxy-s25-plus", brand: "Samsung", series: "Galaxy S25 Series", name: "Galaxy S25+" },
  { id: "galaxy-s25", brand: "Samsung", series: "Galaxy S25 Series", name: "Galaxy S25" },
  { id: "pixel-9-pro-xl", brand: "Google", series: "Pixel 9 Series", name: "Pixel 9 Pro XL" },
  { id: "pixel-9-pro", brand: "Google", series: "Pixel 9 Series", name: "Pixel 9 Pro" },
  { id: "pixel-9", brand: "Google", series: "Pixel 9 Series", name: "Pixel 9" },
]

export const designVariants: DesignVariant[] = [
  { id: "marble-white", name: "White Marble", type: "pattern", swatch: "#F5F3F0" },
  { id: "marble-black", name: "Black Marble", type: "pattern", swatch: "#2C2C2C" },
  { id: "sage-green", name: "Sage Green", type: "solid", swatch: "#8FAF8A" },
  { id: "dusty-rose", name: "Dusty Rose", type: "solid", swatch: "#D4A9A1" },
  { id: "midnight-navy", name: "Midnight Navy", type: "solid", swatch: "#1C2B4A" },
  { id: "champagne-gold", name: "Champagne Gold", type: "gradient", swatch: "#C9A96E" },
  { id: "cloud-grey", name: "Cloud Grey", type: "solid", swatch: "#B8B8B8" },
  { id: "terracotta", name: "Terracotta", type: "solid", swatch: "#C17A5A" },
  { id: "lavender-mist", name: "Lavender Mist", type: "solid", swatch: "#B8A9C9" },
  { id: "obsidian", name: "Obsidian", type: "solid", swatch: "#1A1A18" },
  { id: "cherry-red", name: "Cherry Red", type: "solid", swatch: "#C41E3A" },
]

export const allModelIds = deviceModels.map((m) => m.id)

export function getModelsByBrand(brand: DeviceModel["brand"]) {
  return deviceModels.filter((m) => m.brand === brand)
}

export function getModelsBySeries(series: string) {
  return deviceModels.filter((m) => m.series === series)
}

export function getModelById(id: string) {
  return deviceModels.find((m) => m.id === id)
}
