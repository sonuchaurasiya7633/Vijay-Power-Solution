"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Wrench,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  X,
  Loader2,
  Save,
  Eye,
  ExternalLink,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";
import CmsTableImageCell from "@/components/admin/CmsTableImageCell";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/services");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    serviceType: "installation",
    shortDescription: "",
    fullDescription: "",
    image: "",
    isAvailable: true,
    isFeatured: false,
  });

  const fetchServices = () => {
    fetch("/api/services?adminMode=true")
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      serviceType: "installation",
      shortDescription: "",
      fullDescription: "",
      image: "",
      isAvailable: true,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setEditingId(s._id);
    setForm({
      title: s.title || "",
      slug: s.slug || "",
      serviceType: s.serviceType || "installation",
      shortDescription: s.shortDescription || "",
      fullDescription: s.fullDescription || s.shortDescription || "",
      image: s.image || "",
      isAvailable: s.isAvailable !== undefined ? s.isAvailable : true,
      isFeatured: Boolean(s.isFeatured),
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
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        if (editingId) {
          toast.updated("Updated successfully!", `Service "${form.title}" updated.`);
        } else {
          toast.created("Created successfully!", `Service "${form.title}" created.`);
        }
        setShowModal(false);
        fetchServices();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save service");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Service status changed.`);
        fetchServices();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", `Service "${title}" deleted.`);
        fetchServices();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete service");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Services CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Installation & EPC Services
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Turnkey solar EPC offerings. Manage service details, Cloudinary banners, and public visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPreviewUrl("/services");
              setPreviewOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Services Preview</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : services.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-border text-center space-y-2">
          <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-navy-800">No services found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s._id || s.slug}
              className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <CmsTableImageCell
                    imageUrl={s.image}
                    title={s.title}
                    folder="services"
                    aspect="card"
                    onUpdate={async (newUrl) => {
                      const res = await fetch(`/api/services/${s._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: newUrl }),
                      });
                      if (!res.ok) throw new Error("Failed to update service photo");
                      setServices((prev) =>
                        prev.map((item) => (item._id === s._id ? { ...item, image: newUrl } : item))
                      );
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/services/${s._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: "" }),
                      });
                      if (!res.ok) throw new Error("Failed to remove service photo");
                      setServices((prev) =>
                        prev.map((item) => (item._id === s._id ? { ...item, image: "" } : item))
                      );
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10 pointer-events-none">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm ${
                        s.isAvailable
                          ? "bg-solar-green text-white"
                          : "bg-navy-800 text-slate-200"
                      }`}
                    >
                      {s.isAvailable ? "Active" : "Hidden"}
                    </span>
                    {s.isFeatured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-solar-yellow text-navy-800 shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-navy-800 line-clamp-1">{s.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-slate-400 hover:text-navy-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Service"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-muted line-clamp-2 leading-relaxed">
                    {s.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => toggleAvailability(s._id, s.isAvailable)}
                  className="text-[11px] font-bold text-slate-600 hover:text-navy-800 hover:underline"
                >
                  {s.isAvailable ? "Hide from Public" : "Show on Public"}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(`/services/${s.slug}`);
                      setPreviewOpen(true);
                    }}
                    className="font-bold text-navy-800 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                  <Link
                    href={`/services/${s.slug}`}
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

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Service Offering" : "Add Service Offering"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turnkey Commercial Solar EPC"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              {/* Service Cover Image */}
              <CmsImageUploader
                label="Service Showcase Banner Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                folder="services"
                aspectRatio="banner"
                helpText="Upload an authentic solar installation photograph for this service. Directly saves to Cloudinary."
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
                  <label className="font-bold text-navy-800 block mb-1">Service Category</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="installation">Installation</option>
                    <option value="survey">Site Survey & Feasibility</option>
                    <option value="maintenance">Maintenance / O&M</option>
                    <option value="consultation">Consultation & Net Metering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Short Summary (Displayed on cards) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary of engineering deliverables..."
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Full Detailed Narrative</label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive description of engineering scope, safety protocols, equipment, and utility liaison..."
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-navy-800">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-solar-green focus:ring-solar-green"
                  />
                  <span>Show on public website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-navy-800">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-solar-green focus:ring-solar-green"
                  />
                  <span>Feature on Homepage</span>
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
                  <span>{editingId ? "Update Service" : "Save Service"}</span>
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
        pageTitle="Services Live Preview"
      />
    </div>
  );
}
