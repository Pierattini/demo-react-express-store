const HEX_TO_NAME: Record<string, string> = {
  "#000000": "Negro",
  "#ffffff": "Blanco",
  "#ff0000": "Rojo",
  "#e10909": "Rojo",
  "#d8db1a": "Amarillo",
  "#8b5a2b": "Cafe",
  "#8b4513": "Cafe",
  "#808080": "Gris",
  "#c0c0c0": "Plateado",
  "#0000ff": "Azul",
  "#00ff00": "Verde",
};

function normalizeHex(hex?: string) {
  return (hex || "").trim().toLowerCase();
}

export function getFriendlyColorName(
  colorHex?: string,
  explicitName?: string
): string {
  if (explicitName && explicitName.trim()) {
    return explicitName.trim();
  }

  const hex = normalizeHex(colorHex);
  if (!hex) return "Sin color";

  return HEX_TO_NAME[hex] || `Color ${hex}`;
}
