import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Zap, MapPin, ArrowRight, CheckCircle2, Sparkles, FolderGit2 } from "lucide-react";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import InstallationGallery from "@/models/InstallationGallery";
import DedicatedGalleryView from "@/components/public/DedicatedGalleryView";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Our Solar Installation Projects | Customer Photo Gallery",
  description:
    "Explore real solar installations completed by Vijoy Power Solution for our valued customers across India. Authentic customer photographs and verified case studies.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: any[] = [];
  let galleryItems: any[] = [];

  try {
    await connectDB();
    const [prjList, galList] = await Promise.all([
      PortfolioProject.find({ isPublished: true }).sort({ completionDate: -1 }).lean(),
      InstallationGallery.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    ]);
    projects = prjList;
    galleryItems = galList;
  } catch (err) {
    console.warn("Database not reachable during build, using fallback data");
  }

  const cleanGalleryItems = JSON.parse(JSON.stringify(galleryItems));

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-green/20 border border-solar-green/30 text-solar-yellow text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authentic Field Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Our Solar Installation Projects
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Explore real solar installations completed by Vijoy Power Solution for our valued customers. Authentic completed customer handovers and engineered case studies across India.
          </p>
        </div>
      </div>

      {/* 1. Real Customer Installation Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
              Customer Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
              Customer Handovers & Completed Plants
            </h2>
          </div>
          <span className="text-xs text-slate-muted">
            Click any photograph to view high-resolution full-screen
          </span>
        </div>

        <DedicatedGalleryView items={cleanGalleryItems} />
      </div>

      {/* 2. Detailed Technical Case Studies */}
      {projects.length > 0 && (
        <div className="bg-slate-bg border-t border-slate-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-2">
              <FolderGit2 className="w-5 h-5 text-solar-green" />
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
                Engineering Documentation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800 mb-8">
              Verified Technical Case Studies
            </h2>

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
                      <div className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold">
                        {p.systemCapacityKw} kW Plant
                      </div>
                      <div className="absolute bottom-4 right-4 bg-solar-green text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {p.systemCategory}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-solar-green uppercase tracking-wider">
                          Project #{p.projectId}
                        </span>
                        <h3 className="text-lg font-bold font-display text-navy-800 mt-1 line-clamp-1">
                          {p.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-muted">
                        <MapPin className="w-4 h-4 text-solar-green shrink-0" />
                        <span>{p.generalLocation || `${p.city}, ${p.state}`}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-border">
                        <div>
                          <p className="text-[11px] text-slate-muted">Panels Used</p>
                          <p className="font-semibold text-navy-800 truncate">{p.panelBrandModel || "Tier-1 ALMM"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-muted">Mount Structure</p>
                          <p className="font-semibold text-navy-800 truncate">{p.installationType || "Galvanized Steel"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Read Engineering Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Conversion Banner */}
      <CtaBanner />
    </div>
  );
}
