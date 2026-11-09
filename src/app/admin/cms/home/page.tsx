"use client";

import { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle2 } from "lucide-react";

export default function AdminHomeCmsPage() {
  const [headline, setHeadline] = useState("Power Your Future with Solar Energy");
  const [subheading, setSubheading] = useState("Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand and Uttar Pradesh.");
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
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Page Content</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Homepage CMS Sections
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Update hero headlines, trust metrics, and section ordering dynamically.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6 max-w-3xl">
        <h3 className="text-base font-bold text-navy-800">Section 2: Hero Configuration</h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-navy-800 block mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-sm font-bold text-navy-800 outline-none focus:border-solar-green"
            />
          </div>

          <div>
            <label className="font-bold text-navy-800 block mb-1">
              Hero Subheading
            </label>
            <textarea
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-xs text-slate-muted outline-none focus:border-solar-green"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>

        {saved && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Homepage CMS updated successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
}
