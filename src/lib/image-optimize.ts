/**
 * Enhances Cloudinary delivery URLs with automatic format negotiation (AVIF/WebP),
 * quality optimization, and optional width clamping without mutating non-Cloudinary URLs.
 */
export function optimizeCloudinaryUrl(url?: string | null, width?: number): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (!trimmed.includes("res.cloudinary.com") || !trimmed.includes("/image/upload/")) {
    return trimmed;
  }

  const marker = "/image/upload/";
  const idx = trimmed.indexOf(marker);
  if (idx === -1) return trimmed;

  const prefix = trimmed.slice(0, idx + marker.length);
  const rest = trimmed.slice(idx + marker.length);

  // Skip if caller already added delivery transformations before the version/public_id segment
  const firstSegment = rest.split("/")[0] || "";
  if (firstSegment && !firstSegment.startsWith("v") && (firstSegment.includes("f_") || firstSegment.includes("q_") || firstSegment.includes("w_"))) {
    return trimmed;
  }

  const transforms = width ? `f_auto,q_auto:good,c_limit,w_${width}` : "f_auto,q_auto:good";
  return `${prefix}${transforms}/${rest}`;
}
