export const OFFICIAL_PANEL_BRANDS = [
  "Vikram Solar",
  "Adani Solar",
  "Waaree",
  "Loom Solar",
] as const;

export type OfficialPanelBrand = (typeof OFFICIAL_PANEL_BRANDS)[number];

/**
 * Normalizes any legacy or variant brand name into one of the four official
 * authorized solar panel manufacturer brands.
 */
export function normalizeOfficialPanelBrand(brand?: string | null): OfficialPanelBrand {
  const b = (brand || "").trim().toLowerCase();
  if (b.includes("vikram")) return "Vikram Solar";
  if (b.includes("adani")) return "Adani Solar";
  if (b.includes("waaree") || b.includes("goldi")) return "Waaree";
  if (b.includes("loom") || b.includes("luminous")) return "Loom Solar";
  if (b.includes("tata")) return "Adani Solar";
  return "Vikram Solar";
}

export function isOfficialPanelBrand(brand?: string | null): brand is OfficialPanelBrand {
  if (!brand) return false;
  return (OFFICIAL_PANEL_BRANDS as readonly string[]).includes(brand.trim());
}
