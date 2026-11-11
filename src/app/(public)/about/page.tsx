import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Compass, Sparkles, Quote, ArrowRight } from "lucide-react";
import StatsSection from "@/components/public/StatsSection";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import Setting from "@/models/Setting";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export const metadata: Metadata = {
  title: "About Us | VIJOY POWER SOLUTION Solar EPC",
  description:
    "Learn about VIJOY POWER SOLUTION, leading solar engineering and installation contractor operating across India.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let dynamicPage: any = null;
  let cmsAbout: any = null;

  try {
    await connectDB();
    const [pageDoc, settingDoc] = await Promise.all([
      Page.findOne({ slug: "about", isPublished: true }).lean(),
      Setting.findOne({ key: "about_page" }).lean(),
    ]);
    dynamicPage = pageDoc;
    if (settingDoc && settingDoc.value) {
      cmsAbout = settingDoc.value;
    }
  } catch (err) {
    console.error("Error loading dynamic about page:", err);
  }

  // Fallbacks combined with dynamic CMS
  const heroBadge = cmsAbout?.hero?.badge || "Company Profile & Engineering Philosophy";
  const title = cmsAbout?.hero?.title || dynamicPage?.title || "About VIJOY POWER SOLUTION";
  const heroSubtitle =
    cmsAbout?.hero?.subtitle ||
    dynamicPage?.heroSubtitle ||
    "Delivering clean, dependable solar rooftop engineering, ALMM-compliant panel supply, and seamless DISCOM net-metering across India.";
  const rawHeroImage = cmsAbout?.hero?.imageUrl || dynamicPage?.heroImage || "";
  const heroImage = getCleanPublicImage(rawHeroImage);

  const storyBadge = cmsAbout?.narrative?.badge || "Engineering Heritage";
  const storyHeadline =
    cmsAbout?.narrative?.headline || "Empowering India with Dependable Renewable Energy";
  const paragraph1 =
    cmsAbout?.narrative?.paragraph1 ||
    "VIJOY POWER SOLUTION was founded with a singular conviction: renewable energy must be engineered for real Indian operating conditions. Solar panels across Indian states face intense summer heat exceeding 45°C, high dust deposition, and severe monsoon winds.";
  const paragraph2 =
    cmsAbout?.narrative?.paragraph2 ||
    "We bridge the gap between premium tier-1 equipment and flawless civil-electrical execution. From 10W specialized modules up to 730W high-efficiency Heterojunction and N-Type TOPCon bifacial arrays, every system is designed around the customer's exact roof geometry and energy consumption pattern.";
  const missionTitle = cmsAbout?.narrative?.missionTitle || "Our Mission";
  const missionDesc =
    cmsAbout?.narrative?.missionDesc ||
    "To make rooftop solar the most dependable, cost-effective power source for every home and enterprise.";
  const valuesTitle = cmsAbout?.narrative?.valuesTitle || "Our Core Value";
  const valuesDesc =
    cmsAbout?.narrative?.valuesDesc ||
    "Uncompromising engineering transparency: verified equipment, no fake pricing, and zero shortcuts on safety.";

  const pillars = cmsAbout?.pillars || [
    {
      title: "Tier-1 ALMM Module Supply",
      desc: "Strictly deploy ALMM-listed mono PERC and N-type TOPCon modules ranging from 10W to 730W with 25-30 year linear output warranties.",
    },
    {
      title: "Rigorous Civil & Wind Engineering",
      desc: "Hot-dip galvanized mounting structures engineered to withstand 150 km/h wind gusts, anchored with non-destructive ballasts.",
    },
    {
      title: "DISCOM Liaison Mastery",
      desc: "End-to-end liaison with state electricity utility boards (DISCOMs) across India for rapid feasibility approval and net-meter synchronization.",
    },
    {
      title: "Nationwide Field Support",
      desc: "Trained resident technicians and certified installation teams across India ensuring prompt routine maintenance and warranty service.",
    },
  ];

  const leadership = cmsAbout?.leadership || {
    quote:
      "Solar rooftop adoption is not just an equipment sale — it is a quarter-century engineering commitment to our clients across India.",
    author: "Eng. Vijay Kumar",
    designation: "Founder & Chief Technical Director",
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {heroBadge}
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
                {storyBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
                {storyHeadline}
              </h2>
              {dynamicPage?.contentHtml ? (
                <div
                  className="prose prose-slate max-w-none text-sm sm:text-base text-slate-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: dynamicPage.contentHtml }}
                />
              ) : (
                <>
                  <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                    {paragraph1}
                  </p>
                  <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                    {paragraph2}
                  </p>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-border bg-slate-bg/60 space-y-1">
                  <h4 className="text-sm font-bold text-navy-800">{missionTitle}</h4>
                  <p className="text-xs text-slate-muted">{missionDesc}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-border bg-slate-bg/60 space-y-1">
                  <h4 className="text-sm font-bold text-navy-800">{valuesTitle}</h4>
                  <p className="text-xs text-slate-muted">{valuesDesc}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-border h-96 sm:h-[450px] bg-navy-900">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt="Solar installation engineering"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <SolarCardPlaceholder title={title} subtitle={heroBadge} />
                )}
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

      {/* Standards & Benchmarks (CMS Controlled) */}
      <section className="py-20 bg-slate-bg border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              Engineering Benchmarks
            </span>
            <h2 className="text-3xl font-display font-extrabold text-navy-800">
              Our Non-Negotiable Quality Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-muted">
              Every solar plant engineered by VIJOY POWER SOLUTION adheres to certified structural, electrical, and DISCOM criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-xl bg-navy-800 text-solar-yellow flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-navy-800">{pillar.title}</h3>
                  <p className="text-xs text-slate-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Leadership Note */}
          {leadership?.quote && (
            <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-border shadow-md max-w-3xl mx-auto flex items-start gap-4">
              <Quote className="w-10 h-10 text-solar-green shrink-0 opacity-40 mt-1" />
              <div className="space-y-3">
                <p className="text-sm sm:text-base italic text-navy-800 font-medium leading-relaxed">
                  &ldquo;{leadership.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-bold text-navy-800">{leadership.author}</h4>
                  <p className="text-[11px] text-solar-green font-semibold">{leadership.designation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
