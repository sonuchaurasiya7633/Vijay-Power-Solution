import type { Metadata } from "next";
import CalculatorWidget from "@/components/public/CalculatorWidget";
import CtaBanner from "@/components/public/CtaBanner";
import { ShieldAlert, Sun, Zap, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Solar Savings Calculator | Rooftop Feasibility Across India",
  description:
    "Calculate your recommended rooftop solar system capacity, annual energy generation, and estimated electricity bill savings across India.",
};

export default function SolarCalculatorPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Engineering Estimator
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Rooftop Feasibility & Savings Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Estimate your required solar kW size, shadow-free roof area, and potential annual electricity bill reduction based on your monthly unit consumption.
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
              Calculation Methodology & Engineering Assumptions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-muted leading-relaxed">
            <div className="space-y-1">
              <strong className="text-navy-800 block">Solar Irradiance & Yield:</strong>
              <p>Based on long-term meteorological data across Eastern and Northern India, 1 kWp of high-efficiency solar modules generates approximately 4.0 to 4.5 kWh daily, yielding ~1,450 to 1,550 units annually.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-navy-800 block">Roof Area Benchmark:</strong>
              <p>Utilizing modern 550W+ Mono PERC and TOPCon modules, approximately 70 to 80 square feet of shadow-free rooftop space is required per kilowatt capacity.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-navy-800 block">Electricity Tariff Assumption:</strong>
              <p>Calculations assume an average residential slab tariff of ₹7.50 per unit. Actual bill savings vary depending on your sanctioned load and DISCOM tariff bracket.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-4 border-t border-slate-200 text-xs text-slate-muted">
            <ShieldAlert className="w-4 h-4 text-solar-yellow shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> This calculator provides an educational approximation. Exact system capacity, array tilt, string configuration, and physical feasibility will be finalized by our certified solar engineer during the on-site survey.
            </p>
          </div>
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
