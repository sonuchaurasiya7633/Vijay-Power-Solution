"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/solutions")
      .then((r) => r.json())
      .then((d) => setSolutions(d.solutions || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Solutions CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Solar Solutions Architecture
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Residential, Commercial, Industrial, Agricultural, On-Grid, and Hybrid power packages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s) => (
          <div key={s.slug} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-solar-green uppercase bg-solar-green-light px-2 py-0.5 rounded">
              {s.category}
            </span>
            <h3 className="text-base font-bold text-navy-800">{s.title}</h3>
            <p className="text-xs text-slate-muted line-clamp-2">{s.tagline}</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold text-navy-800">Range: {s.typicalCapacityRange}</span>
              <Link href={`/solar-solutions/${s.slug}`} target="_blank" className="text-xs font-bold text-solar-green hover:underline">
                View Page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
