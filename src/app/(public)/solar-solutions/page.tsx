import type { Metadata } from "next";
import SolutionsGrid from "@/components/public/SolutionsGrid";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Solar Power Solutions | Residential, Commercial & Industrial EPC",
  description:
    "Tailored solar architectures: Residential Rooftop, Commercial Enterprises, Industrial Captive Plants, On-Grid Net Metering, and Hybrid Battery Systems across India.",
};

export default function SolarSolutionsPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Engineered Architectures
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Comprehensive Solar Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            From urban residential rooftop installations cutting bills by 90% to high-voltage industrial plants and agricultural water pumps.
          </p>
        </div>
      </div>

      <SolutionsGrid />
      <CtaBanner />
    </div>
  );
}
