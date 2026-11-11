import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectDB();
  const serv = await SolarService.findOne({ slug: params.slug }).lean();
  if (!serv) return { title: "Service Not Found" };

  return {
    title: `${serv.title} | VIJOY POWER SOLUTION Services`,
    description: serv.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const serv: any = await SolarService.findOne({ slug: params.slug }).lean();

  if (!serv) notFound();

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-bg border-b border-slate-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-muted flex items-center gap-2">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-navy-800">Services</Link>
          <span>/</span>
          <span className="text-navy-800 font-bold">{serv.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Service Description */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-sm border border-slate-border bg-navy-900">
              {getCleanPublicImage(serv.image) ? (
                <Image
                  src={getCleanPublicImage(serv.image)}
                  alt={serv.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <SolarCardPlaceholder title={serv.title} subtitle="Turnkey Solar Service" />
              )}
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                Professional Engineering Service
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
                {serv.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                {serv.fullDescription}
              </p>
            </div>

            {/* Benefits */}
            {serv.benefits && serv.benefits.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-border">
                <h3 className="text-lg font-bold text-navy-800">Key Advantages</h3>
                <ul className="space-y-2">
                  {serv.benefits.map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy-800">
                      <Check className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Execution Process */}
            {serv.processSteps && serv.processSteps.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-border">
                <h3 className="text-lg font-bold text-navy-800">Standard Execution Workflow</h3>
                <div className="space-y-3">
                  {serv.processSteps.map((st: { stepNumber: number; title: string; description: string }) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 rounded-2xl bg-slate-bg/70 border border-slate-border flex gap-4 items-start"
                    >
                      <span className="w-8 h-8 rounded-full bg-solar-green text-white font-bold flex items-center justify-center shrink-0 text-sm">
                        {st.stepNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-navy-800">{st.title}</h4>
                        <p className="text-xs text-slate-muted mt-0.5 leading-relaxed">{st.description}</p>
                      </div>
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
                  Service Booking
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Book {serv.title}
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Schedule a verified technician visit or consult directly with our engineering division.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="service"
                defaultSolution={serv.title}
                compact
                buttonText="Book Site Visit & Survey"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
