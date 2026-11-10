import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Zap, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Real Installation Portfolio | VIJOY POWER SOLUTION",
  description:
    "Explore customer-confirmed solar installations across India with verified generation outcomes, rooftop photos, and case studies.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    await connectDB();
    projects = await PortfolioProject.find({ isPublished: true })
      .sort({ completionDate: -1 })
      .lean();
  } catch (err) {
    console.warn("Database not reachable during build, using fallback projects");
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Proven Field Work
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Real Installation Portfolio
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Every project listed here represents a genuine rooftop solar plant engineered, installed, and commissioned by VIJOY POWER SOLUTION with documented customer consent.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="group bg-white rounded-3xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-60 w-full bg-navy-100 overflow-hidden">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-solar-green text-white text-xs font-extrabold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{p.systemCapacityKw} kW</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-navy-900/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-solar-yellow" />
                    <span>{p.generalLocation}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green">
                    {p.systemCategory}
                  </span>
                  <h3 className="text-lg font-bold font-display text-navy-800 group-hover:text-solar-green transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-muted leading-relaxed line-clamp-2">
                    {p.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-solar-green">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Customer Consent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
