"use client";

import { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminHomeCmsPage() {
  const [headline, setHeadline] = useState("Power Your Future with Solar Energy");
  const [subheading, setSubheading] = useState("Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand and Uttar Pradesh.");
  const [experienceYears, setExperienceYears] = useState(8);
  const [installationsCount, setInstallationsCount] = useState(350);
  const [capacityMw, setCapacityMw] = useState(2.5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings?key=homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && d.setting.headline) {
          setHeadline(d.setting.headline);
          setSubheading(d.setting.subheading || "");
          if (d.setting.experienceYears) setExperienceYears(d.setting.experienceYears);
          if (d.setting.installationsCount) setInstallationsCount(d.setting.installationsCount);
          if (d.setting.capacityMw) setCapacityMw(d.setting.capacityMw);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "homepage",
          value: {
            headline,
            subheading,
            experienceYears,
            installationsCount,
            capacityMw,
            serviceStates: ["Bihar", "Jharkhand", "Uttar Pradesh"],
          },
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save homepage settings");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
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
        <h3 className="text-base font-bold text-navy-800">Hero & Trust Indicators Configuration</h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-navy-800 block mb-1">
              Hero Headline *
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-sm font-bold text-navy-800 outline-none focus:border-solar-green"
            />
          </div>

          <div>
            <label className="font-bold text-navy-800 block mb-1">
              Hero Subheading *
            </label>
            <textarea
              rows={3}
              required
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-border text-xs text-slate-muted outline-none focus:border-solar-green leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label className="font-bold text-navy-800 block mb-1">Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Installations Completed</label>
              <input
                type="number"
                value={installationsCount}
                onChange={(e) => setInstallationsCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
              />
            </div>
            <div>
              <label className="font-bold text-navy-800 block mb-1">Total Capacity (MW)</label>
              <input
                type="number"
                step="0.1"
                value={capacityMw}
                onChange={(e) => setCapacityMw(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Homepage Changes</span>
          </button>

          {saved && (
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Saved to database!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
