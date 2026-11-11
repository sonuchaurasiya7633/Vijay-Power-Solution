import type { Metadata } from "next";
import ServiceAreasSection from "@/components/public/ServiceAreasSection";
import CtaBanner from "@/components/public/CtaBanner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";
import { buildServiceSchema } from "@/lib/seo-schema";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "service-areas",
    path: "/service-areas",
    fallbackTitle:
      "Pan India Solar Service Coverage | All Indian States & UTs",
    fallbackDescription:
      "Vijoy Power Solution provides turnkey solar rooftop installation and ALMM panel supply across all 28 states and 8 union territories in India.",
  });
}

export default async function ServiceAreasPage() {
  const cms = await getPublicPagesCms();
  const h = cms.serviceAreasPage;

  const serviceSchema = buildServiceSchema({
    name: "Pan-India Solar Installation & EPC Service Coverage",
    description:
      "Rooftop solar EPC, commercial solar installation, and ALMM solar panel supply across all 28 states and 8 union territories of India.",
    path: "/service-areas",
    areaServedNames: INDIAN_STATES_AND_UTS.filter(
      (s) => s !== "Other / Outside India"
    ),
  });

  return (
    <div className="bg-white">
      <JsonLd data={serviceSchema} />
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: "Service Areas", path: "/service-areas" }]}
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

      <ServiceAreasSection />
      <CtaBanner />
    </div>
  );
}
