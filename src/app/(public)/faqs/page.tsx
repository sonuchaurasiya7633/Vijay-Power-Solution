import type { Metadata } from "next";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaBanner from "@/components/public/CtaBanner";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VIJOY POWER SOLUTION Solar",
  description:
    "Find answers to common rooftop solar questions: subsidies, DISCOM net metering, payback periods, warranties, and maintenance in Bihar, JH, and UP.",
};

export default function FaqsPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Help & Advisory
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Everything you need to know about rooftop solar engineering, DISCOM net-metering approvals, government financial assistance, and long-term warranties.
          </p>
        </div>
      </div>

      <FaqAccordion />
      <CtaBanner />
    </div>
  );
}
