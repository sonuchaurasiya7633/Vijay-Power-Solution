"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, CheckCircle2 } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(d.services || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Services CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Installation & EPC Services
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Turnkey services offered to clients (only published when active capability exists).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.slug} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-solar-green" />
                <span>{s.title}</span>
              </span>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">Active</span>
            </div>
            <p className="text-xs text-slate-muted line-clamp-2">{s.shortDescription}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Steps: {s.processSteps?.length || 4}</span>
              <Link href={`/services/${s.slug}`} target="_blank" className="text-xs font-bold text-solar-green hover:underline">
                View Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
