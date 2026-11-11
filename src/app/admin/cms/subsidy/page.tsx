"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Landmark,
  Save,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  ShieldAlert,
  FileCheck2,
} from "lucide-react";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";

export default function AdminSubsidyCmsPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "slabs" | "states" | "workflow" | "documents">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    hero: {
      badge: "Government Initiatives & Schemes",
      title: "PM Surya Ghar: Muft Bijli Yojana",
      subtitle:
        "Educational guide to national financial assistance, eligibility guidelines, DISCOM technical requirements, and step-by-step application workflow for rooftop solar across India.",
    },
    slabs: [
      {
        capacity: "1 kW System",
        subsidyAmount: "₹30,000",
        application: "Small homes (1-2 fans, TV, LED lights)",
        typicalSavings: "₹800 – ₹1,200 / month",
      },
      {
        capacity: "2 kW System",
        subsidyAmount: "₹60,000",
        application: "Medium homes (1 AC, refrigerator, washing machine)",
        typicalSavings: "₹1,800 – ₹2,500 / month",
      },
      {
        capacity: "3 kW to 10 kW System",
        subsidyAmount: "₹78,000 (Maximum Cap)",
        application: "Large homes & multi-floor residences (2-3 ACs, heavy loads)",
        typicalSavings: "₹3,500 – ₹8,000+ / month",
      },
    ],
    states: [
      {
        state: "North & Central India",
        discoms: "UPPCL, BSES/TPDDL (Delhi), JVVNL (Rajasthan), MPMKVVCL",
        perks:
          "Seamless integration with the PM Surya Ghar national portal across Delhi NCR, UP, Rajasthan, Haryana, and MP, plus state net-metering incentives.",
      },
      {
        state: "West & South India",
        discoms: "MSEDCL (Maharashtra), UGVCL (Gujarat), BESCOM (Karnataka), TANGEDCO",
        perks:
          "Fast-track online bi-directional net-metering and DBT processing across industrial, commercial, and residential rooftops nationwide.",
      },
      {
        state: "East & North-East India",
        discoms: "SBPDCL & NBPDCL (Bihar), JBVNL (Jharkhand), WBSEDCL, TPCODL",
        perks:
          "Single-window rooftop DISCOM coordination, expedited feeder feasibility checks, and turnkey net-metering commissioning.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "National Portal Registration",
        desc: "Register on pmsuryaghar.gov.in using your electricity consumer CA number and mobile number.",
      },
      {
        step: "02",
        title: "Feasibility Approval by DISCOM",
        desc: "Local DISCOM engineers verify transformer capacity and sanction approval within 7-15 days.",
      },
      {
        step: "03",
        title: "Installation by Certified Vendor",
        desc: "VIJOY POWER SOLUTION installs ALMM compliant panels, galvanized structure, and grid inverter.",
      },
      {
        step: "04",
        title: "Net-Meter Inspection & Synchronization",
        desc: "DISCOM officials inspect technical safety, install the bi-directional meter, and commission the plant.",
      },
      {
        step: "05",
        title: "Direct Benefit Transfer (DBT)",
        desc: "Commissioning certificate is uploaded, and the subsidy is credited directly to the customer's bank account within 30 days.",
      },
    ],
    documents: [
      { name: "Latest Electricity Bill", note: "Should be in consumer's name showing sanctioned load & CA number" },
      { name: "Aadhaar Card", note: "Linked to the bank account and mobile number" },
      { name: "Cancelled Bank Cheque / Passbook", note: "For direct subsidy deposit via PFMS DBT" },
      { name: "Terrace / Rooftop Ownership Proof", note: "Latest property tax receipt or registered title deed" },
      { name: "Passport Size Photograph", note: "Recent color photo of the electricity connection holder" },
    ],
    disclaimer:
      "VIJOY POWER SOLUTION provides turnkey EPC liaison and subsidy application assistance. Central subsidy disbursement is managed exclusively by the Ministry of New and Renewable Energy (MNRE) directly to the beneficiary bank account.",
  });

  useEffect(() => {
    fetch("/api/settings?key=subsidy_page")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setForm((prev) => ({
            ...prev,
            ...d.setting,
            hero: { ...prev.hero, ...(d.setting.hero || {}) },
            slabs: d.setting.slabs || prev.slabs,
            states: d.setting.states || prev.states,
            workflow: d.setting.workflow || prev.workflow,
            documents: d.setting.documents || prev.documents,
          }));
        }
      })
      .catch((e) => console.error("Error loading subsidy CMS:", e))
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
          key: "subsidy_page",
          value: form,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
        toast.saved("Saved successfully!", "PM Surya Ghar subsidy guide and slab policy updated.");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save subsidy CMS.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving subsidy CMS.");
    } finally {
      setSaving(false);
    }
  };

  const updateSlab = (idx: number, field: string, value: string) => {
    const list = [...form.slabs];
    list[idx] = { ...list[idx], [field]: value };
    setForm({ ...form, slabs: list });
  };

  const updateState = (idx: number, field: string, value: string) => {
    const list = [...form.states];
    list[idx] = { ...list[idx], [field]: value };
    setForm({ ...form, states: list });
  };

  const updateWorkflow = (idx: number, field: string, value: string) => {
    const list = [...form.workflow];
    list[idx] = { ...list[idx], [field]: value };
    setForm({ ...form, workflow: list });
  };

  const updateDoc = (idx: number, field: string, value: string) => {
    const list = [...form.documents];
    list[idx] = { ...list[idx], [field]: value };
    setForm({ ...form, documents: list });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-muted">
        <Loader2 className="w-8 h-8 animate-spin text-solar-green mb-2" />
        <span className="text-sm font-semibold">Loading Subsidy CMS...</span>
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
              <span className="text-[10px] font-semibold text-slate-400">/subsidy-information</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-navy-800">
              PM Surya Ghar & Subsidy Guide CMS
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
            href="/subsidy-information"
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
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "hero"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          1. Hero Banner
        </button>
        <button
          onClick={() => setActiveTab("slabs")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "slabs"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          2. Central Subsidy Slabs
        </button>
        <button
          onClick={() => setActiveTab("states")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "states"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          3. State DISCOM Policies
        </button>
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "workflow"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          4. 5-Step Application Process
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "documents"
              ? "border-solar-green text-solar-green"
              : "border-transparent text-slate-muted hover:text-navy-800"
          }`}
        >
          5. Document Checklist & Advisory
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-b-2xl border border-slate-border border-t-0 shadow-sm space-y-6">
        {activeTab === "hero" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Top Badge
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
                Main Page Heading (H1)
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
                Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={form.hero.subtitle}
                onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "slabs" && (
          <div className="space-y-5">
            <p className="text-xs text-slate-muted">
              Central Govt Subsidy amounts under PM Surya Ghar Muft Bijli Yojana (1 kW up to 10 kW).
            </p>

            <div className="space-y-4">
              {form.slabs.map((slab, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-solar-green text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-navy-800">Subsidy Slab #{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Capacity Tier</label>
                      <input
                        type="text"
                        value={slab.capacity}
                        onChange={(e) => updateSlab(idx, "capacity", e.target.value)}
                        className="w-full text-xs font-bold px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Central Subsidy Amount</label>
                      <input
                        type="text"
                        value={slab.subsidyAmount}
                        onChange={(e) => updateSlab(idx, "subsidyAmount", e.target.value)}
                        className="w-full text-xs font-bold text-solar-green px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Typical Application</label>
                      <input
                        type="text"
                        value={slab.application}
                        onChange={(e) => updateSlab(idx, "application", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">Typical Monthly Savings</label>
                      <input
                        type="text"
                        value={slab.typicalSavings}
                        onChange={(e) => updateSlab(idx, "typicalSavings", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "states" && (
          <div className="space-y-5">
            <p className="text-xs text-slate-muted">
              State-specific DISCOM net-metering provisions and state incentives across India.
            </p>

            <div className="space-y-4">
              {form.states.map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">State Name</label>
                      <input
                        type="text"
                        value={st.state}
                        onChange={(e) => updateState(idx, "state", e.target.value)}
                        className="w-full text-xs font-bold px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-muted mb-1">DISCOMs</label>
                      <input
                        type="text"
                        value={st.discoms}
                        onChange={(e) => updateState(idx, "discoms", e.target.value)}
                        className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">State Incentives & Feasibility Rules</label>
                    <textarea
                      rows={2}
                      value={st.perks}
                      onChange={(e) => updateState(idx, "perks", e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "workflow" && (
          <div className="space-y-5">
            <p className="text-xs text-slate-muted">
              Step-by-step consumer journey for net-meter synchronization and DBT subsidy release.
            </p>

            <div className="space-y-4">
              {form.workflow.map((wf, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-navy-800 text-white text-xs font-bold flex items-center justify-center">
                      {wf.step}
                    </span>
                    <input
                      type="text"
                      value={wf.title}
                      onChange={(e) => updateWorkflow(idx, "title", e.target.value)}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-border bg-white flex-1"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={wf.desc}
                      onChange={(e) => updateWorkflow(idx, "desc", e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-5">
            <p className="text-xs text-slate-muted">
              Required documentation checklist displayed to customers before site survey.
            </p>

            <div className="space-y-3">
              {form.documents.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-border bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">Document Name</label>
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDoc(idx, "name", e.target.value)}
                      className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-muted mb-1">Requirement Note</label>
                    <input
                      type="text"
                      value={doc.note}
                      onChange={(e) => updateDoc(idx, "note", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-border bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Official Advisory / Legal Disclaimer Note
              </label>
              <textarea
                rows={3}
                value={form.disclaimer}
                onChange={(e) => setForm({ ...form, disclaimer: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-border focus:border-solar-green outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes will take effect instantly on <Link href="/subsidy-information" target="_blank" className="text-solar-green underline">/subsidy-information</Link>.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Subsidy CMS</span>
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      <CmsLivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url="/subsidy-information"
        pageTitle="PM Surya Ghar Subsidy Guide Live Preview"
      />
    </div>
  );
}
