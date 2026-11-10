"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Megaphone,
  Save,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Eye,
  ExternalLink,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Globe,
  Sliders,
} from "lucide-react";

export default function AdminHeaderFooterCmsPage() {
  const [activeTab, setActiveTab] = useState<"notice" | "header" | "footer" | "badges">("notice");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    noticeBar: {
      enabled: true,
      badge: "PM Surya Ghar 2026",
      text: "Serving Customers Across India | Solar Modules 10W to 730W | Subsidy up to ₹78,000 Guidance",
      linkText: "Check Subsidy",
      linkUrl: "/subsidy-information",
    },
    topBar: {
      phone: "+91 94310 00000",
      whatsapp: "919431000000",
      email: "contact@vijoypowersolution.com",
    },
    footer: {
      companyName: "VIJOY POWER SOLUTION",
      tagline: "Premier solar engineering, supply, and rooftop installation specialist empowering households, commercial enterprises, and agricultural farms across India.",
      address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
      phone: "+91 94310 00000",
      email: "contact@vijoypowersolution.com",
      workingHours: "Mon – Sat: 9:00 AM – 7:00 PM (Sunday Closed)",
      copyright: "© 2026 VIJOY POWER SOLUTION (VPS SOLAR). All rights reserved. Pan India Registered Solar EPC Contractor.",
    },
    badges: [
      "ALMM Listed Solar Modules (10W - 730W)",
      "MNRE Registered Channel Vendor",
      "DISCOM Net-Metering Liaison Across India",
      "Strict Private Quotation Policy (Non-Ecommerce)",
    ],
  });

  useEffect(() => {
    fetch("/api/settings?key=header_footer")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setForm((prev) => ({
            ...prev,
            ...d.setting,
            noticeBar: { ...prev.noticeBar, ...(d.setting.noticeBar || {}) },
            topBar: { ...prev.topBar, ...(d.setting.topBar || {}) },
            footer: { ...prev.footer, ...(d.setting.footer || {}) },
            badges: d.setting.badges || prev.badges,
          }));
        }
      })
      .catch((e) => console.error("Error loading header/footer CMS:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "header_footer",
            value: form,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "general",
            value: {
              phone: form.topBar.phone,
              whatsapp: form.topBar.whatsapp,
              email: form.topBar.email,
              address: form.footer.address,
              workingHours: form.footer.workingHours,
            },
          }),
        }),
      ]);

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      toast.saved("Saved successfully!", "Header and footer configuration updated.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving header & footer settings.");
    } finally {
      setSaving(false);
    }
  };

  const updateBadge = (idx: number, val: string) => {
    const list = [...form.badges];
    list[idx] = val;
    setForm({ ...form, badges: list });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-muted">
        <Loader2 className="w-8 h-8 animate-spin text-solar-green mb-2" />
        <span className="text-sm font-semibold">Loading Header & Footer CMS...</span>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Global Shell CMS
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Header, Ticker & Footer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-navy-800">
              Header, Announcement Bar & Footer CMS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
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
          onClick={() => setActiveTab("notice")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "notice"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          1. Top Announcement Marquee Ticker
        </button>
        <button
          onClick={() => setActiveTab("header")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "header"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          2. Header Helpline & WhatsApp Desk
        </button>
        <button
          onClick={() => setActiveTab("footer")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "footer"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          3. Footer Blurb & Registered Office
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "badges"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          4. Certifications & Badges
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-b-2xl border border-slate-border border-t-0 shadow-sm space-y-6">
        {activeTab === "notice" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-border">
              <input
                type="checkbox"
                id="noticeEnabled"
                checked={form.noticeBar.enabled}
                onChange={(e) => setForm({ ...form, noticeBar: { ...form.noticeBar, enabled: e.target.checked } })}
                className="w-4 h-4 text-solar-green rounded border-slate-300 focus:ring-solar-green"
              />
              <label htmlFor="noticeEnabled" className="text-xs font-bold text-navy-800 cursor-pointer">
                Display Top Announcement Bar on All Pages
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={form.noticeBar.badge}
                  onChange={(e) => setForm({ ...form, noticeBar: { ...form.noticeBar, badge: e.target.value } })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Announcement Message / Ticker
                </label>
                <input
                  type="text"
                  value={form.noticeBar.text}
                  onChange={(e) => setForm({ ...form, noticeBar: { ...form.noticeBar, text: e.target.value } })}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Action Link Text (Optional)
                </label>
                <input
                  type="text"
                  value={form.noticeBar.linkText}
                  onChange={(e) => setForm({ ...form, noticeBar: { ...form.noticeBar, linkText: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Action Link URL
                </label>
                <input
                  type="text"
                  value={form.noticeBar.linkUrl}
                  onChange={(e) => setForm({ ...form, noticeBar: { ...form.noticeBar, linkUrl: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4 p-4 rounded-xl border border-slate-border bg-slate-50 space-y-2">
              <span className="text-[11px] font-bold text-slate-muted uppercase tracking-wider block">Live Banner Preview:</span>
              <div className="bg-navy-800 text-white text-xs py-2 px-4 rounded-lg flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <span className="inline-block w-2 h-2 rounded-full bg-solar-yellow animate-pulse" />
                  <span className="font-bold text-solar-yellow text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded">{form.noticeBar.badge}</span>
                  <span className="truncate">{form.noticeBar.text}</span>
                </div>
                {form.noticeBar.linkText && (
                  <span className="text-[11px] text-solar-green underline font-bold shrink-0">{form.noticeBar.linkText} &rarr;</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "header" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Navbar Hotline Number
                </label>
                <input
                  type="text"
                  value={form.topBar.phone}
                  onChange={(e) => setForm({ ...form, topBar: { ...form.topBar, phone: e.target.value } })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Navbar WhatsApp Number (with 91 prefix)
                </label>
                <input
                  type="text"
                  value={form.topBar.whatsapp}
                  onChange={(e) => setForm({ ...form, topBar: { ...form.topBar, whatsapp: e.target.value } })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Central Inquiries Email
              </label>
              <input
                type="email"
                value={form.topBar.email}
                onChange={(e) => setForm({ ...form, topBar: { ...form.topBar, email: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "footer" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Company Brand Summary Paragraph
              </label>
              <textarea
                rows={3}
                value={form.footer.tagline}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, tagline: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Footer Office Address
              </label>
              <input
                type="text"
                value={form.footer.address}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, address: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Footer Contact Phone
                </label>
                <input
                  type="text"
                  value={form.footer.phone}
                  onChange={(e) => setForm({ ...form, footer: { ...form.footer, phone: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Working Hours Note
                </label>
                <input
                  type="text"
                  value={form.footer.workingHours}
                  onChange={(e) => setForm({ ...form, footer: { ...form.footer, workingHours: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Copyright Notice Line
              </label>
              <input
                type="text"
                value={form.footer.copyright}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, copyright: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-muted">
              Official compliance badges and certifications rendered in the footer trust bar.
            </p>

            <div className="space-y-3">
              {form.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateBadge(idx, e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will take effect instantly across all public pages.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Global Header & Footer</span>
          </button>
        </div>
      </form>
    </div>
  );
}
