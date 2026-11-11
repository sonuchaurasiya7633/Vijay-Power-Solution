"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/utils/youtube";

interface VideoStory {
  title: string;
  location: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const defaultVideos: VideoStory[] = [
  {
    title: "10 kW Elevated Rooftop Solar Walkthrough — Delhi NCR",
    location: "New Delhi, India",
    duration: "1:05",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/watch?v=IQS7WYUY2oE",
  },
  {
    title: "25 kW Commercial Solar Plant Commissioning & DISCOM Inspection",
    location: "Jaipur, Rajasthan",
    duration: "1:42",
    thumbnail: "",
    videoUrl: "",
  },
];

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [videoList, setVideoList] = useState<VideoStory[]>(defaultVideos);
  const [badge, setBadge] = useState("Video Stories & Walkthroughs");
  const [title, setTitle] = useState("See Our Installations in Action");
  const [subtitle, setSubtitle] = useState(
    "Watch real site surveys, rooftop mounting structure erections, inverter synchronization, and client reviews."
  );

  useEffect(() => {
    fetch("/api/settings?key=homepage")
      .then((res) => res.json())
      .then((data) => {
        if (data.setting?.videos) {
          const v = data.setting.videos;
          if (v.badge) setBadge(v.badge);
          if (v.title) setTitle(v.title);
          if (v.subtitle) setSubtitle(v.subtitle);
          if (Array.isArray(v.items) && v.items.length > 0) {
            setVideoList(v.items);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-muted">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videoList.map((v, idx) => {
            const customThumb = getCleanPublicImage(v.thumbnail);
            const ytThumb = !customThumb ? getYouTubeThumbnailUrl(v.videoUrl) : null;
            const displayThumb = customThumb || ytThumb || "";
            const hasPlayableUrl = Boolean(v.videoUrl && v.videoUrl.trim());

            return (
              <div
                key={idx}
                className={`group bg-white rounded-3xl overflow-hidden border border-slate-border shadow-sm transition-all ${
                  hasPlayableUrl ? "hover:shadow-xl cursor-pointer" : "opacity-95"
                }`}
                onClick={() => {
                  if (hasPlayableUrl) {
                    setActiveVideo({ url: v.videoUrl.trim(), title: v.title });
                  }
                }}
              >
                <div className="relative h-60 w-full overflow-hidden bg-navy-900">
                  {displayThumb ? (
                    <Image
                      src={displayThumb}
                      alt={v.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <SolarCardPlaceholder title={v.title} subtitle={v.location} />
                  )}
                  <div className="absolute inset-0 bg-navy-950/35 group-hover:bg-navy-950/20 transition-colors" />

                  {/* Play Button Overlay or Coming Soon badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {hasPlayableUrl ? (
                      <div className="w-14 h-14 rounded-full bg-white/90 text-solar-green flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-solar-green group-hover:text-white transition-all">
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      </div>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full bg-navy-900/85 border border-white/20 text-white text-xs font-bold tracking-wide">
                        Video Coming Soon
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 right-3 bg-navy-950/80 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                    {v.duration || "1:00"}
                  </span>
                </div>

                <div className="p-5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green">
                    {v.location}
                  </span>
                  <h3 className="font-bold text-navy-800 text-sm group-hover:text-solar-green transition-colors">
                    {v.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player (Supports YouTube & Direct MP4) */}
      {activeVideo && (() => {
        const ytEmbedUrl = getYouTubeEmbedUrl(activeVideo.url);
        return (
          <div
            className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="bg-black rounded-3xl overflow-hidden max-w-3xl w-full border border-white/15 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 border border-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video w-full bg-black">
                {ytEmbedUrl ? (
                  <iframe
                    src={ytEmbedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video src={activeVideo.url} controls autoPlay className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
