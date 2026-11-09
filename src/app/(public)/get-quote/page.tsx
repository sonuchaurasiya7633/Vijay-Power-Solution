"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

function GetQuoteContent() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get("product") || "";
  const defaultSolution = searchParams.get("solution") || "Residential Rooftop Solar";
  const defaultWattage = searchParams.get("wattage") ? Number(searchParams.get("wattage")) : undefined;

  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Personalized Proposal
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Request an Itemized Solar Quotation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Get a transparent, private commercial proposal tailored to your roof specifications, panel preference (10W to 730W), and DISCOM net-metering rules.
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

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
              <span>No Public Price Fabrication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
              <span>Certified ALMM Panels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
              <span>Net Metering Assistance</span>
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
