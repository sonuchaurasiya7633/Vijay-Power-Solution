"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";

export default function AdminServiceAreasPage() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/service-areas")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Location Module</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Service Coverage & Regional Locations
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Verified state and city hierarchy: State → District → City. Only published verified locations appear publicly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc._id} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2 py-0.5 rounded">
                {loc.state}
              </span>
              <span className="text-[10px] font-bold text-navy-800 bg-slate-bg px-2 py-0.5 rounded">
                District: {loc.district}
              </span>
            </div>
            <h3 className="text-lg font-bold text-navy-800">{loc.city}</h3>
            <p className="text-xs text-slate-muted line-clamp-2">{loc.overviewText || "Full solar EPC coverage."}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-muted">/{loc.stateSlug}/{loc.citySlug}</span>
              <Link href={`/service-areas/${loc.stateSlug}/${loc.citySlug}`} target="_blank" className="text-xs font-bold text-solar-green hover:underline">
                View Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
