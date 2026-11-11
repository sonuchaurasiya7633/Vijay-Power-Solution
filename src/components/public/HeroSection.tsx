import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getHomepageSetting } from "@/lib/cms-server";
import { optimizeCloudinaryUrl } from "@/lib/image-optimize";

export default async function HeroSection() {
  let heroData = {
    badge: "Certified Solar EPC • Serving Customers Across India",
    headline: "Professional Solar Panel Installation Services Across India",
    subheading:
      "Vijoy Power Solution delivers reliable solar panel supply and installation solutions for residential, commercial, industrial, and agricultural requirements across India.",
    backgroundImage: "/images/hero-solar-banner.jpg",
    checkpoints: [
      "Modules from 10W to 730W",
      "Up to ₹78,000 Govt Subsidy Guidance",
      "Heavy-Duty Hot-Dip Galvanized Mounts",
      "25-Year Linear Power Warranty",
    ],
    ctaPrimaryText: "Get Free Solar Consultation",
    ctaPrimaryLink: "/get-quote",
    ctaSecondaryText: "Explore Real Installations",
    ctaSecondaryLink: "/projects",
    transparencyNote:
      "Strict Transparency: No hidden costs. Zero public pricing fabrication. Private quotations only.",
  };

  try {
    const homeSettingVal = await getHomepageSetting();
    if (homeSettingVal) {
      if (homeSettingVal.hero) {
        heroData = { ...heroData, ...homeSettingVal.hero };
      } else {
        if (homeSettingVal.headline) heroData.headline = homeSettingVal.headline;
        if (homeSettingVal.subheading) heroData.subheading = homeSettingVal.subheading;
      }
    } else {
      await connectDB();
      const homePage = await Page.findOne({ slug: "home", isPublished: true }).lean();
      if (homePage) {
        if (homePage.heroHeading) heroData.headline = homePage.heroHeading;
        if (homePage.heroSubtitle) heroData.subheading = homePage.heroSubtitle;
        if (homePage.sections?.[0]?.badgeText) heroData.badge = homePage.sections[0].badgeText;
      }
    }
  } catch (e) {
    // fallback gracefully
  }

  const heroHeading = heroData.headline;
  const heroSubtitle = heroData.subheading;
  const checkpoints = heroData.checkpoints || [];
  const bgImage = optimizeCloudinaryUrl(heroData.backgroundImage || "/images/hero-solar-banner.jpg", 1600);

  return (
    <section className="relative overflow-hidden bg-navy-800 text-white py-6 sm:py-8 lg:py-0 lg:h-[52vh] lg:min-h-[480px] lg:max-h-[560px] flex items-center">
      {/* Background Solar Collage Image - Desktop Full View (hidden on mobile, visible lg:block) */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="VIJOY POWER SOLUTION - Residential, Commercial & Agricultural Solar EPC"
          fill
          priority
          sizes="100vw"
          className="object-fill object-center w-full h-full"
        />
        {/* Soft dark tint to balance brightness on desktop */}
        <div className="absolute inset-0 bg-navy-900/25 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2 lg:py-0">
        {/* Mobile Visual Solar Showcase - 100% visible on mobile devices (hidden on lg desktop) */}
        <div className="lg:hidden w-full mb-4 rounded-2xl overflow-hidden border border-navy-700 shadow-2xl relative aspect-[16/9] bg-navy-800 group">
          <Image
            src={bgImage}
            alt="VIJOY POWER SOLUTION - Solar Panels Installation Across India"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-800/90 backdrop-blur-md border border-solar-yellow/40 text-[10px] font-bold text-solar-yellow shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-solar-yellow shrink-0" />
              <span>Pan India Solar EPC • 10W to 730W</span>
            </span>
            <span className="text-[10px] font-bold text-white bg-solar-green/90 px-2.5 py-0.5 rounded-md shadow-sm">
              All Over India
            </span>
          </div>
        </div>

        {/* Solid Corporate Navy Card - Zero Glassmorphism, 100% Crisp Typography */}
        <div className="max-w-xl lg:max-w-2xl bg-navy-800 p-5 sm:p-7 rounded-3xl border border-navy-700 shadow-2xl space-y-4">
          {/* Main Headline with High-Contrast Golden Yellow Accent */}
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-[1.18]">
            {heroHeading.includes("Across India") ? (
              <>
                {heroHeading.replace("Across India", "")}
                <span className="text-solar-yellow font-black">Across India</span>
              </>
            ) : heroHeading.includes("Solar Energy") ? (
              <>
                {heroHeading.replace("Solar Energy", "")}
                <span className="text-solar-yellow font-black">Solar Energy</span>
              </>
            ) : (
              heroHeading
            )}
          </h1>

          {/* Subheading Narrative */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {heroSubtitle}
          </p>

          {/* Trust Checkpoints with Solid Navy Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-100">
            {checkpoints.map((cp: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-navy-800/80 px-3 py-1.5 rounded-xl border border-navy-700 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-solar-yellow shrink-0" />
                <span className="font-semibold text-[11px] sm:text-xs text-slate-200">{cp}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={heroData.ctaPrimaryLink || "/get-quote"}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <span>{heroData.ctaPrimaryText || "Get Free Solar Consultation"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={heroData.ctaSecondaryLink || "/projects"}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 shadow-sm transition-colors"
            >
              {heroData.ctaSecondaryText || "Explore Real Installations"}
            </Link>
          </div>

          {/* Transparency Note */}
          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-solar-yellow shrink-0" />
            <span>{heroData.transparencyNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
