import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { formatDateIST } from "@/lib/utils/formatters";
import CtaBanner from "@/components/public/CtaBanner";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export const metadata: Metadata = {
  title: "Solar Knowledge Hub & Blog | VIJOY POWER SOLUTION",
  description:
    "Educational articles, technical solar guides, PM Surya Ghar updates, and rooftop maintenance tips for solar consumers across India.",
};

const defaultArticles = [
  {
    slug: "pm-surya-ghar-subsidy-guide-pan-india",
    title: "Complete PM Surya Ghar Subsidy Guide — Pan India Coverage",
    excerpt: "Everything residential consumers need to know about the ₹78,000 central rooftop subsidy, DISCOM portal registration, and net meter commissioning.",
    category: "Government Schemes",
    readTime: "5 min read",
    date: "2024-04-10",
    coverImage: "",
  },
  {
    slug: "on-grid-vs-hybrid-solar-systems-comparison",
    title: "On-Grid vs Hybrid Solar: Which Is Right for Your Home?",
    excerpt: "A detailed engineering breakdown of battery-backed hybrid systems versus standard grid-tied net metering in areas prone to load shedding.",
    category: "Technical Guide",
    readTime: "6 min read",
    date: "2024-05-18",
    coverImage: "",
  },
  {
    slug: "how-to-calculate-solar-panel-capacity-for-home",
    title: "How to Size Your Rooftop Solar System from Your Electricity Bill",
    excerpt: "Learn how to calculate required kW capacity, rooftop square footage, and annual units generation using simple engineering rules.",
    category: "Solar Engineering",
    readTime: "4 min read",
    date: "2024-06-02",
    coverImage: "",
  },
];

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  let dbBlogs: any[] = [];
  const cms = await getPublicPagesCms();
  const h = cms.blogPage;

  try {
    await connectDB();
    dbBlogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
  } catch (err) {
    console.warn("Database not reachable during build, using default articles");
  }
  const articles = dbBlogs.length > 0 ? dbBlogs : defaultArticles;

  return (
    <div className="bg-white">
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((a: any, idx: number) => (
            <article
              key={a.slug}
              className="bg-white rounded-3xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="relative h-48 w-full bg-navy-900 overflow-hidden">
                  {getCleanPublicImage(a.coverImage) ? (
                    <Image
                      src={getCleanPublicImage(a.coverImage)}
                      alt={a.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <SolarCardPlaceholder title={a.title} subtitle={a.category} />
                  )}
                  <div className="absolute top-4 left-4 bg-navy-900/85 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {a.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{a.date || (a.publishedAt ? formatDateIST(a.publishedAt) : "Recent")}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{a.readTime || `${a.estimatedReadTimeMin || 4} min read`}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold font-display text-navy-800 group-hover:text-solar-green transition-colors leading-snug">
                    {a.title}
                  </h2>
                  <p className="text-xs text-slate-muted leading-relaxed line-clamp-3">
                    {a.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                <Link
                  href={`/blog/${a.slug}`}
                  className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1 group-hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
