"use client";

import { useState } from "react";
import { Globe, CheckCircle2, Save } from "lucide-react";

export default function AdminSeoPage() {
  const [defaultTitle, setDefaultTitle] = useState("VIJOY POWER SOLUTION | Premier Solar Panel Installation & EPC in Bihar, Jharkhand & UP");
  const [defaultDesc, setDefaultDesc] = useState("Turnkey solar power solutions, high-efficiency solar panels (10W-730W), PM Surya Ghar subsidy assistance, and DISCOM net-metering across Bihar, Jharkhand, and Uttar Pradesh.");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Search Optimization</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            SEO Manager & Meta Configuration
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage organic ranking directives, meta titles, descriptions, and sitemap settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6 max-w-3xl">
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-navy-800">Default Meta Title Tag</label>
              <span className="text-[10px] text-slate-muted">{defaultTitle.length} / 70 chars</span>
            </div>
            <input
              type="text"
              value={defaultTitle}
              onChange={(e) => setDefaultTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-xs font-medium text-navy-800 outline-none focus:border-solar-green"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-navy-800">Default Meta Description</label>
              <span className="text-[10px] text-slate-muted">{defaultDesc.length} / 160 chars</span>
            </div>
            <textarea
              rows={3}
              value={defaultDesc}
              onChange={(e) => setDefaultDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-xs text-slate-muted outline-none focus:border-solar-green"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO Settings</span>
        </button>

        {saved && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>SEO configuration saved successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
}
