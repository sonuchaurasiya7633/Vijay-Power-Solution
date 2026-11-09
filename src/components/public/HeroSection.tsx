import Link from "next/link";
import { ShieldCheck, Sun, CheckCircle2, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";

export default async function HeroSection() {
  let homePage: any = null;
  try {
    await connectDB();
    homePage = await Page.findOne({ slug: "home", isPublished: true }).lean();
  } catch (e) {
    // fallback gracefully
  }

  const badgeText = homePage?.sections?.[0]?.badgeText || "Certified Solar EPC • Bihar | Jharkhand | Uttar Pradesh";
  const heroHeading = homePage?.heroHeading || "Power Your Future with Solar Energy";
  const heroSubtitle =
    homePage?.heroSubtitle ||
    "Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand, and Uttar Pradesh. Complete engineering, DISCOM net metering liaison, and PM Surya Ghar subsidy guidance.";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white py-16 lg:py-24">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F6C453_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-solar-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-solar-yellow/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-solar-yellow backdrop-blur-sm">
              <Sun className="w-3.5 h-3.5 text-solar-yellow animate-spin-slow" />
              <span>{badgeText}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              {heroHeading.includes("Solar Energy") ? (
                <>
                  {heroHeading.replace("Solar Energy", "")}
                  <span className="text-solar-green">Solar Energy</span>
                </>
              ) : (
                heroHeading
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              {heroSubtitle}
            </p>

            {/* Quick trust checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
                <span>Modules from <strong>10W to 730W</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
                <span>Up to ₹78,000 Govt Subsidy Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
                <span>Heavy-Duty Hot-Dip Galvanized Mounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
                <span>25-Year Linear Power Warranty</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/get-quote"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span>Get Free Solar Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-colors"
              >
                Explore Real Installations
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-solar-yellow shrink-0" />
              <span>Strict Transparency: No hidden costs. Zero public pricing fabrication. Private quotations only.</span>
            </div>
          </div>

          {/* Right Column: Hero Quick Consultation Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-border relative">
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-1 rounded-full">
                  Fast Rooftop Evaluation
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Request Free Site Feasibility
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Connect directly with our regional solar engineer.
                </p>
              </div>

              <LeadCaptureForm compact buttonText="Request Free Consultation" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
