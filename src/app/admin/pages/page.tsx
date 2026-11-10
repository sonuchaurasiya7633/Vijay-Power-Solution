"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  FileCode2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  Save,
  X,
  Loader2,
  Sliders,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";

export default function AdminPagesManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    heroHeading: "",
    heroSubtitle: "",
    heroImage: "",
    contentHtml: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: true,
  });

  const fetchPages = () => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((d) => setPages(d.pages || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreateModal = () => {
    setEditingPageId(null);
    setForm({
      title: "",
      slug: "",
      heroHeading: "",
      heroSubtitle: "",
      heroImage: "",
      contentHtml: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingPageId(p._id);
    setForm({
      title: p.title || "",
      slug: p.slug || "",
      heroHeading: p.heroHeading || p.title || "",
      heroSubtitle: p.heroSubtitle || "",
      heroImage: p.heroImage || "",
      contentHtml: p.contentHtml || "",
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      isPublished: p.isPublished !== undefined ? p.isPublished : true,
    });
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingPageId) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm({ ...form, title: val, slug, heroHeading: val });
    } else {
      setForm({ ...form, title: val });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingPageId ? `/api/pages/${editingPageId}` : "/api/pages";
      const method = editingPageId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        if (editingPageId) {
          toast.updated("Updated successfully!", `Page "${form.title}" updated.`);
        } else {
          toast.created("Created successfully!", `Page "${form.title}" created.`);
        }
        setShowModal(false);
        fetchPages();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save page");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Page visibility set to ${!current ? "Published" : "Draft"}.`);
        fetchPages();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update page status");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update page status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the page "${title}"?`)) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", `Page "${title}" deleted.`);
        fetchPages();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete page");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete page");
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Page Builder Engine</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Pages & Section Content CMS
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage every public page, hero headings, modular sections, and SEO tags without touching code.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-border text-xs outline-none focus:border-solar-green font-medium"
          />
        </div>
        <span className="text-xs text-slate-muted font-bold">
          {filteredPages.length} {filteredPages.length === 1 ? "Page" : "Pages"} Configured
        </span>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading pages...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FileCode2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No pages found</h3>
            <p className="text-xs text-slate-muted">Click &quot;Create New Page&quot; to configure your first CMS page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Page Title</th>
                  <th className="p-4">Route / Slug</th>
                  <th className="p-4">Hero Heading</th>
                  <th className="p-4">Sections</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-bold text-navy-800 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-solar-green" />
                        <span>{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-muted font-bold">
                      /{p.slug === "home" ? "" : p.slug}
                    </td>
                    <td className="p-4 text-slate-muted max-w-sm truncate">
                      {p.heroHeading || p.title}
                    </td>
                    <td className="p-4 font-semibold text-navy-800">
                      <span className="bg-slate-100 text-navy-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {p.sections?.length || 0} Blocks
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(p._id, p.isPublished)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase cursor-pointer ${
                          p.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Content</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(p.slug === "home" ? "/" : `/${p.slug}`);
                          setPreviewOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-navy-800"
                        title="Live Preview Modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={p.slug === "home" ? "/" : `/${p.slug}`}
                        target="_blank"
                        className="p-1 rounded text-slate-400 hover:text-navy-800"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      {p.slug !== "home" && p.slug !== "about" && (
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Page Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="sticky top-0 bg-white p-5 border-b border-slate-border flex items-center justify-between z-10">
              <div>
                <h3 className="text-base font-bold text-navy-800">
                  {editingPageId ? "Edit Page Content & SEO" : "Create New Dynamic Page"}
                </h3>
                <p className="text-xs text-slate-muted">All updates persist directly to MongoDB and revalidate public views.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subsidy Information"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. subsidy-information"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                  />
                </div>
              </div>

              {/* Hero Configuration */}
              <div className="p-4 bg-slate-bg rounded-xl border border-slate-border space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green">Hero Section Configuration</span>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Hero Heading</label>
                  <input
                    type="text"
                    placeholder="Main headline displayed in the top hero banner"
                    value={form.heroHeading}
                    onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold text-navy-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Hero Subtitle / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Descriptive explanation under the main heading..."
                    value={form.heroSubtitle}
                    onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <CmsImageUploader
                  label="Hero Background Banner"
                  value={form.heroImage}
                  onChange={(url) => setForm({ ...form, heroImage: url })}
                  folder="pages"
                  aspectRatio="banner"
                  helpText="Upload a banner photo for the top of this page. Replaces existing image and saves to Cloudinary."
                />
              </div>

              {/* Body Content / Markdown / HTML */}
              <div>
                <label className="font-bold text-navy-800 block mb-1">Page Body Content (Markdown / HTML)</label>
                <textarea
                  rows={6}
                  placeholder="Primary content text for this page. Supports paragraphs, bullet points, and headers..."
                  value={form.contentHtml}
                  onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green leading-relaxed font-sans"
                />
              </div>

              {/* SEO Tags */}
              <div className="p-4 bg-white rounded-xl border border-slate-border space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-800">Search Engine Optimization (SEO)</span>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Meta Title Tag</label>
                  <input
                    type="text"
                    placeholder="Custom page title for Google search results"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Snippet summary under 160 characters for search listings..."
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="page_pub"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-solar-green focus:ring-0"
                />
                <label htmlFor="page_pub" className="font-bold text-navy-800 cursor-pointer">
                  Publish this page publicly immediately upon saving
                </label>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-border flex justify-end gap-2">
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
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingPageId ? "Update Page" : "Save Page"}</span>
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
        pageTitle="Page Live Preview"
      />
    </div>
  );
}
