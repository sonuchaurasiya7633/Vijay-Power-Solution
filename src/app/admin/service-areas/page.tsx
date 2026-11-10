"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import { MapPin, Plus, CheckCircle2, Trash2, Edit3, X, Loader2, Save } from "lucide-react";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";

export default function AdminServiceAreasPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    state: "Bihar",
    stateSlug: "bihar",
    district: "",
    city: "",
    citySlug: "",
    contactPhone: "+91 94310 00000",
    overviewText: "Turnkey solar solutions, net metering assistance, and DISCOM grid-tie installations.",
    serviceAvailability: "available",
    priorityArea: true,
    isPublished: true,
  });

  const fetchLocations = () => {
    fetch("/api/service-areas")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      state: "Bihar",
      stateSlug: "bihar",
      district: "",
      city: "",
      citySlug: "",
      contactPhone: "+91 94310 00000",
      overviewText: "Turnkey solar solutions, net metering assistance, and DISCOM grid-tie installations.",
      serviceAvailability: "available",
      priorityArea: true,
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (loc: any) => {
    setEditingId(loc._id);
    setForm({
      state: loc.state || "Bihar",
      stateSlug: loc.stateSlug || "bihar",
      district: loc.district || "",
      city: loc.city || "",
      citySlug: loc.citySlug || "",
      contactPhone: loc.contactPhone || "+91 94310 00000",
      overviewText: loc.overviewText || "",
      serviceAvailability: loc.serviceAvailability || "available",
      priorityArea: loc.priorityArea !== undefined ? loc.priorityArea : true,
      isPublished: loc.isPublished !== undefined ? loc.isPublished : true,
    });
    setShowModal(true);
  };

  const handleCityChange = (val: string) => {
    if (!editingId) {
      const citySlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm({ ...form, city: val, citySlug });
    } else {
      setForm({ ...form, city: val });
    }
  };

  const handleStateChange = (stateName: string) => {
    const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm({ ...form, state: stateName, stateSlug });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.district || !form.city) {
      toast.warning("District and City are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/service-areas/${editingId}` : "/api/service-areas";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        if (editingId) {
          toast.updated("Updated successfully!", `Service area "${form.city}" updated.`);
        } else {
          toast.created("Created successfully!", `Service area "${form.city}" registered.`);
        }
        setShowModal(false);
        fetchLocations();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save location");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, city: string) => {
    if (!confirm(`Are you sure you want to remove ${city} from verified service areas?`)) return;
    try {
      const res = await fetch(`/api/service-areas/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", `Service area "${city}" deleted.`);
        fetchLocations();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete service area");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service area");
    }
  };

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

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading service areas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc._id} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2 py-0.5 rounded">
                    {loc.state}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-navy-800 bg-slate-bg px-2 py-0.5 rounded">
                      District: {loc.district}
                    </span>
                    <button
                      onClick={() => openEditModal(loc)}
                      className="p-1 text-slate-400 hover:text-navy-800 rounded"
                      title="Edit Location"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc._id, loc.city)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-navy-800">{loc.city}</h3>
                <p className="text-xs text-slate-muted line-clamp-2">{loc.overviewText || "Full solar EPC coverage."}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-muted">/{loc.stateSlug}/{loc.citySlug}</span>
                <Link href={`/service-areas/${loc.stateSlug}/${loc.citySlug}`} target="_blank" className="text-xs font-bold text-solar-green hover:underline">
                  View Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Location Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Service Location" : "Add Service Location"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                >
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muzaffarpur / Dhanbad / Gorakhpur"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muzaffarpur"
                    value={form.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">City Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.citySlug}
                    onChange={(e) => setForm({ ...form, citySlug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  placeholder="Local net metering assistance, DISCOM coverage..."
                  value={form.overviewText}
                  onChange={(e) => setForm({ ...form, overviewText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-solar-green text-white font-bold hover:bg-solar-green-hover flex items-center gap-1.5 shadow-sm"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? "Update Location" : "Save Location"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
