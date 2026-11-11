import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/constants/social";

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

export const metadata: Metadata = {
  title: {
    default: "VIJOY POWER SOLUTION | Premier Solar Panel Installation & EPC Across India",
    template: "%s | VIJOY POWER SOLUTION",
  },
  description:
    "Turnkey solar power solutions, high-efficiency solar panels (10W-730W), PM Surya Ghar subsidy assistance, and DISCOM net-metering across India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vijoypowersolution.com"),
  keywords: [
    "Solar panel installation in India",
    "Pan India solar EPC contractor",
    "Solar rooftop installation across India",
    "Vikram Solar panel dealer India",
    "Adani Solar panel installation India",
    "Waaree and Loom Solar modules India",
    "PM Surya Ghar Muft Bijli Yojana",
    "Commercial solar installation India",
    "10W to 730W solar panels",
  ],
  authors: [{ name: "VIJOY POWER SOLUTION" }],
  openGraph: {
    title: "VIJOY POWER SOLUTION — Renewable Solar Energy Engineering",
    description:
      "Reliable solar panel solutions and professional rooftop installation serving customers across India.",
    url: "https://vijoypowersolution.com",
    siteName: "VIJOY POWER SOLUTION",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "VIJOY POWER SOLUTION Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "VIJOY POWER SOLUTION",
    image: "https://vijoypowersolution.com/images/logo.png",
    telephone: "+91-9431000000",
    email: "contact@vijoypowersolution.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Road, Near Power Grid Substation",
      addressLocality: "Gaya",
      addressRegion: "Bihar",
      postalCode: "823001",
      addressCountry: "IN",
    },
    areaServed: "India",
    sameAs: [
      DEFAULT_SOCIAL_LINKS.youtube,
      DEFAULT_SOCIAL_LINKS.instagram,
      DEFAULT_SOCIAL_LINKS.facebook,
    ],
    description:
      "Solar EPC contractor providing rooftop solar installations, solar panels from 10W to 730W, and PM Surya Ghar subsidy assistance across India.",
    priceRange: "Consultation-Based",
  };

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
