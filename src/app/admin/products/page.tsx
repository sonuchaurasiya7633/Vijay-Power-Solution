"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, Zap, CheckCircle2, Loader2, Trash2, Edit3, X, Save } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    brand: "VPS Solar",
    ratedPowerWp: 550,
    cellTechnology: "Mono PERC",
    wattageGroup: "351W - 550W",
    moduleEfficiencyPercent: 21.5,
    description: "",
    isPublished: true,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?adminMode=true");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      slug: "",
      brand: "VPS Solar",
      ratedPowerWp: 550,
      cellTechnology: "Mono PERC",
      wattageGroup: "351W - 550W",
      moduleEfficiencyPercent: 21.5,
      description: "",
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      slug: p.slug || "",
      brand: p.brand || "VPS Solar",
      ratedPowerWp: p.ratedPowerWp || 550,
      cellTechnology: p.cellTechnology || "Mono PERC",
      wattageGroup: p.wattageGroup || "351W - 550W",
      moduleEfficiencyPercent: p.moduleEfficiencyPercent || 21.5,
      description: p.description || "",
      isPublished: p.isPublished !== undefined ? p.isPublished : true,
    });
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    if (!editingId) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm({ ...form, name: val, slug });
    } else {
      setForm({ ...form, name: val });
    }
  };

  const handlePowerChange = (power: number) => {
    let group = "10W - 100W";
    if (power > 550) group = "551W - 730W";
    else if (power > 350) group = "351W - 550W";
    else if (power > 100) group = "101W - 350W";

    setForm({ ...form, ratedPowerWp: power, wattageGroup: group });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.ratedPowerWp < 10 || form.ratedPowerWp > 730) {
      return alert("Solar panel rated power must strictly be between 10W and 730W");
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert(data.error || "Failed to save product");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !currentStatus }),
    });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from the catalogue?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Catalogue CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Solar Panels (10W to 730W)
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Verified engineering module catalogue. Strictly non-ecommerce (no public pricing).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Solar Panel</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading product catalogue...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No products found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Rated Power</th>
                  <th className="p-4">Group</th>
                  <th className="p-4">Efficiency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{p.productId}</td>
                    <td className="p-4 font-bold text-navy-800 max-w-xs truncate">{p.name}</td>
                    <td className="p-4 text-slate-muted">{p.brand}</td>
                    <td className="p-4 font-extrabold text-navy-800">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-solar-green fill-current" />
                        <span>{p.ratedPowerWp} Wp</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted">{p.wattageGroup}</td>
                    <td className="p-4 font-semibold text-navy-800">{p.moduleEfficiencyPercent ? `${p.moduleEfficiencyPercent}%` : "-"}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          p.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => togglePublish(p._id, p.isPublished)}
                        className="px-2.5 py-1 rounded-lg border border-slate-border text-navy-800 hover:bg-slate-50 font-bold text-[11px]"
                      >
                        {p.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/solar-panels/${p.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px]"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Solar Panel" : "Add Solar Module (10W - 730W)"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Module Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waaree 550W Mono PERC Bifacial Solar Panel"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                  <label className="font-bold text-navy-800 block mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Waaree / Tata Power / VPS"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Rated Power (10-730W) *</label>
                  <input
                    type="number"
                    min={10}
                    max={730}
                    required
                    value={form.ratedPowerWp}
                    onChange={(e) => handlePowerChange(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Technology</label>
                  <select
                    value={form.cellTechnology}
                    onChange={(e) => setForm({ ...form, cellTechnology: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="Mono PERC">Mono PERC</option>
                    <option value="TOPCon">TOPCon</option>
                    <option value="Bifacial">Bifacial</option>
                    <option value="Monocrystalline">Monocrystalline</option>
                    <option value="Polycrystalline">Polycrystalline</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Efficiency (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.moduleEfficiencyPercent}
                    onChange={(e) => setForm({ ...form, moduleEfficiencyPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Technical Overview</label>
                <textarea
                  rows={3}
                  placeholder="Engineering features, cell construction, durability under Indian weather conditions..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  <span>{editingId ? "Update Product" : "Save Module"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
