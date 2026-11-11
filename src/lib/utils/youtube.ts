/**
 * Extracts an 11-character YouTube video ID from standard watch, youtu.be,
 * shorts, live, or embed URLs. Returns null if the URL is not a YouTube URL.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const vParam = parsed.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      // Matches /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
      if (segments.length >= 2 && ["embed", "shorts", "live", "v"].includes(segments[0])) {
        const id = segments[1];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    // Fallback regex if partial/raw URL is pasted
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/
    );
    if (match?.[1]) return match[1];
  }

  return null;
}

export function isYouTubeUrl(url?: string | null): boolean {
  return extractYouTubeId(url) !== null;
}

export function getYouTubeEmbedUrl(url?: string | null, autoplay = true): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
