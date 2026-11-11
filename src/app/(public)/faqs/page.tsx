import type { Metadata } from "next";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaBanner from "@/components/public/CtaBanner";
import { getPublicPagesCms } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VIJOY POWER SOLUTION Solar",
  description:
    "Find answers to common rooftop solar questions: subsidies, DISCOM net metering, payback periods, warranties, and maintenance across India.",
};

export default async function FaqsPage() {
  const cms = await getPublicPagesCms();
  const h = cms.faqsPage;

  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
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

      <FaqAccordion />
      <CtaBanner />
    </div>
  );
}
