import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Wrench } from "lucide-react";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";

export const metadata: Metadata = {
  title: "Solar Installation Services & EPC | VIJOY POWER SOLUTION",
  description:
    "End-to-end solar services: Roof feasibility surveys, turnkey rooftop installation, DISCOM net metering liaison, subsidy guidance, and annual maintenance across India.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    await connectDB();
    services = await SolarService.find({ isAvailable: true }).sort({ sortOrder: 1 }).lean();
  } catch (err) {
    console.warn("Database not reachable during build, using fallback services");
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Turnkey Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Professional Solar Services
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Full-lifecycle solar engineering from initial rooftop shadow simulation and utility approvals to precision physical mounting and long-term maintenance.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.slug}
              className="bg-white rounded-3xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-48 w-full bg-navy-100">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold font-display text-navy-800">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-muted leading-relaxed line-clamp-3">
                    {s.shortDescription}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1 text-[11px] text-slate-muted">
                    {s.serviceableStates?.map((st: string) => (
                      <span key={st} className="px-2 py-0.5 rounded bg-slate-bg border border-slate-200">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <Link
                  href={`/services/${s.slug}`}
                  className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1"
                >
                  <span>Learn Process</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/get-quote?service=${encodeURIComponent(s.title)}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-solar-green-light text-solar-green hover:bg-solar-green hover:text-white transition-colors"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
