import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Zap, MapPin, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Installation Photo Gallery | VIJOY POWER SOLUTION",
  description:
    "Browse authentic rooftop solar installation photographs across Bihar, Jharkhand, and Uttar Pradesh. Verified installations with documented customer consent.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let projects: any[] = [];
  try {
    await connectDB();
    projects = await PortfolioProject.find({ isPublished: true })
      .sort({ completionDate: -1 })
      .lean();
  } catch (err) {
    console.warn("Database not reachable during build, using fallback gallery");
  }

  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Real Site Photography
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Installation Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Real-world photographs captured during structural anchoring, panel torque clamping, inverter wiring, and final commissioning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.slug}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-border aspect-square bg-navy-100"
            >
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white space-y-1">
                <div className="flex items-center gap-1.5 text-solar-yellow text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.generalLocation}</span>
                </div>
                <h3 className="text-base font-bold font-display line-clamp-1">{p.title}</h3>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-solar-green bg-white/15 px-2 py-0.5 rounded-md">
                    {p.systemCapacityKw} kW System
                  </span>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-xs font-bold text-white hover:text-solar-yellow flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
