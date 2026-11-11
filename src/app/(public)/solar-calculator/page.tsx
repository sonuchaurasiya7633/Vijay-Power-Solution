import type { Metadata } from "next";
import CalculatorWidget from "@/components/public/CalculatorWidget";
import CtaBanner from "@/components/public/CtaBanner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ShieldAlert, Sun } from "lucide-react";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "solar-calculator",
    path: "/solar-calculator",
    fallbackTitle: "Solar Savings Calculator | Rooftop Feasibility Across India",
    fallbackDescription:
      "Calculate your recommended rooftop solar system capacity, annual energy generation, and estimated electricity bill savings across India.",
  });
}

export default async function SolarCalculatorPage() {
  const cms = await getPublicPagesCms();
  const h = cms.calculatorPage;

  return (
    <div className="bg-white">
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: "Solar Calculator", path: "/solar-calculator" }]}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CalculatorWidget />

        {/* Calculation Assumptions & Methodology */}
        <div className="mt-16 bg-slate-bg rounded-3xl p-8 border border-slate-border space-y-6">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-solar-green" />
            <h3 className="text-lg font-bold text-navy-800">
              {h.methodologyTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-muted leading-relaxed">
            <div className="space-y-1">
              <strong className="text-navy-800 block">{h.card1Title}</strong>
              <p>{h.card1Text}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-navy-800 block">{h.card2Title}</strong>
              <p>{h.card2Text}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-navy-800 block">{h.card3Title}</strong>
              <p>{h.card3Text}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-4 border-t border-slate-200 text-xs text-slate-muted">
            <ShieldAlert className="w-4 h-4 text-solar-yellow shrink-0 mt-0.5" />
            <p>{h.disclaimerText}</p>
          </div>
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
