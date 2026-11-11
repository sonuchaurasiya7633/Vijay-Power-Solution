import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Zap, MapPin, Calendar, CheckCircle2, ShieldCheck, ArrowRight, Play } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import { formatDateIST } from "@/lib/utils/formatters";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectDB();
  const proj = await PortfolioProject.findOne({ slug: params.slug }).lean();
  if (!proj) return { title: "Project Not Found" };

  return {
    title: `${proj.title} | Case Study`,
    description: proj.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const proj: any = await PortfolioProject.findOne({ slug: params.slug }).lean();

  if (!proj) notFound();

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-bg border-b border-slate-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-muted flex items-center gap-2">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-navy-800">Projects</Link>
          <span>/</span>
          <span className="text-navy-800 font-bold truncate">{proj.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Case Study */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-border bg-navy-900">
              {getCleanPublicImage(proj.coverImage) ? (
                <Image
                  src={getCleanPublicImage(proj.coverImage)}
                  alt={proj.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <SolarCardPlaceholder title={proj.title} subtitle={proj.systemCategory} />
              )}
              <div className="absolute top-4 left-4 bg-solar-green text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                <span>{proj.systemCapacityKw} kW System</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-solar-green" />
                  <strong>{proj.generalLocation}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Commissioned: {formatDateIST(proj.completionDate)}</span>
                </span>
                <span>•</span>
                <span className="text-solar-green font-semibold">{proj.systemCategory}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-navy-800">
                {proj.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                {proj.shortDescription}
              </p>
            </div>

            {/* Quick Equipment Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-y border-slate-border py-4">
              <div>
                <span className="text-slate-muted block text-[10px]">Solar Capacity</span>
                <strong className="text-navy-800 text-sm">{proj.systemCapacityKw} kW</strong>
              </div>
              <div>
                <span className="text-slate-muted block text-[10px]">Module Model</span>
                <strong className="text-navy-800 text-xs">{proj.panelBrandModel || "Tier-1 Mono PERC"}</strong>
              </div>
              <div>
                <span className="text-slate-muted block text-[10px]">Module Quantity</span>
                <strong className="text-navy-800 text-sm">{proj.panelQuantity || "Custom"} Panels</strong>
              </div>
              <div>
                <span className="text-slate-muted block text-[10px]">Inverter Model</span>
                <strong className="text-navy-800 text-xs">{proj.inverterModel || "Grid-Tie Inverter"}</strong>
              </div>
            </div>

            {/* Narrative Case Study */}
            {proj.fullCaseStudy && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-display text-navy-800">Project Overview & Background</h3>
                <p className="text-sm text-slate-muted leading-relaxed whitespace-pre-line">
                  {proj.fullCaseStudy}
                </p>
              </div>
            )}

            {/* Problem & Solution Breakdown */}
            {(proj.problemStatement || proj.recommendedSolution) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {proj.problemStatement && (
                  <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-1.5">
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">The Challenge</h4>
                    <p className="text-xs text-red-950/80 leading-relaxed">{proj.problemStatement}</p>
                  </div>
                )}
                {proj.recommendedSolution && (
                  <div className="p-5 rounded-2xl bg-solar-green-light/60 border border-solar-green/20 space-y-1.5">
                    <h4 className="text-xs font-bold text-solar-green uppercase tracking-wider">The Solution</h4>
                    <p className="text-xs text-navy-900 leading-relaxed">{proj.recommendedSolution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Video Walkthrough if present */}
            {proj.videoUrl && (
              <div className="space-y-3 pt-4 border-t border-slate-border">
                <h3 className="text-lg font-bold text-navy-800">Installation Walkthrough Video</h3>
                <div className="rounded-2xl overflow-hidden bg-black aspect-video border border-slate-border">
                  <video
                    src={proj.videoUrl}
                    controls
                    poster={proj.videoThumbnail || proj.coverImage}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Testimonial Quote */}
            {proj.testimonialQuote && (
              <div className="p-6 rounded-2xl bg-slate-bg border-l-4 border-solar-green space-y-2">
                <p className="text-sm italic text-navy-800 leading-relaxed">
                  &ldquo;{proj.testimonialQuote}&rdquo;
                </p>
                <p className="text-xs font-bold text-slate-muted">
                  — {proj.customerName || "Customer"}, {proj.city}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Similar Requirement Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-xl space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Similar Property Enquiry
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Have a Similar Rooftop?
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Get a customized solar installation quotation like this {proj.systemCapacityKw} kW system in {proj.city}.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="project"
                defaultSolution={`${proj.systemCategory} (${proj.systemCapacityKw} kW)`}
                compact
                buttonText="Request Consultation Like This"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
