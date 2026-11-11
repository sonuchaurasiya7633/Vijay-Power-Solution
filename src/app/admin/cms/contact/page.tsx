"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Phone,
  Save,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Eye,
  ExternalLink,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  Building,
  Plus,
  Trash2,
} from "lucide-react";
const CmsLivePreviewModal = dynamic(() => import("@/components/admin/CmsLivePreviewModal"), { ssr: false });

export default function AdminContactCmsPage() {
  const [activeTab, setActiveTab] = useState<"headquarters" | "branches" | "channels" | "map">("headquarters");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    hero: {
      badge: "Direct Communication & Regional Desks",
      title: "Contact VIJOY POWER SOLUTION",
      subtitle:
        "Reach out to our certified solar engineering and technical support teams. Serving customers across India with dedicated regional engineering and liaison desks.",
    },
    headquarters: {
      name: "Corporate Headquarters & Main Solar Yard",
      address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
      city: "Gaya",
      state: "Bihar",
      phone: "+91 94310 00000",
      email: "contact@vijoypowersolution.com",
      operatingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
    },
    branches: [
      {
        city: "Patna",
        state: "Bihar",
        title: "Patna Regional EPC Office",
        address: "Bailey Road, Saguna More, Danapur, Patna, Bihar - 801503",
        phone: "+91 94310 00001",
        contactPerson: "Er. Ramesh Pandey (Regional Manager)",
      },
      {
        city: "Ranchi",
        state: "Jharkhand",
        title: "Ranchi Liaison & Technical Center",
        address: "Harmu Bypass Road, Near Sahjanand Chowk, Ranchi, Jharkhand - 834002",
        phone: "+91 94310 00002",
        contactPerson: "Er. Ankit Kumar (Jharkhand Lead)",
      },
      {
        city: "Lucknow",
        state: "Uttar Pradesh",
        title: "Lucknow DISCOM & Project Desk",
        address: "Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
        phone: "+91 94310 00003",
        contactPerson: "Er. Priya Sharma (UP EPC Specialist)",
      },
    ],
    channels: {
      tollFreeOrHelpline: "+91 94310 00000",
      whatsappNumber: "919431000000",
      salesEmail: "sales@vijoypowersolution.com",
      supportEmail: "support@vijoypowersolution.com",
      discomSupportEmail: "discom.liaison@vijoypowersolution.com",
    },
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115668.75653422615!2d84.9255755!3d24.7954545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f32a514d4e3efb%3A0xbcf04fb5b8821cf3!2sGaya%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  });

  useEffect(() => {
    fetch("/api/settings?key=contact_page")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setForm((prev) => ({
            ...prev,
            ...d.setting,
            hero: { ...prev.hero, ...(d.setting.hero || {}) },
            headquarters: { ...prev.headquarters, ...(d.setting.headquarters || {}) },
            branches: d.setting.branches || prev.branches,
            channels: { ...prev.channels, ...(d.setting.channels || {}) },
          }));
        }
      })
      .catch((e) => console.error("Error loading contact CMS:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Also update general setting for backward compatibility
      await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "contact_page",
            value: form,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "general",
            value: {
              phone: form.headquarters.phone,
              whatsapp: form.channels.whatsappNumber,
              email: form.headquarters.email,
              address: form.headquarters.address,
              workingHours: form.headquarters.operatingHours,
            },
          }),
        }),
      ]);

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      toast.saved("Saved successfully!", "Headquarters, regional desks, and contact channels updated.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving contact CMS.");
    } finally {
      setSaving(false);
    }
  };

  const updateBranch = (idx: number, field: string, value: string) => {
    const list = [...form.branches];
    list[idx] = { ...list[idx], [field]: value };
    setForm({ ...form, branches: list });
  };

  const addBranch = () => {
    setForm({
      ...form,
      branches: [
        ...form.branches,
        {
          city: "New City",
          state: "Bihar",
          title: "New Regional Branch",
          address: "Branch address here",
          phone: "+91 94310 00000",
          contactPerson: "Branch Engineer",
        },
      ],
    });
  };

  const removeBranch = (idx: number) => {
    setForm({
      ...form,
      branches: form.branches.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-muted">
        <Loader2 className="w-8 h-8 animate-spin text-solar-green mb-2" />
        <span className="text-sm font-semibold">Loading Contact CMS...</span>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-800 bg-navy-50 px-2 py-0.5 rounded-full">
                Page CMS
              </span>
              <span className="text-[10px] font-semibold text-slate-400">/contact</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-navy-800">
              Contact Us & Regional Desks CMS
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
            href="/contact"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl text-xs font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Open Tab</span>
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
          onClick={() => setActiveTab("headquarters")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "headquarters"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          1. Headquarters (Gaya HQ)
        </button>
        <button
          onClick={() => setActiveTab("branches")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "branches"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          2. Regional Branches (Patna, Ranchi, UP)
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "channels"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          3. Phone, WhatsApp & Support Emails
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "map"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          4. Google Maps Embed
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-b-2xl border border-slate-border border-t-0 shadow-sm space-y-6">
        {activeTab === "headquarters" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Headquarters Title / Label
              </label>
              <input
                type="text"
                value={form.headquarters.name}
                onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, name: e.target.value } })}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Full Physical Address (With Pincode)
              </label>
              <textarea
                rows={2}
                value={form.headquarters.address}
                onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, address: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={form.headquarters.city}
                  onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, city: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={form.headquarters.state}
                  onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, state: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  HQ Official Phone
                </label>
                <input
                  type="text"
                  value={form.headquarters.phone}
                  onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, phone: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  HQ Official Email
                </label>
                <input
                  type="email"
                  value={form.headquarters.email}
                  onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, email: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Operating Days & Hours
              </label>
              <input
                type="text"
                value={form.headquarters.operatingHours}
                onChange={(e) => setForm({ ...form, headquarters: { ...form.headquarters, operatingHours: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "branches" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-muted">
                Regional offices and liaison desks across India displayed on the Contact directory.
              </p>
              <button
                type="button"
                onClick={addBranch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Branch Desk</span>
              </button>
            </div>

            <div className="space-y-4">
              {form.branches.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-navy-800 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-navy-800">{b.city} Regional Desk ({b.state})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeBranch(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Branch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Branch Title</label>
                      <input
                        type="text"
                        value={b.title}
                        onChange={(e) => updateBranch(idx, "title", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">City</label>
                      <input
                        type="text"
                        value={b.city}
                        onChange={(e) => updateBranch(idx, "city", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">State</label>
                      <input
                        type="text"
                        value={b.state}
                        onChange={(e) => updateBranch(idx, "state", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={b.address}
                      onChange={(e) => updateBranch(idx, "address", e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={b.phone}
                        onChange={(e) => updateBranch(idx, "phone", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Contact Person / Engineer</label>
                      <input
                        type="text"
                        value={b.contactPerson}
                        onChange={(e) => updateBranch(idx, "contactPerson", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "channels" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Toll-Free / Central Solar Helpline
                </label>
                <input
                  type="text"
                  value={form.channels.tollFreeOrHelpline}
                  onChange={(e) => setForm({ ...form, channels: { ...form.channels, tollFreeOrHelpline: e.target.value } })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  WhatsApp Support Desk (Number with 91 prefix)
                </label>
                <input
                  type="text"
                  value={form.channels.whatsappNumber}
                  onChange={(e) => setForm({ ...form, channels: { ...form.channels, whatsappNumber: e.target.value } })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  General Sales Email
                </label>
                <input
                  type="email"
                  value={form.channels.salesEmail}
                  onChange={(e) => setForm({ ...form, channels: { ...form.channels, salesEmail: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  Technical Support Email
                </label>
                <input
                  type="email"
                  value={form.channels.supportEmail}
                  onChange={(e) => setForm({ ...form, channels: { ...form.channels, supportEmail: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                  DISCOM Liaison Email
                </label>
                <input
                  type="email"
                  value={form.channels.discomSupportEmail}
                  onChange={(e) => setForm({ ...form, channels: { ...form.channels, discomSupportEmail: e.target.value } })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Google Maps Embed URL (iframe src)
              </label>
              <textarea
                rows={3}
                value={form.mapEmbedUrl}
                onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none font-mono"
              />
            </div>

            {form.mapEmbedUrl && (
              <div>
                <span className="block text-xs font-bold text-slate-muted mb-2">Live Map Preview:</span>
                <div className="rounded-xl overflow-hidden border border-slate-border h-64 w-full">
                  <iframe
                    src={form.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will take effect instantly on <Link href="/contact" target="_blank" className="text-solar-green underline">/contact</Link>.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Contact Settings</span>
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      {previewOpen && (
        <CmsLivePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          url="/contact"
          pageTitle="Contact & Regional Desks Live Preview"
        />
      )}
    </div>
  );
}
