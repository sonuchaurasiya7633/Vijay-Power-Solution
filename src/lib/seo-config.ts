import type { Metadata } from "next";

export const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://vijoypowersolution.com"
).replace(/\/+$/, "");

export const SITE_NAME = "VIJOY POWER SOLUTION (VPS Solar)";
export const DEFAULT_OG_IMAGE = "/images/logo.png";
export const OFFICIAL_SOLAR_BRANDS = [
  "Vikram Solar",
  "Adani Solar",
  "Waaree",
  "Loom Solar",
] as const;

export interface RouteSeoOverride {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  excludeFromSitemap?: boolean;
  primaryKeyword?: string;
}

export interface GlobalSeoConfig {
  defaultTitle: string;
  titleTemplate: string;
  defaultDesc: string;
  keywords: string;
  defaultOgImage: string;
  defaultImageAltSuffix: string;
  googleSiteVerification: string;
  ga4MeasurementId: string;
  enableConsentBanner: boolean;
  enableOrganizationSchema: boolean;
  enableBreadcrumbSchema: boolean;
  routeOverrides: Record<string, RouteSeoOverride>;
}

export interface SeoRouteDefinition {
  key: string;
  label: string;
  path: string;
  defaultTitle: string;
  defaultDescription: string;
  primaryKeyword: string;
  schemaType: string;
}

export const SEO_ROUTE_DEFINITIONS: SeoRouteDefinition[] = [
  {
    key: "home",
    label: "Home Page",
    path: "/",
    defaultTitle:
      "Solar Panel Installation Across India | VIJOY POWER SOLUTION (VPS Solar)",
    defaultDescription:
      "Pan-India turnkey rooftop solar installation, industrial EPC & ALMM solar panels (10W–730W) from Vikram Solar, Adani Solar, Waaree & Loom Solar with net metering & subsidy support.",
    primaryKeyword: "Solar Panel Installation in India",
    schemaType: "LocalBusiness + WebSite",
  },
  {
    key: "solar-panels",
    label: "Solar Panels Catalog (10W–730W)",
    path: "/solar-panels",
    defaultTitle:
      "Solar Panels 10W to 730W — Vikram, Adani, Waaree & Loom Solar | VPS Solar",
    defaultDescription:
      "Explore BIS & ALMM certified 10W–730W Mono PERC, Bifacial & N-Type TOPCon solar panels from Vikram Solar, Adani Solar, Waaree & Loom Solar supplied across India.",
    primaryKeyword: "Solar Panel Supplier in India",
    schemaType: "CollectionPage + ItemList",
  },
  {
    key: "solar-solutions",
    label: "Solar Solutions (Home, Commercial, Industrial, Pump)",
    path: "/solar-solutions",
    defaultTitle:
      "Residential, Commercial, Industrial & Solar Water Pump Solutions | VPS Solar",
    defaultDescription:
      "Engineered on-grid, off-grid, hybrid rooftop solar systems and agricultural solar water pump installations designed for homes, businesses, and factories across India.",
    primaryKeyword: "Rooftop Solar System Installation",
    schemaType: "Service",
  },
  {
    key: "services",
    label: "Installation & EPC Services",
    path: "/services",
    defaultTitle:
      "Best Solar EPC & Net Metering Installation Services in India | VPS Solar",
    defaultDescription:
      "End-to-end solar site survey, structural engineering, DISCOM net metering approval, PM Surya Ghar subsidy assistance, and preventive AMC across all Indian states.",
    primaryKeyword: "Best Solar Installation Company in India",
    schemaType: "Service",
  },
  {
    key: "projects",
    label: "Completed Solar Projects",
    path: "/projects",
    defaultTitle:
      "Completed Rooftop & Commercial Solar Installation Projects Across India | VPS Solar",
    defaultDescription:
      "Browse commissioned residential, institutional, and industrial rooftop solar power plants engineered by Vijoy Power Solution across India.",
    primaryKeyword: "Commercial Solar Installation",
    schemaType: "CollectionPage",
  },
  {
    key: "service-areas",
    label: "Pan-India Service Areas",
    path: "/service-areas",
    defaultTitle:
      "Pan-India Solar Installation Coverage — All 28 States & 8 UTs | VPS Solar",
    defaultDescription:
      "Nationwide solar panel supply, rooftop EPC, and technical site surveys delivered across every Indian state and union territory with regional DISCOM expertise.",
    primaryKeyword: "Solar Panel Installation in India",
    schemaType: "Service + LocalBusiness",
  },
  {
    key: "subsidy-information",
    label: "PM Surya Ghar Subsidy Guide",
    path: "/subsidy-information",
    defaultTitle:
      "PM Surya Ghar Muft Bijli Yojana Rooftop Solar Subsidy Guide | VPS Solar",
    defaultDescription:
      "Complete guide to central rooftop solar subsidy rules, ALMM DCR compliance, DISCOM net metering, and eligibility documentation for Indian homeowners.",
    primaryKeyword: "Residential Solar Installation Subsidy India",
    schemaType: "FAQPage + WebPage",
  },
  {
    key: "solar-calculator",
    label: "Solar Savings Calculator",
    path: "/solar-calculator",
    defaultTitle:
      "Rooftop Solar System Sizing & Electricity Savings Calculator India | VPS Solar",
    defaultDescription:
      "Estimate required solar kW capacity, roof area, and monthly electricity bill savings for your home or commercial building anywhere in India.",
    primaryKeyword: "Solar Calculator India",
    schemaType: "WebApplication",
  },
  {
    key: "get-quote",
    label: "Request Free Quote",
    path: "/get-quote",
    defaultTitle:
      "Get Free Solar Rooftop Quotation & Technical Consultation | VPS Solar",
    defaultDescription:
      "Request a customized solar EPC proposal and bill-of-materials consultation for residential, commercial, or industrial rooftop projects anywhere in India.",
    primaryKeyword: "Solar Installation Quote India",
    schemaType: "ContactPage",
  },
  {
    key: "request-site-survey",
    label: "Request Site Survey",
    path: "/request-site-survey",
    defaultTitle:
      "Book Free Solar Rooftop Technical Site Survey Across India | VPS Solar",
    defaultDescription:
      "Schedule an engineering roof assessment, shadow analysis, and load feasibility inspection with Vijoy Power Solution for your home or factory.",
    primaryKeyword: "Solar Site Survey India",
    schemaType: "ContactPage",
  },
  {
    key: "about",
    label: "About Vijoy Power Solution",
    path: "/about",
    defaultTitle:
      "About VIJOY POWER SOLUTION (VPS Solar) — Pan-India Solar EPC Partner",
    defaultDescription:
      "Learn about Vijoy Power Solution's solar engineering standards, authorized Vikram, Adani, Waaree & Loom module partnerships, and nationwide service delivery.",
    primaryKeyword: "VIJOY POWER SOLUTION VPS Solar",
    schemaType: "AboutPage",
  },
  {
    key: "contact",
    label: "Contact Us",
    path: "/contact",
    defaultTitle:
      "Contact VIJOY POWER SOLUTION (VPS Solar) — Helpline & Engineering Desk",
    defaultDescription:
      "Reach Vijoy Power Solution for residential rooftop solar enquiries, industrial EPC tenders, ALMM panel supply, and site survey scheduling across India.",
    primaryKeyword: "Contact VPS Solar India",
    schemaType: "ContactPage",
  },
  {
    key: "testimonials",
    label: "Customer Testimonials",
    path: "/testimonials",
    defaultTitle:
      "Customer Stories & Solar Installation Reviews | VIJOY POWER SOLUTION",
    defaultDescription:
      "Read genuine feedback from homeowners, schools, commercial facilities, and agricultural clients powered by Vijoy Power Solution across India.",
    primaryKeyword: "VPS Solar Customer Reviews",
    schemaType: "WebPage",
  },
  {
    key: "gallery",
    label: "Installation Photo Gallery",
    path: "/gallery",
    defaultTitle:
      "Rooftop Solar Installation Photo Gallery & Mounting Showcase | VPS Solar",
    defaultDescription:
      "Inspect elevated GI mounting structures, earthing, ACDB/DCDB wiring, and completed rooftop solar arrays commissioned by Vijoy Power Solution.",
    primaryKeyword: "Solar Installation Photos India",
    schemaType: "ImageGallery",
  },
  {
    key: "videos",
    label: "Installation Video Stories",
    path: "/videos",
    defaultTitle:
      "Solar Installation Walkthroughs & Commissioning Videos | VPS Solar",
    defaultDescription:
      "Watch real site surveys, elevated structure fabrications, inverter commissioning, and rooftop solar walkthroughs by Vijoy Power Solution.",
    primaryKeyword: "Solar Installation Videos",
    schemaType: "VideoObject",
  },
  {
    key: "blog",
    label: "Solar Knowledge Hub / Blog",
    path: "/blog",
    defaultTitle:
      "Solar Engineering Guides, Subsidy Updates & Buyer Tips | VPS Solar Blog",
    defaultDescription:
      "Expert articles on Mono PERC vs N-Type TOPCon panels, net metering, PM Surya Ghar rules, and rooftop maintenance for Indian conditions.",
    primaryKeyword: "Solar Energy Blog India",
    schemaType: "Blog",
  },
  {
    key: "faqs",
    label: "Frequently Asked Questions",
    path: "/faqs",
    defaultTitle:
      "Solar Panel Installation, Net Metering & Warranty FAQs | VPS Solar",
    defaultDescription:
      "Clear answers on solar system sizing, 10W–730W module selection, rooftop structure wind resistance, net metering, and 25–30 year warranties.",
    primaryKeyword: "Rooftop Solar FAQs India",
    schemaType: "FAQPage",
  },
  {
    key: "privacy-policy",
    label: "Privacy Policy",
    path: "/privacy-policy",
    defaultTitle: "Privacy Policy | VIJOY POWER SOLUTION (VPS Solar)",
    defaultDescription:
      "How Vijoy Power Solution collects, protects, and uses customer enquiry details, site survey records, and technical consultation requests.",
    primaryKeyword: "VPS Solar Privacy Policy",
    schemaType: "WebPage",
  },
  {
    key: "terms-and-conditions",
    label: "Terms & Conditions",
    path: "/terms-and-conditions",
    defaultTitle: "Terms and Conditions | VIJOY POWER SOLUTION (VPS Solar)",
    defaultDescription:
      "Terms governing engineering quotations, site surveys, solar module warranties, and EPC installation contracts with Vijoy Power Solution.",
    primaryKeyword: "VPS Solar Terms and Conditions",
    schemaType: "WebPage",
  },
  {
    key: "disclaimer",
    label: "Regulatory & Engineering Disclaimer",
    path: "/disclaimer",
    defaultTitle: "Regulatory & Engineering Disclaimer | VIJOY POWER SOLUTION",
    defaultDescription:
      "Disclaimers covering indicative solar generation estimates, central/state DISCOM policies, and final site-specific BOM quotations.",
    primaryKeyword: "VPS Solar Disclaimer",
    schemaType: "WebPage",
  },
];

export const DEFAULT_GLOBAL_SEO_CONFIG: GlobalSeoConfig = {
  defaultTitle:
    "VIJOY POWER SOLUTION (VPS Solar) | Pan-India Solar EPC & 10W–730W Panel Supplier",
  titleTemplate: "%s | VIJOY POWER SOLUTION",
  defaultDesc:
    "Authorized Pan-India solar EPC installer supplying Vikram Solar, Adani Solar, Waaree & Loom Solar modules (10W–730W) for residential, commercial, industrial & agricultural solar plants.",
  keywords:
    "Solar Panel Installation in India, Best Solar Installation Company in India, Residential Solar Installation, Commercial Solar Installation, Industrial Rooftop Solar Solutions, Solar Water Pump Installation, Solar Panel Supplier in India, Rooftop Solar System Installation, Vikram Solar, Adani Solar, Waaree Solar, Loom Solar, VIJOY POWER SOLUTION, VPS Solar",
  defaultOgImage: DEFAULT_OG_IMAGE,
  defaultImageAltSuffix: "VIJOY POWER SOLUTION Pan-India Solar EPC",
  googleSiteVerification: "",
  ga4MeasurementId: "",
  enableConsentBanner: true,
  enableOrganizationSchema: true,
  enableBreadcrumbSchema: true,
  routeOverrides: {},
};

export function mergeGlobalSeoConfig(
  raw?: Record<string, any> | null
): GlobalSeoConfig {
  const input = raw && typeof raw === "object" ? raw : {};
  const routeOverrides: Record<string, RouteSeoOverride> = {};

  if (input.routeOverrides && typeof input.routeOverrides === "object") {
    for (const [k, v] of Object.entries(input.routeOverrides)) {
      if (v && typeof v === "object") {
        routeOverrides[k] = { ...(v as RouteSeoOverride) };
      }
    }
  }

  return {
    defaultTitle:
      typeof input.defaultTitle === "string" && input.defaultTitle.trim()
        ? input.defaultTitle.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.defaultTitle,
    titleTemplate:
      typeof input.titleTemplate === "string" && input.titleTemplate.trim()
        ? input.titleTemplate.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.titleTemplate,
    defaultDesc:
      typeof input.defaultDesc === "string" && input.defaultDesc.trim()
        ? input.defaultDesc.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.defaultDesc,
    keywords:
      typeof input.keywords === "string" && input.keywords.trim()
        ? input.keywords.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.keywords,
    defaultOgImage:
      typeof input.defaultOgImage === "string" && input.defaultOgImage.trim()
        ? input.defaultOgImage.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.defaultOgImage,
    defaultImageAltSuffix:
      typeof input.defaultImageAltSuffix === "string" &&
      input.defaultImageAltSuffix.trim()
        ? input.defaultImageAltSuffix.trim()
        : DEFAULT_GLOBAL_SEO_CONFIG.defaultImageAltSuffix,
    googleSiteVerification:
      typeof input.googleSiteVerification === "string"
        ? input.googleSiteVerification.trim()
        : "",
    ga4MeasurementId:
      typeof input.ga4MeasurementId === "string"
        ? input.ga4MeasurementId.trim()
        : "",
    enableConsentBanner:
      typeof input.enableConsentBanner === "boolean"
        ? input.enableConsentBanner
        : DEFAULT_GLOBAL_SEO_CONFIG.enableConsentBanner,
    enableOrganizationSchema:
      typeof input.enableOrganizationSchema === "boolean"
        ? input.enableOrganizationSchema
        : DEFAULT_GLOBAL_SEO_CONFIG.enableOrganizationSchema,
    enableBreadcrumbSchema:
      typeof input.enableBreadcrumbSchema === "boolean"
        ? input.enableBreadcrumbSchema
        : DEFAULT_GLOBAL_SEO_CONFIG.enableBreadcrumbSchema,
    routeOverrides,
  };
}

export function toAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return BASE_URL;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return BASE_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return normalizedPath === "/" ? BASE_URL : `${BASE_URL}${normalizedPath}`;
}

export interface BuildMetadataParams {
  routeKey?: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  keywords?: string[];
  seoConfig?: GlobalSeoConfig;
  dynamicOverride?: RouteSeoOverride;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildNextMetadata({
  routeKey,
  path,
  fallbackTitle,
  fallbackDescription,
  keywords = [],
  seoConfig = DEFAULT_GLOBAL_SEO_CONFIG,
  dynamicOverride,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataParams): Metadata {
  const cmsRouteOverride = routeKey
    ? seoConfig.routeOverrides?.[routeKey]
    : undefined;
  const registryDef = routeKey
    ? SEO_ROUTE_DEFINITIONS.find((r) => r.key === routeKey)
    : undefined;

  const title =
    dynamicOverride?.title?.trim() ||
    cmsRouteOverride?.title?.trim() ||
    registryDef?.defaultTitle ||
    fallbackTitle ||
    seoConfig.defaultTitle;

  const description =
    dynamicOverride?.description?.trim() ||
    cmsRouteOverride?.description?.trim() ||
    registryDef?.defaultDescription ||
    fallbackDescription ||
    seoConfig.defaultDesc;

  const canonical = toAbsoluteUrl(
    dynamicOverride?.canonicalUrl?.trim() ||
      cmsRouteOverride?.canonicalUrl?.trim() ||
      path
  );

  const ogTitle =
    dynamicOverride?.ogTitle?.trim() ||
    cmsRouteOverride?.ogTitle?.trim() ||
    title;
  const ogDescription =
    dynamicOverride?.ogDescription?.trim() ||
    cmsRouteOverride?.ogDescription?.trim() ||
    description;
  const ogImageUrl = toAbsoluteUrl(
    dynamicOverride?.ogImage?.trim() ||
      cmsRouteOverride?.ogImage?.trim() ||
      seoConfig.defaultOgImage ||
      DEFAULT_OG_IMAGE
  );

  const mergedKeywords = Array.from(
    new Set(
      [
        ...keywords,
        ...(cmsRouteOverride?.keywords
          ? cmsRouteOverride.keywords.split(",")
          : []),
        ...(cmsRouteOverride?.primaryKeyword
          ? [cmsRouteOverride.primaryKeyword]
          : []),
        ...(registryDef?.primaryKeyword ? [registryDef.primaryKeyword] : []),
      ]
        .map((k) => k.trim())
        .filter(Boolean)
    )
  );

  const noIndex = Boolean(
    dynamicOverride?.noIndex ?? cmsRouteOverride?.noIndex ?? false
  );

  return {
    title: routeKey === "home" ? { absolute: title } : title,
    description,
    keywords: mergedKeywords.length > 0 ? mergedKeywords : undefined,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${ogTitle} — ${seoConfig.defaultImageAltSuffix}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}

export interface SeoQualityReport {
  score: number;
  titleLength: number;
  descriptionLength: number;
  checks: { label: string; status: "pass" | "warn" | "fail"; message: string }[];
}

export function analyzeSeoQuality(input: {
  title?: string;
  description?: string;
  keyword?: string;
  canonical?: string;
}): SeoQualityReport {
  const title = (input.title || "").trim();
  const description = (input.description || "").trim();
  const keyword = (input.keyword || "").trim().toLowerCase();
  const checks: SeoQualityReport["checks"] = [];
  let score = 0;

  // Title check (30 pts)
  if (title.length >= 30 && title.length <= 68) {
    score += 30;
    checks.push({
      label: "Title Length",
      status: "pass",
      message: `${title.length} chars (ideal 30–68 chars)`,
    });
  } else if (title.length > 0) {
    score += 15;
    checks.push({
      label: "Title Length",
      status: "warn",
      message: `${title.length} chars — aim for 45–65 chars for full desktop/mobile SERP display`,
    });
  } else {
    checks.push({
      label: "Title Length",
      status: "fail",
      message: "Meta title is empty",
    });
  }

  // Description check (30 pts)
  if (description.length >= 110 && description.length <= 165) {
    score += 30;
    checks.push({
      label: "Meta Description",
      status: "pass",
      message: `${description.length} chars (ideal 110–165 chars)`,
    });
  } else if (description.length >= 50) {
    score += 18;
    checks.push({
      label: "Meta Description",
      status: "warn",
      message: `${description.length} chars — aim for 120–160 chars`,
    });
  } else {
    checks.push({
      label: "Meta Description",
      status: "fail",
      message: "Meta description is too short or missing",
    });
  }

  // Primary Keyword alignment (25 pts)
  if (!keyword) {
    score += 15;
    checks.push({
      label: "Focus Keyword",
      status: "warn",
      message: "Add a focus keyword to evaluate topical alignment",
    });
  } else {
    const inTitle = title.toLowerCase().includes(keyword);
    const inDesc = description.toLowerCase().includes(keyword);
    if (inTitle && inDesc) {
      score += 25;
      checks.push({
        label: "Focus Keyword",
        status: "pass",
        message: "Present naturally in both title and description",
      });
    } else if (inTitle || inDesc) {
      score += 15;
      checks.push({
        label: "Focus Keyword",
        status: "warn",
        message: inTitle
          ? "Found in title; consider adding naturally to description"
          : "Found in description; consider including in title",
      });
    } else {
      checks.push({
        label: "Focus Keyword",
        status: "warn",
        message: `"${keyword}" not matched verbatim in title/description`,
      });
    }
  }

  // Canonical check (15 pts)
  const canonical = (input.canonical || "").trim();
  if (!canonical || canonical.startsWith("/") || /^https?:\/\//i.test(canonical)) {
    score += 15;
    checks.push({
      label: "Canonical URL",
      status: "pass",
      message: canonical ? toAbsoluteUrl(canonical) : "Auto-generated canonical",
    });
  } else {
    checks.push({
      label: "Canonical URL",
      status: "fail",
      message: "Canonical must start with / or https://",
    });
  }

  return {
    score: Math.min(100, score),
    titleLength: title.length,
    descriptionLength: description.length,
    checks,
  };
}
