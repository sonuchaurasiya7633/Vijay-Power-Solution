import type { Metadata } from "next";
import VideoSection from "@/components/public/VideoSection";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Installation Videos & Client Stories | VIJOY POWER SOLUTION",
  description:
    "Watch authentic video walkthroughs of rooftop solar installations and client feedback in Patna, Gaya, Bodh Gaya, Ranchi, and Lucknow.",
};

export default function VideosPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Project Visual Stories
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Installation Videos & Client Walkthroughs
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Real video walkthroughs documenting rooftop drone perspectives, electrical tests, and homeowner interviews.
          </p>
        </div>
      </div>

      <VideoSection />
      <CtaBanner />
    </div>
  );
}
