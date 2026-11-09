"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

interface VideoStory {
  title: string;
  location: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const videos: VideoStory[] = [
  {
    title: "10 kW Elevated Rooftop Solar Walkthrough in Patna",
    location: "Kankarbagh, Patna",
    duration: "1:05",
    thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "25 kW Bodh Gaya Hotel Solar Commissioning & SBPDCL Inspection",
    location: "Bodh Gaya, Bihar",
    duration: "1:42",
    thumbnail: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            Video Stories & Walkthroughs
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            See Our Installations in Action
          </h2>
          <p className="text-sm text-slate-muted">
            Watch real site surveys, rooftop mounting structure erections, inverter synchronization, and client reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videos.map((v, idx) => (
            <div
              key={idx}
              onClick={() => setActiveVideo(v.videoUrl)}
              className="group cursor-pointer bg-white rounded-3xl border border-slate-border overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="relative h-64 w-full bg-navy-900 overflow-hidden">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-navy-900/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-solar-green text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {v.duration}
                </div>
              </div>
              <div className="p-5 space-y-1">
                <span className="text-[11px] font-semibold text-solar-green uppercase tracking-wide">
                  {v.location}
                </span>
                <h3 className="text-base font-bold text-navy-800 group-hover:text-solar-green transition-colors">
                  {v.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/60 hover:bg-black p-2 rounded-full"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] aspect-video"
            />
          </div>
        </div>
      )}
    </section>
  );
}
