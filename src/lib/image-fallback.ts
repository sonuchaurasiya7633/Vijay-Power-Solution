const POSTER_CLOUDINARY_IDS = [
  "peclb2xlnhrgnee80gtr",
  "skumqggyxv2l9nangrk3",
  "obng8nqkacglehvotc82",
  "zqtztnkzlqtojla8xfdk",
  "zbxvqrnzjwizdsqbe6pg",
  "ejt2wgjnovmcjtb7pg8t",
  "otjhhooannci70rhv89l",
  "te4aru2gy5shlfdijjs1",
  "veijlr67s47m9diwbubk",
  "e3v9r53sqydmn0cf9udi",
];

const BROKEN_OR_OFFTOPIC_UNSPLASH_IDS = [
  "photo-1509391365360-2e959784a276",
  "photo-1508873696983-2df5293cb32f",
  "photo-1548337138-e87d889cc369",
];

/**
 * Returns "" (empty string) if the URL is empty, a broken/off-topic Unsplash URL,
 * or one of the VPS customer handover posters (which belong ONLY on /projects).
 */
export function getCleanPublicImage(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return "";
  }
  const trimmed = url.trim();
  if (trimmed.includes("/images/gallery/customer-solar-")) {
    return "";
  }
  if (POSTER_CLOUDINARY_IDS.some((id) => trimmed.includes(id))) {
    return "";
  }
  if (BROKEN_OR_OFFTOPIC_UNSPLASH_IDS.some((id) => trimmed.includes(id))) {
    return "";
  }
  return trimmed;
}

/**
 * Kept for backwards compatibility with imports — resolves non-poster, non-broken image URLs
 * or returns "" so components render the clean Title Box Card placeholder.
 */
export function getSafeSolarImage(url?: string | null): string {
  return getCleanPublicImage(url);
}
