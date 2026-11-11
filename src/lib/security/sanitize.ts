import mongoose from "mongoose";

/**
 * Validates MongoDB ObjectId strings cleanly before querying to prevent 500 CastErrors.
 */
export function isValidObjectId(id?: string | null): boolean {
  return Boolean(id && typeof id === "string" && mongoose.Types.ObjectId.isValid(id));
}

/**
 * Escapes user-provided strings for safe case-insensitive MongoDB $regex matching (prevents ReDoS).
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Escapes untrusted plain text before interpolating into HTML emails or notifications.
 */
export function escapeHtml(input?: string | null): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Defense-in-depth HTML sanitizer for CMS rich-text fields before rendering via dangerouslySetInnerHTML.
 * Strips executable script/iframe/object/embed tags, inline event handlers, and javascript:/vbscript: URIs.
 */
export function sanitizeHtmlContent(html?: string | null): string {
  if (!html || typeof html !== "string") return "";

  return html
    .replace(/<\s*(script|iframe|object|embed|form|meta|base|link)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|iframe|object|embed|form|meta|base|link)[^>]*\/?>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src|action|formaction)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html):[^"']*\2/gi, '$1=$2#$2');
}

/**
 * Extracts only allowlisted keys from a request payload to block mass assignment attacks.
 */
export function pickAllowedFields<T extends Record<string, any>>(
  source: Record<string, any> | null | undefined,
  allowedKeys: readonly string[]
): Partial<T> {
  const out: Record<string, any> = {};
  if (!source || typeof source !== "object") return out as Partial<T>;

  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out as Partial<T>;
}

/**
 * Validates uploaded Cloudinary / static media URLs or paths cleanly.
 */
export function isSafeMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//");
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
