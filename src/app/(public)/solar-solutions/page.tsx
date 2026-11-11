import type { Metadata } from "next";
import SolutionsGrid from "@/components/public/SolutionsGrid";
import CtaBanner from "@/components/public/CtaBanner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";
import { buildServiceSchema } from "@/lib/seo-schema";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "solar-solutions",
    path: "/solar-solutions",
    fallbackTitle:
      "Solar Power Solutions | Residential, Commercial & Industrial EPC",
    fallbackDescription:
      "Tailored solar architectures: Residential Rooftop, Commercial Enterprises, Industrial Captive Plants, On-Grid Net Metering, and Hybrid Battery Systems across India.",
  });
}

export default async function SolarSolutionsPage() {
  const cms = await getPublicPagesCms();
  const h = cms.solutionsPage;

  const serviceSchema = buildServiceSchema({
    name: h.title || "Pan-India Solar Solutions",
    description:
      h.subtitle ||
      "Residential rooftop solar, commercial installations, industrial captive solar plants, agricultural solar water pumps, and hybrid battery solutions across India.",
    path: "/solar-solutions",
    serviceType: "Residential, Commercial & Industrial Solar EPC Solutions",
  });

  return (
    <div className="bg-white">
      <JsonLd data={serviceSchema} />
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: "Solar Solutions", path: "/solar-solutions" }]}
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

      <SolutionsGrid showHeader={false} />
      <CtaBanner />
    </div>
  );
}
