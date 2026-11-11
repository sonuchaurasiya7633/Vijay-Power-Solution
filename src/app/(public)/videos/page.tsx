import type { Metadata } from "next";
import VideoSection from "@/components/public/VideoSection";
import CtaBanner from "@/components/public/CtaBanner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getHomepageSetting, getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";
import { buildVideoObjectSchema } from "@/lib/seo-schema";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "videos",
    path: "/videos",
    fallbackTitle:
      "Installation Videos & Client Stories | VIJOY POWER SOLUTION",
    fallbackDescription:
      "Watch authentic YouTube video walkthroughs of rooftop solar installations and verified client stories across India.",
  });
}

export default async function VideosPage() {
  const [cms, homepageSetting] = await Promise.all([
    getPublicPagesCms(),
    getHomepageSetting(),
  ]);
  const h = cms.videosPage;

  const rawVideos: any[] = Array.isArray(homepageSetting?.videos?.items)
    ? homepageSetting.videos.items
    : [];
  const videoSchemas = buildVideoObjectSchema(
    rawVideos.map((v) => ({
      title: v.title || "Solar Installation Walkthrough",
      description:
        v.description ||
        `${v.title || "Rooftop solar installation"} — ${v.location || "India"}`,
      videoUrl: v.videoUrl || "",
      thumbnailUrl: v.thumbnailUrl,
      duration: v.duration,
      location: v.location,
    }))
  );

  return (
    <div className="bg-white">
      {videoSchemas.length > 0 && <JsonLd data={videoSchemas} />}
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: "Videos", path: "/videos" }]}
            variant="dark"
          />
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {h.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {h.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {h.subtitle}
          </p>
        </div>
      </div>

      <VideoSection initialData={homepageSetting?.videos || null} />
      <CtaBanner />
    </div>
  );
}
