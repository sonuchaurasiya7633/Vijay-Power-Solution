import type { Metadata } from "next";
import ServiceAreasSection from "@/components/public/ServiceAreasSection";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Service Areas | Solar Rooftop in Bihar, Jharkhand & Uttar Pradesh",
  description:
    "Check solar installation availability in your city. Serving Patna, Gaya, Muzaffarpur, Ranchi, Jamshedpur, Lucknow, and surrounding districts.",
};

export default function ServiceAreasPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Regional Presence
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Service Areas & Regional Coverage
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Local technical survey teams, DISCOM net metering liaison, and verified installation crews active across Bihar, Jharkhand, and Uttar Pradesh.
          </p>
        </div>
      </div>

      <ServiceAreasSection />
      <CtaBanner />
    </div>
  );
}
