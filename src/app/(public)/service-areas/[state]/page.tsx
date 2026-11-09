import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import PortfolioProject from "@/models/PortfolioProject";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  const stateName =
    params.state === "bihar"
      ? "Bihar"
      : params.state === "jharkhand"
      ? "Jharkhand"
      : params.state === "uttar-pradesh"
      ? "Uttar Pradesh"
      : params.state;

  return {
    title: `Solar Panel Installation in ${stateName} | Subsidy & Net Metering`,
    description: `Professional rooftop solar installation, DISCOM net metering approvals, and PM Surya Ghar subsidy guidance across ${stateName}.`,
  };
}

export default async function StateServiceAreaPage({
  params,
}: {
  params: { state: string };
}) {
  await connectDB();
  const stateLocations = await Location.find({
    stateSlug: params.state.toLowerCase(),
    isPublished: true,
  }).lean();

  if (!stateLocations || stateLocations.length === 0) {
    notFound();
  }

  const stateName = stateLocations[0].state;
  const projects = await PortfolioProject.find({
    state: stateName,
    isPublished: true,
  }).limit(3).lean();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-solar-yellow">
            <Link href="/service-areas" className="hover:underline">Service Areas</Link>
            <span>/</span>
            <span>{stateName}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Panel Installation in {stateName}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Turnkey solar EPC contracting, rooftop site surveys, DISCOM liaison, and PM Surya Ghar financial assistance for residential and commercial consumers in {stateName}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Cities & Details */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-navy-800 mb-4">
                Active Service Cities & Districts in {stateName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stateLocations.map((loc) => (
                  <Link
                    key={loc.citySlug}
                    href={`/service-areas/${params.state}/${loc.citySlug}`}
                    className="p-5 rounded-2xl border border-slate-border hover:border-solar-green/40 hover:shadow-md transition-all group bg-slate-bg/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-solar-green" />
                        <h3 className="text-base font-bold text-navy-800 group-hover:text-solar-green transition-colors">
                          {loc.city}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-muted mt-2">
                      District: <strong>{loc.district}</strong>
                    </p>
                    <span className="inline-block mt-3 text-[10px] font-bold text-solar-green bg-solar-green-light px-2 py-0.5 rounded">
                      Survey & Installation Available
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* State Projects */}
            {projects.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-border">
                <h3 className="text-xl font-bold font-display text-navy-800">
                  Recent Installations in {stateName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="p-4 rounded-xl border border-slate-border hover:border-solar-green transition-all space-y-2 group"
                    >
                      <span className="text-[10px] font-bold text-solar-green bg-solar-green-light px-2 py-0.5 rounded">
                        {p.systemCapacityKw} kW • {p.city}
                      </span>
                      <h4 className="text-sm font-bold text-navy-800 group-hover:text-solar-green leading-snug">
                        {p.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Local Consultation Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-xl space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Regional Expert Appointment
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Solar Consultation in {stateName}
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Connect directly with our {stateName} engineering team for roof feasibility and private quotation.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="location"
                defaultSolution={`Solar Rooftop in ${stateName}`}
                compact
                buttonText={`Book Survey in ${stateName}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
