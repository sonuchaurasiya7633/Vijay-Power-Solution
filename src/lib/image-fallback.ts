const LOCAL_SOLAR_GALLERY = [
  "/images/gallery/customer-solar-01.jpg",
  "/images/gallery/customer-solar-02.jpg",
  "/images/gallery/customer-solar-03.jpg",
  "/images/gallery/customer-solar-04.jpg",
  "/images/gallery/customer-solar-05.jpg",
  "/images/gallery/customer-solar-06.jpg",
  "/images/gallery/customer-solar-07.jpg",
  "/images/gallery/customer-solar-08.jpg",
  "/images/gallery/customer-solar-09.jpg",
  "/images/gallery/customer-solar-10.jpg",
];

const BROKEN_OR_OFFTOPIC_UNSPLASH_IDS = [
  "photo-1509391365360-2e959784a276", // 404
  "photo-1508873696983-2df5293cb32f", // 404
  "photo-1548337138-e87d889cc369", // offshore wind turbines, not solar
];

export function getSafeSolarImage(url?: string | null, index = 0): string {
  const fallback = LOCAL_SOLAR_GALLERY[Math.abs(index) % LOCAL_SOLAR_GALLERY.length];
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }
  const trimmed = url.trim();
  if (BROKEN_OR_OFFTOPIC_UNSPLASH_IDS.some((id) => trimmed.includes(id))) {
    return fallback;
  }
  return trimmed;
}

export function getLocalSolarGalleryImage(index = 0): string {
  return LOCAL_SOLAR_GALLERY[Math.abs(index) % LOCAL_SOLAR_GALLERY.length];
}
