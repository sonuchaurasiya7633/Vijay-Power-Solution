import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export async function generateMetadata({
  params,
}: {
  params: { state: string; city: string };
}): Promise<Metadata> {
  await connectDB();
  const loc = await Location.findOne({
    stateSlug: params.state.toLowerCase(),
    citySlug: params.city.toLowerCase(),
    isPublished: true,
  }).lean();

  if (!loc) return { title: "City Not Found" };

  return {
    title: `Solar Panel Installation in ${loc.city}, ${loc.state} | VIJOY POWER SOLUTION`,
    description: `Turnkey rooftop solar installation in ${loc.city}, ${loc.state}. Net metering assistance, subsidy guidance, and engineering site survey.`,
  };
}

export default async function CityServiceAreaPage({
  params,
}: {
  params: { state: string; city: string };
}) {
  await connectDB();
  const loc: any = await Location.findOne({
    stateSlug: params.state.toLowerCase(),
    citySlug: params.city.toLowerCase(),
    isPublished: true,
  }).lean();

  if (!loc) notFound();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-solar-yellow">
            <Link href="/service-areas" className="hover:underline">Service Areas</Link>
            <span>/</span>
            <Link href={`/service-areas/${params.state}`} className="hover:underline">{loc.state}</Link>
            <span>/</span>
            <span>{loc.city}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Panel Installation in {loc.city}, {loc.state}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {loc.overviewText || `Professional rooftop solar installation, local DISCOM net metering approvals, and PM Surya Ghar financial assistance for residential and commercial properties in ${loc.city}.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-6 rounded-3xl bg-slate-bg border border-slate-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-1 rounded-full">
                  Verified Local Service
                </span>
                <span className="text-xs font-bold text-navy-800">
                  District: {loc.district}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-display text-navy-800">
                Turnkey Solar EPC Contracting in {loc.city}
              </h2>
              <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
                VIJOY POWER SOLUTION deploys trained solar technicians directly in {loc.city} to conduct roof shadow surveys, structural engineering assessments, and end-to-end net metering liaison with your local power board.
              </p>
              {loc.postalCodes && loc.postalCodes.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-navy-800 block mb-1.5">
                    Covered Postal Codes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.postalCodes.map((pin: string) => (
                      <span key={pin} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-muted font-mono">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Local FAQs */}
            {loc.localSolarFaqs && loc.localSolarFaqs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-border">
                <h3 className="text-xl font-bold font-display text-navy-800">
                  Solar FAQs for {loc.city} Consumers
                </h3>
                <div className="space-y-3">
                  {loc.localSolarFaqs.map((faq: { question: string; answer: string }, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-border space-y-1.5">
                      <h4 className="text-sm font-bold text-navy-800">{faq.question}</h4>
                      <p className="text-xs text-slate-muted leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-xl space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Local Appointment
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Schedule Survey in {loc.city}
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Book a rooftop feasibility inspection by our regional technician in {loc.city}, {loc.state}.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="location_city"
                defaultSolution={`Solar Rooftop in ${loc.city}`}
                compact
                buttonText={`Book Survey in ${loc.city}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
