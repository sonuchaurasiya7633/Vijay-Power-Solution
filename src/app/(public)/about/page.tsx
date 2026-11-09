import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Users, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import StatsSection from "@/components/public/StatsSection";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";

export const metadata: Metadata = {
  title: "About Us | VIJOY POWER SOLUTION Solar EPC",
  description:
    "Learn about VIJOY POWER SOLUTION, leading solar engineering and installation contractor operating in Bihar, Jharkhand, and Uttar Pradesh.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let dynamicPage: any = null;
  try {
    await connectDB();
    dynamicPage = await Page.findOne({ slug: "about", isPublished: true }).lean();
  } catch (err) {
    console.error("Error loading dynamic about page:", err);
  }

  const title = dynamicPage?.title || "About VIJOY POWER SOLUTION";
  const heroSubtitle =
    dynamicPage?.heroSubtitle ||
    "Delivering clean, dependable solar rooftop engineering, ALMM-compliant panel supply, and seamless DISCOM net-metering across Eastern and Northern India.";

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Company Profile & Engineering Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
                Engineering Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
                Empowering Bihar, Jharkhand & UP with Reliable Renewable Energy
              </h2>
              {dynamicPage?.contentHtml ? (
                <div
                  className="prose prose-slate max-w-none text-sm sm:text-base text-slate-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: dynamicPage.contentHtml }}
                />
              ) : (
                <>
                  <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                    VIJOY POWER SOLUTION was founded with a singular conviction: renewable energy must be engineered for real Indian operating conditions. Solar panels in Bihar and Uttar Pradesh face intense summer heat exceeding 45°C, high dust deposition, and severe monsoon winds.
                  </p>
                  <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                    We bridge the gap between premium tier-1 equipment and flawless civil-electrical execution. From 10W specialized modules up to 730W high-efficiency Heterojunction and N-Type TOPCon bifacial arrays, every system is designed around the customer&apos;s exact roof geometry and energy consumption pattern.
                  </p>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-border bg-slate-bg/60 space-y-1">
                  <h4 className="text-sm font-bold text-navy-800">Our Mission</h4>
                  <p className="text-xs text-slate-muted">To make rooftop solar the most dependable, cost-effective power source for every home and enterprise.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-border bg-slate-bg/60 space-y-1">
                  <h4 className="text-sm font-bold text-navy-800">Our Core Value</h4>
                  <p className="text-xs text-slate-muted">Uncompromising engineering transparency: verified equipment, no fake pricing, and zero shortcuts on safety.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-border h-96 sm:h-[450px]">
                <Image
                  src={dynamicPage?.heroImage || "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&q=85"}
                  alt="Solar installation engineering"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections if configured in Page Builder */}
      {dynamicPage?.sections && dynamicPage.sections.filter((s: any) => s.isVisible).map((sec: any) => (
        <section key={sec.sectionId} className="py-16 border-t border-slate-border bg-slate-bg/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {sec.badgeText && (
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
                {sec.badgeText}
              </span>
            )}
            {sec.title && (
              <h2 className="text-3xl font-display font-extrabold text-navy-800">{sec.title}</h2>
            )}
            {sec.subtitle && (
              <p className="text-sm text-slate-muted max-w-3xl">{sec.subtitle}</p>
            )}
            {sec.content && (
              <div
                className="prose prose-slate max-w-none text-sm text-slate-muted"
                dangerouslySetInnerHTML={{ __html: sec.content }}
              />
            )}
            {sec.items && sec.items.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {sec.items.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-2">
                    {item.title && <h3 className="text-base font-bold text-navy-800">{item.title}</h3>}
                    {item.description && <p className="text-xs text-slate-muted">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Stats */}
      <StatsSection />

      {/* Leadership & Standards */}
      <section className="py-20 bg-slate-bg border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              Quality Principles
            </span>
            <h2 className="text-3xl font-display font-extrabold text-navy-800">
              Our Non-Negotiable Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-muted">
              Every installation executed by VIJOY POWER SOLUTION adheres to strict structural, electrical, and regulatory criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-3">
              <ShieldCheck className="w-8 h-8 text-solar-green" />
              <h3 className="text-base font-bold text-navy-800">ALMM & BIS Verified</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                We supply modules that are formally included in the Approved List of Models and Manufacturers (ALMM) issued by the Ministry of New and Renewable Energy (MNRE).
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-3">
              <Compass className="w-8 h-8 text-solar-yellow-hover" />
              <h3 className="text-base font-bold text-navy-800">Precision Structural Safety</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                All mounting frames utilize 80-micron hot-dip galvanized steel, stainless steel A2/A4 fasteners, and engineered ballast or chemical anchors to prevent roof leaks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-3">
              <Award className="w-8 h-8 text-navy-800" />
              <h3 className="text-base font-bold text-navy-800">Triple Earthing & SPD Protection</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Complete isolation between AC, DC, and lightning arrester chemical earthing electrodes, protecting sensitive home appliances from grid and lightning surges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
