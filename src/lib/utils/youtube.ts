/**
 * Extracts a YouTube 11-character video ID from standard watch, short share,
 * embed, shorts, or live URLs. Returns null if the URL is not a YouTube video.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
