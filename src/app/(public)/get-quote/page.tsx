"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { defaultPublicPagesCms, mergeWithDefaults } from "@/lib/cms-defaults";

function GetQuoteContent() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get("product") || searchParams.get("module") || "";
  const defaultSolution = searchParams.get("solution") || "Residential Rooftop Solar";
  const defaultWattage = searchParams.get("wattage") ? Number(searchParams.get("wattage")) : undefined;

  const [cms, setCms] = useState(defaultPublicPagesCms.getQuotePage);

  useEffect(() => {
    fetch("/api/settings?key=public_pages_cms")
      .then((res) => res.json())
      .then((data) => {
        if (data?.setting?.getQuotePage) {
          setCms(mergeWithDefaults(defaultPublicPagesCms.getQuotePage, data.setting.getQuotePage));
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {cms.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {cms.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {cms.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-border shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
              Zero Commitment • Free Assessment
            </span>
            <h2 className="text-2xl font-bold font-display text-navy-800">
              Provide Your Installation Details
            </h2>
            <p className="text-xs text-slate-muted">
              {defaultProduct ? `Quoting for module: ${defaultProduct}` : "Fill out the fields below to receive our technical solar assessment."}
            </p>
          </div>

          <LeadCaptureForm
            defaultEnquiryType="get_quote"
            defaultProductName={defaultProduct}
            defaultSolution={defaultSolution}
            defaultWattage={defaultWattage}
            buttonText="Generate My Private Quotation"
          />

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-muted">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-800 block">{cms.guarantee1Title}</strong>
                <span>{cms.guarantee1Subtitle}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-800 block">{cms.guarantee2Title}</strong>
                <span>{cms.guarantee2Subtitle}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-800 block">{cms.guarantee3Title}</strong>
                <span>{cms.guarantee3Subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GetQuotePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-muted">Loading quote system...</div>}>
      <GetQuoteContent />
    </Suspense>
  );
}
