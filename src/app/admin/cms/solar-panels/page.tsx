"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Eye,
  Layers,
  Loader2,
  Package,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
const CmsLivePreviewModal = dynamic(() => import("@/components/admin/CmsLivePreviewModal"), { ssr: false });
import { SolarPanelLoader } from "@/components/ui/SolarLoader";
import {
  defaultSolarPanelsPageCms,
  mergeWithDefaults,
  type SolarPanelsPageCms,
  type SolarPanelsTechCard,
} from "@/lib/cms-defaults";

export default function AdminSolarPanelsCmsPage() {
  const [form, setForm] = useState<SolarPanelsPageCms>(defaultSolarPanelsPageCms);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetch("/api/settings?key=solar_panels_page")
      .then((res) => res.json())
      .then((data) => {
        if (data?.setting && Object.keys(data.setting).length > 0) {
          setForm(mergeWithDefaults(defaultSolarPanelsPageCms, data.setting));
        }
      })
      .catch(() => {
        toast.error("Failed to load Solar Panels CMS data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "solar_panels_page", value: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }
      setSaved(true);
      toast.saved("Solar Panels Page CMS updated!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Error saving Solar Panels CMS");
    } finally {
      setSaving(false);
    }
  };

  const updateTechCard = (index: number, patch: Partial<SolarPanelsTechCard>) => {
    setForm((prev) => ({
      ...prev,
      techCards: prev.techCards.map((c, idx) => (idx === index ? { ...c, ...patch } : c)),
    }));
  };

  const addTechCard = () => {
    setForm((prev) => ({
      ...prev,
      techCards: [
        ...prev.techCards,
        {
          badge: "New Tier",
          badgeColor: "green",
          title: "Solar Module Series",
          description: "Describe the solar cell architecture and operating advantages.",
        },
      ],
    }));
  };

  const removeTechCard = (index: number) => {
    if (form.techCards.length <= 1) {
      toast.warning("At least one technology card is required.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      techCards: prev.techCards.filter((_, idx) => idx !== index),
    }));
  };

  if (loading) {
    return (
      <SolarPanelLoader
        title="Loading Solar Panels Page CMS..."
        subtitle="Syncing wattage showcase headers and module technology blocks"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-navy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-800 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-solar-green" />
              <span>Solar Panels Page CMS (10W–730W)</span>
            </h1>
            <p className="text-xs text-slate-muted mt-0.5">
              Customize page headers, engineering policy note, and cell technology primer shown on /solar-panels and the Homepage portfolio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-solar-green/40 bg-solar-green-light text-solar-green hover:bg-solar-green hover:text-white text-xs font-bold transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage 10W–730W Panels</span>
          </Link>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-xs font-bold text-navy-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <Link
            href="/solar-panels"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-xs font-bold text-navy-800 transition-colors"
          >
            <span>Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-solar-green hover:bg-solar-green-dark disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Shortcut Notice */}
      <div className="bg-navy-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-solar-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">
              Panel cards (10W to 730W) are dynamically loaded from the Product Catalog!
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              To add, edit, upload real panel images, or publish/hide specific solar modules, use the Solar Panel Catalogue Manager.
            </p>
          </div>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 rounded-xl bg-solar-gold text-navy-800 text-xs font-extrabold whitespace-nowrap hover:bg-solar-yellow-hover transition-colors"
        >
          Open Product Catalogue →
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Page Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-border p-6 space-y-4">
          <h2 className="text-base font-display font-bold text-navy-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-solar-green" />
            <span>1. Solar Panels Page Top Hero Header (/solar-panels)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Hero Badge</label>
              <input
                type="text"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Hero Title</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-800">Hero Subtitle</label>
            <textarea
              rows={2}
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
            />
          </div>
        </div>

        {/* 2. Homepage & Catalogue Showcase Section */}
        <div className="bg-white rounded-2xl border border-slate-border p-6 space-y-4">
          <h2 className="text-base font-display font-bold text-navy-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-solar-green" />
            <span>2. Module Showcase Section & Engineering Policy Banner (Shared with Homepage)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Section Badge</label>
              <input
                type="text"
                value={form.showcaseBadge}
                onChange={(e) => setForm({ ...form, showcaseBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Section Title</label>
              <input
                type="text"
                value={form.showcaseTitle}
                onChange={(e) => setForm({ ...form, showcaseTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">View All Link Text</label>
              <input
                type="text"
                value={form.showcaseViewAllText}
                onChange={(e) => setForm({ ...form, showcaseViewAllText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-800">Showcase Subtitle</label>
            <textarea
              rows={2}
              value={form.showcaseSubtitle}
              onChange={(e) => setForm({ ...form, showcaseSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Policy Banner Title</label>
              <input
                type="text"
                value={form.policyTitle}
                onChange={(e) => setForm({ ...form, policyTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-800">Policy CTA Text</label>
                <input
                  type="text"
                  value={form.policyCtaText}
                  onChange={(e) => setForm({ ...form, policyCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-800">Policy CTA Route</label>
                <input
                  type="text"
                  value={form.policyCtaLink}
                  onChange={(e) => setForm({ ...form, policyCtaLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-800">Policy Banner Description</label>
            <textarea
              rows={2}
              value={form.policyText}
              onChange={(e) => setForm({ ...form, policyText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
            />
          </div>
        </div>

        {/* 3. Technology Primer Section */}
        <div className="bg-white rounded-2xl border border-slate-border p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-display font-bold text-navy-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-solar-green" />
              <span>3. Solar Cell Technology Primer & Cards</span>
            </h2>
            <button
              type="button"
              onClick={addTechCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold hover:bg-solar-green transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Technology Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Primer Badge</label>
              <input
                type="text"
                value={form.primerBadge}
                onChange={(e) => setForm({ ...form, primerBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-800">Primer Title</label>
              <input
                type="text"
                value={form.primerTitle}
                onChange={(e) => setForm({ ...form, primerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-800">Primer Subtitle</label>
            <textarea
              rows={2}
              value={form.primerSubtitle}
              onChange={(e) => setForm({ ...form, primerSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {form.techCards.map((card, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-bg border border-slate-border space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-navy-800">
                    Card #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTechCard(idx)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                    title="Delete Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Badge"
                    value={card.badge}
                    onChange={(e) => updateTechCard(idx, { badge: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                  />
                  <select
                    value={card.badgeColor}
                    onChange={(e) =>
                      updateTechCard(idx, {
                        badgeColor: e.target.value as SolarPanelsTechCard["badgeColor"],
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                  >
                    <option value="navy">Navy</option>
                    <option value="green">Green</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Card Title"
                  value={card.title}
                  onChange={(e) => updateTechCard(idx, { title: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                />
                <textarea
                  rows={3}
                  placeholder="Card Description"
                  value={card.description}
                  onChange={(e) => updateTechCard(idx, { description: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-solar-green hover:bg-solar-green-dark disabled:opacity-60 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving Changes..." : "Save Solar Panels CMS"}</span>
          </button>
        </div>
      </form>

      {previewOpen && (
        <CmsLivePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          pageTitle="Solar Panels Page Live Preview"
          url="/solar-panels"
        />
      )}
    </div>
  );
}
