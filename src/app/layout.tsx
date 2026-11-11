import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import NavigationProgress from "@/components/ui/NavigationProgress";
import GoogleAnalyticsConsent from "@/components/analytics/GoogleAnalyticsConsent";
import JsonLd from "@/components/seo/JsonLd";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/constants/social";
import { BASE_URL, SITE_NAME, toAbsoluteUrl } from "@/lib/seo-config";
import { getGlobalSeoSettings } from "@/lib/seo-server";
import { getPublicShellSettings } from "@/lib/cms-server";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo-schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeoSettings();
  const ogImage = toAbsoluteUrl(seo.defaultOgImage);
  const keywordList = seo.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate || "%s | VIJOY POWER SOLUTION",
    },
    description: seo.defaultDesc,
    keywords: keywordList,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    verification: seo.googleSiteVerification
      ? { google: seo.googleSiteVerification }
      : undefined,
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDesc,
      url: BASE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${seo.defaultImageAltSuffix}`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDesc,
      images: [ogImage],
    },
    robots: {
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
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seoConfig, shell] = await Promise.all([
    getGlobalSeoSettings(),
    getPublicShellSettings(),
  ]);

  const general = shell.general || {};
  const footer = shell.headerFooter?.footer || {};
  const socialLinks = shell.headerFooter?.socialLinks || {};

  const sameAs = Array.from(
    new Set(
      [
        socialLinks.youtube || DEFAULT_SOCIAL_LINKS.youtube,
        socialLinks.instagram || DEFAULT_SOCIAL_LINKS.instagram,
        socialLinks.facebook || DEFAULT_SOCIAL_LINKS.facebook,
      ].filter((u) => typeof u === "string" && /^https?:\/\//i.test(u))
    )
  );

  const orgSchema = seoConfig.enableOrganizationSchema
    ? buildOrganizationSchema({
        phone: footer.phone || general.phone,
        email: footer.email || general.email,
        address: footer.address || general.address,
        logoUrl: shell.headerFooter?.logoUrl || "/images/logo.png",
        description: seoConfig.defaultDesc,
        sameAs,
      })
    : null;

  const websiteSchema = buildWebSiteSchema();

  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {orgSchema && <JsonLd data={orgSchema} />}
        <JsonLd data={websiteSchema} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
          <GoogleAnalyticsConsent
            ga4MeasurementId={seoConfig.ga4MeasurementId}
            enableConsentBanner={seoConfig.enableConsentBanner}
          />
        </Suspense>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
