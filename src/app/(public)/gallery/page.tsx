import type { Metadata } from "next";
import connectDB from "@/lib/db/connection";
import InstallationGallery from "@/models/InstallationGallery";
import DedicatedGalleryView from "@/components/public/DedicatedGalleryView";
import CtaBanner from "@/components/public/CtaBanner";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Installation Photo Gallery | Real Customers | VIJOY POWER SOLUTION",
  description:
    "Browse authentic rooftop solar installation photographs across India. Real customer handovers with verified equipment and documented customer consent.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let galleryItems: any[] = [];
  try {
    await connectDB();
    galleryItems = await InstallationGallery.find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
  } catch (err) {
    console.warn("Database not reachable during build, using fallback gallery");
  }

  const cleanGalleryItems = JSON.parse(JSON.stringify(galleryItems));

  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-green/20 border border-solar-green/30 text-solar-yellow text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Site Photography</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Installation Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Real customer handovers and completed installations captured during plant commissioning, structural mounting, and net metering handover across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DedicatedGalleryView items={cleanGalleryItems} />
      </div>

      <CtaBanner />
    </div>
  );
}
