import type { Metadata } from "next";
import { Compass, CheckCircle2, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "request-site-survey",
    path: "/request-site-survey",
    fallbackTitle: "Request Rooftop Solar Site Survey | VIJOY POWER SOLUTION",
    fallbackDescription:
      "Book an on-site rooftop feasibility inspection by our certified solar technicians across India. Precise shadow analysis and structural evaluation.",
  });
}

export default async function RequestSiteSurveyPage() {
  const cms = await getPublicPagesCms();
  const h = cms.siteSurveyPage;

  return (
    <div className="bg-white">
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[{ name: "Request Site Survey", path: "/request-site-survey" }]}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-border shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
              Field Technician Appointment
            </span>
            <h2 className="text-2xl font-bold font-display text-navy-800">
              Schedule Your Site Visit
            </h2>
            <p className="text-xs text-slate-muted">
              Pan-India engineering dispatch available across Delhi NCR, Mumbai, Ahmedabad, Jaipur, Bengaluru, Hyderabad, Pune, Kolkata, Lucknow, Patna, Ranchi, and all 28 States &amp; 8 UTs.
            </p>
          </div>

          <LeadCaptureForm
            defaultEnquiryType="site_survey"
            defaultSolution="Turnkey Rooftop Site Survey"
            buttonText="Confirm Site Survey Booking"
          />

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-muted">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-solar-green shrink-0" />
              <span>3D Shadow & Tilt Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0" />
              <span>Structural Load Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-solar-green shrink-0" />
              <span>DISCOM Meter Inspection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
