"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Eye,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";
import CmsTableImageCell from "@/components/admin/CmsTableImageCell";

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/solutions");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "residential",
    tagline: "",
    typicalCapacityRange: "3kW - 10kW",
    description: "",
    image: "/images/gallery/customer-solar-01.jpg",
    isPublished: true,
  });

  const fetchSolutions = () => {
    fetch("/api/solutions?adminMode=true")
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
      image: "/images/gallery/customer-solar-01.jpg",
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
      image: s.image || "/images/gallery/customer-solar-01.jpg",
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

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/solutions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Solution visibility updated.`);
        fetchSolutions();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to toggle visibility");
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
            Engineered setups across Residential, Commercial, Industrial, and Agricultural sectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPreviewUrl("/solutions");
              setPreviewOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Solutions Preview</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Solution</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading solutions...</span>
        </div>
      ) : solutions.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-border text-center space-y-2">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-navy-800">No solutions found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div
              key={s._id || s.slug}
              className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <CmsTableImageCell
                    imageUrl={s.image}
                    title={s.title}
                    folder="solutions"
                    aspect="card"
                    onUpdate={async (newUrl) => {
                      const res = await fetch(`/api/solutions/${s._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: newUrl }),
                      });
                      if (!res.ok) throw new Error("Failed to update solution photo");
                      setSolutions((prev) =>
                        prev.map((item) => (item._id === s._id ? { ...item, image: newUrl } : item))
                      );
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/solutions/${s._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: "" }),
                      });
                      if (!res.ok) throw new Error("Failed to remove solution photo");
                      setSolutions((prev) =>
                        prev.map((item) => (item._id === s._id ? { ...item, image: "" } : item))
                      );
                    }}
                  />
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm ${
                        s.isPublished
                          ? "bg-green-500 text-white"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {s.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-navy-800 line-clamp-1">{s.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-slate-400 hover:text-navy-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Solution"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Solution"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-muted line-clamp-2 leading-relaxed">
                    {s.description || s.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => togglePublish(s._id, s.isPublished)}
                  className="text-[11px] font-bold text-slate-600 hover:text-navy-800 hover:underline"
                >
                  {s.isPublished ? "Unpublish" : "Publish"}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(`/solutions/${s.slug}`);
                      setPreviewOpen(true);
                    }}
                    className="font-bold text-navy-800 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                  <Link
                    href={`/solutions/${s.slug}`}
                    target="_blank"
                    className="text-slate-400 hover:text-navy-800"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Solution Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Solar Solution" : "Add Solar Solution"}
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
                  placeholder="e.g. Residential Rooftop Solar Solutions"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              {/* Cover Image Upload / Replace */}
              <CmsImageUploader
                label="Solution Banner Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                folder="solutions"
                aspectRatio="banner"
                helpText="Upload a high-quality solar solution photograph. Replaces existing image on Cloudinary."
              />

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
                  <label className="font-bold text-navy-800 block mb-1">Sector Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="off-grid">Off-Grid</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Cut monthly electricity bills by up to 90%"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Capacity Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 1kW - 10kW"
                    value={form.typicalCapacityRange}
                    onChange={(e) => setForm({ ...form, typicalCapacityRange: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Engineering architecture, inverter configurations, and net-metering advantages..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sol-published"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-solar-green focus:ring-solar-green"
                />
                <label htmlFor="sol-published" className="font-bold text-navy-800 cursor-pointer">
                  Publish solution to public website immediately
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
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

      {/* Responsive Live Preview Modal */}
      <CmsLivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url={previewUrl}
        pageTitle="Solutions Live Preview"
      />
    </div>
  );
}
