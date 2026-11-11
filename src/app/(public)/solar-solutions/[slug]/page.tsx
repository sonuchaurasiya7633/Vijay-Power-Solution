import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectDB();
  const sol = await SolarSolution.findOne({ slug: params.slug }).lean();
  if (!sol) return { title: "Solution Not Found" };

  return {
    title: `${sol.title} | VIJOY POWER SOLUTION`,
    description: sol.description.slice(0, 160),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const sol: any = await SolarSolution.findOne({ slug: params.slug }).lean();

  if (!sol) notFound();

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-bg border-b border-slate-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-muted flex items-center gap-2">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          <span>/</span>
          <Link href="/solar-solutions" className="hover:text-navy-800">Solar Solutions</Link>
          <span>/</span>
          <span className="text-navy-800 font-bold">{sol.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-sm border border-slate-border bg-navy-900">
              {getCleanPublicImage(sol.image) ? (
                <Image
                  src={getCleanPublicImage(sol.image)}
                  alt={sol.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <SolarCardPlaceholder title={sol.title} subtitle={sol.category} />
              )}
              <div className="absolute top-4 left-4 bg-navy-900/85 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                {sol.category}
              </div>
              <div className="absolute bottom-4 right-4 bg-solar-green text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
                Capacity: {sol.typicalCapacityRange}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
                {sol.title}
              </h1>
              <p className="text-base text-slate-muted font-medium">
                {sol.tagline}
              </p>
              <p className="text-sm text-slate-muted leading-relaxed">
                {sol.description}
              </p>
            </div>

            {/* Key Benefits */}
            {sol.keyBenefits && sol.keyBenefits.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-border">
                <h3 className="text-lg font-bold text-navy-800">Primary Commercial & Engineering Benefits</h3>
                <ul className="space-y-2">
                  {sol.keyBenefits.map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy-800">
                      <Check className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suitable For */}
            {sol.suitableFor && sol.suitableFor.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-border">
                <h3 className="text-lg font-bold text-navy-800">Recommended For</h3>
                <div className="flex flex-wrap gap-2">
                  {sol.suitableFor.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-xl bg-slate-bg border border-slate-border text-navy-800 font-semibold"
                    >
                      {item}
                    </span>
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
                  Tailored Engineering Proposal
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Consult for {sol.title}
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Connect with our lead engineer for your location. We provide site survey and private quotation across India.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="solution"
                defaultSolution={sol.title}
                compact
                buttonText="Request Solution Consultation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
