import type { Product, ProductColor } from "../lib/types";

const DESK_PRESET_COLORS: ProductColor[] = [
  { name: "Blanco", hex: "#ffffff" },
  { name: "Cafe", hex: "#8B5A2B" },
  { name: "Negro", hex: "#000000" },
];

const SOFA_PRESET_COLORS: ProductColor[] = [
  { name: "Blanco", hex: "#ffffff" },
  { name: "Cafe", hex: "#8B5A2B" },
  { name: "Negro", hex: "#000000" },
];

function normalizeHex(hex?: string) {
  return (hex || "").trim().toLowerCase();
}

export function getProductColorOptions(product: Product): ProductColor[] {
  const existing = product.colors ?? [];
  const isDesk =
    /escritorio/i.test(product.name) ||
    /desk/i.test(product.name_en || "");

  const isSofa =
    /sillon/i.test(product.name) ||
    /sofa/i.test(product.name_en || "");

  if (!isDesk && !isSofa) return existing;

  const presetColors = isDesk ? DESK_PRESET_COLORS : SOFA_PRESET_COLORS;

  const merged = [...existing];

  for (const preset of presetColors) {
    const alreadyExists = merged.some(
      (c) => normalizeHex(c.hex) === normalizeHex(preset.hex)
    );

    if (!alreadyExists) {
      merged.push(preset);
    }
  }

  return merged;
}

export function getAiVariantImage(
  productId: number,
  productName: string,
  color: ProductColor
) {
  const colorLabel = color.name || color.hex || "neutral";
  const prompt = `${productName} furniture, ${colorLabel} color, clean studio photo, ecommerce catalog, photorealistic`;
  const seedRaw = `${productId}-${normalizeHex(color.hex) || colorLabel}`;
  const seed = seedRaw.replace(/[^a-z0-9]/gi, "").slice(0, 24);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=1200&height=900&seed=${seed}&nologo=true`;
}