"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Building2,
  Save,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Eye,
  ExternalLink,
  ShieldCheck,
  Compass,
  Award,
  Users,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";

export default function AdminAboutCmsPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "narrative" | "pillars" | "leadership">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    hero: {
      badge: "Company Profile & Engineering Philosophy",
      title: "About VIJOY POWER SOLUTION",
      subtitle:
        "Delivering clean, dependable solar rooftop engineering, ALMM-compliant panel supply, and seamless DISCOM net-metering across India.",
      imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&q=85",
    },
    narrative: {
      badge: "Engineering Heritage",
      headline: "Empowering India with Dependable Renewable Energy",
      paragraph1:
        "VIJOY POWER SOLUTION was founded with a singular conviction: renewable energy must be engineered for real Indian operating conditions. Solar panels across Indian states face intense summer heat exceeding 45°C, high dust deposition, and severe monsoon winds.",
      paragraph2:
        "We bridge the gap between premium tier-1 equipment and flawless civil-electrical execution. From 10W specialized modules up to 730W high-efficiency Heterojunction and N-Type TOPCon bifacial arrays, every system is designed around the customer's exact roof geometry and energy consumption pattern.",
      missionTitle: "Our Mission",
      missionDesc:
        "To make rooftop solar the most dependable, cost-effective power source for every home and enterprise across India.",
      valuesTitle: "Our Core Value",
      valuesDesc:
        "Uncompromising engineering transparency: verified tier-1 equipment, zero fake pricing, and zero shortcuts on safety.",
    },
    pillars: [
      {
        title: "Tier-1 ALMM Module Supply",
        desc: "Strictly deploy ALMM-listed mono PERC and N-type TOPCon modules ranging from 10W to 730W with 25-30 year linear output warranties.",
      },
      {
        title: "Rigorous Civil & Wind Engineering",
        desc: "Hot-dip galvanized mounting structures engineered to withstand 150 km/h wind gusts, anchored with non-destructive ballasts.",
      },
      {
        title: "DISCOM Liaison Mastery",
        desc: "End-to-end liaison with state electricity utility boards (DISCOMs) across India for rapid feasibility approval and net-meter synchronization.",
      },
      {
        title: "Nationwide Field Support",
        desc: "Trained resident technicians and certified installation teams across India ensuring prompt routine maintenance and warranty service.",
      },
    ],
    leadership: {
      quote:
        "Solar rooftop adoption is not just an equipment sale — it is a quarter-century engineering commitment to our clients across India.",
      author: "Eng. Vijay Kumar",
      designation: "Founder & Chief Technical Director",
    },
  });

  useEffect(() => {
    fetch("/api/settings?key=about_page")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setForm((prev) => ({
            ...prev,
            ...d.setting,
            hero: { ...prev.hero, ...(d.setting.hero || {}) },
            narrative: { ...prev.narrative, ...(d.setting.narrative || {}) },
            pillars: d.setting.pillars || prev.pillars,
            leadership: { ...prev.leadership, ...(d.setting.leadership || {}) },
          }));
        }
      })
      .catch((e) => console.error("Error loading about page CMS:", e))
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
          key: "about_page",
          value: form,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
        toast.saved("Saved successfully!", "About Us story and pillars have been updated.");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save settings. Please verify you have admin/editor permissions.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const updatePillar = (idx: number, field: "title" | "desc", value: string) => {
    const updated = [...form.pillars];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, pillars: updated });
  };

  const addPillar = () => {
    setForm({
      ...form,
      pillars: [
        ...form.pillars,
        {
          title: "New Quality Benchmark",
          desc: "Description of the engineering standard or operational benchmark.",
        },
      ],
    });
  };

  const removePillar = (idx: number) => {
    if (form.pillars.length <= 1) {
      toast.error("At least one quality pillar is required.");
      return;
    }
    setForm({
      ...form,
      pillars: form.pillars.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-muted">
        <Loader2 className="w-8 h-8 animate-spin text-solar-green mb-2" />
        <span className="text-sm font-semibold">Loading About Us CMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cms"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-navy-800 transition-colors border border-slate-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2 py-0.5 rounded-full">
                Page CMS
              </span>
              <span className="text-[10px] font-semibold text-slate-400">/about</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-navy-800">
              About Us Page Content Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl text-xs font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : saved ? "Changes Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-border bg-white rounded-t-2xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "hero"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          1. Hero Header & Image
        </button>
        <button
          onClick={() => setActiveTab("narrative")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "narrative"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          2. Heritage Narrative & Mission
        </button>
        <button
          onClick={() => setActiveTab("pillars")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "pillars"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          3. Quality Standards (4 Pillars)
        </button>
        <button
          onClick={() => setActiveTab("leadership")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "leadership"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          4. Leadership & Philosophy
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-b-2xl border border-slate-border border-t-0 shadow-sm space-y-6">
        {activeTab === "hero" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Hero Top Badge
              </label>
              <input
                type="text"
                value={form.hero.badge}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, badge: e.target.value } })}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Page Main Title (H1)
              </label>
              <input
                type="text"
                value={form.hero.title}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
                className="w-full text-sm font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={form.hero.subtitle}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <CmsImageUploader
              label="Hero Showcase Image (Rooftop Showcase or Engineering Team)"
              value={form.hero.imageUrl}
              onChange={(url) => setForm({ ...form, hero: { ...form.hero, imageUrl: url } })}
              folder="company"
              aspectRatio="banner"
              helpText="Upload a high-resolution banner photo for the About Us page header. Directly uploads and replaces on Cloudinary."
            />
          </div>
        )}

        {activeTab === "narrative" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={form.narrative.badge}
                onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, badge: e.target.value } })}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Story Headline (H2)
              </label>
              <input
                type="text"
                value={form.narrative.headline}
                onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, headline: e.target.value } })}
                className="w-full text-sm font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Story Paragraph 1 (Regional Context & Engineering)
              </label>
              <textarea
                rows={3}
                value={form.narrative.paragraph1}
                onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, paragraph1: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Story Paragraph 2 (10W-730W Modules & Execution)
              </label>
              <textarea
                rows={3}
                value={form.narrative.paragraph2}
                onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, paragraph2: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-navy-800">Mission Statement Title</label>
                <input
                  type="text"
                  value={form.narrative.missionTitle}
                  onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, missionTitle: e.target.value } })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-border bg-white"
                />
                <label className="block text-xs font-bold text-slate-muted">Mission Description</label>
                <textarea
                  rows={2}
                  value={form.narrative.missionDesc}
                  onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, missionDesc: e.target.value } })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-border bg-white"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-navy-800">Core Value Title</label>
                <input
                  type="text"
                  value={form.narrative.valuesTitle}
                  onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, valuesTitle: e.target.value } })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-border bg-white"
                />
                <label className="block text-xs font-bold text-slate-muted">Value Description</label>
                <textarea
                  rows={2}
                  value={form.narrative.valuesDesc}
                  onChange={(e) => setForm({ ...form, narrative: { ...form.narrative, valuesDesc: e.target.value } })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-border bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "pillars" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-muted">
                These core engineering benchmarks are prominently highlighted on the About page.
              </p>
              <button
                type="button"
                onClick={addPillar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-solar-green-light text-solar-green rounded-xl text-xs font-bold hover:bg-solar-green/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quality Benchmark</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.pillars.map((pillar, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-navy-800 text-white text-xs font-bold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-navy-800">Quality Benchmark #{idx + 1}</span>
                    </div>
                    {form.pillars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePillar(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                        title="Delete this pillar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updatePillar(idx, "title", e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => updatePillar(idx, "desc", e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leadership" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Director / Engineering Philosophy Quote
              </label>
              <textarea
                rows={3}
                value={form.leadership.quote}
                onChange={(e) => setForm({ ...form, leadership: { ...form.leadership, quote: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={form.leadership.author}
                  onChange={(e) => setForm({ ...form, leadership: { ...form.leadership, author: e.target.value } })}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={form.leadership.designation}
                  onChange={(e) => setForm({ ...form, leadership: { ...form.leadership, designation: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will take effect instantly on <Link href="/about" target="_blank" className="text-solar-green underline">/about</Link>.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save About Page Content</span>
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      <CmsLivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url="/about"
        pageTitle="About Us Page Live Preview"
      />
    </div>
  );
}
