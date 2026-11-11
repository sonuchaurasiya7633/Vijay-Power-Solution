import {
  BASE_URL,
  OFFICIAL_SOLAR_BRANDS,
  SITE_NAME,
  toAbsoluteUrl,
} from "@/lib/seo-config";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";

const PAN_INDIA_AREAS = INDIAN_STATES_AND_UTS.filter(
  (s) => s !== "Other / Outside India"
).map((name) => ({
  "@type": "AdministrativeArea",
  name,
}));

export function buildOrganizationSchema(params: {
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  description?: string;
  sameAs?: string[];
}) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "VPS Solar",
    url: BASE_URL,
    logo: toAbsoluteUrl(params.logoUrl || "/images/logo.png"),
    image: toAbsoluteUrl(params.logoUrl || "/images/logo.png"),
    description:
      params.description ||
      "Pan-India rooftop solar installation, industrial EPC & ALMM solar panel supplier for Vikram Solar, Adani Solar, Waaree & Loom Solar.",
    telephone: params.phone || "+91 94310 00000",
    email: params.email || "contact@vijoypowersolution.com",
    areaServed: [
      { "@type": "Country", name: "India" },
      ...PAN_INDIA_AREAS.slice(0, 12),
    ],
    brand: OFFICIAL_SOLAR_BRANDS.map((name) => ({
      "@type": "Brand",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };

  if (params.address && params.address.trim()) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: params.address.trim(),
      addressCountry: "IN",
    };
  }

  if (params.sameAs && params.sameAs.length > 0) {
    schema.sameAs = params.sameAs.filter((u) => /^https?:\/\//i.test(u));
  }

  return schema;
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/solar-panels?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  const valid = (faqs || []).filter(
    (f) => f && f.question?.trim() && f.answer?.trim()
  );
  if (valid.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.trim(),
      },
    })),
  };
}

export function buildProductSchema(product: {
  name: string;
  description: string;
  brand: string;
  sku?: string;
  slug: string;
  image?: string;
  ratedPowerWp: number;
  technologyCategories?: string[];
  certifications?: string[];
  performanceWarrantyYears?: number;
}) {
  const additionalProperty: Record<string, any>[] = [
    {
      "@type": "PropertyValue",
      name: "Rated Power Output",
      value: `${product.ratedPowerWp} Wp`,
    },
  ];
  if (product.technologyCategories?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Cell Technology",
      value: product.technologyCategories.join(", "),
    });
  }
  if (product.certifications?.length) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Certifications",
      value: product.certifications.join(", "),
    });
  }
  if (product.performanceWarrantyYears) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Linear Performance Warranty",
      value: `${product.performanceWarrantyYears} Years`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku || product.slug,
    category: "Solar Photovoltaic Module",
    url: toAbsoluteUrl(`/solar-panels/${product.slug}`),
    image: product.image ? [toAbsoluteUrl(product.image)] : undefined,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.brand,
    },
    additionalProperty,
  };
}

export function buildServiceSchema(service: {
  name: string;
  description: string;
  path: string;
  image?: string;
  serviceType?: string;
  areaServedNames?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.serviceType || "Solar Panel Installation & EPC",
    url: toAbsoluteUrl(service.path),
    image: service.image ? toAbsoluteUrl(service.image) : undefined,
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
    areaServed:
      service.areaServedNames && service.areaServedNames.length > 0
        ? service.areaServedNames.map((name) => ({
            "@type": "AdministrativeArea",
            name,
          }))
        : [{ "@type": "Country", name: "India" }],
  };
}

export function buildArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  authorName?: string;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  category?: string;
}) {
  const url = toAbsoluteUrl(`/blog/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: url,
    url,
    image: article.image ? [toAbsoluteUrl(article.image)] : undefined,
    articleSection: article.category || "Solar Energy",
    author: {
      "@type": "Organization",
      name: article.authorName || SITE_NAME,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : undefined,
  };
}

export function extractYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function buildVideoObjectSchema(
  videos: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    uploadDate?: string;
    location?: string;
  }[]
) {
  return (videos || [])
    .filter((v) => v && v.title && v.videoUrl)
    .map((v) => {
      const ytId = extractYouTubeVideoId(v.videoUrl);
      const embedUrl = ytId
        ? `https://www.youtube.com/embed/${ytId}`
        : undefined;
      const thumb =
        v.thumbnailUrl ||
        (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined);

      // Convert MM:SS to ISO 8601 duration (PTxMyS) if present
      let isoDuration: string | undefined;
      if (v.duration && /^\d{1,2}:\d{2}$/.test(v.duration.trim())) {
        const [mins, secs] = v.duration.trim().split(":").map(Number);
        isoDuration = `PT${mins}M${secs}S`;
      }

      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: v.title,
        description: v.description || v.title,
        thumbnailUrl: thumb ? [toAbsoluteUrl(thumb)] : undefined,
        uploadDate: v.uploadDate || "2026-01-01T00:00:00+05:30",
        ...(isoDuration ? { duration: isoDuration } : {}),
        ...(embedUrl ? { embedUrl } : { contentUrl: toAbsoluteUrl(v.videoUrl) }),
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
      };
    });
}
