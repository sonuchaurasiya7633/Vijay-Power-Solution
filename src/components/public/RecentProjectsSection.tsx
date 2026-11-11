import Link from "next/link";
import Image from "next/image";
import { MapPin, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCleanPublicImage } from "@/lib/image-fallback";
import { optimizeCloudinaryUrl } from "@/lib/image-optimize";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

interface ProjectCardData {
  slug: string;
  title: string;
  location: string;
  capacityKw: number;
  category: string;
  image: string;
  outcome: string;
}

const defaultProjects: ProjectCardData[] = [
  {
    slug: "10kw-on-grid-rooftop-solar-delhi-ncr",
    title: "10 kW On-Grid Elevated Rooftop Solar",
    location: "New Delhi (Delhi NCR)",
    capacityKw: 10,
    category: "Residential Rooftop",
    image: "",
    outcome: "Monthly electricity bill reduced by 85%. Usable terrace space preserved via elevated galvanized structure.",
  },
  {
    slug: "25kw-commercial-solar-jaipur",
    title: "25 kW Commercial Solar Power Plant",
    location: "Jaipur, Rajasthan",
    capacityKw: 25,
    category: "Commercial Enterprise",
    image: "",
    outcome: "Daytime commercial HVAC powered completely by Vikram/Adani modules, saving ₹3.2L annually.",
  },
  {
    slug: "5kw-hybrid-solar-system-ranchi",
    title: "5 kW Hybrid Solar with Lithium Storage",
    location: "Pune, Maharashtra",
    capacityKw: 5,
    category: "Hybrid Storage",
    image: "",
    outcome: "Uninterrupted 24/7 clean backup power during peak outages with zero diesel generator expense.",
  },
];

export default function RecentProjectsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              Real Installations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
              Customer-Confirmed Solar Projects
            </h2>
            <p className="text-sm text-slate-muted">
              Explore real-world completed installations across India with confirmed customer consent and verifiable generation outcomes.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-solar-green hover:underline shrink-0"
          >
            <span>View All Installations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultProjects.map((p) => {
            const imgUrl = getCleanPublicImage(p.image);
            return (
              <div
                key={p.slug}
                className="group bg-white rounded-3xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative h-56 w-full bg-navy-900 overflow-hidden">
                  {imgUrl ? (
                    <Image
                      src={optimizeCloudinaryUrl(imgUrl, 800)}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <SolarCardPlaceholder title={p.title} subtitle={p.category} />
                  )}
                  <div className="absolute top-4 left-4 bg-solar-green text-white text-xs font-extrabold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{p.capacityKw} kW</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-navy-900/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-solar-yellow" />
                    <span>{p.location}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-navy-800 group-hover:text-solar-green transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-muted leading-relaxed line-clamp-2">
                      {p.outcome}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-solar-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
