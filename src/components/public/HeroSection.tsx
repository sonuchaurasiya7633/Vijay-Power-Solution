import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import Page from "@/models/Page";

export default async function HeroSection() {
  let heroData = {
    badge: "Certified Solar EPC • Bihar | Jharkhand | Uttar Pradesh",
    headline: "Power Your Future with Solar Energy",
    subheading:
      "Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand, and Uttar Pradesh. Complete engineering, DISCOM net metering liaison, and PM Surya Ghar subsidy guidance.",
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
    await connectDB();
    const [homeSetting, homePage] = await Promise.all([
      Setting.findOne({ key: "homepage" }).lean(),
      Page.findOne({ slug: "home", isPublished: true }).lean(),
    ]);

    if (homeSetting && homeSetting.value) {
      const val: any = homeSetting.value;
      if (val.hero) {
        heroData = { ...heroData, ...val.hero };
      } else {
        if (val.headline) heroData.headline = val.headline;
        if (val.subheading) heroData.subheading = val.subheading;
      }
    } else if (homePage) {
      if (homePage.heroHeading) heroData.headline = homePage.heroHeading;
      if (homePage.heroSubtitle) heroData.subheading = homePage.heroSubtitle;
      if (homePage.sections?.[0]?.badgeText) heroData.badge = homePage.sections[0].badgeText;
    }
  } catch (e) {
    // fallback gracefully
  }

  const heroHeading = heroData.headline;
  const heroSubtitle = heroData.subheading;
  const checkpoints = heroData.checkpoints || [];
  const bgImage = heroData.backgroundImage || "/images/hero-solar-banner.jpg";

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white min-h-[440px] lg:h-[52vh] lg:min-h-[480px] lg:max-h-[560px] flex items-center py-6 sm:py-8">
      {/* Background Solar Collage Image - 100% Full View (Zero Crop) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="VIJOY POWER SOLUTION - Residential, Commercial & Agricultural Solar EPC"
          fill
          priority
          sizes="100vw"
          className="object-fill object-center w-full h-full"
        />
        {/* Soft dark tint to balance brightness */}
        <div className="absolute inset-0 bg-navy-950/25 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Solid Corporate Navy Card - Zero Glassmorphism, 100% Crisp Background */}
        <div className="max-w-xl lg:max-w-2xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 p-6 sm:p-7 rounded-3xl border border-navy-700 shadow-2xl space-y-4">
          {/* Main Headline with High-Contrast Golden Yellow Accent */}
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-[1.18]">
            {heroHeading.includes("Solar Energy") ? (
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
