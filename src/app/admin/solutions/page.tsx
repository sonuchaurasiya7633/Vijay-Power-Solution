"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import { Sparkles, ArrowRight, Loader2, Plus, Trash2, Edit3, X, Save } from "lucide-react";

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "residential",
    tagline: "",
    typicalCapacityRange: "3kW - 10kW",
    description: "",
    isPublished: true,
  });

  const fetchSolutions = () => {
    fetch("/api/solutions")
      .then((r) => r.json())
      .then((d) => setSolutions(d.solutions || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      category: "residential",
      tagline: "",
      typicalCapacityRange: "3kW - 10kW",
      description: "",
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setEditingId(s._id);
    setForm({
      title: s.title || "",
      slug: s.slug || "",
      category: s.category || "residential",
      tagline: s.tagline || "",
      typicalCapacityRange: s.typicalCapacityRange || "3kW - 10kW",
      description: s.description || "",
      isPublished: s.isPublished !== undefined ? s.isPublished : true,
    });
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingId) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm({ ...form, title: val, slug });
    } else {
      setForm({ ...form, title: val });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/solutions/${editingId}` : "/api/solutions";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        if (editingId) {
          toast.updated("Updated successfully!", `Solution "${form.title}" updated.`);
        } else {
          toast.created("Created successfully!", `Solution "${form.title}" created.`);
        }
        setShowModal(false);
        fetchSolutions();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save solution");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save solution");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete solution "${title}"?`)) return;
    try {
      const res = await fetch(`/api/solutions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", `Solution "${title}" deleted.`);
        fetchSolutions();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete solution");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete solution");
    }
  };

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

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Solution</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading solutions...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div key={s._id || s.slug} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-solar-green uppercase bg-solar-green-light px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1 text-slate-400 hover:text-navy-800 rounded"
                      title="Edit Solution"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id, s.title)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete Solution"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-navy-800">{s.title}</h3>
                <p className="text-xs text-slate-muted line-clamp-2">{s.tagline}</p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-bold text-navy-800">Range: {s.typicalCapacityRange}</span>
                <Link href={`/solar-solutions/${s.slug}`} target="_blank" className="text-xs font-bold text-solar-green hover:underline">
                  View Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Solution Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Solar Solution" : "Add Solar Solution Package"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Solution Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Residential Rooftop Solar"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="institutional">Institutional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Zero electricity bills with government subsidy"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Typical Capacity Range</label>
                <input
                  type="text"
                  placeholder="e.g. 1kW - 10kW"
                  value={form.typicalCapacityRange}
                  onChange={(e) => setForm({ ...form, typicalCapacityRange: e.target.value })}
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
                  <span>{editingId ? "Update Solution" : "Save Solution"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
