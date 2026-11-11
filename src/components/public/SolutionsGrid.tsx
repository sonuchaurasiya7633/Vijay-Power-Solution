import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
import Setting from "@/models/Setting";
import { defaultPublicPagesCms, mergeWithDefaults } from "@/lib/cms-defaults";
import { getCleanPublicImage } from "@/lib/image-fallback";
import { optimizeCloudinaryUrl } from "@/lib/image-optimize";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export interface SolutionItem {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  capacity: string;
  image: string;
  benefits: string[];
}

const defaultSolutions: SolutionItem[] = [
  {
    slug: "residential-rooftop-solar",
    title: "Residential Rooftop Solar",
    category: "Homes & Villas",
    tagline: "Slash your home electricity bills by 70-90% with clean solar energy.",
    capacity: "1 kW – 10 kW",
    image: "",
    benefits: ["PM Surya Ghar subsidy assistance", "Net metering credit on power bills", "Elevated structures available"],
  },
  {
    slug: "commercial-rooftop-solar",
    title: "Commercial & Institutional Solar",
    category: "Schools, Hospitals & Retail",
    tagline: "Reduce peak daytime operating expenditures with accelerated tax depreciation.",
    capacity: "10 kW – 100 kW",
    image: "",
    benefits: ["Significant reduction in daytime tariffs", "Fast ROI within 3-4 years", "Remote cloud generation monitoring"],
  },
  {
    slug: "industrial-solar-systems",
    title: "Industrial Captive Solar Plants",
    category: "Mills, Factories & Storages",
    tagline: "Heavy-duty high-voltage power generation for manufacturing plants and cold storages.",
    capacity: "50 kW – 500+ kW",
    image: "",
    benefits: ["Mitigate costly industrial tariff peaks", "HT synchronization", "Heavy wind-resistant engineering"],
  },
  {
    slug: "on-grid-solar-systems",
    title: "On-Grid Net Metering Systems",
    category: "Utility Grid-Tied",
    tagline: "Export excess solar power back to the grid and receive DISCOM credit adjustments.",
    capacity: "2 kW – 50 kW",
    image: "",
    benefits: ["Lowest initial cost per kW", "Zero recurring battery expenses", "Full utility net-metering approvals"],
  },
  {
    slug: "off-grid-hybrid-solar",
    title: "Hybrid & Battery-Backed Solar",
    category: "Uninterrupted Power",
    tagline: "Continuous 24x7 electricity for areas subject to power cuts and load shedding.",
    capacity: "1 kW – 20 kW",
    image: "",
    benefits: ["100% independence from grid blackouts", "Clean & silent alternative to diesel", "Tubular or Lithium storage"],
  },
  {
    slug: "solar-water-pumping",
    title: "Solar Agricultural Water Pumps",
    category: "Farming & Irrigation",
    tagline: "Reliable daytime irrigation without expensive diesel fuels or erratic grid power.",
    capacity: "3 HP – 10 HP",
    image: "",
    benefits: ["Zero ongoing fuel expenditure", "High discharge flow in full sunlight", "Dry run sensor protections"],
  },
];

interface SolutionsGridProps {
  initialSolutions?: SolutionItem[];
  headerCms?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
  showHeader?: boolean;
}

export default async function SolutionsGrid({
  initialSolutions,
  headerCms,
  showHeader = true,
}: SolutionsGridProps = {}) {
  let solutions: SolutionItem[] = initialSolutions || [];
  let sectionHeader = headerCms;

  if (!initialSolutions || !sectionHeader) {
    try {
      await connectDB();
      if (!initialSolutions) {
        const docs = await SolarSolution.find({ isPublished: true })
          .sort({ sortOrder: 1, createdAt: 1 })
          .lean();
        if (docs && docs.length > 0) {
          solutions = docs.map((doc: any) => ({
            slug: doc.slug,
            title: doc.title,
            category: doc.category || "Solar Architecture",
            tagline: doc.tagline || doc.description || "",
            capacity: doc.typicalCapacityRange || "Custom kW",
            image: getCleanPublicImage(doc.image),
            benefits: Array.isArray(doc.keyBenefits) && doc.keyBenefits.length > 0
              ? doc.keyBenefits.slice(0, 3)
              : ["Custom EPC engineering", "MNRE compliant hardware"],
          }));
        }
      }
      if (!sectionHeader) {
        const settingDoc = await Setting.findOne({ key: "public_pages_cms" }).lean() as any;
        const merged = mergeWithDefaults(defaultPublicPagesCms, settingDoc?.value);
        sectionHeader = merged.solutionsSection;
      }
    } catch {
      // Fallback safely to defaults if DB temporarily unavailable
    }
  }

  const displaySolutions = solutions.length > 0 ? solutions : defaultSolutions;
  const badge = sectionHeader?.badge || defaultPublicPagesCms.solutionsSection.badge;
  const title = sectionHeader?.title || defaultPublicPagesCms.solutionsSection.title;
  const subtitle = sectionHeader?.subtitle || defaultPublicPagesCms.solutionsSection.subtitle;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-muted">
              {subtitle}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySolutions.map((sol) => (
            <div
              key={sol.slug}
              className="group bg-white rounded-3xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Banner or Title Box Card */}
              <div className="relative h-52 w-full overflow-hidden bg-navy-900">
                {getCleanPublicImage(sol.image) ? (
                  <Image
                    src={optimizeCloudinaryUrl(getCleanPublicImage(sol.image), 800)}
                    alt={sol.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <SolarCardPlaceholder title={sol.title} subtitle={sol.category} />
                )}
                <div className="absolute top-4 left-4 bg-navy-900/85 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  {sol.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-solar-green text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow">
                  Capacity: {sol.capacity}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-navy-800 group-hover:text-solar-green transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-muted leading-relaxed">
                    {sol.tagline}
                  </p>
                </div>

                {/* Benefits */}
                <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                  {sol.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-navy-800">
                      <Check className="w-3.5 h-3.5 text-solar-green shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Links */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Link
                    href="/request-site-survey"
                    className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1 group-hover:underline"
                  >
                    <span>Book Site Survey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/get-quote?solution=${encodeURIComponent(sol.title)}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-solar-green-light text-solar-green hover:bg-solar-green hover:text-white transition-colors"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
