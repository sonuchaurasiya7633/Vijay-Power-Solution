export interface SocialLinksConfig {
  youtube: string;
  instagram: string;
  facebook: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinksConfig = {
  youtube: "https://youtube.com/@vijoypowersolutionvpssolar?si=mXRGxgsqmeRqdwVd",
  instagram: "https://www.instagram.com/vps_solar?mdxt=YnduNzhrNGc3MDFj",
  facebook: "https://www.facebook.com/share/19TDRMqdyh/",
};

export function resolveSocialLinks(raw?: Partial<SocialLinksConfig> | null): SocialLinksConfig {
  return {
    youtube: raw?.youtube !== undefined ? raw.youtube.trim() : DEFAULT_SOCIAL_LINKS.youtube,
    instagram: raw?.instagram !== undefined ? raw.instagram.trim() : DEFAULT_SOCIAL_LINKS.instagram,
    facebook: raw?.facebook !== undefined ? raw.facebook.trim() : DEFAULT_SOCIAL_LINKS.facebook,
  };
}
