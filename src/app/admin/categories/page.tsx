"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, CheckCircle2, Loader2, Trash2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    technologyType: "Monocrystalline",
  });

  const fetchCats = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm({ ...form, name: val, slug });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return alert("Please fill name and slug");
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setForm({ name: "", slug: "", description: "", technologyType: "Monocrystalline" });
        fetchCats();
      } else {
        alert(data.error || "Failed to create category");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCats();
      } else {
        alert("Failed to delete category");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Catalogue Taxonomy</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Solar Panel Technology Categories
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Non-mutually exclusive engineering categories (e.g. Mono PERC + Bifacial + Half-Cut).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-border text-center space-y-2">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-navy-800">No categories found</h3>
          <p className="text-xs text-slate-muted">Add your first solar cell technology category above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c._id || c.slug}
              className="p-5 rounded-2xl bg-white border border-slate-border shadow-sm space-y-2 hover:border-solar-green/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => handleDelete(c._id, c.name)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-navy-800">{c.name}</h3>
                <p className="text-xs text-slate-muted font-mono">{c.slug}</p>
                {c.description && <p className="text-xs text-slate-muted line-clamp-2">{c.description}</p>}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-block text-[11px] font-bold text-solar-green bg-slate-bg px-2 py-0.5 rounded">
                  {c.technologyType || "Technology"}
                </span>
                <span className="text-[10px] text-slate-muted font-semibold">
                  {c.isActive ? "Active" : "Disabled"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">Add Technology Category</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. N-Type TOPCon Solar Panels"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

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
                <label className="font-bold text-navy-800 block mb-1">Technology Type</label>
                <select
                  value={form.technologyType}
                  onChange={(e) => setForm({ ...form, technologyType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                >
                  <option value="Monocrystalline">Monocrystalline</option>
                  <option value="Mono PERC">Mono PERC</option>
                  <option value="Bifacial">Bifacial</option>
                  <option value="TOPCon">TOPCon</option>
                  <option value="Polycrystalline">Polycrystalline</option>
                  <option value="Half-Cut">Half-Cut</option>
                  <option value="Small Wattage">Small Wattage</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of this cell engineering technology..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
